import assert from "node:assert/strict";
import { test } from "node:test";
import { mockHass, weeks } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const hc = load();

const card = (config = {}, hass = mockHass(), Card = hc.HeatingCard) => {
  const calls = [];
  hass.callService = (...a) => {
    calls.push(a);
    return Promise.resolve();
  };
  const c = new Card();
  c.setConfig(config);
  c.hass = hass;
  c.calls = calls;
  return c;
};
const html = (c) => c.shadowRoot.innerHTML;
// A click on an element of the card, as composedPath() would report it.
const click = (c, dataset, tagName = "BUTTON") => c._onClick({ composedPath: () => [{ dataset, tagName }], stopPropagation() {} });
// Objects made in the card's sandbox have its own prototypes: compared as plain data.
const plain = (x) => JSON.parse(JSON.stringify(x));
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

test("pilot wire orders are recognized whatever the integration spells them", () => {
  const cases = {
    comfort: "comfort", Confort: "comfort", "comfort_-1": "comfort_1", "comfort-2": "comfort_2", "Confort -1": "comfort_1",
    eco: "eco", Éco: "eco", frost_protection: "frost", "Hors-gel": "frost", hors_gel: "frost", off: "off", Arrêt: "off", away: null, boost: null,
  };
  for (const [v, want] of Object.entries(cases)) assert.equal(hc.pilotMode(v), want, v);
  assert.equal(hc.isPilotSelect({ attributes: { options: ["comfort", "eco", "frost_protection", "off"] } }), true);
  assert.equal(hc.isPilotSelect({ attributes: { options: ["low", "medium", "high"] } }), false);
});

test("thermostats are climate entities that heat and cannot cool, dry or blow", () => {
  assert.equal(hc.isThermostat({ attributes: { hvac_modes: ["off", "heat"] } }), true);
  assert.equal(hc.isThermostat({ attributes: { hvac_modes: ["off", "heat", "cool"] } }), false);
  assert.equal(hc.isThermostat({ attributes: { hvac_modes: ["off", "fan_only"] } }), false);
});

test("zones are found by area: thermostat, pilot wire radiators, schedule and room sensors", () => {
  const zones = hc.discoverZones(mockHass());
  assert.deepEqual(
    plain(zones).map((z) => [z.name, z.entity || null, [...z.pilot_wire], z.schedule || null]),
    [
      ["Living room", "climate.salon_thermostat", ["select.salon_radiateur_fil_pilote"], "schedule.salon_chauffage"],
      ["Bedroom", "climate.chambre_vanne", [], null],
      ["Office", "climate.bureau_thermostat", [], null],
      ["Bathroom", null, ["select.salle_de_bain_seche_serviettes"], null],
    ],
  );
  assert.equal(zones[3].temperature, "sensor.salle_de_bain_temperature");
});

test("a zone given as a select or a switch is a pilot wire zone", () => {
  const [z] = hc.zonesOf(null, { zones: ["switch.radiator"] });
  assert.equal(z.entity, undefined);
  assert.deepEqual([...z.pilot_wire], ["switch.radiator"]);
  const [top] = hc.zonesOf(null, { entity: "climate.a", schedule: "schedule.b", title: "x" });
  assert.equal(top.entity, "climate.a");
  assert.equal(top.schedule, "schedule.b");
});

