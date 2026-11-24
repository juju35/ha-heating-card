// ── Visual editors (ha-form) ─────────────────────────────────────────────────────────────────────────────────────
// Every option of the card, and its zones as folded sections (one per zone, plus an empty one to add a zone).
import { lang, t } from "./core.js";
import { PILOT_ORDER } from "./presets-pilot-wire.js";
import { ZONE_KEYS, normZone, zonesOf } from "./discovery.js";
import { ILLUSTRATIONS } from "./illustrations.js";
import { DEFAULT_COLLAPSED } from "./cards.js";
import { OV_DEFAULT_ACTIONS, OV_DETAILS, OV_ORDERS, OV_SORTS } from "./overview-card.js";

export const LANGUAGES = [
  ["en", "English"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["sr", "Српски"], ["sr-Latn", "Srpski (latinica)"],
  ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português (Portugal)"], ["pl", "Polski"], ["ro", "Română"], ["da", "Dansk"],
  ["sv", "Svenska"], ["bg", "Български"], ["ru", "Русский"], ["uk", "Українська"], ["hu", "Magyar"], ["sk", "Slovenčina"],
  ["cs", "Čeština"], ["sl", "Slovenščina"], ["lv", "Latviešu"], ["el", "Ελληνικά"],
];

// The language option of the editors: automatic (Home Assistant's), or one of the card's languages.
export const languageField = (tr) => ({
  name: "language",
  selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("ed_language_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
});

// The sections folded at first (`collapsed`), on every card: the mini card and the overview unfold into the full card.
export const collapsedField = (tr) => ({
  name: "collapsed",
  selector: { select: { multiple: true, mode: "list", options: [["stove", "sec_stove"], ["boiler", "sec_boiler"], ["pilot_wire", "pilot_wire"], ["schedule", "schedule"]].map(([value, k]) => ({ value, label: tr(k) })) } },
});

// The illustrated header (`illustration: false` in YAML for the classic one) and its day / night colors: the full card,
// the mini card and the overview (and the full card they unfold into).
export const bannerFields = (tr) => ({
  type: "grid",
  name: "",
  schema: [
    { name: "banner", selector: { boolean: {} } },
    { name: "illustration_theme", selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((v) => ({ value: v, label: tr(`theme_${v}`) })) } } },
  ],
});
export const bannerData = (config) => ({ banner: config.illustration !== false, illustration_theme: config.illustration_theme || "auto" });
// Writes the form's banner fields into `out` as YAML options (defaults left out) and takes them out of `value`.
export const bannerChanged = (value, out) => {
  delete out.illustration;
  delete out.illustration_theme;
  if (value.banner === false) out.illustration = false;
  if (value.illustration_theme && value.illustration_theme !== "auto") out.illustration_theme = value.illustration_theme;
  delete value.banner;
  delete value.illustration_theme;
};

export class HeatingCardEditor extends HTMLElement {
  static get mini() {
    return false;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    const prev = this._hass && lang(this._hass, this._config);
    this._hass = hass;
    if (this._form && prev === lang(hass, this._config)) this._form.hass = hass;
    else this._render();
  }

  // The unfolded mini card is the full card: its editor offers the full card's options too, plus the detail button.
  _defaults() {
    const d = { show_title: true, show_subtitle: true, show_controls: true, show_presets: true, show_options: true, show_sensors: true, show_alerts: true, show_pilot_wire: true, show_schedule: true };
    if (this.constructor.mini) d.zoom = true;
    return d;
  }

  _zoneList() {
    if (Array.isArray(this._config.zones)) return this._config.zones.map(normZone);
    if (this._config.entity || this._config.pilot_wire) return zonesOf(null, this._config);
    return [];
  }

