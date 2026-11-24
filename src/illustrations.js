// ── Illustrations (ported from ha-climate-air-card's thermostat card) ─────────────────────────────────────────────
// Heat rises while it actually heats (hvac_action, else the valve opening), the radiator glows from the bottom up and
// the dial's flame flickers; the display shows the target and the dial's arc where it sits between the entity's min
// and max. Three shapes: a round wall thermostat, a column radiator and a radiator valve on the corner of its
// radiator; `illustration: auto` picks one from the device model and name. A pilot wire radiator is the column
// radiator, glowing in the color of its order.
import { esc } from "./core.js";
import { deviceOf } from "./discovery.js";

export const waves = (xs, y, cls = "") => `<g class="heat${cls}">${xs.map((x) => `<path d="M${x} ${y}q-2-2.5 0-5t0-5"/>`).join("")}</g>`;

export const columns = (x, n, w, step, y1, y2) =>
  Array.from({ length: n }, (_, i) => {
    const cx = x + i * step;
    const r = w / 2;
    return (
      `<rect x="${cx}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${r}" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width=".9"/>` +
      `<rect class="glow" x="${cx}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${r}" fill="url(#hc-tg)"/>`
    );
  }).join("");

export const arc = (cx, cy, r, level) => {
  const len = 2 * Math.PI * r;
  const part = len * 0.75;
  const at = `transform="rotate(135 ${cx} ${cy})"`;
  const lvl = Math.max(0, Math.min(1, level ?? 0));
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3a434e" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${part.toFixed(2)} ${len.toFixed(2)}" ${at}/>` +
    `<circle class="arc" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, part * lvl).toFixed(2)} ${len.toFixed(2)}" ${at}/>`
  );
};

