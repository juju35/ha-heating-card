// Mock Home Assistant registries and states of a neutral home, used by the screenshots and the tests: a wall
// thermostat and a pilot wire radiator (Nodon-style select through Zigbee2MQTT) with its weekly schedule in the living
// room, a radiator valve with an open window in the bedroom, a thermostat turned off in the office and a towel
// radiator on pilot wire (French option names, as some integrations spell them) in the bathroom. Entity ids are in
// French on purpose (the cards never rely on them); the names shown are in English.
export const states = {};
export const entities = {};
export const devices = {};
export const areas = {};
export const floors = {};

// Screenshots are taken at this moment (UTC), so that the schedule's "now" line and next event never move.
export const NOW = "2026-11-11T10:30:00Z";

const floor = (floor_id, name, level) => (floors[floor_id] = { floor_id, name, level, icon: null, aliases: [] });
const area = (area_id, name, floor_id = null) => (areas[area_id] = { area_id, name, icon: null, floor_id });
const device = (id, name, model, area_id) => (devices[id] = { id, name, model, area_id, name_by_user: null });
const entity = (entity_id, device_id, state, attributes = {}, extra = {}) => {
  entities[entity_id] = { entity_id, device_id, platform: extra.platform || "mqtt", translation_key: extra.translation_key || null, area_id: extra.area_id || null };
  states[entity_id] = { entity_id, state: String(state), attributes, last_changed: NOW, last_updated: NOW };
};

// Two floors: the living room and the office downstairs, the bedroom and the bathroom upstairs.
floor("ground_floor", "Ground floor", 0);
floor("first_floor", "First floor", 1);
area("living_room", "Living room", "ground_floor");
area("bedroom", "Bedroom", "first_floor");
area("office", "Office", "ground_floor");
area("bathroom", "Bathroom", "first_floor");

const PRESETS = ["none", "eco", "comfort", "away", "boost"];

// Living room: wall thermostat heating, its battery and child lock; a pilot wire radiator; a schedule.
device("thermo_salon", "Living room thermostat", "Smart thermostat", "living_room");
entity("climate.salon_thermostat", "thermo_salon", "heat", {
  friendly_name: "Living room thermostat",
  hvac_modes: ["off", "heat", "auto"],
  hvac_action: "heating",
  current_temperature: 19.5,
  current_humidity: 46,
  temperature: 21,
  min_temp: 7,
  max_temp: 30,
  target_temp_step: 0.5,
  preset_modes: PRESETS,
  preset_mode: "comfort",
  supported_features: 401,
});
entity("sensor.salon_thermostat_batterie", "thermo_salon", "82", { device_class: "battery", unit_of_measurement: "%", friendly_name: "Living room thermostat Battery" });
entity("switch.salon_thermostat_child_lock", "thermo_salon", "off", { friendly_name: "Living room thermostat Child lock" });
device("fp_salon", "Living room radiator", "SIN-4-FP-21", "living_room");
entity("select.salon_radiateur_fil_pilote", "fp_salon", "comfort", {
  friendly_name: "Living room radiator Pilot wire mode",
  options: ["comfort", "eco", "frost_protection", "off", "comfort_-1", "comfort_-2"],
}, { translation_key: "pilot_wire_mode" });
entity("schedule.salon_chauffage", null, "on", { friendly_name: "Living room heating", next_event: "2026-11-11T22:00:00Z", editable: true }, { platform: "schedule", area_id: "living_room" });

// Bedroom: radiator valve idle, valve closed, window open, battery.
device("vanne_chambre", "Bedroom radiator valve", "Zigbee radiator valve", "bedroom");
entity("climate.chambre_vanne", "vanne_chambre", "heat", {
  friendly_name: "Bedroom radiator valve",
  hvac_modes: ["off", "heat"],
  hvac_action: "idle",
  current_temperature: 18.4,
  temperature: 18,
  min_temp: 5,
  max_temp: 30,
  target_temp_step: 0.5,
  preset_modes: PRESETS,
  preset_mode: "eco",
  supported_features: 401,
});
entity("sensor.chambre_vanne_position", "vanne_chambre", "0", { unit_of_measurement: "%", friendly_name: "Bedroom radiator valve Valve position" }, { translation_key: "valve_position" });
entity("binary_sensor.chambre_vanne_fenetre_ouverte", "vanne_chambre", "on", { device_class: "window", friendly_name: "Bedroom radiator valve Window open" }, { translation_key: "window_open" });
entity("sensor.chambre_vanne_batterie", "vanne_chambre", "64", { device_class: "battery", unit_of_measurement: "%", friendly_name: "Bedroom radiator valve Battery" });

