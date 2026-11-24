// ── Illustrated header ─────────────────────────────────────────────────────────────────────────────────────────
// A 90 px banner: the title on the sky at the left, a temperature scene at the right (thermometer, current → target
// temperature, the zone's own device drawn big by `art`) and a 10 px ground strip edge to edge, in the zone's theme:
// heating (orange, heat rising and a halo while it heats), eco (green, a leaf), frost protection (blue, snowflakes)
// or off (grey). Night colors with Home Assistant's dark theme, forced by `illustration_theme`.
import { esc } from "./core.js";
import { presetKey } from "./presets-pilot-wire.js";

// Brand logos, by integration (the entity's platform), embedded by the build from images/badges/<platform>.png.
export const BRAND_LOGOS = {} /* __BRAND_LOGOS__ */;

// The theme's accent, then its tint of the sky behind the scene, by day and by night.
export const BANNER_TINTS = {
  heat: ["#e8590c", "#ffe6d2", "#3a2a26"],
  eco: ["#2e9d5a", "#e4f4e9", "#1f3328"],
  frost: ["#2f80ed", "#dcecfb", "#1d2a3d"],
  off: ["#8a94a0", "#eceff3", "#262c35"],
};
// The thermometer's level when no room temperature is known.
export const BANNER_LEVELS = { heat: 0.62, eco: 0.5, frost: 0.15, off: 0.08 };
// Each device cropped from the art's 80 × 94 box, and its largest size in the 200 × 80 scene (floor at y 80).
export const BANNER_DEVICES = {
  dial: { vb: [11, 23, 58, 58], w: 54, h: 54 },
  radiator: { vb: [4, 26, 75, 63], w: 62, h: 62 },
  valve: { vb: [0, 2, 78, 84], w: 76, h: 76 },
  stove: { vb: [8, 0, 64, 92], w: 56, h: 78 },
  floor: { vb: [0, 28, 84, 60], w: 84, h: 62 },
  towel: { vb: [8, 2, 64, 90], w: 46, h: 64 },
  pellet_boiler: { vb: [2, 0, 78, 92], w: 60, h: 70 },
  gas_boiler: { vb: [10, 0, 60, 90], w: 48, h: 70 },
  oil_boiler: { vb: [0, 0, 80, 92], w: 62, h: 72 },
};

// The banner's theme from a zone's model: off, frost protection (its preset, order or a target of 10° or less), eco
// (eco, away and sleep presets, eco order) or heating.
export const bannerTheme = (m) => {
  if (!m.online || !m.on) return "off";
  if (m.pilot) return m.pilot === "eco" ? "eco" : m.pilot === "frost" ? "frost" : "heat";
  const k = presetKey(m.preset);
  if (k === "frost" || (m.target != null && m.target <= 10)) return "frost";
  if (k === "eco" || k === "away" || k === "sleep") return "eco";
  return "heat";
};

export const flake = (x, y, i) =>
  `<g transform="translate(${x.toFixed(1)} ${y})"><g class="bflake f${i}"><path d="M0-3.2V3.2M-2.8-1.6L2.8 1.6M-2.8 1.6L2.8-1.6"/></g></g>`;

// The scene (200 × 80, drawn 1:1). `dev` is the device's markup from `art` or "", `devW` / `devH` its size,
// `right` the x of its right edge; `cur` / `tgt` the readout's texts. Returns the markup and where the thermometer
// and the device start, for the title's room.
export const bannerScene = ({ theme, night, uid, dev, devW, devH, right, cur, tgt, level, active, flat }) => {
  const [c, day, dark] = BANNER_TINTS[theme];
  const devX = right - devW;
  const textW = Math.max(cur.length * 7.6, tgt.length * 3.8);
  const readX = textW ? devX - 6 - textW : devX;
  const tx = readX - (textW ? 11 : 12);
  const lvl = Math.max(0.06, Math.min(1, level));
  const top = 80 - devH;
  let fx = "";
  if (theme === "heat" && active)
    // A heated floor glows along the floor, not as a ball around the room.
    fx = flat
      ? `<ellipse class="bhalo" cx="${(devX + devW / 2).toFixed(1)}" cy="72" rx="${(devW * 0.56).toFixed(1)}" ry="9" fill="#ff9a52"/>`
      : `<ellipse class="bhalo" cx="${(devX + devW / 2).toFixed(1)}" cy="${(80 - devH / 2).toFixed(1)}" rx="${(devW * 0.62).toFixed(1)}" ry="${(devH * 0.52).toFixed(1)}" fill="#ff9a52"/>`;
  else if (theme === "eco") {
    const [lx, ly] = top >= 22 ? [devX + devW / 2, top - 9] : [devX - 6, 12];
    fx = `<g transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})"><path class="bleaf" d="M0 8q-10-5-5-16q11 0 10 12q-1 4-5 4z"/></g>`;
  } else if (theme === "frost") fx = `<g class="bflakes">${flake(devX - 7, 10, 0) + flake(devX - 17, 25, 1) + flake(tx + 15, 8, 2)}</g>`;
  const readout = textW
    ? `<text class="bcur" x="${readX.toFixed(1)}" y="44">${esc(cur)}</text>${tgt ? `<text class="btgt" x="${readX.toFixed(1)}" y="56">${esc(tgt)}</text>` : ""}`
    : "";
  const svg =
    `<svg class="bscene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false" style="--bc:${c}">` +
    `<defs><linearGradient id="hcb-g-${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${night ? dark : day}" stop-opacity="0"/>` +
    `<stop offset=".45" stop-color="${night ? dark : day}"/><stop offset="1" stop-color="${night ? dark : day}"/></linearGradient></defs>` +
    `<rect width="200" height="80" fill="url(#hcb-g-${uid})"/>${fx}` +
    `<g class="bthermo"><g transform="translate(${tx.toFixed(1)} 14)"><rect class="btube" x="-4.5" y="0" width="9" height="48" rx="4.5"/>` +
    `<rect class="bmerc${theme === "heat" && active ? " rise" : ""}" x="-2.2" y="${(3 + 42 * (1 - lvl)).toFixed(1)}" width="4.4" height="${(42 * lvl).toFixed(1)}" rx="2.2"/>` +
    `<circle class="bbulb" cy="52" r="6.4"/></g>${readout}</g>${dev}</svg>`;
  return { svg, tx, devX };
};
