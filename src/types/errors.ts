/**
 * 복구 가능한 기본 에러 인터페이스
 */
interface RecoverableError extends Error {
  recoverable: boolean;
  recover?: () => Promise<void>;
}

/**
 * 설정 및 입력값 검증 에러
 */
interface ValidationErrorData {
  field: string;
  message: string;
}

class ValidationError extends Error implements RecoverableError {
  public readonly recoverable = false;
  public readonly field: string;

  constructor(data: ValidationErrorData) {
    super(data.message);
    this.name = "ValidationError";
    this.field = data.field;
  }
}

/**
 * API 호출 관련 에러
 */
interface APIError extends RecoverableError {
  service: "github" | "notion";
  statusCode: number;
  retryCount: number;
}

export type { RecoverableError, ValidationErrorData, APIError };
export { ValidationError };
