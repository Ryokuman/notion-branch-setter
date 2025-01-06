import type { BaseContext } from "./types/base-context";
import type { Middleware, UpdateFunction } from "./types/middleware";

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
        await middleware(this.context, executeMiddleware);
      }
    };

    await executeMiddleware();
    return this.context;
  }
}
