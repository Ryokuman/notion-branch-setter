import type { BaseContext } from "./base-context";

/**
 * Pipeline 미들웨어 타입
 * @template T BaseContext를 확장한 컨텍스트 타입
 */
type Middleware<T extends BaseContext> = (context: Readonly<T>, next: () => Promise<void>) => Promise<void>;

/**
 * Context 업데이트 함수 타입
 * @template T BaseContext를 확장한 컨텍스트 타입
 */
type UpdateFunction<T> = (context: Readonly<T>) => Partial<T>;

export type { Middleware, UpdateFunction };
