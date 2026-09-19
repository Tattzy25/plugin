import { MCP_ENDPOINT } from "./config";
import { UI_TOOLS } from "./ui.tools";

export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
  };
}

export interface McpTool {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Recursively cleans JSON Schema for Gemini Function Calling:
 * - Removes `$schema` tags
 * - Strips `meta` property (injected automatically at transport level)
 * - Normalizes data types to uppercase (OBJECT, STRING, NUMBER, INTEGER, BOOLEAN, ARRAY)
 */
export function cleanJsonSchemaForGemini(schema: unknown): GeminiFunctionDeclaration["parameters"] {
  if (!schema || typeof schema !== "object") {
    return { type: "OBJECT", properties: {} };
  }

  const clone = JSON.parse(JSON.stringify(schema));

  function sanitize(node: any): any {
    if (!node || typeof node !== "object") return node;

    if (Array.isArray(node)) {
      return node.map(sanitize);
    }

    delete node["$schema"];

    if (typeof node.type === "string") {
      node.type = node.type.toUpperCase();
    }

    if (node.properties && typeof node.properties === "object") {
      delete node.properties["meta"];

      for (const key of Object.keys(node.properties)) {
        node.properties[key] = sanitize(node.properties[key]);
      }
    }

    if (Array.isArray(node.required)) {
      node.required = node.required.filter((field: string) => field !== "meta");
      if (node.required.length === 0) {
        delete node.required;
      }
    }

    if (node.items) {
      node.items = sanitize(node.items);
    }

    return node;
  }

  const result = sanitize(clone);
  if (!result.type) {
    result.type = "OBJECT";
  }
  if (!result.properties) {
    result.properties = {};
  }

  return result;
}

/**
 * Parses raw MCP JSON-RPC response
 */
export function parseMcpResponse<T = unknown>(rawBody: string): T {
  const eventData = rawBody
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trim())
    .filter(Boolean)
    .join("\n");

  return JSON.parse(eventData || rawBody) as T;
}

export interface McpDiscoveryResult {
  declarations: GeminiFunctionDeclaration[];
  error?: string;
}

/**
 * Fetches the live tools directly from the MCP server and converts them to Gemini function declarations.
 * Pure dynamic execution: ZERO silent fallbacks, ZERO local caching.
 */
export async function fetchMcpToolDeclarations(
  endpoint: string = MCP_ENDPOINT,
): Promise<McpDiscoveryResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      }),
    });

    if (!response.ok) {
      return {
        declarations: [],
        error: `MCP server HTTP error ${response.status}: ${response.statusText}`,
      };
    }

    const rawText = await response.text();
    const parsed = parseMcpResponse<{
      result?: { tools?: McpTool[] };
      error?: { message?: string; code?: number };
    }>(rawText);

    if (parsed.error) {
      return {
        declarations: [],
        error: parsed.error.message || JSON.stringify(parsed.error),
      };
    }

    const tools = parsed.result?.tools ?? [];
    const declarations = tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? "",
      parameters: cleanJsonSchemaForGemini(tool.inputSchema),
    }));

    return { declarations };
  } catch (err: any) {
    return {
      declarations: [],
      error: err?.message || String(err),
    };
  }
}

import { CATALOG_TOOLS } from "./catalog.tools";

export function getPopulatedSessionTools(): {
  tools: Array<{ functionDeclarations: GeminiFunctionDeclaration[] }>;
} {
  return {
    tools: [
      {
        functionDeclarations: [
          ...CATALOG_TOOLS[0].functionDeclarations,
          ...UI_TOOLS[0].functionDeclarations,
        ],
      },
    ],
  };
}