  _schema() {
    const tr = (k, v) => t(this._hass, this._config, k, v);
    const zones = this._zoneList();
    const zoneSchema = [
      { name: "name", selector: { text: {} } },
      { name: "entity", selector: { entity: { domain: "climate" } } },
      { name: "pilot_wire", selector: { entity: { multiple: true, domain: ["select", "switch"] } } },
      { type: "grid", name: "", schema: [
        { name: "temperature", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
        { name: "humidity", selector: { entity: { domain: "sensor", device_class: "humidity" } } },
      ] },
      { type: "grid", name: "", schema: [
        { name: "schedule", selector: { entity: { domain: "schedule" } } },
        { name: "window", selector: { entity: { domain: "binary_sensor" } } },
      ] },
      { name: "illustration", selector: { select: { mode: "dropdown", options: ["auto", ...ILLUSTRATIONS].map((v) => ({ value: v, label: tr(`ill_${v}`) })) } } },
      { type: "grid", name: "", schema: ["switch_on", "switch_off"].map((name) => ({ name, selector: { select: { mode: "dropdown", options: PILOT_ORDER.map((v) => ({ value: v, label: tr(`p_${v}`) })) } } })) },
    ];
    const toggles = Object.keys(this._defaults()).map((name) => ({ name, selector: { boolean: {} } }));
    return [
      { name: "title", selector: { text: {} } },
      ...[...zones, null].map((z, i) => ({
        type: "expandable",
        name: `zone_${i}`,
        title: z ? `${tr("ed_zone", { n: i + 1 })}${z.name ? ` · ${z.name}` : z.entity ? ` · ${z.entity}` : ""}` : tr("ed_add_zone"),
        icon: z ? "mdi:radiator" : "mdi:plus",
        schema: zoneSchema,
      })),
      { type: "grid", name: "", schema: toggles },
      bannerFields(tr),
      collapsedField(tr),
      languageField(tr),
    ];
  }

  _data() {
    const data = { ...this._defaults(), ...this._config };
    if (data.collapsed === undefined) data.collapsed = DEFAULT_COLLAPSED;
    const zones = this._zoneList();
    for (const k of ZONE_KEYS) delete data[k];
    Object.assign(data, bannerData(this._config));
    delete data.zones;
    [...zones, {}].forEach((z, i) => {
      const { pilot_power, ...rest } = z;
      data[`zone_${i}`] = { illustration: "auto", ...rest };
    });
    return data;
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => this._changed(ev));
      this.appendChild(this._form);
    }
    const tr = (k) => t(this._hass, this._config, k);
    this._form.hass = this._hass;
    this._form.computeLabel = (s) => tr(`ed_${s.name}`);
    this._form.computeHelper = (s) => {
      if (s.name === "zone_0" && !this._zoneList().length) return tr("ed_zones_auto");
      const key = `ed_${s.name}_helper`;
      const txt = tr(key);
      return txt === key ? undefined : txt;
    };
    this._form.schema = this._schema();
    this._form.data = this._data();
  }

  // The config from the form: zones rebuilt from their sections (an empty one dropped), defaults left out.
  _changed(ev) {
    ev.stopPropagation();
    const value = { ...ev.detail.value };
    const zones = [];
    const before = this._zoneList();
    for (const k of Object.keys(value).filter((k) => /^zone_\d+$/.test(k)).sort((a, b) => a.slice(5) - b.slice(5))) {
      const z = Object.fromEntries(Object.entries(value[k] || {}).filter(([kk, v]) => v !== "" && v != null && !(Array.isArray(v) && !v.length) && !(kk === "illustration" && v === "auto")));
      delete value[k];
      delete z.pilot_power;
      // The power sensors of the radiators (YAML only) stay with their radiator: `{ entity, power }`.
      const power = before[Number(k.slice(5))]?.pilot_power || {};
      if (z.pilot_wire) z.pilot_wire = z.pilot_wire.map((p) => (power[p] ? { entity: p, power: power[p] } : p));
      if (z.entity || z.pilot_wire?.length || z.temperature) zones.push(z);
    }
    const out = { ...this._config };
    for (const k of [...ZONE_KEYS, "zones"]) delete out[k];
    bannerChanged(value, out);
    const defaults = this._defaults();
    for (const [k, v] of Object.entries(value)) {
      if (v === "" || v == null || v === defaults[k] || (k === "collapsed" && JSON.stringify(v) === JSON.stringify(DEFAULT_COLLAPSED))) delete out[k];
      else out[k] = v;
    }
    if (zones.length) out.zones = zones;
    const relang = lang(this._hass, this._config) !== lang(this._hass, out);
    const recount = zones.length !== this._zoneList().length;
    this._config = out;
    if (relang || recount) this._render();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }
}

