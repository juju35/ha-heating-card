// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { boost, pilotComfort, pilotEco, valveHeating } from "./mock-states.mjs";

const twins = (file, rest) => [
  { file, theme: "light", ...rest },
  { file: `${file}-dark`, theme: "dark", ...rest },
];
// A tab of the full card, as a click on it.
const zone = (i) => [`[data-action="zone"][data-zone="${i}"]`];
const BATHROOM = { pilot_wire: "select.salle_de_bain_seche_serviettes", name: "Bathroom", temperature: "sensor.salle_de_bain_temperature", humidity: "sensor.salle_de_bain_humidite" };

export const shots = [
  // Every zone found on its own: the living room's wall thermostat heating, its presets, pilot wire radiator and schedule (folded).
  ...twins("card", { type: "heating-card", width: 460, config: {} }),
  // The weekly schedule unfolded.
  ...twins("card-schedule", { type: "heating-card", width: 460, config: { collapsed: ["pilot_wire"] } }),
  // The bedroom's radiator valve: idle, window open, battery and valve chips.
  ...twins("card-valve", { type: "heating-card", width: 460, config: {}, clicks: zone(1) }),
  // The bathroom's towel radiator on pilot wire, with the room's temperature and humidity.
  ...twins("card-pilot-wire", { type: "heating-card", width: 460, config: {}, clicks: zone(3) }),
  // The overview of the zones, and one zone as a mini card.
  ...twins("mini-card", { type: "heating-mini-card", width: 380, config: {} }),
  ...twins("mini-card-thermostat", { type: "heating-mini-card", width: 380, config: { entity: "climate.salon_thermostat" } }),
  ...twins("mini-card-zoom", { type: "heating-mini-card", width: 460, config: { collapsed: ["pilot_wire", "schedule"] }, clicks: ['[data-action="zone"][data-zone="1"]'] }),
  // Narrow cards: the full card at 6 columns of a 320 px Sections view, the mini card at 6 columns of a phone's.
  ...twins("card-narrow", { type: "heating-card", width: 238, config: { collapsed: ["pilot_wire", "schedule"] } }),
  ...twins("mini-card-narrow", { type: "heating-mini-card", width: 170, config: {} }),
];

// One looping GIF per distinct animated state (each plays different keyframes):
//   heating-dial      — wall thermostat heating: flame flickers, warm air rises, halo, blinking LED
//   heating-radiator  — the same thermostat drawn as a column radiator: columns glow from the bottom up, heat rises
//   heating-valve     — radiator valve open (45 %): its radiator glows, heat rises
//   boost             — Boost preset: the flame and the heat go twice as fast, in red
//   pilot-comfort     — pilot wire radiator on comfort: glowing and giving off heat
//   pilot-eco         — pilot wire radiator on eco: a slow breathing glow
//   overview          — the zones overview: the flame of each heating zone flickers, the header radiator's heat rises
export const gifs = [
  ...twins("heating-dial", { type: "heating-mini-card", width: 380, config: { entity: "climate.salon_thermostat" } }),
  ...twins("heating-radiator", { type: "heating-mini-card", width: 380, config: { entity: "climate.salon_thermostat", illustration: "radiator" } }),
  ...twins("heating-valve", { type: "heating-mini-card", width: 380, config: { entity: "climate.chambre_vanne" }, overrides: valveHeating }),
  ...twins("boost", { type: "heating-mini-card", width: 380, config: { entity: "climate.salon_thermostat" }, overrides: boost }),
  ...twins("pilot-comfort", { type: "heating-mini-card", width: 380, config: BATHROOM, overrides: pilotComfort }),
  ...twins("pilot-eco", { type: "heating-mini-card", width: 380, config: BATHROOM, overrides: pilotEco }),
  ...twins("overview", { type: "heating-mini-card", width: 380, config: {}, overrides: valveHeating }),
];