// Office: a thermostat turned off.
device("thermo_bureau", "Office thermostat", "Smart thermostat", "office");
entity("climate.bureau_thermostat", "thermo_bureau", "off", {
  friendly_name: "Office thermostat",
  hvac_modes: ["off", "heat"],
  hvac_action: "off",
  current_temperature: 17.2,
  temperature: 19,
  min_temp: 7,
  max_temp: 30,
  target_temp_step: 0.5,
  supported_features: 385,
});

// Bathroom: a towel radiator on pilot wire, a temperature and humidity sensor.
device("fp_sdb", "Towel radiator", "Pilot wire module", "bathroom");
entity("select.salle_de_bain_seche_serviettes", "fp_sdb", "Eco", { friendly_name: "Towel radiator Mode", options: ["Confort", "Eco", "Hors-gel", "Arrêt"] });
device("capteur_sdb", "Bathroom sensor", "Temperature and humidity sensor", "bathroom");
entity("sensor.salle_de_bain_temperature", "capteur_sdb", "21.6", { device_class: "temperature", unit_of_measurement: "°C", friendly_name: "Bathroom sensor Temperature" });
entity("sensor.salle_de_bain_humidite", "capteur_sdb", "63", { device_class: "humidity", unit_of_measurement: "%", friendly_name: "Bathroom sensor Humidity" });

// The week of the living room schedule, as schedule.get_schedule returns it.
const slot = (from, to) => ({ from: `${from}:00`, to: `${to}:00`, data: {} });
export const weeks = {
  "schedule.salon_chauffage": {
    monday: [slot("06:30", "08:30"), slot("17:30", "22:00")],
    tuesday: [slot("06:30", "08:30"), slot("17:30", "22:00")],
    wednesday: [slot("06:30", "08:30"), slot("10:00", "22:00")],
    thursday: [slot("06:30", "08:30"), slot("17:30", "22:00")],
    friday: [slot("06:30", "08:30"), slot("17:30", "23:00")],
    saturday: [slot("08:00", "23:00")],
    sunday: [slot("08:00", "22:00")],
  },
};

// Patches of the mock states for the animated states.
export const boost = { "climate.salon_thermostat": { preset_mode: "boost", temperature: 23 } };
export const valveHeating = { "climate.chambre_vanne": { hvac_action: "heating", temperature: 20, preset_mode: "comfort" }, "sensor.chambre_vanne_position": { state: "45" } };
export const pilotComfort = { "select.salle_de_bain_seche_serviettes": { state: "Confort" } };
export const pilotEco = { "select.salle_de_bain_seche_serviettes": { state: "Eco" } };

// A mock hass for these states, with `overrides` ({ entity_id: { state?, ...attributes } }) applied.
export const mockHass = (overrides = {}, extra = {}) => {
  const st = { ...states };
  for (const [id, o] of Object.entries(overrides)) {
    const { state, ...attrs } = o;
    st[id] = { ...st[id], ...(state != null ? { state } : {}), attributes: { ...st[id].attributes, ...attrs } };
  }
  return {
    states: st,
    entities,
    devices,
    areas,
    floors,
    language: "en",
    locale: { language: "en" },
    config: { unit_system: { temperature: "°C" } },
    themes: { darkMode: false },
    callService: () => Promise.resolve(),
    callWS: async (msg) => {
      if (msg.type === "call_service" && msg.service === "get_schedule") {
        const id = msg.target.entity_id;
        return { response: { [id]: weeks[id] } };
      }
      throw new Error(`unsupported ${msg.type}`);
    },
    ...extra,
  };
};
