import type { CreatePRContext } from "../types/base-context";
import { ValidationError } from "../types/errors";
import { createGitHubBranch, listGitHubBranches } from "../utils/github";

interface BranchNameConflictError extends Error {
  type: "BRANCH_CONFLICT";
  branchName: string;
}

/**
 * 브랜치 생성 미들웨어
 */
const createBranch = async (context: CreatePRContext, next: () => Promise<void>): Promise<void> => {
  const { taskInfo, currentRepository } = context;

  if (!taskInfo?.branch) {
    throw new ValidationError({
      field: "branch",
      message: "Branch name is required",
    });
  }

  try {
    context.github.status = "BRANCH_CREATING";

    // 브랜치 생성 시도
    try {
      await createGitHubBranch({
        name: taskInfo?.branch,
        base: currentRepository.base_branch,
      });

      context.github.branchName = taskInfo?.branch;
      context.github.status = "BRANCH_CREATED";
    } catch (error) {
      // 브랜치명 충돌 시 자동 넘버링
      if (isBranchConflictError(error)) {
        const newBranchName = await generateUniqueBranchName(taskInfo?.branch);
        await createGitHubBranch({
          name: newBranchName,
          base: currentRepository.base_branch,
        });

        context.github.branchName = newBranchName;
        context.github.status = "BRANCH_CREATED";
      } else {
        throw error;
      }
    }

    await next();
  } catch (error: any) {
    throw new ValidationError({
      field: "branch",
      message: `Failed to create branch: ${error.message}`,
    });
  }
};

// 브랜치 충돌 에러 체크
const isBranchConflictError = (error: any): error is BranchNameConflictError => {
  return error.type === "BRANCH_CONFLICT";
};

// 유니크한 브랜치명 생성
const generateUniqueBranchName = async (baseName: string): Promise<string> => {
  const existingBranches = await listGitHubBranches();
  const similarBranches = existingBranches.filter((b) => b.startsWith(baseName));

  if (similarBranches.length === 0) return baseName;

  const numbers = similarBranches
    .map((b) => {
      const match = b.match(/_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxNumber = Math.max(0, ...numbers);
  return `${baseName}_${maxNumber + 1}`;
};

export { createBranch };
