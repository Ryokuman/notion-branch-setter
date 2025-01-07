import type { BaseContext } from "../types/base-context";
import { ValidationError } from "../types/errors";

/**
 * Notion Task 유효성 검증 미들웨어
 */
const validateNotionTask = async <T extends BaseContext>(context: T, next: () => Promise<void>): Promise<void> => {
  const { taskInfo } = context;

  if (!taskInfo) {
    throw new ValidationError({
      field: "taskInfo",
      message: "Task information is required",
    });
  }

  // 필수 필드 검증
  const requiredFields: (keyof typeof taskInfo)[] = ["title", "assignee", "branch", "author"];

  for (const field of requiredFields) {
    if (!taskInfo[field]) {
      throw new ValidationError({
        field: `taskInfo.${field}`,
        message: `Task ${field} is required`,
      });
    }
  }

  // branch 필드 형식 검증
  if (!/^[a-zA-Z0-9-_/]+$/.test(taskInfo.branch)) {
    throw new ValidationError({
      field: "taskInfo.branch",
      message: "Invalid branch name format",
    });
  }

  await next();
};

export { validateNotionTask };
