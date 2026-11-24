// ── Presets and pilot wire orders ──────────────────────────────────────────────────────────────────────────────
// A pilot wire order from an option or a preset name, whatever the integration spells it (Nodon and Legrand
// through Zigbee2MQTT or ZHA: comfort, comfort_-1, eco, frost_protection, off; Heatzy: comfort-1, away; French
// names: confort, hors_gel, arrêt), or null.
import { ICONS } from "./icons.js";

export const pilotMode = (value) => {
  const s = String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
  if (/^(comfort|confort|komfort)$/.test(s)) return "comfort";
  const minus = s.match(/^(?:comfort|confort|komfort)(?:minus|moins|m)?([12])$/);
  if (minus) return `comfort_${minus[1]}`;
  if (/^(eco|economy|economie|reduced|reduit)$/.test(s)) return "eco";
  if (/^(frost|frostprotection|horsgel|antifreeze|antigel|nofrost|hg)$/.test(s)) return "frost";
  if (/^(off|arret|stop|standby)$/.test(s)) return "off";
  return null;
};
export const PILOT_ORDER = ["comfort", "comfort_1", "comfort_2", "eco", "frost", "off"];
export const COMFORT_TAGS = { comfort_1: "−1", comfort_2: "−2" };
export const PILOT_ICONS = { comfort: "comfort", comfort_1: "comfort", comfort_2: "comfort", eco: "eco", frost: "frost", off: "power" };

// A climate preset as one of the card's keys (p_<key>), or null for a preset of its own.
export const presetKey = (p) => {
  const s = String(p ?? "").toLowerCase();
  if (s === "none") return "none";
  const pilot = pilotMode(s);
  if (pilot) return pilot;
  if (/away|absent|vacation|holiday|vacances/.test(s)) return "away";
  if (/boost|turbo/.test(s)) return "boost";
  if (/sleep|night|nuit/.test(s)) return "sleep";
  if (/home|maison/.test(s)) return "home";
  if (/activity|activit/.test(s)) return "activity";
  if (/schedule|program|planning/.test(s)) return "schedule";
  if (/manual|manuel/.test(s)) return "manual";
  return null;
};
// Icon of a climate preset (Home Assistant's own ones, the frost protection and schedule of radiator valves).
export const presetIcon = (p) => {
  const k = presetKey(p);
  if (k === "comfort_1" || k === "comfort_2") return "comfort";
  if (k === "off") return "power";
  if (k === "schedule") return "calendar";
  return k && ICONS[k] ? k : "tune";
};
