// ── Discovery ──────────────────────────────────────────────────────────────────────────────────────────────────
import { pilotMode } from "./presets-pilot-wire.js";

export const dc = (cls) => (st) => st?.attributes.device_class === cls;

// Entities a thermostat's device may have next to its climate entity (ported from ha-climate-air-card). Each role is
// looked up by its registry translation_key, then by the entity_id (English, French, German and Spanish slugs), then
// by its attributes, so that it works with Zigbee2MQTT, ZHA, Netatmo, tado° or Heatzy entities alike.
export const ROLES = {
  indoor_temp: {
    domain: "sensor",
    id: /(indoor_temperature|temperature_interieure|innentemperatur|temperatura_interior|local_temperature)$/,
    test: dc("temperature"),
  },
  outdoor_temp: { domain: "sensor", id: /(outdoor_temperature|temperature_exterieure|aussentemperatur|temperatura_exterior)(_\d+)?$/ },
  humidity: { domain: "sensor", test: dc("humidity") },
  power: { domain: "sensor", id: /(real_time_power|current_power|puissance_instantanee)/, test: dc("power") },
  valve: {
    domain: ["sensor", "number"],
    keys: ["valve_position", "pi_heating_demand", "heating_demand"],
    id: /(valve_(position|opening|state)|pi_heating_demand|heating_demand|position_vanne|ouverture_vanne|ventilstellung|ventilposition)$/,
  },
  window: {
    domain: "binary_sensor",
    keys: ["window_open", "window_detection"],
    id: /(window_open|window_detection|open_window|fenetre_ouverte|fenster_offen|ventana_abierta)$/,
    test: dc("window"),
  },
  battery: { domain: "sensor", test: dc("battery") },
  // A stove's device (Palazzetti, Fumis, Edilkamin, MCZ Maestro, Rika Firenet, Duepi EVO…): its phase as a text
  // sensor, its power level (a number to set), the pellets left, the flue gas temperature, its room fan, an alarm and
  // the ignitions counted. Only read for a zone whose device is drawn as a stove.
  stove_status: {
    domain: "sensor",
    keys: ["status", "stove_status", "burner_status", "operating_phase"],
    id: /(stove_status|burner_status|operating_(phase|state)|_phase|_status|_stato|_etat|_zustand|_estado)$/,
    test: (st) => !!st && !Number.isFinite(Number.parseFloat(st.state)) && !st.attributes.device_class,
  },
  stove_power: { domain: "number", keys: ["power_level", "heating_power", "combustion_power"], id: /(power_level|heating_power|combustion|flame_power|puissance|leistung|potencia|potenza|_power)$/ },
  pellets: { domain: "sensor", keys: ["pellet_level", "pellet_quantity"], id: /(pellet|granul|hopper|tremie|tank_level|vorrat)/ },
  pellets_low: { domain: "binary_sensor", id: /(pellet|granul|reserve|hopper)/ },
  flue_gas: { domain: "sensor", keys: ["flue_gas_temperature", "exhaust_temperature", "smoke_temperature"], id: /(flue|fume|smoke|exhaust|abgas|humos|fumi|rook|chimney)/ },
  stove_fan: { domain: ["number", "fan", "select"], id: /(fan|ventil|ventola|ventilador|soufflerie|geblaese)/ },
  stove_alarm: { domain: ["sensor", "binary_sensor"], keys: ["alarm", "error", "last_alarm"], id: /(alarm|error|fault|erreur|fehler|stoerung|allarme|averia)/ },
  ignitions: { domain: "sensor", id: /(ignition|allumage|zuendung|encendido|accensioni)/ },
  // A boiler's device (OpenTherm Gateway, ebusd, ViCare, myVAILLANT, EMS-ESP, ÖkoFEN…): its flow and return water
  // temperatures, the burner's modulation and flame, the water pressure and an oil tank's level. Read for a boiler only.
  flow_temp: {
    domain: "sensor",
    keys: ["flow_temperature", "supply_temperature", "boiler_water_temperature", "boiler_temperature", "ch_water_temperature"],
    id: /(flow|supply|vorlauf|depart|impulsion|mandata|aanvoer|boiler|ch_water)_?(water_)?temp/,
  },
  return_temp: { domain: "sensor", keys: ["return_temperature", "return_water_temperature"], id: /(return|r[uü]+cklauf|ruecklauf|retour|retorno|ritorno)_?(water_)?temp/ },
  modulation: { domain: "sensor", keys: ["relative_modulation_level", "modulation", "burner_modulation"], id: /(modulation|burner_(power|load|level))/ },
  pressure: { domain: "sensor", keys: ["water_pressure", "ch_water_pressure", "system_pressure"], id: /(pressure|pression|druck|presion|pressione)/, test: dc("pressure") },
  burner: { domain: "binary_sensor", keys: ["flame", "flame_on", "flame_status", "burner_active", "burner"], id: /(flame|burner|bruleur|brenner|quemador|bruciatore)/ },
  fuel: { domain: "sensor", keys: ["fuel_level", "tank_level", "oil_level"], id: /(fuel|fioul|heiz_?oel|heating_oil|oil_level|gasoil|gasoleo|gasolio|diesel|cuve|oil_tank)/ },
  // An underfloor heating thermostat's floor probe (Danfoss Icon, Heatmiser, Zigbee floor thermostats…).
  floor_temp: { domain: "sensor", keys: ["floor_temperature", "external_floor_temperature"], id: /(floor|plancher|sol|fussboden|boden|suelo|pavimento)_?temp/ },
};
// The roles read only for a stove (and a pellet boiler, which burns the same way), for a boiler, for a heated floor.
export const STOVE_ROLES = new Set(["stove_status", "stove_power", "pellets", "pellets_low", "flue_gas", "stove_fan", "stove_alarm", "ignitions"]);
export const BOILER_ROLES = new Set(["flow_temp", "return_temp", "modulation", "pressure", "burner", "fuel"]);
// The devices that burn pellets (phases, hopper) and the boilers (flow, burner, pressure, tank).
export const FIRES = new Set(["stove", "pellet_boiler"]);
export const BOILERS = new Set(["pellet_boiler", "gas_boiler", "oil_boiler"]);
// Whether a device role is looked for on a device drawn as `variant`: its own roles only on the devices that have them
// (a boiler's alarm is the stove's alarm role).
export const roleFor = (role, variant) => {
  if (STOVE_ROLES.has(role)) return FIRES.has(variant) || (role === "stove_alarm" && BOILERS.has(variant));
  if (BOILER_ROLES.has(role)) return BOILERS.has(variant);
  if (role === "floor_temp") return variant === "floor";
  return true;
};
// A boiler's water pressure under this (bar) is flagged, as is an oil tank at or under this level (%).
export const PRESSURE_LOW = 0.8;
export const FUEL_LOW = 15;

