export {
  AGENT_PROFILE_URL,
  MCP_ENDPOINT,
} from "./config";

import { CATALOG_TOOLS } from "./catalog.tools";
import { UI_TOOLS } from "./ui.tools";

export { CATALOG_TOOLS } from "./catalog.tools";
export { UI_TOOLS } from "./ui.tools";
export {
  fetchMcpToolDeclarations,
  getPopulatedSessionTools,
  cleanJsonSchemaForGemini,
} from "./mcpToolPopulator";

export const AGENT_SHOP_TOOLS = [
  ...CATALOG_TOOLS,
  ...UI_TOOLS,
] as const;