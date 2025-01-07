import type { BaseContext } from "./types/base-context";
import type { Middleware, UpdateFunction } from "./types/middleware";
import type { RecoverableError } from "./types/errors";

export class Pipeline<T extends BaseContext> {
  private middlewares: Middleware<T>[] = [];
  private context: T;

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
   * 파이프라인 실행
   */
  async execute(): Promise<T> {
    let index = 0;

    const executeMiddleware = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        try {
          await middleware(this.context, executeMiddleware);
        } catch (error) {
          await this.handleError(error as Error);
        }
      }
    };

    await executeMiddleware();
    return this.context;
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
          // 복구 성공 시 재시도
          await this.execute();
          return;
        } catch (recoveryError) {
          // 복구 실패 로깅
          console.error("Recovery failed:", recoveryError);
        }
      }
    }
    // 복구 불가능한 에러는 그대로 전파
    throw error;
  }

  /**
   * 에러가 복구 가능한지 확인
   */
  private isRecoverable(error: Error): boolean {
    return "recoverable" in error && (error as RecoverableError).recoverable === true;
  }
}
