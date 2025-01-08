import type { BaseContext } from "./types/base-context";
import type { Middleware, UpdateFunction } from "./types/middleware";
import { RecoverableError, ValidationError } from "./types/errors";

export abstract class Pipeline<T extends BaseContext> {
  private middlewares: Middleware<T>[] = [];
  protected context: T;

  constructor(initialContext: T) {
    this.context = { ...initialContext };
  }

  /**
   * 미들웨어를 파이프라인에 추가
   */
  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Context 안전한 업데이트
   */
  protected updateContext(fn: UpdateFunction<T>): void {
    const updates = fn(this.context);
    this.context = { ...this.context, ...updates };
  }

  /**
   * 파이프라인 실행 전 훅
   */
  protected async beforeExecute(): Promise<void> {}

  /**
   * 파이프라인 실행 후 훅
   */
  protected async afterExecute(): Promise<void> {}

  /**
   * 파이프라인 실행
   */
  async execute(): Promise<T> {
    try {
      await this.beforeExecute();
      await this.runMiddlewares();
      await this.afterExecute();
      return this.context;
    } catch (error) {
      await this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 미들웨어 체인 실행
   */
  private async runMiddlewares(): Promise<void> {
    let index = 0;

    const executeMiddleware = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        await middleware(this.context, executeMiddleware);
      }
    };

    await executeMiddleware();
  }

  /**
   * 에러 처리 및 복구 시도
   */
  private async handleError(error: Error): Promise<void> {
    if (this.isRecoverable(error)) {
      const recoverableError = error as RecoverableError;
      if (recoverableError.recover) {
        try {
          await recoverableError.recover();
          await this.execute();
          return;
        } catch (recoveryError) {
          console.error("Recovery failed:", recoveryError);
        }
      }
    }

    if (error instanceof ValidationError) {
      console.error(`Validation failed: ${error.field} - ${error.message}`);
    }

    throw error;
  }

  /**
   * 복구 가능한 에러인지 확인
   */
  private isRecoverable(error: Error): boolean {
    return "recoverable" in error && (error as RecoverableError).recoverable;
  }
}
