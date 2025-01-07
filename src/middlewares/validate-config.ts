import type { BaseContext } from "../types/base-context";
import type { Config } from "../types/config";
import { ValidationError } from "../types/errors";

/**
 * Config 유효성 검증 미들웨어
 */
const validateConfig = async <T extends BaseContext>(context: T, next: () => Promise<void>): Promise<void> => {
  const config = context.config as Config;
  const { github, notion } = config;

  // GitHub 토큰 검증
  if (!github.token) {
    throw new ValidationError({
      field: "github.token",
      message: "GitHub token is required",
    });
  }

  // GitHub 레포지토리 설정 검증
  if (!github.repositories || github.repositories.length === 0) {
    throw new ValidationError({
      field: "github.repositories",
      message: "At least one repository configuration is required",
    });
  }

  // Notion 토큰 검증
  if (!notion.token) {
    throw new ValidationError({
      field: "notion.token",
      message: "Notion token is required",
    });
  }

  await next();
};

export { validateConfig };
