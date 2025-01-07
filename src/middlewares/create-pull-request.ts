import type { CreatePRContext } from "../types/base-context";
import { ValidationError } from "../types/errors";
import { createGitHubPR } from "../utils/github";

/**
 * PR 생성 미들웨어
 */
const createPullRequest = async (context: CreatePRContext, next: () => Promise<void>): Promise<void> => {
  const { taskInfo, currentRepository } = context;

  if (!taskInfo) {
    throw new ValidationError({
      field: "taskInfo",
      message: "Task information is required",
    });
  }

  try {
    context.github.status = "PR_CREATING";

    const title = `[${context.taskId}]${taskInfo.title}`;

    const pr = await createGitHubPR({
      title,
      head: context.github.branchName,
      base: currentRepository.base_branch,
      assignee: taskInfo.assignee,
    });

    context.github.prNumber = pr.number;
    context.github.prUrl = pr.url;
    context.github.status = "COMPLETED";

    await next();
  } catch (error: any) {
    throw new ValidationError({
      field: "pullRequest",
      message: `Failed to create PR: ${error.message}`,
    });
  }
};

export { createPullRequest };
