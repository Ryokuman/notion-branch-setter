import type { CreatePRContext } from "../types/base-context";
import { Pipeline } from "../pipeline";
import { validateConfig } from "../middlewares/validate-config";
import { validateNotionTask } from "../middlewares/validate-notion-task";
import { createBranch } from "../middlewares/create-branch";
import { createPullRequest } from "../middlewares/create-pull-request";

export class CreatePRPipeline extends Pipeline<CreatePRContext> {
  constructor(context: CreatePRContext) {
    super(context);
    this.use(validateConfig).use(validateNotionTask).use(createBranch).use(createPullRequest);
  }

  protected async beforeExecute(): Promise<void> {
    this.updateContext((ctx) => ({
      github: {
        ...ctx.github,
        status: "INIT",
      },
    }));
  }
}
