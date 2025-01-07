import type { BaseContext, CreatePRContext, RequestReviewContext } from "../types/base-context";

export const updateGitHubStatus = <T extends { github: any }>(
  context: T,
  status: CreatePRContext["github"]["status"]
): Partial<T> =>
  ({
    github: {
      ...context.github,
      status,
    },
  } as unknown as Partial<T>);

export const updateReviewerSelection = (
  context: RequestReviewContext,
  status: RequestReviewContext["reviewerSelection"]["status"]
): Partial<RequestReviewContext> => ({
  reviewerSelection: {
    ...context.reviewerSelection,
    status,
  },
});

export const addSelectedReviewer = (
  context: RequestReviewContext,
  reviewer: RequestReviewContext["github"]["selectedReviewers"][0]
): Partial<RequestReviewContext> => ({
  github: {
    ...context.github,
    selectedReviewers: [...context.github.selectedReviewers, reviewer],
  },
});
