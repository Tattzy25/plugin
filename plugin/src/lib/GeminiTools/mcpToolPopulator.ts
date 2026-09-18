import { MCP_ENDPOINT } from "./config";
import { CATALOG_TOOLS } from "./catalog.tools";
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

/**
 * Fetches the live tools from the MCP server and converts them to Gemini function declarations.
 */
export async function fetchMcpToolDeclarations(
  endpoint: string = MCP_ENDPOINT,
): Promise<GeminiFunctionDeclaration[]> {
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
    throw new Error(`MCP tools/list failed with status: ${response.status}`);
  }

  const rawText = await response.text();
  const parsed = parseMcpResponse<{
    result?: { tools?: McpTool[] };
    error?: { message?: string };
  }>(rawText);

  if (parsed.error) {
    throw new Error(`MCP tools/list error: ${parsed.error.message}`);
  }

  const tools = parsed.result?.tools ?? [];

  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? "",
    parameters: cleanJsonSchemaForGemini(tool.inputSchema),
  }));
}

import { webMcp } from "../MCP/webMcpClient";

/**
 * In-memory cache for declarations to ensure instantaneous starts on repeated sessions
 */
let cachedMcpDeclarations: GeminiFunctionDeclaration[] | null = null;

/**
 * Populates tools at session start.
 * 1. Checks native WebMCP (document.modelContext / window.webmcp) or active WebSocket.
 * 2. Falls back to querying live declarations from the HTTP MCP server.
 * 3. Merges with local UI tools (`get_ui_state`).
 * 4. Falls back seamlessly to baseline tools if MCP endpoint is temporarily slow/unreachable.
 */
export async function getPopulatedSessionTools(timeoutMs: number = 4000) {
  try {
    // 1. Check Native WebMCP / WebSocket first
    const webMcpTools = await webMcp.discoverTools();
    if (webMcpTools.length > 0) {
      console.info(
        `[GeminiLive] Successfully auto-populated ${webMcpTools.length} declarations from WebMCP / WebSocket`,
      );
      cachedMcpDeclarations = webMcpTools;
      return [
        {
          functionDeclarations: [
            ...webMcpTools,
            ...UI_TOOLS[0].functionDeclarations,
          ],
        },
      ];
    }

    // 2. Query HTTP MCP endpoint
    const fetchPromise = fetchMcpToolDeclarations(MCP_ENDPOINT);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("MCP tools/list fetch timed out")), timeoutMs),
    );

    const liveDeclarations = await Promise.race([fetchPromise, timeoutPromise]);
    cachedMcpDeclarations = liveDeclarations;

    console.info(
      `[GeminiLive] Successfully auto-populated ${liveDeclarations.length} declarations from MCP server`,
    );

    return [
      {
        functionDeclarations: [
          ...liveDeclarations,
          ...UI_TOOLS[0].functionDeclarations,
        ],
      },
    ];
  } catch (error) {
    console.warn(
      "[GeminiLive] Could not auto-populate MCP declarations from server, falling back to cached/baseline:",
      error,
    );

    if (cachedMcpDeclarations && cachedMcpDeclarations.length > 0) {
      return [
        {
          functionDeclarations: [
            ...cachedMcpDeclarations,
            ...UI_TOOLS[0].functionDeclarations,
          ],
        },
      ];
    }

    return [
      {
        functionDeclarations: [
          ...CATALOG_TOOLS[0].functionDeclarations,
          ...UI_TOOLS[0].functionDeclarations,
        ],
      },
    ];
  }
}

