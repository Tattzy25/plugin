import { AGENT_PROFILE_URL, MCP_ENDPOINT } from "../GeminiTools/config";

export async function callCatalogMcp(
  name: string,
  id: string,
  args: unknown,
) {
  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
            ...(args && typeof args === "object" ? args : {}),
          },
        },
      }),
    });

    const rawBody = await response.text();
    try {
      return JSON.parse(
        rawBody
          .split(/\r?\n/)
          .find((line) => line.startsWith("data:"))
          ?.replace(/^data:\s*/, "") || rawBody,
      );
    } catch {
      return rawBody;
    }
  } catch {
    return {};
  }
}
