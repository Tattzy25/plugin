import { AGENT_PROFILE_URL, MCP_ENDPOINT } from "../GeminiTools/config";

let rpcIdCounter = 1;

export async function callCatalogMcp(
  name: string,
  id: string,
  args: unknown,
) {
  try {
    const rpcId = typeof id === "number" ? id : (parseInt(id, 10) || rpcIdCounter++);
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
      ...rawArgs,
      meta,
      ...(catalog ? { catalog } : {}),
    };

    let targetName = name;
    if (name === "search_catalog" && !payloadArgs.shop_domain) {
      targetName = "global_search_catalog";
    } else if (name === "get_product" && !payloadArgs.shop_domain) {
      targetName = "global_get_product";
    } else if (name === "lookup_catalog" && !payloadArgs.shop_domain) {
      targetName = "global_lookup_catalog";
    }

    if (catalog && targetName === "global_search_catalog") {
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
        id: rpcId,
        method: "tools/call",
        params: {
          name: targetName,
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
