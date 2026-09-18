export async function callFaqMcp(
  name: string,
  id: string | undefined,
  args: unknown,
) {
  const faqResponse = await fetch(
    "https://mcp-faq-policies-agent.facetimefy.com/",
    {
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
          arguments: args ?? {},
        },
      }),
    },
  );

  const faqRawBody = await faqResponse.text();

  if (!faqResponse.ok) {
    throw new Error(
      `FAQ MCP failed (${faqResponse.status}): ${faqRawBody}`,
    );
  }

  return faqRawBody;
}