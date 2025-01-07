import type { RequestReviewContext } from "../types/base-context";
import { Pipeline } from "../pipeline";
import { validateConfig } from "../middlewares/validate-config";
import { validateNotionTask } from "../middlewares/validate-notion-task";
import { selectReviewers } from "../middlewares/select-reviewers";

export class RequestReviewPipeline extends Pipeline<RequestReviewContext> {
  constructor(context: RequestReviewContext) {
    super(context);
    this.use(validateConfig).use(validateNotionTask).use(selectReviewers);
  }

  protected async beforeExecute(): Promise<void> {
    this.updateContext((ctx) => ({
      reviewerSelection: {
        ...ctx.reviewerSelection,
        status: "IN_PROGRESS",
      },
    }));
  }
}
