import { Client } from "@notionhq/client";
import type { Config } from "../types/config";
import type { TaskInfo } from "../types/base-context";

let notion: Client;

export const initNotionClient = (config: Config) => {
  notion = new Client({
    auth: config.notion.token,
  });
};

export const fetchTaskInfo = async (taskId: string): Promise<TaskInfo> => {
  if (!notion) throw new Error("Notion client not initialized");

  const response = await notion.pages.retrieve({
    page_id: taskId,
  });

  if (!("properties" in response)) {
    throw new Error("Invalid page response");
  }

  const properties = response.properties;

  return {
    title: getPropertyValue(properties, "Title", "title"),
    assignee: getPropertyValue(properties, "Assignee", "people"),
    branch: getPropertyValue(properties, "Branch", "rich_text"),
    author: getPropertyValue(properties, "Author", "people"),
  };
};

const getPropertyValue = (properties: any, propertyName: string, propertyType: string): string => {
  const property = properties[propertyName];

  if (!property || property.type !== propertyType) {
    throw new Error(`Invalid ${propertyName} property`);
  }

  switch (propertyType) {
    case "title":
      return property.title[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text[0]?.plain_text || "";
    case "people":
      return property.people[0]?.name || "";
    default:
      throw new Error(`Unsupported property type: ${propertyType}`);
  }
};
