import fs from "fs";
import path from "path";
import process from "process";

import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    file: "build/bundle.js",
    format: "iife",
    banner: fs.readFileSync(path.join(process.cwd(), "metadata.js")),
    globals: {
      jquery: "$"
    }
  },
  external: ["jquery"],
  plugins: [terser({
    format: {
      comments: "all"
    }
  }), babel({ babelHelpers: "bundled" }), typescript()]
};
