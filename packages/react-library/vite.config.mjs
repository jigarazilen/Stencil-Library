import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import svgr from "vite-plugin-svgr";
import EnvironmentPlugin from "vite-plugin-environment";
import sourcemaps from "rollup-plugin-sourcemaps";

const IsDevelopment = process.argv.indexOf("--sourcemap") >= 0;

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    externalizeDeps(),
    EnvironmentPlugin("all", { prefix: "REACT_APP_" }),
  ],
  build: {
    rollupOptions: {
      plugins: [sourcemaps()],
    },
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "index",
      formats: ["esm"],
      fileName: (format) => `index.modern.js`,
    },
    emptyOutDir: !IsDevelopment,
    minify: !IsDevelopment,
    sourcemap: IsDevelopment,
  },
});