export const ARTS = {
  dial: (s) =>
    '<circle class="halo" cx="40" cy="52" r="34" fill="url(#hc-th)"/>' +
    waves([31, 40, 49], 24) +
    '<rect x="13" y="25" width="54" height="54" rx="12" fill="url(#hc-tb)" stroke="#c3cad2" stroke-width="1.1"/>' +
    '<circle cx="40" cy="52" r="22" fill="url(#hc-tr)" stroke="#aab3bd" stroke-width=".8"/>' +
    '<circle cx="40" cy="52" r="18" fill="#1d2632"/>' +
    arc(40, 52, 14.5, s.level) +
    `<text class="disp big" x="40" y="54.6" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<path class="flame" d="M40 57.4c2 1.7 2.6 3 2.6 4.3a2.6 2.6 0 0 1-5.2 0c0-1 .5-1.8 1.1-2.3c.1.8.5 1.2 1 1.2c.5-1 .5-2.1.5-3.2Z"/>' +
    '<circle class="led" cx="40" cy="74" r="1.3"/>',
  radiator: () =>
    '<ellipse class="floor" cx="40" cy="89" rx="31" ry="4" fill="url(#hc-af)"/>' +
    waves([22, 40, 58], 22) +
    '<rect x="12" y="82" width="4" height="6" rx="1" fill="#8f9aa6"/><rect x="60" y="82" width="4" height="6" rx="1" fill="#8f9aa6"/>' +
    columns(8, 7, 7, 8.6, 28, 84) +
    '<rect x="6" y="31" width="64" height="3.4" rx="1.7" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="6" y="77" width="64" height="3.4" rx="1.7" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="70" y="42" width="7" height="22" rx="2.2" fill="#3a434e"/>' +
    '<circle class="led" cx="73.5" cy="47" r="1.3"/>' +
    '<circle cx="73.5" cy="56" r="2.2" fill="#5d6874" stroke="#8f9aa6" stroke-width=".5"/>',
  valve: (s) =>
    '<ellipse class="floor" cx="26" cy="89" rx="24" ry="3.6" fill="url(#hc-af)"/>' +
    waves([11, 20, 29], 22) +
    columns(2, 4, 7, 8.6, 30, 86) +
    '<rect x="0" y="33" width="38" height="3.2" rx="1.6" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="0" y="79" width="38" height="3.2" rx="1.6" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="36" y="77" width="40" height="6" rx="1.5" fill="#cfd5dc" stroke="#aab3bd" stroke-width=".6"/>' +
    '<rect x="51" y="66" width="12" height="18" rx="2" fill="#dfe4ea" stroke="#aab3bd" stroke-width=".7"/>' +
    '<rect x="48" y="16" width="18" height="51" rx="8" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width="1.1"/>' +
    '<path d="M50 50h14M50 53.5h14M50 57h14M50 60.5h14" stroke="#d5dbe2" stroke-width="1"/>' +
    `<rect x="50" y="26" width="14" height="10" rx="2.5" fill="#1d2632"/><text class="disp" x="57" y="33.2" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<circle class="led" cx="57" cy="42" r="1.3"/>',
};
// A stove (pellet or wood): its flue pipe, the fire behind the glass (flames while it burns, embers glowing), the
// display with the target and the hopper lid on top.
ARTS.stove = (s) =>
  '<ellipse class="floor" cx="40" cy="89" rx="30" ry="4" fill="url(#hc-af)"/>' +
  '<circle class="halo" cx="40" cy="54" r="34" fill="url(#hc-th)"/>' +
  '<rect x="35" y="0" width="10" height="24" fill="#5d6874"/><rect x="33" y="14" width="14" height="3" rx="1" fill="#4d5764"/>' +
  '<rect x="14" y="22" width="52" height="66" rx="7" fill="#3a434e"/>' +
  '<rect x="12" y="20" width="56" height="7" rx="3" fill="#4d5764"/><path d="M18 31h44" stroke="#566170" stroke-width="1"/>' +
  '<rect x="21" y="35" width="38" height="33" rx="5" fill="#141a22"/>' +
  '<rect class="glow ember" x="23" y="52" width="34" height="14" rx="3" fill="url(#hc-tg)"/>' +
  '<path class="flame" d="M29 66c-2-7 3-10 2-16c4 4 6 7 5 11c2-3 2-6 1-9c5 4 8 9 7 14z"/>' +
  '<path class="flame f2" d="M43 66c0-6 3-8 3-13c3 4 5 8 4 13z"/>' +
  '<rect x="21" y="35" width="38" height="33" rx="5" fill="none" stroke="#6b7682" stroke-width="2"/>' +
  '<rect x="24" y="64" width="32" height="3" rx="1.5" fill="#5d6874"/>' +
  `<rect x="28" y="74" width="24" height="8" rx="2" fill="#1d2632"/><text class="disp" x="40" y="80.2" text-anchor="middle">${esc(s.display || "")}</text>` +
  '<circle class="led" cx="57" cy="78" r="1.3"/>' +
  '<rect x="18" y="88" width="6" height="3" fill="#3a434e"/><rect x="56" y="88" width="6" height="3" fill="#3a434e"/>';
// Underfloor heating: a sofa on the floor, and under it the floor's cross-section, its water loop glowing while it heats
// and the heat rising from the floor around the sofa.
export const FLOOR_PATH = "M9 66h62a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h62a3 3 0 0 1 0 6H9";
ARTS.floor = () =>
  '<rect class="glow" x="6" y="52" width="68" height="10" rx="3" fill="url(#hc-tg)"/>' +
  waves([9, 75], 56, " floorheat") +
  waves([30, 50], 35, " floorheat") +
  '<rect x="4" y="62" width="72" height="24" rx="3" fill="#d6cfc6"/><rect x="4" y="62" width="72" height="24" rx="3" fill="#000" opacity=".04"/>' +
  `<path d="${FLOOR_PATH}" fill="none" stroke="#b9b1a6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path class="glow pipe" d="${FLOOR_PATH}" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` +
  '<rect x="4" y="57" width="72" height="6" rx="2" fill="#c8a07a"/><path d="M16 57v6M30 57v6M44 57v6M58 57v6" stroke="#b08660" stroke-width=".8"/>' +
  '<rect x="18" y="38" width="44" height="12" rx="4" fill="#5c7cfa"/><rect x="14" y="44" width="52" height="10" rx="4" fill="#4c6ef5"/>' +
  '<rect x="11" y="40" width="9" height="15" rx="4" fill="#4263eb"/><rect x="60" y="40" width="9" height="15" rx="4" fill="#4263eb"/>' +
  '<rect x="21" y="40" width="18" height="6" rx="3" fill="#91a7ff"/><rect x="41" y="40" width="18" height="6" rx="3" fill="#91a7ff"/>' +
  '<path d="M16 54v3M64 54v3" stroke="#364fc7" stroke-width="2.4" stroke-linecap="round"/>';
