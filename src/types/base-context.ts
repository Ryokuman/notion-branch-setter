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
  config: {
    github: GitHubConfig;
    notion: NotionConfig;
  };

  /** Notion 태스크 관련 정보 */
  taskInfo?: TaskInfo;
}

export type { BaseContext, GitHubConfig, NotionConfig, TaskInfo };
