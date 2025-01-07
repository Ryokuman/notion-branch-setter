import type { Config } from "../types/config";
import type { TaskInfo, PRCreationStatus } from "../types/base-context";
import { CreatePRPipeline } from "../pipelines/create-pr";

interface CreatePROptions {
  config: Config;
  taskId: string;
  taskInfo: TaskInfo;
  currentRepository: string;
}

export const createPR = async (options: CreatePROptions) => {
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
      branchName: taskInfo.branch,
      status: "INIT" as PRCreationStatus,
      template: { title: taskInfo.title },
    },
  };

  const pipeline = new CreatePRPipeline(context);
  return await pipeline.execute();
};
