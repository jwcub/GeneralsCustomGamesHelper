import fs from "fs";
import path from "path";
import process from "process";

import * as esbuild from "esbuild";

const banner = await new Promise<Buffer>(resolve => fs.readFile(path.join(process.cwd(), "metadata.ts"), (_, data) => resolve(data)));

const res = await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "build/bundle.js",
  banner: { js: banner.toString() },
  legalComments: "none",
  minify: true,
  metafile: true,
  charset: "utf8",
  target: ["ES6"]
});

console.log(await esbuild.analyzeMetafile(res.metafile));