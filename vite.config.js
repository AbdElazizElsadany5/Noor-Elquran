import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import https from "https";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "cairo-radio-dev-middleware",
      configureServer(server) {
        server.middlewares.use("/api/cairo-radio", (req, res) => {
          const targetUrl = "https://stream.radiojar.com/8s5u5tpdtwzuv";
          https.get(targetUrl, (apiRes) => {
            const rawLoc = apiRes.headers.location;
            const finalUrl = rawLoc ? rawLoc.replace(/^http:\/\//i, "https://") : targetUrl;
            res.writeHead(302, { Location: finalUrl, "Cache-Control": "no-cache" });
            res.end();
          }).on("error", () => {
            res.writeHead(302, { Location: "https://n0a.radiojar.com/8s5u5tpdtwzuv" });
            res.end();
          });
        });
      }
    }
  ]
});