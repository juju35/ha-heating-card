// The overview card: the whole home floor by floor, its summary, its filters and sorts, the quick actions confirmed at
// the top of the card, and a tap on a zone.
import assert from "node:assert/strict";
import { test } from "node:test";
import { mockHass } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const hc = load();

const card = (config = {}, hass = mockHass()) => {
  const calls = [];
  hass.callService = (...a) => {
    calls.push(a);
    return Promise.resolve();
  };
  const c = new hc.HeatingOverviewCard();
  c.setConfig(config);
  c.hass = hass;
  c.calls = calls;
  return c;
};
const html = (c) => c.shadowRoot.innerHTML;
// The zone names of the tiles, in order.
const tiles = (c) => [...html(c).matchAll(/<div class="tname">([^<]*)<\/div>/g)].map((m) => m[1]);
const floorsShown = (c) => [...html(c).matchAll(/<div class="gtitle">.*?<span>([^<]*)<\/span>/g)].map((m) => m[1]);
// A click on an element of the card, as composedPath() would report it (detail 1: a mouse click).
const click = (c, dataset, extra = {}) => {
  const el = { dataset, tagName: "BUTTON", ...extra };
  c._onClick({ composedPath: () => [el], stopPropagation() {}, detail: 1 });
};
const plain = (x) => JSON.parse(JSON.stringify(x));