// A stove's phase from its status text (any language and integration): alarm, ignition, cooling down, standby or off,
// burning; null when the text says nothing known.
export const stovePhase = (text) => {
  const t = String(text ?? "").toLowerCase();
  if (!t || t === "unknown" || t === "unavailable") return null;
  if (/alarm|error|fault|erreur|fehler|allarme|block|failure/.test(t)) return "alarm";
  if (/cool|extinc|refroid|abk[uü]hl|spegn|apagando|shut|stopping|cleaning|nettoy/.test(t)) return "cooling";
  if (/ignit|allum|z[uü]nd|encend|accens|start|pre.?heat|heating.?up|warm.?up|load/.test(t)) return "ignition";
  if (/stand.?by|veille|wait|idle|bereit|attesa|espera|^off$|^aus$|apagad|spent|eteint|éteint|^0$/.test(t)) return t === "off" || t === "0" || /apagad|spent|eteint|éteint|^aus$/.test(t) ? "off" : "standby";
  if (/burn|flame|work|modul|combust|run|marche|brenn|funcion|lavoro|power|heat|^on$|normal|eco/.test(t)) return "burning";
  return null;
};
export const STOVE_STEPS = ["off", "ignition", "burning", "cooling"];
// The outdoor sensor never stands for the room: skip it when looking for the indoor one.
export const OUTDOOR = /(outdoor|exterieur|aussen|exterior)/;

// The device switches listed as options: icon and label (`sw_<key>`) from the entity ID, since integrations often
// name them in English only. The first match wins; others keep their own name.
export const SWITCHES = [
  [/child_?lock|lock|verrou|kindersicherung/, "lock", "child_lock"],
  [/window|fenetre|fenster/, "window", "window_detection"],
  [/frost|freeze|antigel|hors_?gel/, "frost", "frost"],
  [/eco/, "eco", "eco"],
  [/display|screen|ecran|led/, "monitor", "display"],
  [/tone|sound|buzzer|beep|bip/, "sound", "sound"],
  [/boost|turbo/, "boost", "boost"],
  [/light|lamp/, "light", "light"],
];
export const switchInfo = (id) => SWITCHES.find(([re]) => re.test(id.split(".")[1] || id));

