import type { Config, RepositoryConfig } from "./config";

interface GitHubConfig {
  /** GitHub Personal Access Token */
  token: string;
  repository: {
    /** 'owner/repo-name' 형식의 저장소 식별자 */
    name: string;
    /** 기본 리뷰어 GitHub 사용자명 */
    defaultReviewer?: string;
  };
}

interface NotionConfig {
  /** Notion Integration Token */
  token: string;
  /** Notion Database ID */
  databaseId: string;
}

interface TaskInfo {
  /** 태스크 제목 */
  title: string;
  /** 담당자 정보 */
  assignee: string;
  /** 브랜치명 */
  branch: string;
  /** 작성자 정보 */
  author: string;
}

interface BaseContext {
  /** Notion 태스크 식별자 */
  taskId: string;

  /** 애플리케이션 설정 정보 */
  config: Config;

  /** Notion 태스크 관련 정보 */
  currentRepository: RepositoryConfig;

  taskInfo?: TaskInfo;
}

// 리뷰어 타입
type ReviewerType = "MANUAL" | "AUTHOR" | "DEFAULT";

// 리뷰어 선택 상태
type ReviewerSelectionStatus = "IN_PROGRESS" | "MANUAL_SELECTED" | "AUTO_ASSIGNED" | "FAILED";

// 리뷰어 정보
interface Reviewer {
  username: string; // GitHub 사용자명
  type: ReviewerType; // 리뷰어 지정 타입
  assignedAt: string; // 할당 시간
}

// PR 생성 상태
type PRCreationStatus = "INIT" | "BRANCH_CREATING" | "BRANCH_CREATED" | "PR_CREATING" | "COMPLETED";

// Request-Review Context
interface RequestReviewContext extends BaseContext {
  github: {
    prNumber: number;
    reviewers: Reviewer[];
    selectedReviewers: Reviewer[];
  };
  reviewerSelection: {
    status: ReviewerSelectionStatus;
    pagination: { currentPage: number; totalPages: number; pageSize: 10 };
  };
}

// Create-PR Context
interface CreatePRContext extends BaseContext {
  github: {
    branchName: string;
    prNumber?: number;
    prUrl?: string;
    status: PRCreationStatus;
    template: { title: string }; // [${notion-id}]${task-name}
  };
}

export type {
  BaseContext,
  GitHubConfig,
  NotionConfig,
  TaskInfo,
  RequestReviewContext,
  CreatePRContext,
  ReviewerSelectionStatus,
  PRCreationStatus,
};
