import { AGENT_PROFILE_URL, MCP_ENDPOINT } from "../GeminiTools/config";

export async function callCatalogMcp(
  name: string,
  id: string,
  args: unknown,
) {
  const response = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name,
        arguments: {
          meta: {
            "ucp-agent": {
              profile: AGENT_PROFILE_URL,
            },
          },
          ...(args ?? {}),
        },
      },
    }),
  });

  const rawBody = await response.text();
  return JSON.parse(
  rawBody
    .split(/\r?\n/)
    .find((line) => line.startsWith("data:"))
    ?.replace(/^data:\s*/, "") || rawBody,
);
}