// Memo for the lookups that scan the registry or all of `hass.states`, keyed on the `hass.entities` object (it only
// changes with the registry) and started over when the number of states changes (states still arriving at start-up)
// or the area or device registry changes (an area renamed, a device moved to another area).
export const MEMO = new WeakMap();
// The number of states, counted once per `hass.states` object (a new one comes with each state change): memo() runs
// for every role of every zone on each update, and counting thousands of states each time cost more than the lookup.
export const COUNTS = new WeakMap();
export const stateCount = (states) => {
  if (!states) return 0;
  let n = COUNTS.get(states);
  if (n === undefined) COUNTS.set(states, (n = Object.keys(states).length));
  return n;
};
export const memo = (hass, key, compute) => {
  const reg = hass?.entities;
  if (!reg) return compute();
  const count = stateCount(hass.states);
  let m = MEMO.get(reg);
  if (!m || m.count !== count || m.areas !== hass.areas || m.devices !== hass.devices) {
    MEMO.set(reg, (m = { count, areas: hass.areas, devices: hass.devices, map: new Map() }));
  }
  if (!m.map.has(key)) m.map.set(key, compute());
  return m.map.get(key);
};

export const byDevice = (hass) =>
  memo(hass, "devices", () => {
    const index = new Map();
    for (const e of Object.values(hass.entities || {})) {
      if (!e.device_id || e.hidden) continue;
      if (!index.has(e.device_id)) index.set(e.device_id, []);
      index.get(e.device_id).push(e);
    }
    return index;
  });

export const deviceOf = (hass, id) => hass?.entities?.[id]?.device_id;
export const deviceEntities = (hass, deviceId) => (deviceId ? (byDevice(hass).get(deviceId) || []).filter((e) => hass.states[e.entity_id]) : []);
export const areaIdOf = (hass, id) => {
  const e = hass?.entities?.[id];
  return e?.area_id || (e?.device_id && hass.devices?.[e.device_id]?.area_id) || null;
};
export const areaName = (hass, id) => hass?.areas?.[areaIdOf(hass, id)]?.name || "";

export const findRole = (hass, list, role) => {
  const m = ROLES[role];
  const domains = [].concat(m.domain);
  const inDomain = list.filter((e) => domains.includes(e.entity_id.split(".")[0]) && !(role === "indoor_temp" && OUTDOOR.test(e.entity_id)));
  let hit = m.keys && inDomain.find((e) => m.keys.includes(e.translation_key));
  if (!hit && m.id) hit = inDomain.find((e) => m.id.test(e.entity_id));
  if (!hit && m.test && role !== "indoor_temp") hit = inDomain.find((e) => m.test(hass.states[e.entity_id]));
  return hit?.entity_id;
};

export const roleOf = (hass, id, role) => memo(hass, `role:${id}:${role}`, () => findRole(hass, deviceEntities(hass, deviceOf(hass, id)), role));

// A heating thermostat: a climate entity that heats and cannot cool, dry or only blow (those are air conditioners,
// for ha-climate-air-card).
export const isThermostat = (st) => {
  const modes = st?.attributes?.hvac_modes || [];
  return modes.some((m) => m === "heat" || m === "auto" || m === "heat_cool") && !modes.some((m) => m === "cool" || m === "dry" || m === "fan_only");
};

// A pilot wire radiator: a select offering at least three pilot wire orders.
export const isPilotSelect = (st) => new Set((st?.attributes?.options || []).map(pilotMode).filter(Boolean)).size >= 3;

// The first temperature (indoor) or humidity sensor of an area, for a zone without thermostat.
export const areaSensor = (hass, area, cls) =>
  Object.keys(hass.states).find(
    (id) =>
      id.startsWith("sensor.") &&
      areaIdOf(hass, id) === area &&
      dc(cls)(hass.states[id]) &&
      !(cls === "temperature" && OUTDOOR.test(id)) &&
      !hass.entities?.[id]?.hidden &&
      !hass.entities?.[id]?.entity_category,
  );

export const deviceName = (hass, id) => {
  const dev = hass.devices?.[deviceOf(hass, id)];
  return String(dev?.name_by_user || dev?.name || "").trim();
};

// The name shown for an entity: its device's name, else its own.
export const nameOf = (hass, id) => deviceName(hass, id) || String(hass.states[id]?.attributes.friendly_name || id);

