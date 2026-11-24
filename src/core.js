/*
 * Heating Card for Home Assistant
 * https://github.com/juju35/ha-heating-card
 *
 * Lovelace cards for the heating of a home: thermostats (`climate` entities that heat but cannot cool, dry or blow:
 * wall thermostats, electric radiators, radiator valves), pilot wire radiators (`select` entities offering comfort,
 * eco, frost protection, off, comfort -1 / -2, or a `switch` relay) and their weekly `schedule` helpers, room by room.
 *
 * The thermostat part comes from the thermostat card of juju35/ha-climate-air-card (illustrations, device sensors
 * found through the registries, debounced target, presets, alerts), extended with zones, pilot wire and schedules;
 * the overview card takes over the thermostats of that repository's overview: the whole home floor by floor, with its
 * summary and quick actions for every zone.
 * Entities are resolved through the entity, device and area registries, so they work whatever the Home Assistant
 * language or entity ids.
 */
import { STRINGS } from "./i18n/strings.js";

export const VERSION = "__VERSION__";
export const REPO = "https://github.com/juju35/ha-heating-card";


export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The card's language: its `language` option, else Home Assistant's, else the page's; the full code when the card has
// it ("sr-Latn"), else the part before the dash ("fr-FR" → "fr"), else English.
export const lang = (hass, config) => {
  const full = String(config?.language || hass?.locale?.language || hass?.language || globalThis.document?.documentElement?.lang || "en");
  if (STRINGS[full]) return full;
  const base = full.split("-")[0];
  return STRINGS[base] ? base : "en";
};

// Locale for Intl: Home Assistant's full locale ("pt-BR", "de-CH") when it is in the card's language, else the card's
// language; a bare "pt" (Home Assistant's European Portuguese) becomes "pt-PT", or Intl formats it the Brazilian way.
export const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = String(config?.language || hass?.locale?.language || hass?.language || "");
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

export const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)]?.[key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const unavailable = (st) => !st || st.state === "unavailable" || st.state === "unknown";
// Versatile Thermostat's auto start/stop pause: the entity is `off` because the target is reached and restarts on its
// own. Newer releases say it in `specific_states.hvac_off_reason` / `auto_start_stop_manager`, older ones at the root.
export const autoStopped = (a) =>
  !!a &&
  ((a.specific_states?.hvac_off_reason ?? a.hvac_off_reason) === "hvac_off_auto_start_stop" ||
    a.auto_start_stop_manager?.is_auto_stop_detected === true ||
    a.is_auto_stop_detected === true);
export const numOf = (st) => (unavailable(st) ? null : Number.isFinite(Number.parseFloat(st.state)) ? Number.parseFloat(st.state) : null);
export const fmtNum = (locale, v, digits = 1) => (v == null || !Number.isFinite(v) ? "—" : v.toLocaleString(locale, { maximumFractionDigits: digits }));
export const humanize = (v) => {
  const s = String(v ?? "").replace(/_/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
};
