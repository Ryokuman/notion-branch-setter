# GitHub-Notion PR Automation

GitHub PR 생성과 리뷰 요청을 Notion 태스크와 연동하여 자동화하는 라이브러리입니다.

## 주요 기능

- Notion 태스크 기반 PR 자동 생성
- 리뷰어 자동 할당
  - 작성자(Author) 우선 할당
  - 기본 리뷰어(Default Reviewer) 할당
- 브랜치 자동 생성
  - 브랜치명 충돌 시 자동 넘버링
- CLI 인터페이스 제공

## 설치

```bash
npm install github-notion-pr
```

## 설정

### 1. 설정 파일 생성

`pr.config.json` 파일을 프로젝트 루트에 생성:

```json
{
  "github": {
    "token": "your-github-token",
    "repositories": [
      {
        "repository_name": "owner/repo-name",
        "default_reviewer": "default-reviewer-username",
        "base_branch": "main"
      }
    ]
  },
  "notion": {
    "token": "your-notion-token"
  }
}
```

### 2. 환경 변수 설정 (선택사항)

```bash
export PR_CONFIG_PATH=./custom/path/to/pr.config.json
```

## 사용 방법

### CLI 사용

1. PR 생성:

```bash
pr-cli create --task-id <notion-task-id> --repository <repository-name>
```

2. 리뷰 요청:

```bash
pr-cli review --task-id <notion-task-id> --repository <repository-name>
```

### API 사용

```typescript
import { createPR, requestReview, loadConfig } from "github-notion-pr";

// 설정 로드
const config = await loadConfig();

// PR 생성
await createPR({
  config,
  taskId: "notion-task-id",
  taskInfo: {
    title: "Task Title",
    assignee: "assignee-username",
    branch: "feature/branch-name",
    author: "author-username",
  },
  currentRepository: "owner/repo-name",
});
```

## API 문서

### 타입 정의

```typescript
interface TaskInfo {
  title: string; // 태스크 제목
  assignee: string; // 담당자
  branch: string; // 브랜치명
  author: string; // 작성자
}

interface Config {
  github: {
    token: string;
    repositories: RepositoryConfig[];
  };
  notion: {
    token: string;
  };
}

interface RepositoryConfig {
  repository_name: string; // 'owner/repo-name' 형식
  default_reviewer?: string; // 기본 리뷰어
  base_branch: string; // 기본 브랜치
}
```

### 주요 함수

#### createPR

PR을 생성하고 담당자를 할당합니다.

```typescript
async function createPR(options: {
  config: Config;
  taskId: string;
  taskInfo: TaskInfo;
  currentRepository: string;
}): Promise<void>;
```

#### requestReview

PR에 리뷰어를 자동으로 할당합니다.

```typescript
async function requestReview(options: {
  config: Config;
  taskId: string;
  taskInfo: TaskInfo;
  currentRepository: string;
}): Promise<void>;
```

## 에러 처리

라이브러리는 다음과 같은 에러 타입을 제공합니다:

- `ValidationError`: 설정이나 입력값 검증 실패
- `APIError`: GitHub/Notion API 호출 실패

```typescript
try {
  await createPR(options);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed: ${error.field} - ${error.message}`);
  } else if (error instanceof APIError) {
    console.error(`API call failed: ${error.service} - ${error.message}`);
  }
}
```

## 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 라이선스

MIT

## 작성자

[Ryokuman](https://github.com/Ryokuman)