export class HeatingMiniCardEditor extends HeatingCardEditor {
  static get mini() {
    return true;
  }
}

// The overview's editor: which zones (areas, floors, entities to add or leave out), how they are grouped and sorted,
// what a tap on a zone does, the parts shown and the quick actions offered.
export class HeatingOverviewCardEditor extends HeatingCardEditor {
  _defaults() {
    return {
      show_title: true,
      show_subtitle: true,
      show_summary: true,
      show_actions: true,
      show_alerts: true,
      show_pilot_wire: true,
      show_schedule: true,
      // The full card a zone unfolds into.
      show_controls: true,
      show_presets: true,
      show_options: true,
      show_sensors: true,
      compact: false,
      zoom: true,
      group_by: "floor",
      sort: "area",
      detail: "card",
      actions: OV_DEFAULT_ACTIONS,
    };
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    const select = (name, values, label) => ({ name, selector: { select: { mode: "dropdown", options: values.map((value) => ({ value, label: tr(label(value)) })) } } });
    const grid = (...schema) => ({ type: "grid", name: "", schema });
    const toggles = Object.entries(this._defaults())
      .filter(([, v]) => typeof v === "boolean")
      .map(([name]) => ({ name, selector: { boolean: {} } }));
    return [
      { name: "title", selector: { text: {} } },
      grid({ name: "areas", selector: { area: { multiple: true } } }, { name: "exclude_areas", selector: { area: { multiple: true } } }),
      grid({ name: "floors", selector: { floor: { multiple: true } } }, { name: "exclude_floors", selector: { floor: { multiple: true } } }),
      grid({ name: "include", selector: { entity: { multiple: true, domain: ["climate", "select", "switch"] } } }, { name: "exclude", selector: { entity: { multiple: true } } }),
      grid(
        select("group_by", ["floor", "none"], (v) => `ed_group_${v}`),
        select("sort", OV_SORTS, (v) => `ed_sort_${v}`),
      ),
      grid(
        select("detail", OV_DETAILS, (v) => `ed_detail_${v.replace("-", "_")}`),
        { name: "columns", selector: { number: { min: 1, max: 6, mode: "box" } } },
      ),
      grid(...toggles),
      bannerFields(tr),
      { name: "actions", selector: { select: { multiple: true, mode: "list", options: OV_ORDERS.map((value) => ({ value, label: tr(`p_${value}`) })) } } },
      collapsedField(tr),
      languageField(tr),
    ];
  }

  _data() {
    const { illustration, ...config } = this._config;
    return { ...this._defaults(), collapsed: DEFAULT_COLLAPSED, ...config, ...bannerData(this._config) };
  }

  _render() {
    super._render();
    if (!this._form) return;
    const tr = (k) => t(this._hass, this._config, k);
    this._form.computeHelper = (s) => {
      const key = s.name === "zoom" ? "ed_ov_zoom_helper" : `ed_${s.name}_helper`;
      const txt = tr(key);
      return txt === key ? undefined : txt;
    };
  }

  // The config from the form: options left at their default, and emptied ones, are left out (an empty list of quick
  // actions is kept: no quick action; an empty list of folded sections too: nothing folded).
  _changed(ev) {
    ev.stopPropagation();
    const defaults = this._defaults();
    const out = { ...this._config };
    const value = { ...ev.detail.value };
    // An option the form no longer sends (a list emptied) is left out too.
    const names = this._schema().flatMap((s) => (s.schema ? s.schema : [s]).map((x) => x.name));
    for (const k of names) if (!(k in value)) delete out[k];
    bannerChanged(value, out);
    for (const [k, v] of Object.entries(value)) {
      const empty = v === "" || v == null || (Array.isArray(v) && !v.length && k !== "actions" && k !== "collapsed");
      if (empty || JSON.stringify(v) === JSON.stringify(k === "collapsed" ? DEFAULT_COLLAPSED : defaults[k])) delete out[k];
      else out[k] = v;
    }
    const relang = lang(this._hass, this._config) !== lang(this._hass, out);
    this._config = out;
    if (relang) this._render();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }
}
