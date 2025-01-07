interface RepositoryConfig {
  /** 'owner/repo-name' 형식의 저장소 식별자 */
  repository_name: string;
  /** 기본 리뷰어 GitHub 사용자명 */
  default_reviewer?: string;
  /** base 브랜치명 */
  base_branch: string;
}

interface Config {
  github: {
    /** GitHub Personal Access Token */
    token: string;
    /** 레포지토리 설정 목록 */
    repositories: RepositoryConfig[];
  };
  notion: {
    /** Notion Integration Token */
    token: string;
  };
}

export type { Config, RepositoryConfig };
