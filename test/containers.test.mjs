// The cards in parents outside the native views (layout-card, a grid or a horizontal stack) and at the narrow widths of
// a Sections view: they neither fall to their borders in a shrink-to-fit parent nor let their content leave the card.
// Rendered in Chromium when Playwright and a browser are installed (CHROMIUM_PATH picks one); skipped otherwise.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { areas, devices, entities, floors, states, weeks } from "../scripts/mock-states.mjs";

const source = readFileSync(new URL("../src/heating-card.js", import.meta.url), "utf8");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {}
const browser = await chromium?.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}).catch(() => null);

const HA_CARD = `customElements.define("ha-card", class extends HTMLElement { constructor() { super();
  this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block;border:1px solid #ddd;overflow:hidden}</style><slot></slot>"; } });`;

// [name, total width, parent style, cards in the parent]
const CONTEXTS = [
  ["inline-block 600", 600, "display:inline-block", 1],
  ["grid auto 600", 600, "display:grid;grid-template-columns:auto;justify-content:start", 1],
  ["grid 1fr 1fr 340", 340, "display:grid;grid-template-columns:1fr 1fr;gap:8px", 2],
  ["block 238", 238, "display:block", 1],
  ["block 170", 170, "display:block", 1],
];

// The width a card takes in a shrink-to-fit parent with room to spare.
const NATURAL = { "heating-card": 360, "heating-mini-card": 300, "heating-overview-card": 400 };

for (const type of Object.keys(NATURAL)) {
  test(`${type} keeps a width and stays inside its parent`, { skip: !browser && "no Chromium" }, async () => {
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    try {
      await page.setContent('<!doctype html><body style="margin:0;font-family:Arial,sans-serif"></body>');
      await page.addScriptTag({ content: HA_CARD });
      await page.addScriptTag({ content: source });
      const results = await page.evaluate(
        async ({ type, CONTEXTS, states, entities, devices, areas, floors, weeks }) => {
          const hass = { states, entities, devices, areas, floors, language: "en", callService: async () => {}, callWS: async (m) => ({ response: { [m.target?.entity_id]: weeks[m.target?.entity_id] } }) };
          const runs = [];
          for (const [name, width, style, count] of CONTEXTS) {
            const outer = document.body.appendChild(document.createElement("div"));
            outer.style.width = `${width}px`;
            const parent = outer.appendChild(document.createElement("div"));
            parent.style.cssText = style;
            const cards = [];
            for (let i = 0; i < count; i++) {
              const card = document.createElement(type);
              card.setConfig({ collapsed: [] });
              card.hass = hass;
              parent.appendChild(card);
              cards.push(card);
            }
            runs.push({ name, outer, cards });
          }
          await new Promise((r) => setTimeout(r, 100));
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          return runs.map(({ name, outer, cards }) => ({
            name,
            cards: cards.map((card) => {
              const box = card.shadowRoot.querySelector("ha-card").getBoundingClientRect();
              let inside = 0;
              for (const e of card.shadowRoot.querySelectorAll("ha-card *")) {
                if (e.closest("svg") || e.tagName === "STYLE" || e.closest(".zones")) continue;
                const r = e.getBoundingClientRect();
                if (r.width && Math.round(r.right - box.right) > inside) { inside = Math.round(r.right - box.right); globalThis.__worst = e.className?.baseVal ?? e.className; }
              }
              return { worst: globalThis.__worst, width: Math.round(box.width), overflow: Math.round(box.right - outer.getBoundingClientRect().right), inside };
            }),
          }));
        },
        { type, CONTEXTS, states, entities, devices, areas, floors, weeks },
      );
      for (const { name, cards } of results) {
        for (const { width, overflow, inside, worst } of cards) {
          assert.ok(overflow <= 0, `${name}: the card overflows its parent by ${overflow} px (width ${width})`);
          assert.ok(width >= 100, `${name}: the card falls to ${width} px`);
          assert.ok(inside <= 0, `${name}: content ${inside} px outside the card (width ${width}, ${worst})`);
        }
        if (name.endsWith(" 600")) assert.equal(cards[0].width, NATURAL[type], name);
      }
    } finally {
      await page.close();
    }
  });
}

test.after(() => browser?.close());
