import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const htmlRedirects = {
  "/login.html": "/login",
  "/overview.html": "/overview",
  "/leads.html": "/leads",
  "/replied.html": "/replied",
  "/orders.html": "/orders",
  "/customers.html": "/customers",
  "/products.html": "/products",
  "/complaints.html": "/complaints",
  "/settings.html": "/settings",
  "/index.html": "/",
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-page-redirects",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = (req.url || "").split("?")[0];
          const to = htmlRedirects[path];
          if (to) {
            res.statusCode = 302;
            res.setHeader("Location", to);
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 8765,
    strictPort: true,
  },
});
