import type { RequestReviewContext } from "../types/base-context";
import { ValidationError } from "../types/errors";

/**
 * 리뷰어 선택 미들웨어
 */
const selectReviewers = async (context: RequestReviewContext, next: () => Promise<void>): Promise<void> => {
  const { taskInfo, currentRepository } = context;

  try {
    // 1. AUTHOR 할당 시도
    if (taskInfo?.author && taskInfo.author !== taskInfo.assignee) {
      context.github.selectedReviewers = [
        {
          username: taskInfo.author,
          type: "AUTHOR",
          assignedAt: new Date().toISOString(),
        },
      ];
      context.reviewerSelection.status = "AUTO_ASSIGNED";
      await next();
      return;
    }

    // 2. DEFAULT 할당 시도
    if (currentRepository.default_reviewer && currentRepository.default_reviewer !== taskInfo?.assignee) {
      context.github.selectedReviewers = [
        {
          username: currentRepository.default_reviewer,
          type: "DEFAULT",
          assignedAt: new Date().toISOString(),
        },
      ];
      context.reviewerSelection.status = "AUTO_ASSIGNED";
      await next();
      return;
    }

    // 둘 다 실패한 경우
    context.reviewerSelection.status = "FAILED";
    throw new ValidationError({
      field: "reviewers",
      message: "No eligible reviewers found",
    });
  } catch (error) {
    context.reviewerSelection.status = "FAILED";
    throw error;
  }
};

export { selectReviewers };