// A towel rail: its ladder of bars glowing from the bottom up, a towel over it and its controller at the foot.
ARTS.towel = () =>
  '<ellipse class="floor" cx="40" cy="89" rx="28" ry="3.6" fill="url(#hc-af)"/>' +
  '<circle class="halo" cx="40" cy="46" r="34" fill="url(#hc-th)"/>' +
  waves([10, 70], 40) +
  '<rect x="14" y="6" width="5" height="80" rx="2.5" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width=".6"/>' +
  '<rect x="61" y="6" width="5" height="80" rx="2.5" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width=".6"/>' +
  Array.from({ length: 11 }, (_, i) => {
    const y = 10 + i * 7;
    return `<rect x="17" y="${y}" width="46" height="3.2" rx="1.6" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width=".5"/><rect class="glow" x="17" y="${y}" width="46" height="3.2" rx="1.6" fill="url(#hc-tg)"/>`;
  }).join("") +
  '<path class="towel" d="M27 22h26v38c-4 5-22 5-26 0z"/><path class="towel fold" d="M27 22h26v5H27z"/>' +
  '<path class="towel stripe" d="M33 29v28M40 29v30M47 29v28"/>' +
  '<rect x="57" y="79" width="12" height="8" rx="2" fill="#3a434e"/><circle class="led" cx="63" cy="83" r="1.3"/>';
