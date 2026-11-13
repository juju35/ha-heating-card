// Bundles src/heating-card.js into the single Marketplace file dist/heating-card.js (the version stamped in), then moves
// every translation but English to its own file next to it (scripts/i18n-split.mjs).
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const out = readFileSync(`${root}src/heating-card.js`, "utf8").replace("__VERSION__", pkg.version);

mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(`${root}dist/heating-card.js`, out);
console.log(`Built dist/heating-card.js (${(out.length / 1024).toFixed(1)} KB)`);

// Translations: English stays in the bundle, each other language goes to dist/heating-card.i18n.<lang>.js,
// fetched when a card needs it.
if (process.argv[1] === fileURLToPath(import.meta.url)) splitDist(`${root}dist`, "heating-card.js", { version: pkg.version });
