// Browser test (Chromium through Playwright): a state update must not move the page. Home Assistant's <ha-card> and
// <ha-icon> render their shadow DOM a microtask after they are connected (the stand-ins below do the same): a card
// that rewrote its shadow root on every update collapsed to its border while the status pill was measured, which
// shortened the page and scrolled it (the dashboard jumped on every sensor change). Each card is mounted at the bottom
// of a scrolled page (no scroll anchoring, as in Safari) and gets 20 updates, half of them to an entity it does not
// show: those change nothing in its DOM, the others patch it in place (no node removed, <ha-card> and the icons
// kept), and neither the card's height nor the scroll position moves.
// Skipped when Playwright or Chromium is not installed.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFileSync } from "node:fs";
import { mockHass, weeks } from "../scripts/mock-states.mjs";

const src = readFileSync(new URL("../src/heating-card.js", import.meta.url), "utf8");
const STAND_INS = `
customElements.define("ha-card", class extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(":host{display:block;border:1px solid #ddd;border-radius:12px;overflow:hidden}");
    root.adoptedStyleSheets = [sheet];
    this.updateComplete = new Promise((done) => queueMicrotask(() => { root.innerHTML = "<slot></slot>"; done(true); }));
  }
});
customElements.define("ha-icon", class extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    queueMicrotask(() => { root.innerHTML = '<span style="display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)"></span>'; });
  }
});`;

let browser;
let skip = false;
before(async () => {
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  } catch (err) {
    skip = `Chromium not available: ${err.message.split("\n")[0]}`;
  }
});
after(() => browser?.close());

const { callService, callWS, ...hass } = mockHass();
const CASES = [
  ["heating-card", {}],
  ["heating-mini-card", {}],
  ["heating-mini-card", { entity: "climate.salon_thermostat" }],
  ["heating-overview-card", {}],
];

test("state updates patch the cards in place: no DOM change for other entities, no height change, no scroll", { timeout: 120000 }, async (t) => {
  if (skip) return t.skip(skip);
  for (const [tag, config] of CASES) {
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await page.setContent(
      "<!doctype html><body style='margin:0;font-family:Arial,sans-serif;overflow-anchor:none'><div style='height:1500px'></div><div id='root' style='width:400px'></div><div style='height:40px'></div></body>",
    );
    await page.addScriptTag({ content: STAND_INS });
    await page.addScriptTag({ content: src });
    const r = await page.evaluate(
      async ({ tag, config, hass, weeks }) => {
        const frame = () => new Promise((res) => requestAnimationFrame(res));
        const el = document.createElement(tag);
        el.setConfig({ type: `custom:${tag}`, ...config });
        let h = { ...hass, callService: async () => {}, callWS: async (m) => ({ response: { [m.target?.entity_id]: weeks[m.target?.entity_id] } }) };
        el.hass = h;
        document.getElementById("root").appendChild(el);
        for (let i = 0; i < 10; i++) await frame();
        window.scrollTo(0, document.documentElement.scrollHeight);
        await frame();
        const scroll = window.scrollY;
        const height = el.getBoundingClientRect().height;
        const kept = [...el.shadowRoot.querySelectorAll("ha-card, ha-icon")];
        const log = { unrelated: 0, removed: 0, heights: new Set([height]) };
        let own = false;
        const mo = new MutationObserver((ms) => {
          for (const m of ms) {
            if (!own) log.unrelated++;
            log.removed += [...m.removedNodes].filter((n) => n.nodeType === 1).length;
          }
        });
        mo.observe(el.shadowRoot, { subtree: true, childList: true, attributes: true, characterData: true });
        for (let i = 0; i < 20; i++) {
          own = i % 2 === 1;
          const states = { ...h.states };
          if (own) {
            const id = "climate.salon_thermostat";
            states[id] = { ...states[id], attributes: { ...states[id].attributes, current_temperature: 19 + i / 10 } };
          } else states["sensor.unrelated"] = { entity_id: "sensor.unrelated", state: String(i), attributes: {} };
          h = { ...h, states };
          el.hass = h;
          for (let f = 0; f < 3; f++) {
            await frame();
            log.heights.add(el.getBoundingClientRect().height);
          }
          // Records of this update are counted under its kind.
          for (const m of mo.takeRecords()) {
            if (!own) log.unrelated++;
            log.removed += [...m.removedNodes].filter((n) => n.nodeType === 1).length;
          }
        }
        mo.disconnect();
        return {
          unrelated: log.unrelated,
          removed: log.removed,
          heights: [...log.heights],
          drift: window.scrollY - scroll,
          kept: kept.every((n) => n.isConnected),
        };
      },
      { tag, config, hass, weeks },
    );
    const label = `${tag} ${JSON.stringify(config)}`;
    assert.equal(r.unrelated, 0, `${label}: an update of another entity changes nothing`);
    assert.equal(r.removed, 0, `${label}: an update of its entities removes no node`);
    assert.ok(r.kept, `${label}: <ha-card> and the icons are kept`);
    assert.deepEqual(r.heights, [r.heights[0]], `${label}: the height never changes`);
    assert.equal(r.drift, 0, `${label}: the page does not scroll`);
    await page.close();
  }
});
