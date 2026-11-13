// Renders the cards with the mock home and saves the README screenshots and animations.
// Usage: npm run build && npm run screenshots   (GIFs need ffmpeg on PATH; CHROMIUM_PATH picks another browser)
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { areas, devices, entities, floors, NOW, states, weeks } from "./mock-states.mjs";
import { unchanged } from "./pixels.mjs";
import { gifs, shots } from "./screenshot-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
mkdirSync(`${root}screenshots`, { recursive: true });

// Every capture is rendered to a temporary file and copied over screenshots/<file> only when its decoded pixels
// differ (scripts/pixels.mjs): a run that draws the same pictures changes no file, so the workflow commits nothing.
const work = mkdtempSync(join(tmpdir(), "hc-shots-"));
const keep = (fresh, name) => {
  const target = `${root}screenshots/${name}`;
  if (unchanged(fresh, target)) return console.log(`screenshots/${name} (unchanged)`);
  copyFileSync(fresh, target);
  console.log(`screenshots/${name}`);
};
const cardJs = readFileSync(`${root}dist/heating-card.js`, "utf8");

// Every uncaught page error is collected here; the script exits non-zero when any occurred, so a card that throws on
// load cannot silently produce blank screenshots.
const pageErrors = [];

const THEMES = {
  light: {
    "--primary-background-color": "#e8eaed",
    "--secondary-background-color": "#ececec",
    "--card-background-color": "#ffffff",
    "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272",
    "--divider-color": "rgba(0,0,0,.12)",
  },
  dark: {
    "--primary-background-color": "#111111",
    "--secondary-background-color": "#282828",
    "--card-background-color": "#1c1c1c",
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--divider-color": "rgba(225,225,225,.12)",
  },
};

// Minimal stand-in for Home Assistant's <ha-card>.
const HA_CARD = `customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});`;

const pageHtml = (theme, width) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root { ${Object.entries(THEMES[theme]).map(([k, v]) => `${k}:${v};`).join("")} --primary-color:#03a9f4; }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: ${width}px; }
</style></head><body><div id="root"></div></body></html>`;

// Opens a card on a fresh page (its script declares top-level names, which cannot be evaluated twice in one page) at
// the fixed moment NOW, in UTC, and mounts it with the mock hass; `overrides` patch the mock states for this capture.
async function openCard(browser, { file, type, config, theme, width, overrides }) {
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1000, height: 2000 }, timezoneId: "UTC", locale: "en-GB" });
  await page.clock.setFixedTime(new Date(NOW));
  page.on("pageerror", (err) => {
    console.error(`pageerror (${file}): ${err.message}`);
    pageErrors.push(`${file}: ${err.message}`);
  });
  await page.setContent(pageHtml(theme, width));
  await page.addScriptTag({ content: HA_CARD });
  await page.addScriptTag({ content: cardJs });
  await page.evaluate(
    ({ type, config, states, entities, devices, areas, floors, weeks, overrides, theme }) => {
      for (const [id, o] of Object.entries(overrides || {})) {
        const { state, ...attrs } = o;
        states[id] = { ...states[id], ...(state != null ? { state } : {}), attributes: { ...states[id].attributes, ...attrs } };
      }
      const el = document.createElement(type);
      el.setConfig({ type: `custom:${type}`, ...config });
      el.hass = {
        states, entities, devices, areas, floors, language: "en", locale: { language: "en" }, config: { unit_system: { temperature: "°C" } },
        themes: { darkMode: theme === "dark" }, callService: async () => {},
        callWS: async (msg) => ({ response: { [msg.target?.entity_id]: weeks[msg.target?.entity_id] } }),
      };
      document.getElementById("root").appendChild(el);
    },
    { type, config, states, entities, devices, areas, floors, weeks, overrides, theme },
  );
  return page;
}

// A mouse click (detail 1) on an element of the card, not .click(): a keyboard-like click would move the focus and
// show its ring.
const clickIn = (page, sel) =>
  page.evaluate(
    (sel) =>
      document
        .querySelector("#root")
        .firstElementChild.shadowRoot.querySelector(sel)
        .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 })),
    sel,
  );

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const s of shots) {
  const page = await openCard(browser, s);
  await page.waitForTimeout(200);
  for (const sel of s.clicks || []) {
    await clickIn(page, sel);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(500);
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({
    path: join(work, `${s.file}.png`),
    clip: { x: 0, y: 0, width: s.width + 32, height: Math.ceil(box.height) + 32 },
    animations: "disabled",
  });
  keep(join(work, `${s.file}.png`), `${s.file}.png`);
  await page.close();
}

// Records one animated state as a looping GIF (screenshots/<gif.file>.gif). Every animation (of the document and of
// the card's shadow root) is paused and stepped frame by frame, so the GIF is identical whatever the machine's speed.
async function makeGif(browser, gif, { fps = 20, seconds = 2.8 } = {}) {
  const page = await openCard(browser, gif);
  await page.waitForTimeout(300);
  const box = await page.locator("#root").boundingBox();
  const clip = { x: 0, y: 0, width: gif.width + 32, height: Math.ceil(box.height) + 32 };
  const dir = mkdtempSync(join(tmpdir(), "hc-frames-"));
  const frames = Math.round(fps * seconds);
  for (let i = 0; i < frames; i++) {
    const n = await page.evaluate((t) => {
      const card = document.querySelector("#root").firstElementChild.shadowRoot;
      const all = [...document.getAnimations(), ...card.getAnimations()];
      for (const a of all) {
        a.pause();
        a.currentTime = t;
      }
      return all.length;
    }, (i * 1000) / fps);
    // An animated state with no animation to step would record frames at the machine's speed again.
    if (!n) throw new Error(`${gif.file}: no animation found to step`);
    await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`), clip });
  }
  await page.close();
  const out = join(work, `${gif.file}.gif`);
  // Halve the retina capture and build a per-clip palette; Bayer dithering is an ordered pattern (no random error
  // diffusion), so the same frames give the same GIF.
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(dir, "f%03d.png"),
    "-vf", `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop", "0", out,
  ]);
  rmSync(dir, { recursive: true });
  keep(out, `${gif.file}.gif`);
}

for (const g of gifs) await makeGif(browser, g);
await browser.close();
rmSync(work, { recursive: true });

if (pageErrors.length) {
  console.error(`\n${pageErrors.length} page error(s) while rendering:`);
  for (const e of pageErrors) console.error(`  ${e}`);
  process.exitCode = 1;
}