test("the full card shows the home summary, the zone tabs and the selected zone", () => {
  const c = card();
  const h = html(c);
  assert.match(h, /1 of 4 zones heating/);
  assert.equal((h.match(/role="tab"/g) || []).length, 4);
  // The illustrated header draws the zone's device; the classic header keeps it in the hero.
  assert.match(h, /class="bdev running active"/);
  assert.doesNotMatch(h, /class="picture /);
  assert.match(html(card({ illustration: false })), /class="picture running active"/);
  assert.match(h, /aria-valuenow="21"/);
  assert.match(h, /Living room radiator/);
  click(c, { action: "zone", zone: "1" });
  assert.match(html(c), /Window open/);
  assert.match(html(c), /Valve 0 %/);
});

test("− / + move the target at once and send it once the taps stop, clamped to the entity's range", async () => {
  const c = card({ entity: "climate.salon_thermostat" });
  click(c, { action: "temp", value: "1", zone: "0" });
  click(c, { action: "temp", value: "1", zone: "0" });
  assert.match(html(c), /aria-valuenow="22"/);
  assert.equal(c.calls.length, 0);
  await tick(1000);
  assert.deepEqual(plain(c.calls), [["climate", "set_temperature", { entity_id: "climate.salon_thermostat", temperature: 22 }]]);
  // The spin button: End jumps to the maximum.
  c._onKey({ key: "End", target: { getAttribute: () => "spinbutton", dataset: { action: "temp", zone: "0" } }, preventDefault() {} });
  assert.match(html(c), /aria-valuenow="30"/);
  assert.match(html(c), /data-value="1" data-zone="0" title="Raise the target" aria-label="Raise the target" disabled/);
  c.disconnectedCallback();
});

test("a tap on the selected preset goes back to none; modes, power and presets call the climate services", () => {
  const c = card({ entity: "climate.salon_thermostat" });
  click(c, { action: "preset", value: "comfort", zone: "0" });
  click(c, { action: "preset", value: "eco", zone: "0" });
  click(c, { action: "hvac", value: "auto", zone: "0" });
  click(c, { action: "power", zone: "0" });
  assert.deepEqual(plain(c.calls), [
    ["climate", "set_preset_mode", { entity_id: "climate.salon_thermostat", preset_mode: "none" }],
    ["climate", "set_preset_mode", { entity_id: "climate.salon_thermostat", preset_mode: "eco" }],
    ["climate", "set_hvac_mode", { entity_id: "climate.salon_thermostat", hvac_mode: "auto" }],
    ["climate", "set_hvac_mode", { entity_id: "climate.salon_thermostat", hvac_mode: "off" }],
  ]);
});

test("power turns an office thermostat back on with set_hvac_mode, not turn_on", () => {
  const c = card({ entity: "climate.bureau_thermostat" });
  click(c, { action: "power", zone: "0" });
  assert.deepEqual(plain(c.calls), [["climate", "set_hvac_mode", { entity_id: "climate.bureau_thermostat", hvac_mode: "heat" }]]);
});

test("pilot wire buttons pick the select's own option, and a switch relay follows switch_on / switch_off", () => {
  const c = card({ pilot_wire: "select.salle_de_bain_seche_serviettes" });
  click(c, { action: "pilot", entity: "select.salle_de_bain_seche_serviettes", value: "frost", zone: "0" });
  assert.deepEqual(plain(c.calls).at(-1), ["select", "select_option", { entity_id: "select.salle_de_bain_seche_serviettes", option: "Hors-gel" }]);
  const hass = mockHass();
  hass.states["switch.relais"] = { entity_id: "switch.relais", state: "on", attributes: {} };
  const s = card({ zones: [{ pilot_wire: ["switch.relais"], switch_on: "eco", switch_off: "comfort", name: "Hall" }] }, hass);
  assert.match(html(s), /aria-pressed="true" title="Eco"/);
  click(s, { action: "pilot", entity: "switch.relais", value: "comfort", zone: "0" });
  assert.deepEqual(plain(s.calls).at(-1), ["switch", "turn_off", { entity_id: "switch.relais" }]);
});

test("the weekly schedule is read with schedule.get_schedule and drawn day by day", async () => {
  const c = card({ entity: "climate.salon_thermostat", schedule: "schedule.salon_chauffage", collapsed: [] });
  await tick(10);
  const h = html(c);
  assert.equal((h.match(/class="track/g) || []).length, 7);
  assert.equal((h.match(/class="slot"/g) || []).length, Object.values(weeks["schedule.salon_chauffage"]).flat().length);
  assert.match(h, /On until/);
  assert.deepEqual(plain(hc.weekOf({ monday: [{ from: "22:00:00", to: "00:00:00" }] })[0]), [[1320, 1440]]);
});

test("the schedule section folds back when clicking elsewhere on the page", () => {
  const c = card({ entity: "climate.salon_thermostat", schedule: "schedule.salon_chauffage" });
  assert.match(html(c), /data-section="schedule" aria-expanded="false"/);
  click(c, { action: "toggle_section", section: "schedule" });
  assert.match(html(c), /data-section="schedule" aria-expanded="true"/);
  c._outside.tap({ composedPath: () => [] });
  assert.match(html(c), /data-section="schedule" aria-expanded="false"/);
});

test("no rewrite under a press: an update is held until the click, which draws it at once, or the release", async () => {
  const c = card({ entity: "climate.salon_thermostat", schedule: "schedule.salon_chauffage" });
  const open = /data-section="schedule" aria-expanded="true"/;
  // Pressed: an update (here the section's state changed from elsewhere) does not rewrite the card under the pointer.
  c._onPress();
  c._toggled = new Map([["schedule", false]]);
  c._refresh();
  assert.doesNotMatch(html(c), open, "held under the press");
  // Released without a click: drawn right after.
  c._onPressEnd();
  await tick();
  assert.match(html(c), open);
  // The click itself draws at once.
  c._onPress();
  c._onPressClick({ detail: 1 });
  click(c, { action: "toggle_section", section: "schedule" });
  assert.doesNotMatch(html(c), open);
  c._onPressEnd();
  await tick();
});

test("folding: a tap elsewhere (pointer), not a drag that ends outside; leaving the page folds back too", () => {
  const c = card({ entity: "climate.salon_thermostat", schedule: "schedule.salon_chauffage" });
  c.connectedCallback();
  const open = /data-section="schedule" aria-expanded="true"/;
  click(c, { action: "toggle_section", section: "schedule" });
  // A slider pressed in the card and released outside of it: nothing folds.
  c._outside.tap({ composedPath: () => [c] });
  assert.match(html(c), open);
  // Left with the section open and back: folded.
  c.disconnectedCallback();
  c.connectedCallback();
  assert.doesNotMatch(html(c), open);
  c.disconnectedCallback();
  const mini = card({}, mockHass(), hc.HeatingMiniCard);
  mini.connectedCallback();
  click(mini, { action: "zone", zone: "3" }, "DIV");
  assert.match(html(mini), /role="tab" aria-selected="true"/);
  mini.disconnectedCallback();
  mini.connectedCallback();
  assert.match(html(mini), /class="rows"/, "back compact");
  mini.disconnectedCallback();
});

test("an unavailable thermostat shows it, without controls", () => {
  const hass = mockHass({ "climate.salon_thermostat": { state: "unavailable" } });
  const c = card({ entity: "climate.salon_thermostat" }, hass);
  assert.match(html(c), /Unavailable/);
  assert.doesNotMatch(html(c), /data-action="temp"/);
});

test("a thermostat without presets, target or off mode shows none of their controls", () => {
  const hass = mockHass({ "climate.bureau_thermostat": { supported_features: 0, hvac_modes: ["heat"], state: "heat" } });
  const c = card({ entity: "climate.bureau_thermostat" }, hass);
  assert.doesNotMatch(html(c), /data-action="(temp|power|preset|hvac)"/);
});

test("the mini card lists the zones and unfolds the full card on the zone clicked", () => {
  const c = card({}, mockHass(), hc.HeatingMiniCard);
  assert.equal((html(c).match(/class="row"/g) || []).length, 4);
  assert.match(html(c), /Window open/);
  click(c, { action: "zone", zone: "3" }, "DIV");
  assert.match(html(c), /role="tab" aria-selected="true" data-action="zone" data-zone="3"/);
  c._unzoom.tap({ composedPath: () => [] });
  assert.match(html(c), /class="rows"/);
});

test("a mini card on one thermostat keeps − / + and power", () => {
  const c = card({ entity: "climate.salon_thermostat" }, mockHass(), hc.HeatingMiniCard);
  assert.match(html(c), /data-action="temp" data-value="-1"/);
  assert.match(html(c), /data-action="power"/);
});

test("an unrelated state change does not rebuild the card", () => {
  const hass = mockHass();
  const c = card({}, hass);
  let renders = 0;
  const render = c._render.bind(c);
  c._render = (z) => {
    renders++;
    return render(z);
  };
  c.hass = { ...hass, states: { ...hass.states, "light.elsewhere": { entity_id: "light.elsewhere", state: "on", attributes: {} } } };
  assert.equal(renders, 0);
});

test("every language has every English key, with the same placeholders", () => {
  const en = hc.STRINGS.en;
  const langs = Object.keys(hc.STRINGS);
  assert.equal(langs.length, 22);
  for (const l of langs) {
    for (const [k, v] of Object.entries(en)) {
      assert.equal(typeof hc.STRINGS[l][k], "string", `${l}.${k}`);
      for (const ph of v.match(/\{\w+\}/g) || []) assert.ok(hc.STRINGS[l][k].includes(ph), `${l}.${k} lacks ${ph}`);
    }
  }
});

test("the editor writes zones from their sections and leaves defaults out", () => {
  const e = new hc.HeatingCardEditor();
  const events = [];
  e.dispatchEvent = (ev) => events.push(ev);
  e.setConfig({ type: "custom:heating-card" });
  e._hass = mockHass();
  e._changed({
    stopPropagation() {},
    detail: { value: { show_title: true, zone_0: { entity: "climate.chambre_vanne", illustration: "auto", pilot_wire: [] }, zone_1: { illustration: "auto" }, collapsed: ["schedule"] } },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(events.at(-1).detail.config)), { type: "custom:heating-card", zones: [{ entity: "climate.chambre_vanne" }] });
  // The illustrated header's options: on and automatic left out, the classic header and a forced theme written.
  e._changed({ stopPropagation() {}, detail: { value: { banner: false, illustration_theme: "night", zone_0: { entity: "climate.chambre_vanne" } } } });
  assert.deepEqual(JSON.parse(JSON.stringify(events.at(-1).detail.config)), {
    type: "custom:heating-card",
    illustration: false,
    illustration_theme: "night",
    zones: [{ entity: "climate.chambre_vanne" }],
  });
  e.setConfig(events.at(-1).detail.config);
  assert.equal(e._data().banner, false);
  e._changed({ stopPropagation() {}, detail: { value: { banner: true, illustration_theme: "auto", zone_0: { entity: "climate.chambre_vanne" } } } });
  assert.deepEqual(JSON.parse(JSON.stringify(events.at(-1).detail.config)), { type: "custom:heating-card", zones: [{ entity: "climate.chambre_vanne" }] });
});

test("the mini card editor offers the full card options its unfolded view uses, plus zoom", () => {
  const names = (E, type) => {
    const e = new E();
    e.setConfig({ type });
    e._hass = mockHass();
    return e._schema().flatMap((x) => (x.schema && !x.type?.startsWith("expandable") ? x.schema : [x]).map((y) => y.name));
  };
  const full = names(hc.HeatingCardEditor, "custom:heating-card");
  const mini = names(hc.HeatingMiniCardEditor, "custom:heating-mini-card");
  for (const n of ["show_title", "show_subtitle", "show_controls", "show_sensors", "show_alerts", "show_pilot_wire", "show_schedule", "collapsed", "language", "banner", "illustration_theme"]) {
    assert.ok(full.includes(n), `full: ${n}`);
    assert.ok(mini.includes(n), `mini: ${n}`);
  }
  assert.ok(mini.includes("zoom"));
  assert.ok(!full.includes("zoom"));
  const e = new hc.HeatingMiniCardEditor();
  const events = [];
  e.dispatchEvent = (ev) => events.push(ev);
  e.setConfig({ type: "custom:heating-mini-card" });
  e._hass = mockHass();
  assert.deepEqual(plain(e._data().collapsed), ["schedule"]);
  e._changed({ stopPropagation() {}, detail: { value: { ...e._data(), show_schedule: false, collapsed: [] } } });
  assert.deepEqual(plain(events.at(-1).detail.config), { type: "custom:heating-mini-card", show_schedule: false, collapsed: [] });
});

test("power turns off with climate.turn_off a thermostat that has no off mode", () => {
  const hass = mockHass({ "climate.bureau_thermostat": { state: "heat", hvac_modes: ["heat", "auto"], supported_features: 385 } });
  const c = card({ entity: "climate.bureau_thermostat" }, hass);
  click(c, { action: "power", zone: "0" });
  assert.deepEqual(plain(c.calls), [["climate", "turn_off", { entity_id: "climate.bureau_thermostat" }]]);
});

test("power turns a thermostat back on in the mode it had before the card turned it off", () => {
  const c = card({ entity: "climate.salon_thermostat" }, mockHass({ "climate.salon_thermostat": { state: "auto" } }));
  click(c, { action: "power", zone: "0" });
  c.hass = { ...mockHass({ "climate.salon_thermostat": { state: "off" } }), callService: c.hass.callService };
  click(c, { action: "power", zone: "0" });
  assert.deepEqual(plain(c.calls).at(-1), ["climate", "set_hvac_mode", { entity_id: "climate.salon_thermostat", hvac_mode: "auto" }]);
});

test("discovery leaves out an air conditioner's or a fan's selects and names a second thermostat of an area after its device", () => {
  const hass = mockHass();
  hass.states = { ...hass.states };
  hass.entities = { ...hass.entities };
  hass.devices = { ...hass.devices, clim: { id: "clim", name: "Split", area_id: "bedroom" }, valve2: { id: "valve2", name: "Bedroom second valve", area_id: "bedroom" } };
  const add = (id, device_id, state, attributes) => {
    hass.entities[id] = { entity_id: id, device_id };
    hass.states[id] = { entity_id: id, state, attributes };
  };
  add("climate.split", "clim", "cool", { hvac_modes: ["off", "cool", "heat"] });
  add("select.split_mode", "clim", "eco", { options: ["comfort", "eco", "off", "frost_protection"] });
  add("climate.vanne2", "valve2", "heat", { hvac_modes: ["off", "heat"] });
  const zones = plain(hc.discoverZones(hass));
  assert.ok(!zones.some((z) => z.entity === "climate.split" || (z.pilot_wire || []).includes("select.split_mode")));
  const second = zones.find((z) => z.entity === "climate.vanne2");
  assert.equal(second.name, "Bedroom second valve");
});

test("the schedule falls back to schedule/list when get_schedule is missing", async () => {
  const hass = mockHass();
  hass.callWS = async (msg) => {
    if (msg.type === "schedule/list") return [{ id: "abc", name: "Living room heating", monday: [{ from: "07:00:00", to: "09:00:00" }] }];
    if (msg.type === "config/entity_registry/get") return { unique_id: "abc" };
    throw new Error("unknown service");
  };
  hass.states = { ...hass.states, "schedule.salon_chauffage": { ...hass.states["schedule.salon_chauffage"], last_updated: "fallback" } };
  const week = await hc.fetchWeek(hass, "schedule.salon_chauffage");
  assert.deepEqual(plain(week)[0], [[420, 540]]);
  assert.deepEqual(plain(week)[1], []);
});

test("an update held back while a dropdown has the focus is drawn once it leaves", async () => {
  const c = card({ entity: "climate.salon_thermostat" });
  c.shadowRoot.activeElement = { tagName: "SELECT", attributes: [] };
  c.hass = mockHass({ "climate.salon_thermostat": { current_temperature: 23.5 } });
  assert.doesNotMatch(html(c), /23\.5/);
  c.shadowRoot.activeElement = null;
  c.shadowRoot.listeners.focusout({ target: { tagName: "SELECT" } });
  await tick(5);
  assert.match(html(c), /23\.5/);
});

test("fan mode and target humidity of a thermostat that has them are dropdowns calling their services", () => {
  const hass = mockHass({ "climate.salon_thermostat": { supported_features: 401 | 8 | 4, fan_modes: ["auto", "on"], fan_mode: "auto", humidity: 45, min_humidity: 30, max_humidity: 60 } });
  const c = card({ entity: "climate.salon_thermostat" }, hass);
  assert.match(html(c), /data-attr="fan_mode"/);
  assert.match(html(c), /data-attr="humidity"/);
  const change = (attr, service, value) =>
    c._onChange({ target: { tagName: "SELECT", value, dataset: { action: "attr", attr, service, zone: "0" }, blur() {} } });
  change("fan_mode", "set_fan_mode", "on");
  change("humidity", "set_humidity", "50");
  assert.deepEqual(plain(c.calls), [
    ["climate", "set_fan_mode", { entity_id: "climate.salon_thermostat", fan_mode: "on" }],
    ["climate", "set_humidity", { entity_id: "climate.salon_thermostat", humidity: 50 }],
  ]);
});

test("comfort −1 and −2 keep their −1 / −2 on icon-only pilot wire buttons", () => {
  const c = card({ pilot_wire: "select.salon_radiateur_fil_pilote" });
  assert.match(html(c), /title="Comfort −1"[^>]*>.*?<span class="tag" aria-hidden="true">−1<\/span>/);
});

test("a thermostat without an area and a second thermostat of an area get zones of their own", () => {
  const hass = mockHass();
  hass.states = { ...hass.states };
  hass.entities = { ...hass.entities };
  hass.devices = { ...hass.devices, valve2: { id: "valve2", name: "Bedroom second valve", area_id: "bedroom" }, loose: { id: "loose", name: "Garage heater", area_id: null } };
  for (const [id, device_id] of [["climate.vanne2", "valve2"], ["climate.garage", "loose"]]) {
    hass.entities[id] = { entity_id: id, device_id };
    hass.states[id] = { entity_id: id, state: "heat", attributes: { hvac_modes: ["off", "heat"], current_temperature: 15, temperature: 16, supported_features: 1 } };
  }
  const c = card({}, hass);
  assert.equal((html(c).match(/role="tab"/g) || []).length, 6);
  assert.match(html(c), /Bedroom second valve/);
  assert.match(html(c), /Garage heater/);
});

test("a top-level name titles the card and the area stands under it, not the name again", () => {
  const c = card({ entity: "climate.chambre_vanne", name: "Bedroom valve" });
  // The status is in the pill on the title's row, no longer repeated in the subtitle.
  assert.match(html(c), /<div class="name">Bedroom valve<\/div><span class="st bst"[^>]*title="Idle"[^>]*>.*?<\/span><\/div><div class="sub" title="Bedroom · Eco">Bedroom · Eco<\/div>/);
  const classic = card({ entity: "climate.chambre_vanne", name: "Bedroom valve", illustration: false });
  assert.match(html(classic), /<div class="name">Bedroom valve<\/div><span class="st"[^>]*title="Idle"[^>]*>.*?<\/span><\/div><div class="sub" title="Bedroom · Eco">Bedroom · Eco<\/div>/);
});

test("the illustrated header: theme, readout, ground strip and icon color follow the zone", () => {
  // Heating: orange, heat halo, readout current → target, the Netatmo badge on the fire icon (the build embeds the
  // logos from images/badges/).
  hc.BRAND_LOGOS.netatmo = "data:image/png;base64,AA==";
  let h = html(card({ entity: "climate.salon_thermostat" }, mockHass(), hc.HeatingMiniCard));
  assert.match(h, /class="banner"/);
  assert.match(h, /class="bground g-heat"/);
  assert.match(h, /class="bhalo"/);
  assert.match(h, /class="bcur"[^>]*>19\.5°<\/text><text class="btgt"[^>]*>→ 21°</);
  assert.match(h, /<span class="brand"><img src=/);
  assert.match(h, /class="badge heating" style="--hc-color:var\(--state-climate-heat-color/);
  // Eco preset: green with a leaf; an open window turns the icon amber.
  h = html(card({ entity: "climate.chambre_vanne" }, mockHass(), hc.HeatingMiniCard));
  assert.match(h, /class="bground g-eco"/);
  assert.match(h, /class="bleaf"/);
  assert.match(h, /class="badge" style="--hc-color:var\(--hc-warn\)"/);
  // Frost protection (a target of 10° or less): blue snowflakes.
  const frost = mockHass({ "climate.chambre_vanne": { preset_mode: "none", temperature: 7 }, "binary_sensor.chambre_vanne_fenetre_ouverte": { state: "off" } });
  h = html(card({ entity: "climate.chambre_vanne" }, frost, hc.HeatingMiniCard));
  assert.match(h, /class="bground g-frost"/);
  assert.match(h, /class="bflake f0"/);
  // Off: grey strip and icon, the radiator-off icon.
  h = html(card({ entity: "climate.bureau_thermostat" }, mockHass(), hc.HeatingMiniCard));
  assert.match(h, /class="bground g-off"/);
  assert.match(h, /class="badge" style="--hc-color:var\(--disabled-text-color/);
  assert.doesNotMatch(h, /class="brand"/, "no logo for a platform without one");
  // The overview has it too (the first zone that heats), and keeps the classic one with `illustration: false`.
  h = html(card({}, mockHass(), hc.HeatingOverviewCard));
  assert.match(h, /class="banner/);
  assert.match(h, /class="bground g-/);
  assert.doesNotMatch(html(card({ illustration: false }, mockHass(), hc.HeatingOverviewCard)), /class="banner/);
});

test("night follows the dark theme alone (a light theme stays day after sunset), and illustration_theme forces it", () => {
  const sun = (state, darkMode = false) =>
    mockHass({}, { states: { ...mockHass().states, "sun.sun": { entity_id: "sun.sun", state, attributes: {} } }, themes: { darkMode } });
  assert.match(html(card({}, sun("above_horizon", true))), /class="banner night"/);
  assert.match(html(card({ illustration_theme: "day" }, sun("above_horizon", true))), /class="banner"/);
  assert.match(html(card({}, sun("below_horizon"))), /class="banner"/, "light theme after sunset: day");
  assert.match(html(card({}, sun("above_horizon"), hc.HeatingCard)), /class="banner"/);
  assert.match(html(card({}, mockHass({}, { themes: { darkMode: true } }))), /class="banner night"/);
  assert.match(html(card({ illustration_theme: "day" }, sun("below_horizon"))), /class="banner"/);
  assert.match(html(card({ illustration_theme: "night" }, sun("above_horizon"))), /class="banner night"/);
});

test("several cards on a page keep their SVG ids apart", () => {
  const a = html(card());
  const b = html(card());
  const ids = (h) => [...h.matchAll(/id="(hcb?-[\w-]+)"/g)].map((m) => m[1]);
  assert.ok(ids(a).length);
  assert.equal(ids(a).filter((id) => ids(b).includes(id)).length, 0);
});

test("a stove: found from its integration or name, its phase read in any language", () => {
  assert.equal(hc.guessVariant("palazzetti Connection Box Pellet stove"), "stove");
  assert.equal(hc.guessVariant("Poêle à granulés"), "stove");
  assert.equal(hc.guessVariant("Zigbee radiator valve"), "valve");
  for (const [text, phase] of [["burning", "burning"], ["Accensione", "ignition"], ["Cooling", "cooling"], ["Standby", "standby"], ["off", "off"], ["Alarm: pellet end", "alarm"], ["modulation", "burning"], ["", null], ["unknown", null]])
    assert.equal(hc.stovePhase(text), phase, text);
  // The stove is hidden from discovery: the zones found stay four.
  assert.equal(hc.discoverZones(mockHass()).length, 4);
});

test("a stove zone shows its phases, power levels, pellets, flue gas, fan and ignitions, and sets its power", () => {
  const c = card({ entity: "climate.poele_granules" });
  const h = html(c);
  assert.match(h, /Burning/);
  assert.match(h, /class="phase on" aria-current="step">Burning/);
  assert.match(h, /class="segments levels"/);
  assert.match(h, /data-action="stove_power" data-value="3"[^>]*aria-pressed="true"/);
  assert.match(h, /Pellets[\s\S]*35 %/);
  assert.match(h, /Flue gas[\s\S]*168 °C/);
  assert.match(h, /Ignitions[\s\S]*>2</);
  click(c, { action: "stove_power", value: "5", entity: "number.poele_granules_puissance", zone: "0" });
  assert.deepEqual(plain(c.calls.at(-1)), ["number", "set_value", { entity_id: "number.poele_granules_puissance", value: 5 }]);
});

test("a stove's mini card shows its power level and pellets left", () => {
  const h = html(card({ entity: "climate.poele_granules" }, mockHass(), hc.HeatingMiniCard));
  assert.match(h, /Power 3\/5 · Pellets 35 %/);
});

test("a stove in alarm or low on pellets raises an alert", () => {
  const hass = mockHass({ "sensor.poele_granules_status": { state: "Alarm" }, "sensor.poele_granules_pellet_level": { state: "6" } });
  const h = html(card({ entity: "climate.poele_granules" }, hass));
  assert.match(h, /class="phases alarm"/);
  assert.match(h, /chip warn[^>]*>[\s\S]*Low pellets/);
});

test("underfloor heating, towel rails and boilers: found from their integration, brand or name", () => {
  for (const [text, v] of [
    ["oekofen Pellematic", "pellet_boiler"],
    ["Chaudière à granulés", "pellet_boiler"],
    ["Hargassner Nano-PK", "pellet_boiler"],
    ["opentherm_gw OpenTherm Gateway", "gas_boiler"],
    ["vicare Vitodens 200", "gas_boiler"],
    ["Chaudière gaz", "gas_boiler"],
    ["Oil boiler", "oil_boiler"],
    ["Chaudière fioul", "oil_boiler"],
    ["esphome Diesel heater", "oil_boiler"],
    ["Plancher chauffant", "floor"],
    ["Danfoss Icon room thermostat", "floor"],
    ["Fußbodenheizung", "floor"],
    ["Sèche-serviettes", "towel"],
    ["Towel radiator", "towel"],
    ["Palazzetti pellet stove", "stove"],
    ["Zigbee radiator valve", "valve"],
    ["heatzy Pilote", "radiator"],
  ])
    assert.equal(hc.guessVariant(text), v, text);
  // Each is hidden from discovery: the zones found stay four.
  assert.equal(hc.discoverZones(mockHass()).length, 4);
});

test("underfloor heating shows its floor temperature", () => {
  const h = html(card({ entity: "climate.plancher_sejour" }));
  assert.match(h, /Floor 26\.5 °C/);
  assert.match(h, /class="glow pipe"/);
});

test("a towel rail on Boost says its time left", () => {
  const h = html(card({ entity: "climate.seche_serviettes" }));
  assert.match(h, /Heating · 30 min left/);
  assert.match(h, /class="towel"/);
});

test("a pellet boiler burns as a stove: phases, pellets, flow and return in a Boiler section", () => {
  const h = html(card({ entity: "climate.chaudiere_granules" }));
  assert.match(h, /class="phase on" aria-current="step">Burning/);
  assert.match(h, />Boiler</);
  assert.match(h, /Pellets[\s\S]*52 %/);
  assert.match(h, /Flow[\s\S]*68 °C/);
  assert.match(h, /Return[\s\S]*52 °C/);
});

test("a gas boiler: flow, return, burner modulation and pressure; low pressure is an alert", () => {
  const h = html(card({ entity: "climate.chaudiere_gaz" }));
  assert.match(h, /class="flame gas"/);
  for (const re of [/Flow[\s\S]*55 °C/, /Return[\s\S]*42 °C/, /Burner[\s\S]*42 %/, /Pressure[\s\S]*1\.6 bar/]) assert.match(h, re);
  assert.doesNotMatch(h, /Low pressure/);
  const low = html(card({ entity: "climate.chaudiere_gaz" }, mockHass({ "sensor.chaudiere_gaz_pressure": { state: "0.5" } })));
  assert.match(low, /chip warn[^>]*>[\s\S]*Low pressure · 0\.5 bar/);
  // The mini card: its flow and burner on one line.
  assert.match(html(card({ entity: "climate.chaudiere_gaz" }, mockHass(), hc.HeatingMiniCard)), /Flow 55 °C · Burner 42 %/);
});

test("an oil boiler: its tank as a bar and a low fuel alert; the burner off means not heating", () => {
  const h = html(card({ entity: "climate.chaudiere_fioul" }));
  assert.match(h, /class="pellets fuel"[\s\S]*Fuel[\s\S]*48 %/);
  const low = html(card({ entity: "climate.chaudiere_fioul" }, mockHass({ "sensor.chaudiere_fioul_fuel_level": { state: "9" }, "climate.chaudiere_fioul": { hvac_action: null }, "binary_sensor.chaudiere_fioul_burner": { state: "off" } })));
  assert.match(low, /chip warn[^>]*>[\s\S]*Low fuel/);
  assert.match(low, /Idle/);
});

test("the states are counted once per states object, not on every registry lookup", () => {
  const { stateCount } = load();
  const states = { "climate.a": {}, "climate.b": {} };
  assert.equal(stateCount(states), 2);
  // Counted already: the same object answers from the cache (Home Assistant replaces it on every change).
  states["climate.c"] = {};
  assert.equal(stateCount(states), 2);
  assert.equal(stateCount({ ...states }), 3);
  assert.equal(stateCount(undefined), 0);
});
