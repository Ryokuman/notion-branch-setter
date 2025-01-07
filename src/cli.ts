import { Command } from "commander";

import { createPR } from "./commands/create-pr";
import { requestReview } from "./commands/request-review";
import { loadConfig } from "./utils/config";
import { fetchTaskInfo } from "./utils/notion";

const program = new Command();

program.name("pr-cli").description("CLI tool for managing pull requests").version("1.0.0");

program
  .command("create")
  .description("Create a new pull request")
  .requiredOption("-t, --task-id <id>", "Notion task ID")
  .requiredOption("-r, --repository <name>", "Repository name")
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const taskInfo = await fetchTaskInfo(options.taskId);
      await createPR({
        config,
        taskId: options.taskId,
        taskInfo,
        currentRepository: options.repository,
      });
    } catch (error: any) {
      console.error("Failed to create PR:", error.message);
      process.exit(1);
    }
  });

program
  .command("review")
  .description("Request review for a pull request")
  .requiredOption("-t, --task-id <id>", "Notion task ID")
  .requiredOption("-r, --repository <name>", "Repository name")
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const taskInfo = await fetchTaskInfo(options.taskId);
      await requestReview({
        config,
        taskId: options.taskId,
        taskInfo,
        currentRepository: options.repository,
      });
    } catch (error: any) {
      console.error("Failed to request review:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
