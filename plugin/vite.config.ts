import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { GoogleGenAI } from "@google/genai"

function sessionTokenPlugin(): Plugin {
  return {
    name: "session-token-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/session-token" && req.method === "POST") {
          const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "GEMINI_API_KEY environment variable not configured" }));
            return;
          }

          try {
            const client = new GoogleGenAI({ apiKey });
            const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
            const token = await (client as any).authTokens.create({
              config: {
                uses: 1,
                expireTime,
                newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString(),
                httpOptions: { apiVersion: "v1alpha" },
              },
            });

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ token: token.name }));
          } catch (error: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sessionTokenPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
