import { Octokit } from "@octokit/rest";
import type { Config } from "../types/config";

let octokit: Octokit;

export const initGitHubClient = (config: Config) => {
  octokit = new Octokit({
    auth: config.github.token,
  });
};

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
  if (!octokit) throw new Error("GitHub client not initialized");

  const [owner, repo] = params.base.split("/");

  // 1. Get the SHA of the base branch
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${params.base}`,
  });

  // 2. Create new branch
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${params.name}`,
    sha: ref.object.sha,
  });
};

export const listGitHubBranches = async (repository: string): Promise<string[]> => {
  if (!octokit) throw new Error("GitHub client not initialized");

  const [owner, repo] = repository.split("/");

  const { data: branches } = await octokit.repos.listBranches({
    owner,
    repo,
  });

  return branches.map((b) => b.name);
};

interface PullRequestResponse {
  number: number;
  url: string;
}

export const createGitHubPR = async (params: CreatePRParams): Promise<PullRequestResponse> => {
  if (!octokit) throw new Error("GitHub client not initialized");

  const [owner, repo] = params.base.split("/");

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: params.title,
    head: params.head,
    base: params.base,
  });

  if (params.assignee) {
    await octokit.issues.addAssignees({
      owner,
      repo,
      issue_number: pr.number,
      assignees: [params.assignee],
    });
  }

  return {
    number: pr.number,
    url: pr.html_url,
  };
};
