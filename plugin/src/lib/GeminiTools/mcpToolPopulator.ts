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
 * Parses raw MCP response (supporting standard JSON and SSE data streams)
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

const MCP_TOOLS_CACHE_KEY = "mcp_tool_declarations_cache";

export interface McpDiscoveryResult {
  declarations: GeminiFunctionDeclaration[];
  error?: string;
}

/**
 * Fetches the live tools from the MCP server and converts them to Gemini function declarations.
 * Saves dynamically to localStorage so runtime is instant without hardcoded files.
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
        id: "tools-list-" + Date.now(),
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

    // Dynamically save whatever the server returned so runtime doesn't hang
    if (typeof window !== "undefined" && declarations.length > 0) {
      try {
        localStorage.setItem(MCP_TOOLS_CACHE_KEY, JSON.stringify(declarations));
      } catch {
        // ignore
      }
    }

    return { declarations };
  } catch (err: any) {
    return {
      declarations: [],
      error: err?.message || String(err),
    };
  }
}

export async function getPopulatedSessionTools(): Promise<{
  tools: Array<{ functionDeclarations: GeminiFunctionDeclaration[] }>;
  error?: string;
}> {
  const result = await fetchMcpToolDeclarations(MCP_ENDPOINT);

  if (result.declarations.length > 0) {
    return {
      tools: [
        {
          functionDeclarations: [
            ...result.declarations,
            ...UI_TOOLS[0].functionDeclarations,
          ],
        },
      ],
    };
  }

  // If live fetch was delayed or had a transient network issue, load the previously saved server declarations
  let savedDeclarations: GeminiFunctionDeclaration[] = [];
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(MCP_TOOLS_CACHE_KEY);
      if (cached) {
        savedDeclarations = JSON.parse(cached);
      }
    } catch {
      // ignore
    }
  }

  return {
    tools: [
      {
        functionDeclarations: [
          ...savedDeclarations,
          ...UI_TOOLS[0].functionDeclarations,
        ],
      },
    ],
    error: result.error,
  };
}

