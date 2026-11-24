// ── Registration ───────────────────────────────────────────────────────────────────────────────────────────────
import { pickerDefine } from "./card-picker.js";
import { REPO, VERSION } from "./core.js";
import { HeatingCard, HeatingMiniCard } from "./cards.js";
import { HeatingOverviewCard } from "./overview-card.js";
import { HeatingCardEditor, HeatingMiniCardEditor, HeatingOverviewCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("heating-card", HeatingCard);
define("heating-mini-card", HeatingMiniCard);
define("heating-card-editor", HeatingCardEditor);
define("heating-mini-card-editor", HeatingMiniCardEditor);
define("heating-overview-card", HeatingOverviewCard);
define("heating-overview-card-editor", HeatingOverviewCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "heating-card",
    name: "Heating Card",
    description: "Thermostats, pilot wire radiators and weekly schedules, zone by zone: target, presets, heating modes and animated radiators.",
  },
  { type: "heating-mini-card", name: "Heating Mini Card", description: "Overview of the heating zones, unfolding into the full Heating Card." },
  {
    type: "heating-overview-card",
    name: "Heating Overview Card",
    description: "The heating of the whole home: zones heating, temperatures, open windows, low batteries, pilot wire orders and quick actions, floor by floor.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: REPO });
}

console.info(`%c HEATING-CARD %c v${VERSION} `, "color: white; background: #ff8100; font-weight: 700;", "color: #ff8100; background: white; font-weight: 700;");
