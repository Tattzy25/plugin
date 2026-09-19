import { AGENT_PROFILE_URL, MCP_ENDPOINT } from "../GeminiTools/config";

export async function callCatalogMcp(
  name: string,
  id: string,
  args: unknown,
) {
  try {
    const rawArgs = (args && typeof args === "object" ? args : {}) as Record<string, any>;

    const meta = {
      ...(rawArgs.meta || {}),
      "ucp-agent": {
        ...(rawArgs.meta?.["ucp-agent"] || {}),
        profile: rawArgs.meta?.["ucp-agent"]?.profile || AGENT_PROFILE_URL,
      },
    };

    let catalog = rawArgs.catalog;
    if (!catalog && rawArgs.query) {
      catalog = { query: rawArgs.query };
    } else if (catalog && typeof catalog === "object" && rawArgs.query && !catalog.query) {
      catalog.query = rawArgs.query;
    }

    if (!catalog && (rawArgs.id || rawArgs.product_id)) {
      catalog = { id: rawArgs.id || rawArgs.product_id };
    } else if (catalog && typeof catalog === "object" && (rawArgs.id || rawArgs.product_id) && !catalog.id) {
      catalog.id = rawArgs.id || rawArgs.product_id;
    }

    if (!catalog && rawArgs.ids) {
      catalog = { ids: rawArgs.ids };
    }

    const payloadArgs: Record<string, any> = {
      ...(catalog ? { catalog } : {}),
      meta,
      ...rawArgs,
    };

    if (catalog) {
      payloadArgs.catalog = catalog;
      delete payloadArgs.query;
    }

    const response = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: {
          name,
          arguments: payloadArgs,
        },
      }),
    });

    const rawBody = await response.text();
    try {
      const dataLine = rawBody
        .split(/\r?\n/)
        .find((line) => line.startsWith("data:"))
        ?.replace(/^data:\s*/, "");

      let parsed = JSON.parse(dataLine || rawBody);

      const textContent = parsed?.result?.content?.find(
        (c: any) => c?.type === "text" && typeof c?.text === "string",
      )?.text;

      if (textContent) {
        try {
          parsed = JSON.parse(textContent);
        } catch {}
      }

      if (parsed?.result) {
        parsed = parsed.result;
      }

      return parsed;
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}
