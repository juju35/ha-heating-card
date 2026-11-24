// ── Feature flags (homeassistant.components.climate) and timings ────────────────────────────────────────────────
export const CLIMATE_TARGET = 1;
export const CLIMATE_RANGE = 2;
export const CLIMATE_TARGET_HUMIDITY = 4;
export const CLIMATE_FAN_MODE = 8;
export const CLIMATE_PRESET = 16;
export const CLIMATE_SWING = 32;
export const CLIMATE_TURN_OFF = 128;
export const CLIMATE_SWING_HORIZONTAL = 512;
// A radiator valve's battery at or under this level (%) is flagged.
export const BATTERY_LOW = 15;
// Taps on − / + (and arrow keys on the target): the service is called once they stop for this long.
export const TEMP_DEBOUNCE = 900;
// Once sent, a target stays on screen until the entity reports it, or for this long at most (a device that rounds it).
export const TEMP_SETTLE = 10000;
