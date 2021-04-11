/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-process-exit */

const { build } = require("esbuild");

build({
  bundle: true,
  entryPoints: ["./src/handler"],
  outdir: "./dist",
  external: ["aws-sdk"],
  minify: false,
  sourcemap: true,
  format: "cjs",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
