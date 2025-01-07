import type { Config } from "../types/config";
import type { TaskInfo } from "../types/base-context";
import type { ReviewerSelectionStatus } from "../types/base-context";
import { RequestReviewPipeline } from "../pipelines/request-review";

interface RequestReviewOptions {
  config: Config;
  taskId: string;
  taskInfo: TaskInfo;
  currentRepository: string;
}

export const requestReview = async (options: RequestReviewOptions) => {
  const { config, taskId, taskInfo, currentRepository } = options;

  // 현재 레포지토리 설정 찾기
  const repository = config.github.repositories.find((r) => r.repository_name === currentRepository);

  if (!repository) {
    throw new Error(`Repository not found: ${currentRepository}`);
  }

  const context = {
    taskId,
    config,
    currentRepository: repository,
    taskInfo,
    github: {
      prNumber: 0,
      reviewers: [],
      selectedReviewers: [],
    },
    reviewerSelection: {
      status: "IN_PROGRESS" as ReviewerSelectionStatus,
      pagination: { currentPage: 1, totalPages: 1, pageSize: 10 as const },
    },
  };

  const pipeline = new RequestReviewPipeline(context);
  return await pipeline.execute();
};
