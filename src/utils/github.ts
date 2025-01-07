interface CreateBranchParams {
  name: string;
  base: string;
}

interface CreatePRParams {
  title: string;
  head: string;
  base: string;
  assignee: string;
}

export const createGitHubBranch = async (params: CreateBranchParams): Promise<void> => {
  throw new Error("Not implemented");
};

export const listGitHubBranches = async (): Promise<string[]> => {
  return []; // 임시 반환값
};

interface PullRequestResponse {
  number: number;
  url: string;
}

export const createGitHubPR = async (params: CreatePRParams): Promise<PullRequestResponse> => {
  throw new Error("Not implemented");
};