// A pellet boiler: its flue, the fire behind its door (as a stove), its display and the hopper beside it, filled to the
// pellets left.
ARTS.pellet_boiler = (s) => {
  const lvl = Math.max(0, Math.min(100, s.stove?.pellets ?? 60)) / 100;
  const h = 44 * lvl;
  return (
    '<ellipse class="floor" cx="40" cy="89" rx="36" ry="4" fill="url(#hc-af)"/>' +
    '<circle class="halo" cx="25" cy="54" r="32" fill="url(#hc-th)"/>' +
    '<rect x="20" y="0" width="8" height="18" fill="#8f9aa6"/><rect x="18" y="14" width="12" height="3" rx="1" fill="#5d6874"/>' +
    '<rect x="4" y="16" width="42" height="72" rx="6" fill="url(#hc-tb)" stroke="#c3cad2" stroke-width="1"/>' +
    `<rect x="10" y="22" width="30" height="9" rx="2" fill="#1d2632"/><text class="disp" x="25" y="28.6" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<rect x="12" y="38" width="26" height="24" rx="4" fill="#141a22"/>' +
    '<rect class="glow ember" x="14" y="50" width="22" height="10" rx="3" fill="url(#hc-tg)"/>' +
    '<path class="flame" d="M17 61c-1-6 3-8 2-13c3 3 5 6 4 9c2-2 2-5 1-7c4 3 6 7 5 11z"/>' +
    '<path class="flame f2" d="M28 61c0-5 2-6 2-10c3 3 4 6 3 10z"/>' +
    '<rect x="12" y="38" width="26" height="24" rx="4" fill="none" stroke="#8f9aa6" stroke-width="1.6"/>' +
    '<rect x="10" y="70" width="30" height="3" rx="1.5" fill="#cfd5dc"/><circle class="led" cx="38" cy="80" r="1.3"/>' +
    '<rect x="46" y="70" width="5" height="4" fill="#8f9aa6"/>' +
    '<rect x="50" y="12" width="26" height="76" rx="4" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width="1"/>' +
    '<rect x="48" y="9" width="30" height="5" rx="2" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="54" y="34" width="18" height="48" rx="2" fill="#ffffff" opacity=".55"/>' +
    `<rect x="55" y="${(81 - h).toFixed(1)}" width="16" height="${h.toFixed(1)}" rx="1.5" fill="#c08a4a"/>` +
    '<path d="M57 79h12M57 76h12" stroke="#a0703a" stroke-width=".8" stroke-dasharray="1.5 1.5"/>'
  );
};
// A wall-hung gas boiler: its display, the blue flame of its burner while it fires, its knobs and the pipes under it.
ARTS.gas_boiler = (s) =>
  '<circle class="halo" cx="40" cy="38" r="34" fill="url(#hc-th)"/>' +
  '<rect x="36" y="0" width="8" height="8" fill="#aab3bd"/>' +
  ["#e03131", "#1c7ed6", "#f59f00", "#e03131", "#1c7ed6"].map((c, i) => `<rect x="${(21.5 + i * 8.6).toFixed(1)}" y="56" width="3.4" height="34" fill="${c}"/>`).join("") +
  '<rect x="14" y="6" width="52" height="52" rx="8" fill="url(#hc-tb)" stroke="#c3cad2" stroke-width="1"/>' +
  '<rect x="18" y="54" width="44" height="3" rx="1.5" fill="#cfd5dc"/>' +
  `<rect x="24" y="15" width="32" height="12" rx="3" fill="#1d2632"/><text class="disp big" x="40" y="23.8" text-anchor="middle">${esc(s.display || "")}</text>` +
  '<path class="flame gas" d="M40 50c-3.4 0-5-2.4-5-5c0-2.2 1.4-3.4 2.4-4.6c.2 1.3.8 2 1.6 2.2c-.3-2.6.8-4.8 3-6.6c-.5 2.6 1 4 2 5.6c.8 1.2 1 2.2 1 3.4c0 2.6-2 5-5 5z"/>' +
  '<circle cx="23" cy="46" r="3.2" fill="#dfe4ea" stroke="#aab3bd" stroke-width=".6"/><circle cx="57" cy="46" r="3.2" fill="#dfe4ea" stroke="#aab3bd" stroke-width=".6"/>' +
  '<circle class="led" cx="40" cy="32" r="1.3"/>';
// An oil boiler (or a diesel heater): its dark cabinet, the burner's flame behind its round window, and the fuel tank
// beside it with its gauge at the fuel left.
ARTS.oil_boiler = (s) => {
  const lvl = Math.max(0, Math.min(100, s.boiler?.fuel ?? 60)) / 100;
  const h = 34 * lvl;
  return (
    '<ellipse class="floor" cx="40" cy="89" rx="38" ry="4" fill="url(#hc-af)"/>' +
    '<circle class="halo" cx="22" cy="56" r="30" fill="url(#hc-th)"/>' +
    '<rect x="16" y="0" width="9" height="24" fill="#5d6874"/>' +
    '<rect x="2" y="22" width="40" height="66" rx="5" fill="#3a434e"/><rect x="2" y="22" width="40" height="6" rx="3" fill="#4d5764"/>' +
    `<rect x="8" y="31" width="28" height="8" rx="2" fill="#141a22"/><text class="disp" x="22" y="36.8" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<rect x="9" y="46" width="26" height="22" rx="11" fill="#141a22"/>' +
    '<rect class="glow ember" x="11" y="56" width="22" height="10" rx="5" fill="url(#hc-tg)"/>' +
    '<path class="flame" d="M15 67c-1-6 4-8 3-13c3 3 5 5 4 8c2-2 2-4 1-7c4 3 6 7 5 12z"/>' +
    '<rect x="9" y="46" width="26" height="22" rx="11" fill="none" stroke="#6b7682" stroke-width="1.6"/>' +
    '<circle class="led" cx="36" cy="80" r="1.3"/><rect x="42" y="80" width="5" height="3" fill="#8f9aa6"/>' +
    '<rect x="46" y="38" width="32" height="50" rx="10" fill="url(#hc-tc)" stroke="#aab3bd" stroke-width="1"/>' +
    '<rect x="52" y="44" width="8" height="38" rx="3" fill="#1d2632"/>' +
    `<rect x="53.5" y="${(81 - h).toFixed(1)}" width="5" height="${h.toFixed(1)}" rx="2" fill="#f59f00"/>` +
    '<path d="M64 52h9M64 60h9M64 68h9M64 76h9" stroke="#aab3bd" stroke-width="1"/>'
  );
};
export const ILLUSTRATIONS = Object.keys(ARTS);