test("the overview shows the whole home floor by floor, with its summary", () => {
  const c = card();
  const h = html(c);
  assert.match(h, /<ha-card class="overview">/);
  assert.match(h, /1 of 4 zones heating/);
  assert.deepEqual(floorsShown(c), ["Ground floor", "First floor"]);
  assert.deepEqual(tiles(c), ["Living room", "Office", "Bedroom", "Bathroom"]);
  // Zones heating, average room temperature (coldest – warmest), average target of the thermostats that are on.
  assert.match(h, /<small>Heating<\/small><b>1\/4<\/b><small>Living room<\/small>/);
  assert.match(h, /<small>Average<\/small><b>19.2 °C<\/b><small>17.2–21.6°<\/small>/);
  assert.match(h, /Coldest: Office \(17.2 °C\) · Warmest: Bathroom \(21.6 °C\)/);
  assert.match(h, /<small>Target<\/small><b>19.5 °C<\/b><small>18–21°<\/small>/);
  // Alerts and the pilot wire radiators per order, a count each.
  assert.match(h, /chip warn" title="Window open: Bedroom" data-entity="binary_sensor.chambre_vanne_fenetre_ouverte"/);
  assert.match(h, /Pilot wire · Comfort: 1/);
  assert.match(h, /Pilot wire · Eco: 1/);
  // The zone that heats glows and gives off heat; its flame flickers.
  assert.match(h, /class="tile on heating active"/);
  assert.match(h, /<svg class="heat"/);
  assert.match(h, /class="tile on pw-eco"/);
  assert.match(h, /class="tile on alert"/);
  // The living room's pilot wire radiator and schedule show on its tile.
  assert.match(h, /title="Living room radiator: Comfort"/);
  assert.match(h, /Schedule · On until/);
});

test("without floors, or with group_by: none, the zones are not grouped", () => {
  const hass = mockHass();
  delete hass.floors;
  assert.deepEqual(floorsShown(card({}, hass)), []);
  const c = card({ group_by: "none" });
  assert.deepEqual(floorsShown(c), []);
  assert.deepEqual(tiles(c), ["Living room", "Bedroom", "Office", "Bathroom"]);
});

test("a zone without floor goes under Other areas, after the floors", () => {
  const hass = mockHass();
  hass.areas = { ...hass.areas, office: { ...hass.areas.office, floor_id: null } };
  assert.deepEqual(floorsShown(card({}, hass)), ["Ground floor", "First floor", "Other areas"]);
});

test("areas, floors and entities filter the zones", () => {
  assert.deepEqual(tiles(card({ areas: ["bedroom", "office"] })), ["Office", "Bedroom"]);
  assert.deepEqual(tiles(card({ exclude_areas: ["office"] })), ["Living room", "Bedroom", "Bathroom"]);
  assert.deepEqual(tiles(card({ floors: ["first_floor"] })), ["Bedroom", "Bathroom"]);
  assert.deepEqual(tiles(card({ exclude_floors: "first_floor" })), ["Living room", "Office"]);
  // A thermostat left out takes its zone with it, unless the zone has pilot wire radiators.
  assert.deepEqual(tiles(card({ exclude: ["climate.bureau_thermostat"] })), ["Living room", "Bedroom", "Bathroom"]);
  const c = card({ exclude: ["climate.salon_thermostat"] });
  assert.deepEqual(tiles(c), ["Living room", "Office", "Bedroom", "Bathroom"]);
  const living = c._zonesNow[0];
  assert.equal(living.id, null);
  assert.deepEqual([...living.pilots], ["select.salon_radiateur_fil_pilote"]);
});

test("include adds a hidden thermostat or pilot wire radiator to its area's zone, or as a zone of its own", () => {
  const hass = mockHass();
  hass.entities = { ...hass.entities, "select.salle_de_bain_seche_serviettes": { ...hass.entities["select.salle_de_bain_seche_serviettes"], hidden: true } };
  assert.deepEqual(tiles(card({}, hass)), ["Living room", "Office", "Bedroom"]);
  const c = card({ include: ["select.salle_de_bain_seche_serviettes"] }, hass);
  assert.deepEqual(tiles(c), ["Living room", "Office", "Bedroom", "Bathroom"]);
  const bath = c._zonesNow.find((z) => z.name === "Bathroom");
  assert.equal(bath.ent.indoor_temp, "sensor.salle_de_bain_temperature");
});

test("the zones sort by name, coldest first, or alerts and heating first", () => {
  const flat = { group_by: "none" };
  assert.deepEqual(tiles(card({ ...flat, sort: "name" })), ["Bathroom", "Bedroom", "Living room", "Office"]);
  assert.deepEqual(tiles(card({ ...flat, sort: "temperature" })), ["Office", "Bedroom", "Living room", "Bathroom"]);
  assert.deepEqual(tiles(card({ ...flat, sort: "state" })), ["Bedroom", "Living room", "Bathroom", "Office"]);
});

test("a quick action asks first, at the top of the card, then sets every zone it reaches", () => {
  const c = card();
  click(c, { action: "order", value: "frost" });
  const h = html(c);
  assert.match(h, /<ha-card class="overview dialog-open">/);
  assert.match(h, /Set the heating to Frost protection\?/);
  assert.match(h, /<div class="mzones">Living room, Bedroom, Bathroom<\/div>/);
  assert.match(h, /Not available in: Office/);
  assert.equal(c.calls.length, 0);
  click(c, { action: "confirm_ok" });
  assert.doesNotMatch(html(c), /overview dialog-open/);
  // The thermostats without a frost protection preset take away; each pilot wire radiator its own spelling of frost.
  assert.deepEqual(plain(c.calls), [
    ["climate", "set_preset_mode", { entity_id: "climate.salon_thermostat", preset_mode: "away" }],
    ["select", "select_option", { entity_id: "select.salon_radiateur_fil_pilote", option: "frost_protection" }],
    ["climate", "set_preset_mode", { entity_id: "climate.chambre_vanne", preset_mode: "away" }],
    ["select", "select_option", { entity_id: "select.salle_de_bain_seche_serviettes", option: "Hors-gel" }],
  ]);
});

test("Cancel, a click on the backdrop, Escape or a click elsewhere close the confirmation without a call", () => {
  const c = card();
  const backdrop = { dataset: { action: "confirm_backdrop" }, tagName: "DIV" };
  for (const close of [
    () => click(c, { action: "confirm_cancel" }),
    () => c._onClick({ composedPath: () => [backdrop], stopPropagation() {}, detail: 1 }),
    () => c._onEscape({ key: "Escape", stopPropagation() {} }),
    () => c._dismiss.tap({ composedPath: () => [] }),
  ]) {
    c._confirmClosed = 0;
    click(c, { action: "order", value: "eco" });
    assert.match(html(c), /overview dialog-open/);
    close();
    assert.doesNotMatch(html(c), /overview dialog-open/);
  }
  assert.equal(c.calls.length, 0);
});

test("off turns the thermostats off and the pilot wire radiators to off; a zone already there counts", () => {
  const c = card({ actions: ["off"] });
  const plan = c._plan("off", c._zonesNow.map((z) => c._model(z)));
  assert.deepEqual(plain(plan.zones.map((x) => x.m.z.name)), ["Living room", "Bedroom", "Office", "Bathroom"]);
  assert.deepEqual(plain(plan.calls).map((x) => [x[1], x[2].entity_id]), [
    ["set_hvac_mode", "climate.salon_thermostat"],
    ["select_option", "select.salon_radiateur_fil_pilote"],
    ["set_hvac_mode", "climate.chambre_vanne"],
    ["select_option", "select.salle_de_bain_seche_serviettes"],
  ]);
  assert.equal((html(c).match(/data-action="order"/g) || []).length, 1);
});

test("a quick action every zone already took shows as pressed, and does nothing", () => {
  const hass = mockHass({
    "climate.salon_thermostat": { preset_mode: "eco" },
    "select.salon_radiateur_fil_pilote": { state: "eco" },
  });
  const c = card({}, hass);
  assert.match(html(c), /class="act on" data-action="order" data-value="eco"[^>]*aria-pressed="true" disabled/);
  assert.match(html(c), /class="act" data-action="order" data-value="comfort"[^>]*aria-pressed="false">/);
  click(c, { action: "order", value: "eco" }, { disabled: true });
  assert.doesNotMatch(html(c), /overview dialog-open/);
});

test("a tap on a zone unfolds the full card on it, opens its more-info dialog, or does nothing", () => {
  const c = card();
  click(c, { action: "open", zone: "1" }, { tagName: "DIV" });
  assert.equal(c._zoomed, true);
  assert.equal(c._zone, 1);
  assert.match(html(c), /role="tab"/);
  assert.match(html(c), /Window open/);
  // The detail button brings the overview back.
  click(c, { action: "zoom" });
  assert.match(html(c), /class="overview"/);
  const m = card({ detail: "more-info" });
  click(m, { action: "open", zone: "3" }, { tagName: "DIV" });
  assert.equal(m.events.at(-1).type, "hass-more-info");
  assert.equal(m.events.at(-1).detail.entityId, "select.salle_de_bain_seche_serviettes");
  assert.doesNotMatch(html(card({ detail: "none" })), /data-action="open"/);
});

test("compact tiles, and the summary and quick actions left out", () => {
  const c = card({ compact: true, show_summary: false, show_actions: false, columns: 3 });
  const h = html(c);
  assert.match(h, /class="tiles compact fixed" style="--cols:3"/);
  assert.match(h, /<span class="adot"><\/span>/);
  assert.doesNotMatch(h, /class="stats"/);
  assert.doesNotMatch(h, /class="actions"/);
  const quiet = html(card({ show_alerts: false, show_pilot_wire: false, show_schedule: false }));
  assert.doesNotMatch(quiet, /Window open/);
  assert.doesNotMatch(quiet, /Pilot wire ·/);
  assert.doesNotMatch(quiet, /On until/);
});

test("a low battery and a device offline are counted with the open windows", () => {
  const c = card({}, mockHass({ "sensor.chambre_vanne_batterie": { state: "9" }, "climate.bureau_thermostat": { state: "unavailable" } }));
  const h = html(c);
  assert.match(h, /Low battery · 9 %/);
  assert.match(h, /title="Low battery: Bedroom"/);
  assert.match(h, /title="Device offline: Office"/);
  assert.match(h, /class="tile na alert"/);
});

test("the overview editor leaves defaults out and keeps an empty list of quick actions", () => {
  const e = new hc.HeatingOverviewCardEditor();
  e.setConfig({ type: "custom:heating-overview-card" });
  e.hass = mockHass();
  const names = e._schema().flatMap((s) => (s.schema ? s.schema : [s]).map((x) => x.name));
  for (const n of ["areas", "exclude_areas", "floors", "exclude_floors", "include", "exclude", "group_by", "sort", "detail", "columns", "compact", "zoom", "actions"]) assert.ok(names.includes(n), n);
  let out;
  e.dispatchEvent = (ev) => (out = ev.detail.config);
  const value = { ...e._data(), sort: "temperature", areas: [], actions: [] };
  e._changed({ stopPropagation() {}, detail: { value } });
  assert.deepEqual(plain(out), { type: "custom:heating-overview-card", sort: "temperature", actions: [] });
  e._changed({ stopPropagation() {}, detail: { value: { ...e._data(), actions: ["comfort", "eco", "frost", "away"] } } });
  assert.deepEqual(plain(out), { type: "custom:heating-overview-card", sort: "temperature" });
});

test("the overview is registered with the other cards", () => {
  assert.ok(hc.window.customCards.some((x) => x.type === "heating-overview-card" && x.preview));
  assert.equal(hc.HeatingOverviewCard.getConfigElement().constructor, hc.HeatingOverviewCardEditor);
});
