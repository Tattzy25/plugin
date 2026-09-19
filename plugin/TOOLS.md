# Shopify MCP & Gemini Live Tools Directory

This document provides a reference for all MCP tools and local UI tools configured for the Gemini Multimodal Live Commerce assistant.

All tools are defined in [`plugin/src/lib/GeminiTools/tools.json`](./src/lib/GeminiTools/tools.json) and exposed to Gemini via [`plugin/src/lib/GeminiTools/catalog.tools.ts`](./src/lib/GeminiTools/catalog.tools.ts).

---

## Tool IDs & Specifications Table

| Tool ID | Function Name | Scope / Category | Description | Key Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `tool_01_global_search_catalog` | `global_search_catalog` | Global Catalog | Searches for products across all Shopify merchants. Returns UCP catalog search envelope with products, pricing, and variants. | `meta.ucp-agent.profile`, `catalog.query`, `catalog.catalog_id`, `catalog.like`, `catalog.context` |
| `tool_02_global_lookup_catalog` | `global_lookup_catalog` | Global Catalog | Resolves or validates products and variants by identifier across all Shopify merchants. | `meta.ucp-agent.profile`, `lookup.ids` |
| `tool_03_global_get_product` | `global_get_product` | Global Catalog | Retrieves full details, specifications, and variants for a single product across merchants. | `meta.ucp-agent.profile`, `product.id`, `product.selected_options` |
| `tool_04_search_catalog` | `search_catalog` | Store Catalog | Searches a specific store's product catalog. | `shop_domain`, `query`, `category`, `tags`, `sort_by` |
| `tool_05_lookup_catalog` | `lookup_catalog` | Store Catalog | Resolves products or variants by ID within a specific store. | `shop_domain`, `ids` |
| `tool_06_get_product` | `get_product` | Store Catalog | Retrieves full details for a single product from a specific store. | `shop_domain`, `id`, `selected_options` |
| `tool_07_create_cart` | `create_cart` | Cart Management | Creates a new cart with line items and optional buyer context. Returns cart ID, validated items, and continue_url. | `shop_domain`, `cart.line_items` |
| `tool_08_get_cart` | `get_cart` | Cart Management | Retrieves the current state of an existing cart. | `shop_domain`, `id` |
| `tool_09_update_cart` | `update_cart` | Cart Management | Replaces full contents of an existing cart (PUT semantics). | `shop_domain`, `id`, `cart` |
| `tool_10_cancel_cart` | `cancel_cart` | Cart Management | Cancels an active cart upon explicit user request. | `shop_domain`, `id` |
| `tool_11_create_checkout` | `create_checkout` | Checkout | Creates a checkout session with line items and buyer info. Returns checkout ID and continue_url for handoff. | `shop_domain`, `checkout.line_items`, `checkout.buyer` |
| `tool_12_get_checkout` | `get_checkout` | Checkout | Retrieves the current state of an existing checkout session. | `shop_domain`, `id` |
| `tool_13_update_checkout` | `update_checkout` | Checkout | Updates checkout details (shipping address, fulfillment option, line items). | `shop_domain`, `id`, `checkout` |
| `tool_14_complete_checkout` | `complete_checkout` | Checkout | Submits payment credentials and finalizes the order. | `shop_domain`, `id`, `checkout.payment` |
| `tool_15_cancel_checkout` | `cancel_checkout` | Checkout | Cancels an active checkout session. | `shop_domain`, `id` |
| `tool_16_search_shop_policies_and_faqs` | `search_shop_policies_and_faqs` | Store Info | Searches and answers questions on store policies, shipping options, return windows, warranties, and FAQs. | `store_domain`, `query` |
| `tool_ui_get_state` | `get_ui_state` | Client UI State | Retrieves the real-time state of the in-browser Commerce Layer (visible cards, selections, cart drawer). | *None* |

---

## How Tools Are Loaded & Executed

1. **Declarations File**: [`plugin/src/lib/GeminiTools/tools.json`](./src/lib/GeminiTools/tools.json) contains the static tool schema definitions.
2. **Sanitization for Gemini Live**: [`plugin/src/lib/GeminiTools/catalog.tools.ts`](./src/lib/GeminiTools/catalog.tools.ts) maps over `tools.json` to extract pure `{ name, description, parameters }` function declarations required by Google Gemini's WebSocket Live API.
3. **Dispatch & Zero-Error Principle**:
   - Client calls execute through [`catalogCall.ts`](./src/lib/MCP/catalogCall.ts) against the MCP worker endpoint (`https://shop-easy.tattty.com/mcp`).
   - If an internal failure or empty result occurs, it returns `{}` without raising customer-facing errors or feeding synthetic error prompts into Gemini's context window.
