/**
 * webMcpClient.ts
 * 
 * Native WebMCP (W3C / Chrome Origin Trial) client for Gemini Live API.
 * Discovers tools registered on document.modelContext / navigator.modelContext
 * and executes them directly in the Shopify store tab.
 */

import { cleanJsonSchemaForGemini, type GeminiFunctionDeclaration } from "../GeminiTools/mcpToolPopulator";
import { MCP_ENDPOINT, AGENT_PROFILE_URL } from "../GeminiTools/config";
import { callCatalogMcp } from "./catalogCall";

export interface WebMcpToolDescriptor {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
  annotations?: unknown;
  execute?: (args: unknown) => Promise<unknown> | unknown;
  [key: string]: unknown;
}

export class WebMcpClient {
  private registeredTools = new Map<string, WebMcpToolDescriptor>();
  private bridgePendingRequests = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private onToolsChangedCallbacks = new Set<(tools: GeminiFunctionDeclaration[]) => void>();
  private initialized = false;

  constructor() {
    this.initMessageBridge();
  }

  /**
   * Resolve active ModelContext from the three supported origin-trial sources
   */
  public getModelContext(): any {
    if (typeof window === "undefined") return null;

    if (typeof document !== "undefined" && (document as any).modelContext) {
      return (document as any).modelContext;
    }
    if (typeof navigator !== "undefined") {
      if ((navigator as any).modelContext) return (navigator as any).modelContext;
      if ((navigator as any).modelContextTesting) return (navigator as any).modelContextTesting;
    }
    if ((window as any).webmcp) {
      return (window as any).webmcp;
    }

    return null;
  }

  public hasWebMcp(): boolean {
    return this.getModelContext() !== null;
  }

  /**
   * Listen for WEBMCP_DEVTOOLS_EVENT postMessage events (for extension / cross-world bridge)
   */
  private initMessageBridge() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || data.type !== "WEBMCP_DEVTOOLS_EVENT") return;

      if (data.event === "TOOL_EXECUTION_RESULT" && data.requestId) {
        const pending = this.bridgePendingRequests.get(data.requestId);
        if (pending) {
          this.bridgePendingRequests.delete(data.requestId);
          if (data.error) pending.reject(new Error(data.error));
          else pending.resolve(data.result);
        }
      }

      if (data.event === "TOOLS_CHANGED" && Array.isArray(data.data?.tools)) {
        this.cacheTools(data.data.tools);
      }
    });

    // Wire ontoolchange if native ModelContext is available
    const ctx = this.getModelContext();
    if (ctx && typeof ctx === "object") {
      try {
        ctx.ontoolchange = async () => {
          console.info("[WebMCP] ontoolchange event detected on page");
          await this.discoverTools();
        };
      } catch (e) {
        console.warn("[WebMCP] Could not attach ontoolchange listener:", e);
      }
    }
  }

  private cacheTools(tools: WebMcpToolDescriptor[]) {
    this.registeredTools.clear();
    for (const t of tools) {
      if (t.name) {
        this.registeredTools.set(t.name, t);
      }
    }
  }

  /**
   * Query the live tools from the page's ModelContext
   */
  public async discoverTools(): Promise<GeminiFunctionDeclaration[]> {
    this.initMessageBridge();
    const ctx = this.getModelContext();

    if (ctx) {
      try {
        let rawTools: WebMcpToolDescriptor[] = [];

        if (typeof ctx.getTools === "function") {
          rawTools = await ctx.getTools();
        } else if (typeof ctx.listTools === "function") {
          const res = await ctx.listTools();
          rawTools = res?.tools || res || [];
        } else if (Array.isArray(ctx.tools)) {
          rawTools = ctx.tools;
        }

        if (rawTools && rawTools.length > 0) {
          console.info(`[WebMCP] Successfully discovered ${rawTools.length} tools on ModelContext`);
          this.cacheTools(rawTools);

          const geminiDeclarations = rawTools.map((tool) => ({
            name: tool.name,
            description: tool.description || "",
            parameters: cleanJsonSchemaForGemini(tool.inputSchema),
          }));

          // Notify any subscribers
          for (const cb of this.onToolsChangedCallbacks) {
            cb(geminiDeclarations);
          }

          return geminiDeclarations;
        }
      } catch (err) {
        console.warn("[WebMCP] Error fetching tools from ModelContext:", err);
      }
    }

    return [];
  }

  /**
   * Execute a tool directly on the page via WebMCP
   */
  public async executeTool(name: string, id: string, args: unknown): Promise<unknown> {
    const ctx = this.getModelContext();

    // 1. Direct tool.execute() if available
    const tool = this.registeredTools.get(name);
    if (tool && typeof tool.execute === "function") {
      console.info(`[WebMCP] Executing '${name}' via tool.execute()`);
      return await tool.execute(args);
    }

    // 2. Native modelContext.executeTool()
    if (ctx && typeof ctx.executeTool === "function") {
      console.info(`[WebMCP] Executing '${name}' via modelContext.executeTool()`);
      return await ctx.executeTool(name, args);
    }

    // 3. postMessage Bridge fallback
    if (typeof window !== "undefined") {
      const requestId = "req-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      const bridgePromise = new Promise((resolve, reject) => {
        this.bridgePendingRequests.set(requestId, { resolve, reject });
        window.postMessage(
          {
            type: "WEBMCP_DEVTOOLS_EVENT",
            event: "EXECUTE_TOOL",
            requestId,
            data: { name, args },
          },
          "*",
        );

        // 8 second timeout for bridge
        setTimeout(() => {
          if (this.bridgePendingRequests.has(requestId)) {
            this.bridgePendingRequests.delete(requestId);
            reject(new Error(`WebMCP bridge execution timed out for '${name}'`));
          }
        }, 8000);
      });

      try {
        return await bridgePromise;
      } catch {
        // Fall through to remote HTTP MCP if bridge doesn't respond
      }
    }

    // 4. Fallback to remote HTTP Catalog MCP
    console.info(`[WebMCP] Fallback: Executing '${name}' via remote HTTP MCP endpoint`);
    return await callCatalogMcp(name, id, args);
  }

  /**
   * Subscribe to dynamic tool updates when user navigates to new pages
   */
  public onToolsChanged(callback: (tools: GeminiFunctionDeclaration[]) => void) {
    this.onToolsChangedCallbacks.add(callback);
    return () => {
      this.onToolsChangedCallbacks.delete(callback);
    };
  }
}

export const webMcp = new WebMcpClient();
