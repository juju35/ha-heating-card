// Bundles the ES modules of src/ (entry src/index.js, assembled by scripts/bundle.mjs) into the single Marketplace file dist/heating-card.js (the version and the brand logos
// stamped in), then moves every translation but English to its own file next to it (scripts/i18n-split.mjs).
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";
import { bundle } from "./bundle.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
// The integrations' logos for the header icon's badge, as data URIs (no network at run time): images/badges/<platform>.png.
const badges = `${root}images/badges/`;
const logos = Object.fromEntries(
  (existsSync(badges) ? readdirSync(badges) : [])
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => [f.slice(0, -4), `data:image/png;base64,${readFileSync(badges + f).toString("base64")}`]),
);
const out = bundle("src/index.js").replace("__VERSION__", pkg.version).replace("{} /* __BRAND_LOGOS__ */", JSON.stringify(logos));

mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(`${root}dist/heating-card.js`, out);
console.log(`Built dist/heating-card.js (${(out.length / 1024).toFixed(1)} KB)`);

// Translations: English stays in the bundle, each other language goes to dist/heating-card.i18n.<lang>.js,
// fetched when a card needs it.
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) splitDist(`${root}dist`, "heating-card.js", { version: pkg.version });
