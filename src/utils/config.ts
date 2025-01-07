import { readFile } from "fs/promises";
import type { Config } from "../types/config";

export const loadConfig = async (): Promise<Config> => {
  try {
    const configPath = process.env.PR_CONFIG_PATH || "./pr.config.json";
    const content = await readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch (error: any) {
    throw new Error(`Failed to load config: ${error.message}`);
  }
};