export const art = (variant, s, uid) =>
  (
    '<svg viewBox="0 0 80 94" aria-hidden="true"><defs>' +
    '<linearGradient id="hc-tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e1e6eb"/></linearGradient>' +
    '<linearGradient id="hc-tc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d5dbe2"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d0d8"/></linearGradient>' +
    '<linearGradient id="hc-tr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#c9d0d8"/><stop offset="1" stop-color="#eef1f4"/></linearGradient>' +
    '<linearGradient id="hc-tg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" class="c-stop" stop-opacity=".75"/><stop offset=".7" class="c-stop" stop-opacity=".18"/><stop offset="1" class="c-stop" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="hc-th" cx=".5" cy=".5" r=".5"><stop offset=".55" class="c-stop" stop-opacity=".35"/><stop offset="1" class="c-stop" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="hc-af" cx=".5" cy=".5" r=".5"><stop offset="0" class="c-stop" stop-opacity=".45"/><stop offset="1" class="c-stop" stop-opacity="0"/></radialGradient></defs>' +
    (ARTS[variant] || ARTS.dial)(s) +
    "</svg>"
  ).replace(/(id="|url\(#)(hc-[a-z]+)/g, `$1$2-${uid}`);

// The shape that looks most like the device, from its model and name: a valve first (a "radiator valve" is one).
export const guessVariant = (text) => {
  const s = String(text).toLowerCase();
  if (/(pellet|granul).{0,24}(boiler|kessel|chaudi|caldaia|caldera|heizung)|(boiler|kessel|chaudi|caldaia|caldera).{0,24}(pellet|granul)|[oö]kofen|oekofen|hargassner|fr[oö]ling|froeling|\bkwb\b|windhager|\beta\b|guntamatic|solarfocus/.test(s)) return "pellet_boiler";
  if (/stove|po[eê]le|pellet|granul|kaminofen|pelletofen|estufa|stufa|kachelofen|chemin[ée]e|fireplace|insert|palazzetti|edilkamin|maestro|rika|ecoforest|fumis|duepi|extraflame|micronova|piazzetta|j[oø]tul|invicta|godin/.test(s)) return "stove";
  if (/valve|vanne|trv|t[eê]te.?thermo|thermostatic|thermostatique|heizk[oö]rperthermostat|ventil|spirit|eurotronic|danfoss.?ally|e1.?thermostat/.test(s)) return "valve";
  if (/\boil\b|fioul|fuel|heiz[oö]l|[oö]lkessel|oelkessel|gasoil|gas[oó]leo|gasolio|diesel|mazout|webasto|eberspa|afterburner/.test(s)) return "oil_boiler";
  if (/opentherm|otgw|ebusd|ems.?esp|vicare|viessmann|vaillant|my.?pyllant|buderus|nefit|easycontrol|saunier|atag|remeha|baxi|de.?dietrich|chappee|frisquet|immergas|ariston|junkers|boiler|chaudi[eè]re|kessel|therme|caldera|caldaia|ketel/.test(s)) return "gas_boiler";
  if (/under.?floor|floor.?heat|heated.?floor|plancher|sol.?chauffant|fu[sß]boden|fussboden|suelo.?radiante|pavimento|vloerverwarming|\bufh\b|danfoss.?icon|uponor|heatmiser|thermosmart|warmup|devireg|nea.?smart/.test(s)) return "floor";
  if (/towel|s[eè]che.?serviette|handtuch|toallero|scaldasalviette|toalheiro|badheizk[oö]rper/.test(s)) return "towel";
  if (/radiat|convect|heater|chauffage|panel|panneau|heizk[oö]rper|radiador|heatzy/.test(s)) return "radiator";
  return "dial";
};
export const variantOf = (hass, id, illustration) => {
  if (illustration && ILLUSTRATIONS.includes(illustration)) return illustration;
  if (id?.split(".")[0] !== "climate") return "radiator";
  const dev = hass.devices?.[deviceOf(hass, id)];
  return guessVariant([hass.entities?.[id]?.platform, dev?.manufacturer, dev?.model, dev?.name, dev?.name_by_user, id, hass.states[id]?.attributes.friendly_name].filter(Boolean).join(" "));
};
