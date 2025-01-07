interface CreateBranchParams {
  name: string;
  base: string;
}

export const createGitHubBranch = async (params: CreateBranchParams): Promise<void> => {
  throw new Error("Not implemented");
};

export const listGitHubBranches = async (): Promise<string[]> => {
  return []; // 임시 반환값
};
