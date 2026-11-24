// ── Colors ───────────────────────────────────────────────────────────────────────────────────────────────────
// Home Assistant's own climate state colors, as in ha-climate-air-card.
export const IDLE = "var(--disabled-text-color, #9e9e9e)";
export const HEAT = "var(--state-climate-heat-color, #ff8100)";
export const MODE_COLORS = {
  heat: HEAT,
  auto: "var(--state-climate-auto-color, #008000)",
  heat_cool: "var(--state-climate-heat-cool-color, #008000)",
  // A heat pump set by hand in a zone: its other modes keep Home Assistant's colors.
  cool: "var(--state-climate-cool-color, #2b9af3)",
  dry: "var(--state-climate-dry-color, #efbd07)",
  fan_only: "var(--state-climate-fan_only-color, #8a8a8a)",
};
export const BOOST = "var(--error-color, #db4437)";
// Pilot wire orders: comfort in the heat color (lighter for -1 / -2), eco green, frost protection blue, off grey.
export const PILOT_COLORS = {
  comfort: HEAT,
  comfort_1: "color-mix(in srgb, var(--state-climate-heat-color, #ff8100) 80%, #ffd54f)",
  comfort_2: "color-mix(in srgb, var(--state-climate-heat-color, #ff8100) 60%, #ffd54f)",
  eco: "var(--success-color, #43a047)",
  frost: "var(--state-climate-cool-color, #2b9af3)",
  off: IDLE,
};
export const MODE_ICONS = { heat: "fire", auto: "auto", heat_cool: "heat_cool", off: "power", cool: "frost", dry: "humidity", fan_only: "tune" };
