// Bundles the service worker, the offscreen document and copies the static files into dist/, which is
// the folder Chrome loads with "Load unpacked".
import { build } from "esbuild";
import { cp, mkdir, readFile, rm } from "node:fs/promises";

const outdir = "dist";
// One source for the oldest Chrome supported: the manifest.
const manifest = JSON.parse(await readFile("static/manifest.json", "utf8"));

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
await build({
  entryPoints: {
    background: "src/main.ts",
    offscreen: "src/offscreen-main.ts",
  },
  outdir,
  bundle: true,
  format: "iife",
  target: `chrome${manifest.minimum_chrome_version}`,
  minify: false,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});
await cp("static", outdir, { recursive: true });