// Every zone found on the instance: one per area holding heating thermostats or pilot wire radiators (its first
// thermostat, all its pilot wire radiators, its temperature and humidity sensors when there is no thermostat, and its
// schedule helper), in the order of the area registry; a thermostat beyond the first of its area, and entities
// without an area, get a zone of their own. Hidden and configuration entities are left out.
export const discoverZones = (hass) =>
  memo(hass, "zones", () => {
    const shown = (id) => {
      const e = hass.entities?.[id];
      return !e?.hidden && !(e?.entity_category && !id.startsWith("select."));
    };
    const ids = Object.keys(hass.states).filter(shown);
    const thermostats = ids.filter((id) => id.startsWith("climate.") && isThermostat(hass.states[id]));
    // The selects of an air conditioner or a fan (a mode select whose options read like pilot wire orders) are theirs,
    // not a pilot wire radiator's: ha-climate-air-card's.
    const notHeating = new Set(
      Object.keys(hass.states)
        .filter((id) => id.startsWith("fan.") || (id.startsWith("climate.") && !isThermostat(hass.states[id])))
        .map((id) => deviceOf(hass, id))
        .filter(Boolean),
    );
    const pilots = ids.filter((id) => id.startsWith("select.") && isPilotSelect(hass.states[id]) && !notHeating.has(deviceOf(hass, id)));
    const areas = new Map(Object.keys(hass.areas || {}).map((a) => [a, { climates: [], pilots: [] }]));
    const loose = [];
    for (const [list, key] of [
      [thermostats, "climates"],
      [pilots, "pilots"],
    ]) {
      for (const id of list) {
        const a = areaIdOf(hass, id);
        if (a && areas.has(a)) areas.get(a)[key].push(id);
        else loose.push(key === "climates" ? { entity: id } : { pilot_wire: [id], name: nameOf(hass, id) });
      }
    }
    const inArea = (area, test) => ids.find((id) => areaIdOf(hass, id) === area && test(id));
    const zones = [];
    for (const [area, { climates, pilots: pw }] of areas) {
      if (!climates.length && !pw.length) continue;
      const name = hass.areas[area]?.name;
      const zone = { name, area, pilot_wire: pw };
      if (climates.length) zone.entity = climates[0];
      else {
        zone.temperature = areaSensor(hass, area, "temperature");
        zone.humidity = areaSensor(hass, area, "humidity");
      }
      zone.schedule = inArea(area, (id) => id.startsWith("schedule."));
      // A second thermostat of the area gets its own zone, named after its device (not the area again).
      zones.push(zone, ...climates.slice(1).map((entity) => ({ entity, area, name: nameOf(hass, entity) })));
    }
    return [...zones, ...loose];
  });

// The zones of a card: `zones`, else the top-level `entity` / `pilot_wire` (one zone), else every zone found.
// A zone given as a bare entity id is a thermostat, or a pilot wire radiator for a select or a switch.
export const ZONE_KEYS = ["entity", "name", "icon", "illustration", "pilot_wire", "temperature", "humidity", "schedule", "window", "entities", "switch_on", "switch_off"];
// A pilot wire radiator is an entity id, or `{ entity, power }` with the power sensor of its relay: the ids stay in
// `pilot_wire`, the sensors go to `pilot_power` (radiator → sensor).
export const normZone = (z) => {
  const zone = typeof z === "string" ? { entity: z } : { ...z };
  if (zone.entity && /^(select|switch)\./.test(zone.entity)) {
    zone.pilot_wire = [zone.entity, ...[].concat(zone.pilot_wire || [])];
    delete zone.entity;
  }
  const power = { ...(zone.pilot_power || {}) };
  zone.pilot_wire = [].concat(zone.pilot_wire || []).filter(Boolean).map((p) => {
    if (typeof p !== "object") return p;
    if (p.entity && p.power) power[p.entity] = p.power;
    return p.entity;
  }).filter(Boolean);
  zone.pilot_power = power;
  return zone;
};
export const zonesOf = (hass, config) => {
  if (Array.isArray(config.zones) && config.zones.length) return config.zones.filter(Boolean).map(normZone);
  if (config.entity || config.pilot_wire) return [normZone(Object.fromEntries(ZONE_KEYS.filter((k) => config[k] != null).map((k) => [k, config[k]])))];
  // Discovered zones go through normZone too: a thermostat without an area, or the second one of an area, has no
  // pilot_wire list of its own.
  return hass ? discoverZones(hass).map(normZone) : [];
};
