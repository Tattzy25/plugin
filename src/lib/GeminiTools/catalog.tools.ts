import toolsJson from "./tools.json";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
  };
}

export const MCP_RAW_TOOLS = toolsJson as ToolDefinition[];

export const CATALOG_TOOLS = [
  {
    functionDeclarations: MCP_RAW_TOOLS.map(({ name, description, parameters }) => ({
      name,
      description,
      parameters,
    })),
  },
] as const;
