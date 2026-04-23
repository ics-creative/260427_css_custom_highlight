import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** GitHub Pages 向けの base と docs 出力先を切り替える Vite 設定。 */
export default defineConfig(({ mode }) => ({
  base:
    mode === "production" ? "/260427_css_custom_highlight/04_heatmap/" : "/",
  plugins: [react()],
  build: {
    cssMinify: "esbuild",
    outDir: "../docs/04_heatmap",
    emptyOutDir: true,
  },
}));
