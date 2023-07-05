import fs from "fs";
import path from "path";
import process from "process";

import terser from "@rollup/plugin-terser";

export default {
  input: "src/main.js",
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
  })]
};
