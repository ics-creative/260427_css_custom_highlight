import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/260427_css_custom_highlight/04_mastra/" : "/",
  build: {
    outDir: "../docs/04_mastra",
    emptyOutDir: true,
  },
}));
