// ── Cards ──────────────────────────────────────────────────────────────────────────────────────────────────────
import { esc, fmtNum, humanize, intlLocale, lang, numOf, t, unavailable } from "./core.js";
import { svgIcon } from "./icons.js";
import { BOOST, HEAT, IDLE, MODE_COLORS, MODE_ICONS, PILOT_COLORS } from "./colors.js";
import { COMFORT_TAGS, PILOT_ICONS, PILOT_ORDER, pilotMode, presetIcon, presetKey } from "./presets-pilot-wire.js";
import { BATTERY_LOW, CLIMATE_FAN_MODE, CLIMATE_PRESET, CLIMATE_RANGE, CLIMATE_SWING, CLIMATE_SWING_HORIZONTAL, CLIMATE_TARGET, CLIMATE_TARGET_HUMIDITY, CLIMATE_TURN_OFF, TEMP_DEBOUNCE, TEMP_SETTLE } from "./feature-flags-timings.js";
import { BOILERS, FIRES, FUEL_LOW, PRESSURE_LOW, ROLES, STOVE_STEPS, areaName, deviceEntities, deviceName, deviceOf, nameOf, roleFor, roleOf, stateCount, stovePhase, switchInfo, zonesOf } from "./discovery.js";
import { SCHEDULES, fetchWeek } from "./schedules.js";
import { art, variantOf } from "./illustrations.js";
import { BANNER_DEVICES, BANNER_LEVELS, BRAND_LOGOS, bannerScene, bannerTheme } from "./illustrated-header.js";
import { BANNER_STYLE, BASE_STYLE, FULL_STYLE, MINI_STYLE, textWidth } from "./styles.js";
import { listOf } from "./overview-card.js";
import { STRINGS } from "./i18n/strings.js";

export const DEFAULT_COLLAPSED = ["schedule"];
export const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
export const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app) a
// tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to the
// page. It counts when the press and the release are both outside the card (a slider dragged out of the card does not
// fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through the click
// event. `tap(ev)` (a press and a release at the same spot) is for the tests.
export const watchOutside = (isOut, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOut(ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOut(ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOut(ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};
// A state update patches the card in place instead of rewriting its shadow root. A rewrite replaced <ha-card> and
// every <ha-icon>, whose own shadow DOM Home Assistant renders a microtask later: the status pill's measurement
// forced a layout in between, with the card collapsed to its border, which shortened the page and moved its scroll
// position (the dashboard jumped on every sensor change); it also restarted the illustration's animations.
// `morph(root, html)` turns `root`'s children into `html`, keeping every node that is still there (same tag at the
// same place, or the same `data-key` among its siblings) and updating its attributes and text.
export const patchAttrs = (cur, next) => {
  // A custom element may style its own host (an inline style the markup never gives): that one stays.
  const own = cur.localName.includes("-") ? "style" : "";
  for (const { name } of [...cur.attributes]) if (!next.hasAttribute(name) && name !== own) cur.removeAttribute(name);
  for (const { name, value } of next.attributes) if (cur.getAttribute(name) !== value) cur.setAttribute(name, value);
};
export const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute("data-key") : null);
// Nodes the card does not render itself stay where they are, untouched: card-mod's <card-mod> element (its styles),
// inserted into the shadow root after the card has drawn (#107). Neither matched to the card's markup nor trimmed.
export const FOREIGN_TAGS = new Set(["card-mod"]);
export const foreignNode = (n) => n.nodeType === 1 && FOREIGN_TAGS.has(n.localName);
export const patchChildren = (cur, next) => {
  const all = [...cur.childNodes];
  const old = all.filter((n) => !foreignNode(n));
  // With a foreign node among them, positions count the card's own nodes only, and a node added at the end goes
  // before the foreign ones, which keep the last place (card-mod's styles after the card's own).
  const at =
    old.length === all.length
      ? (i) => cur.childNodes[i] ?? null
      : (i) => {
          const own = [...cur.childNodes].filter((n) => !foreignNode(n));
          return own[i] ?? (own.length ? own[own.length - 1].nextSibling : cur.firstChild);
        };
  const fresh = [...next.childNodes];
  const byKey = new Map();
  for (const o of old) {
    const k = keyOf(o);
    if (k !== null && !byKey.has(k)) byKey.set(k, o);
  }
  const used = new Set();
  fresh.forEach((n, i) => {
    const k = keyOf(n);
    let o = k !== null ? byKey.get(k) : old[i];
    if (!o || o.nodeType !== n.nodeType || o.nodeName !== n.nodeName || used.has(o) || (k === null && keyOf(o) !== null)) o = null;
    const ref = at(i);
    if (!o) {
      cur.insertBefore(n, ref);
      return;
    }
    used.add(o);
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType !== 1) {
      if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
      return;
    }
    patchAttrs(o, n);
    // A custom element given no children (<ha-icon>) keeps those it draws itself.
    if (n.firstChild || !o.localName.includes("-")) patchChildren(o, n);
    // A dropdown the user changed no longer follows its options' attributes: selected as a fresh one would be.
    if (o.localName === "select") {
      const at = [...o.options].findIndex((x) => x.hasAttribute("selected"));
      o.selectedIndex = at < 0 ? 0 : at;
    }
  });
  let kept = 0;
  for (const n of [...cur.childNodes]) if (!foreignNode(n) && ++kept > fresh.length) cur.removeChild(n);
};
export const morph = (root, html) => {
  // No DOM to patch (the unit tests' stand-ins): written at once.
  if (!root.childNodes) {
    root.innerHTML = html;
    return;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  patchChildren(root, tpl.content);
};
// What identifies the focused control across a render (its tag and data attributes).
export const focusKey = (el) => {
  const data = [...(el?.attributes || [])].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value]);
  return data.length ? { tag: el.localName, data } : null;
};
export let UID = 0;

export class HeatingCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("heating-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._uid = ++UID;
    this._zone = 0;
    // No rewrite of the card between a press and its click: Home Assistant updates the card several times a second,
    // and a rewrite under the pointer replaces the element pressed, so that the click lands on the card itself and
    // does nothing. The update held back is drawn once released: by the click (registered before the card's own
    // handler, which renders at once), else right after the release.
    this._onPress = () => {
      this._byPointer = true;
      this._pressing = true;
      window.addEventListener("pointerup", this._onPressEnd, true);
      window.addEventListener("pointercancel", this._onPressEnd, true);
    };
    this._onPressEnd = () => {
      window.removeEventListener("pointerup", this._onPressEnd, true);
      window.removeEventListener("pointercancel", this._onPressEnd, true);
      setTimeout(() => {
        this._pressing = false;
        if (this._dirty) this._update();
      }, 0);
    };
    this._onPressClick = (ev) => {
      if (ev.detail === 0) this._byPointer = false;
      this._pressing = false;
    };
    this.shadowRoot.addEventListener("pointerdown", this._onPress);
    this.shadowRoot.addEventListener("click", this._onPressClick);
    // From the keyboard, the focus is kept across rewrites (with the pointer it would draw the focus ring).
    this.shadowRoot.addEventListener("keydown", () => {
      this._byPointer = false;
    });
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this.shadowRoot.addEventListener("change", (ev) => this._onChange(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => this._onKey(ev));
    // A dropdown closed with Escape fires no `change`: the updates held back while it had the focus are drawn when
    // the focus leaves it (deferred, so the focus has settled).
    this.shadowRoot.addEventListener("focusout", (ev) => {
      if (ev.target?.tagName === "SELECT") setTimeout(() => this._update(), 0);
    });
    // A tap elsewhere on the page folds the sections back to their defaults (as in ha-carburants-france).
    this._outside = watchOutside(
      (ev) => isOutside(this, ev),
      () => {
        if (!this._toggled?.size) return;
        this._toggled = new Map();
        this._refresh();
      },
    );
  }

  connectedCallback() {
    this._outside.on();
    // Back on the page after leaving it: rendered again in its default state.
    if (this._hass && this._config) this._refresh();
    if (!this._fitObserver && typeof ResizeObserver === "function") this._fitObserver = new ResizeObserver(() => this._fitPill());
    this._fitObserver?.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
    // The "now" line and the next change of the schedule move on their own: redrawn every minute while the card is on
    // the page and shows a schedule (no other card is rebuilt, nor its animations restarted, for nothing).
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      const folded = this._setZoom && !this._zoomed; // a mini card in its compact view draws no schedule
      if (!folded && this._config?.show_schedule !== false && this._zonesNow?.some((z) => z.schedule)) this._refresh();
    }, 60000);
  }

  // The banner's status pill, measured after each render and on a new width (in every language): it sits on the
  // title's row, right after the title, only when the whole title and the pill's whole label fit there; otherwise it
  // takes a line of its own under the subtitle (.below), the title whole on its row (cut only when it does not fit
  // alone) and the subtitle on one line. When the three lines do not fit in the banner above the ground strip, or
  // the label does not fit its line, the pill shows its dot alone (.dot-only): beside the title when the whole title
  // leaves it room, else under the subtitle.
  _fitPill() {
    for (const t of this.shadowRoot?.querySelectorAll?.(".htext .titles, .header .titles") || []) {
      const row = t.querySelector(".trow");
      const chips = row ? [...row.querySelectorAll(":scope > .st")] : [];
      if (!chips[0]?.getBoundingClientRect) continue;
      t.classList.remove("below", "dot-only");
      const name = row.querySelector(".name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const outer = (c) => c.getBoundingClientRect().width + (parseFloat(getComputedStyle(c).marginLeft) || 0) + (parseFloat(getComputedStyle(c).marginRight) || 0);
      const others = [...row.children].filter((c) => c !== name && !chips.includes(c) && c.getClientRects().length);
      const room = row.getBoundingClientRect().width - others.reduce((w, c) => w + outer(c) + gap, 0);
      const title = name && getComputedStyle(name).display !== "none" ? textWidth(name) + gap : 0;
      const pills = () => chips.reduce((w, c) => w + c.getBoundingClientRect().width, gap * (chips.length - 1));
      if (title + pills() <= room) continue;
      t.classList.add("below");
      const banner = t.closest(".banner") || t;
      const ground = banner.querySelector(".bground");
      const floor = ground ? ground.getBoundingClientRect().top : banner.getBoundingClientRect().bottom;
      const box = t.getBoundingClientRect();
      // Whole: the label not cut and the pill not past the title block (into the picture).
      const whole = chips.every((c) => {
        const tx = c.querySelector(".stt");
        return (!tx || tx.scrollWidth <= tx.clientWidth + 0.5) && c.getBoundingClientRect().right <= box.right + 0.5;
      });
      if (whole && box.bottom <= floor + 0.5 && box.top >= banner.getBoundingClientRect().top - 0.5) continue;
      t.classList.add("dot-only");
      if (title + pills() <= room) t.classList.remove("below");
    }
  }

  disconnectedCallback() {
    this._fitObserver?.disconnect();
    this._pressing = this._dirty = false;
    window.removeEventListener("pointerup", this._onPressEnd, true);
    window.removeEventListener("pointercancel", this._onPressEnd, true);
    this._outside.off();
    // Left (another dashboard view, a conditional card hidden): the sections fold back to their defaults.
    this._toggled = new Map();
    clearInterval(this._tick);
    clearTimeout(this._tempTimer);
    clearTimeout(this._settleTimer);
    // Detached mid-debounce (dashboard edit, zoom): the pending target is sent now instead of being lost.
    const p = this._pending;
    if (p && !p.sent && this._hass) this._call("climate", "set_temperature", { entity_id: p.entity, ...p.data });
    this._pending = null;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = {
      show_title: true,
      show_subtitle: true,
      show_controls: true,
      show_presets: true,
      show_options: true,
      show_sensors: true,
      show_alerts: true,
      show_pilot_wire: true,
      show_schedule: true,
      ...config,
    };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._sig = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._settle();
    this._update();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _st(id) {
    return id ? this._hass.states[id] : undefined;
  }

  // A refused call (out of range, unavailable) is reported by Home Assistant's own toast: resolves to whether it went
  // through, never an unhandled rejection.
  _call(domain, service, data) {
    return Promise.resolve(this._hass.callService(domain, service, data)).then(
      () => true,
      () => false,
    );
  }

  _unit() {
    return this._hass.config?.unit_system?.temperature || "°C";
  }

  _temp(v, digits = 1) {
    return `${fmtNum(this._locale(), v, digits)} ${this._unit()}`;
  }

  // ── Zones ──
  // Resolved again only when the configuration, the registries, the language or the number of entities change (what
  // the resolution reads, as `memo`); a state push otherwise reuses them. The name, which can follow an entity's
  // friendly_name, is worked out again each time (cheap).
  _zones() {
    const h = this._hass;
    const key = [this._config, h.entities, h.devices, h.areas, h.floors, stateCount(h.states), lang(h, this._config)];
    let c = this._zoneCache;
    if (!c || key.some((v, i) => v !== c.key[i])) {
      c = this._zoneCache = { key, zones: zonesOf(h, this._config).map((z, i) => [z, this._resolve(z, i)]) };
    }
    return c.zones.map(([z, r]) => ({ ...r, name: this._zoneName(z, r.id, r.pilots) }));
  }

  _zoneName(z, id, pilots) {
    const hass = this._hass;
    return z.name || (id ? areaName(hass, id) || nameOf(hass, id) : pilots[0] ? areaName(hass, pilots[0]) || nameOf(hass, pilots[0]) : "") || this._t("zone");
  }

  // A zone with its entities found: the thermostat's device roles (overridable with `entities`), the zone's own
  // temperature / humidity / window sensors winning, and its pilot wire radiators.
  _resolve(z, index) {
    const hass = this._hass;
    const id = z.entity && hass.states[z.entity] ? z.entity : null;
    const ent = { main: id };
    const over = z.entities || {};
    // A stove's, a boiler's or a heated floor's own roles are looked for only on that device.
    const variant = id ? variantOf(hass, id, z.illustration) : null;
    for (const role of Object.keys(ROLES)) {
      if (!roleFor(role, variant)) ent[role] = over[role];
      else ent[role] = over[role] || (id ? roleOf(hass, id, role) : undefined);
    }
    if (z.temperature) ent.indoor_temp = z.temperature;
    if (z.humidity) ent.humidity = z.humidity;
    if (z.window) ent.window = z.window;
    const pilots = z.pilot_wire.filter((p) => hass.states[p]);
    const missing = (z.entity && !id) || (!z.entity && z.pilot_wire.length && !pilots.length);
    const used = new Set(Object.values(ent).filter(Boolean));
    // The option toggles: the thermostat's other switches, but those listed in `exclude`.
    const hidden = new Set(listOf(this._config.exclude));
    const switches = id ? deviceEntities(hass, deviceOf(hass, id)).map((e) => e.entity_id).filter((s) => s.startsWith("switch.") && !used.has(s) && !pilots.includes(s) && !hidden.has(s)) : [];
    const name = this._zoneName(z, id, pilots);
    return { ...z, index, id, ent, pilots, switches, name, missing, schedule: z.schedule && hass.states[z.schedule] ? z.schedule : null };
  }

  // Every entity the card shows, for the render signature.
  _ids(zones) {
    return zones.flatMap((z) => [z.id, ...Object.values(z.ent), ...z.pilots, ...z.pilots.map((p) => z.pilot_power?.[p]), ...z.switches, z.schedule]).filter(Boolean);
  }

  // ── Render loop: only when something shown changed (Home Assistant replaces a state object when it changes) ──
  _update() {
    if (!this._hass || !this._config) return;
    // Held back under a press (see the constructor): drawn once released.
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const zones = this._zones();
    const h = this._hass;
    const ids = this._ids(zones);
    const sig = [lang(h, this._config), h.entities, h.areas, h.floors, h.themes?.darkMode, this._unit(), this._zoomed, this._zone, this._pending, this._toggled, this._weekVersion, ...ids.map((id) => h.states[id])];
    if (this._sig && sig.length === this._sig.length && sig.every((v, i) => v === this._sig[i])) return;
    this._zonesNow = zones;
    for (const z of zones) if (z.schedule) this._loadWeek(z.schedule);
    const active = this.shadowRoot.activeElement;
    // A dropdown that has the focus (an open preset list) is not rebuilt under the finger: the signature is not
    // kept, so the update held back is drawn once the focus leaves it (focusout).
    if (active?.tagName === "SELECT") return;
    this._sig = sig;
    // Kept across the rewrite for the keyboard only (with the pointer it would draw the focus ring).
    const key = this._byPointer ? null : focusKey(active);
    morph(this.shadowRoot, this._render(zones));
    this._fitPill();
    // A new <ha-card> (first render) shows its content once Home Assistant has rendered it, a microtask later: the
    // pill measured before (on an empty card) is measured again then, before the frame is painted.
    const card = this.shadowRoot.querySelector("ha-card");
    if (card && card !== this._fitCard) {
      this._fitCard = card;
      card.updateComplete?.then?.(() => this._fitPill());
    }
    if (key && !this.shadowRoot.activeElement) [...this.shadowRoot.querySelectorAll(key.tag)].find((n) => key.data.every(([k, v]) => n.getAttribute(k) === v))?.focus({ preventScroll: true });
  }

  _refresh() {
    this._sig = null;
    this._update();
  }

  // Fetched once per state object of the schedule and shared by every card; the week already known stays shown while
  // a newer one loads.
  _loadWeek(id) {
    const st = this._st(id);
    const key = st?.last_updated || st?.last_changed || st?.state;
    const kept = SCHEDULES.get(id);
    if (kept?.key === key) {
      if (kept.loading) kept.waiting.add(this);
      return;
    }
    const entry = { key, week: kept?.week, loading: true, waiting: new Set([this]) };
    SCHEDULES.set(id, entry);
    if (typeof this._hass.callWS !== "function") {
      entry.week = null;
      entry.loading = false;
      return;
    }
    fetchWeek(this._hass, id).then((week) => {
      entry.week = week;
      entry.loading = false;
      for (const card of entry.waiting) {
        card._weekVersion = (card._weekVersion || 0) + 1;
        card._update();
      }
      entry.waiting.clear();
    });
  }

  // ── Zone model (from ha-climate-air-card's thermostat model) ──
  _target(st) {
    const p = this._pending;
    if (p?.entity === st.entity_id && p.data.temperature != null) return p.data.temperature;
    return st.attributes.temperature == null ? null : Number(st.attributes.temperature);
  }

  // A low / high range (heat_cool, auto) when the entity sets one instead of a single target.
  _range(st) {
    const a = st.attributes;
    const f = a.supported_features || 0;
    if (!(f & CLIMATE_RANGE) || a.target_temp_low == null || a.target_temp_high == null) return null;
    if (f & CLIMATE_TARGET && a.temperature != null) return null;
    const p = this._pending;
    if (p?.entity === st.entity_id && p.data.target_temp_low != null) return { low: p.data.target_temp_low, high: p.data.target_temp_high };
    return { low: Number(a.target_temp_low), high: Number(a.target_temp_high) };
  }

  _model(z) {
    const m = { z, chips: [], online: true };
    const c = this._config;
    const num = (id) => numOf(this._st(id));
    const fmt = (id) => {
      const st = this._st(id);
      const v = numOf(st);
      if (v == null) return null;
      const unit = st.attributes.unit_of_measurement || "";
      return `${fmtNum(this._locale(), v, unit === "%" ? 0 : 1)}${unit ? ` ${unit}` : ""}`;
    };
    m.humidity = num(z.ent.humidity);
    if (z.id) {
      const st = this._st(z.id);
      const a = st.attributes;
      m.online = !unavailable(st);
      m.mode = st.state;
      m.on = m.online && st.state !== "off";
      m.range = this._range(st);
      m.target = m.range ? null : this._target(st);
      m.cur = a.current_temperature != null ? Number(a.current_temperature) : num(z.ent.indoor_temp);
      if (m.humidity == null && a.current_humidity != null) m.humidity = Number(a.current_humidity);
      m.valve = num(z.ent.valve);
      const action = a.hvac_action;
      m.action = action;
      const variant = variantOf(this._hass, z.id, z.illustration);
      if (FIRES.has(variant)) m.stove = this._stoveModel(z, a, fmt);
      if (BOILERS.has(variant)) m.boiler = this._boilerModel(z, a, fmt);
      if (variant === "floor") m.floorTemp = fmt(z.ent.floor_temp) || (a.floor_temperature != null ? this._temp(Number(a.floor_temperature)) : null);
      const phase = m.stove?.phase;
      // Whether it heats right now: what the entity says it does, else a stove's phase, else whether its valve is open.
      m.heating =
        m.on &&
        (action && action !== "off"
          ? ["heating", "preheating"].includes(action)
          : phase
            ? phase === "burning" || phase === "ignition"
            : m.boiler?.burner != null
              ? m.boiler.burner
              : m.valve != null
              ? m.valve > 0
              : m.mode === "heat");
      if (m.stove && !phase) m.stove.phase = !m.on ? "off" : m.heating ? "burning" : "standby";
      m.preset = m.on && a.preset_mode && a.preset_mode !== "none" ? a.preset_mode : "";
      m.boost = presetKey(m.preset) === "boost";
      // A boost's time left, when the integration says it (towel rails, Heatzy, Atlantic, Netatmo…), in minutes.
      const left = m.boost ? Number(a.boost_remaining_time ?? a.boost_remaining ?? a.boost_time_left ?? a.remaining_boost_time ?? Number.NaN) : Number.NaN;
      m.boostLeft = Number.isFinite(left) && left > 0 ? left : null;
      m.color = !m.online || !m.on ? IDLE : m.boost && m.heating ? BOOST : m.heating ? HEAT : MODE_COLORS[m.mode] || HEAT;
      m.status = !m.online
        ? this._t("st_unavailable")
        : !m.on
          ? this._t("st_off")
          : action
            ? this._actionLabel(z.id, action)
            : this._t(m.heating ? "st_heating" : "st_idle");
      const min = Number(a.min_temp ?? 7);
      const max = Number(a.max_temp ?? 35);
      m.min = min;
      m.max = max;
      const set = m.range ? m.range.high : m.target;
      m.level = m.on && set != null ? (set - min) / (max - min || 1) : 0;
      m.display = m.on ? (m.range ? `${fmtNum(this._locale(), m.range.low, 0)}-${fmtNum(this._locale(), m.range.high, 0)}` : m.target != null ? `${fmtNum(this._locale(), m.target)}°` : "--") : "";
      m.presetText = m.preset ? this._presetLabel(z.id, m.preset) : "";
      // A stove says its phase (ignition, burning, cooling down…) rather than heating or idle.
      if (m.stove && m.online && phase) m.status = this._t(`ph_${phase}`);
      if (m.boostLeft != null && m.online && m.on) m.status = `${m.status} · ${this._t("boost_left", { time: this._minutes(m.boostLeft) })}`;
      // A zone with a thermostat and pilot wire radiators also heats while one of its radiators draws more than
      // `power_threshold` (a radiator without a power sensor never says it heats): *Heating · Radiator*, the
      // thermostat's own state kept apart for the subtitle.
      if (m.online && !m.heating && z.pilots.some((id) => this._pilotDraws(z, id))) {
        m.heating = true;
        m.radiatorHeat = true;
        m.pilotHeat = true;
        m.thermoStatus = m.status;
        m.color = HEAT;
        m.status = `${this._t("st_heating")} · ${this._t("ill_radiator")}`;
      }
    } else {
      // A pilot wire zone: its first radiator's order sets the color and the state.
      const first = z.pilots[0];
      const mode = first ? this._pilotState(z, first) : null;
      m.online = !!first && !unavailable(this._st(first));
      m.pilot = mode;
      m.on = m.online && mode && mode !== "off";
      m.heating = false;
      m.cur = num(z.ent.indoor_temp);
      m.color = m.online && mode ? PILOT_COLORS[mode] : IDLE;
      m.status = !m.online ? this._t("st_unavailable") : mode ? this._t(`p_${mode}`) : this._fmtState(first);
      // It glows while it heats: on comfort, or, with the power sensor of its relay, while it draws power.
      m.pilotHeat = !!(m.on && first && this._pilotHeats(z, first, mode));
      const watts = first && !z.id ? this._pilotPower(z, first) : "";
      if (watts) m.status = `${m.status} · ${watts}`;
    }
    // Chips: an open window, a low battery, the valve, humidity, outdoor temperature and power (as in
    // ha-climate-air-card), each only if found.
    const e = z.ent;
    if (c.show_alerts && this._st(e.window)?.state === "on") m.chips.push(this._chip("window", this._t("window_open"), "warn", e.window));
    const battery = num(e.battery);
    if (battery != null && c.show_alerts && battery <= BATTERY_LOW) m.chips.push(this._chip("battery_low", `${this._t("battery_low")} · ${fmt(e.battery)}`, "warn", e.battery));
    else if (battery != null && c.show_sensors) m.chips.push(this._chip("battery", fmt(e.battery), "", e.battery));
    if (c.show_sensors) {
      if (m.valve != null) m.chips.push(this._chip("valve", `${this._t("valve")} ${fmt(e.valve)}`, "", e.valve));
      if (m.humidity != null) m.chips.push(this._chip("humidity", `${fmtNum(this._locale(), m.humidity, 0)} %`, "", e.humidity || z.id));
      const out = fmt(e.outdoor_temp);
      if (out) m.chips.push(this._chip("outdoor", `${this._t("outdoor")} ${out}`, "", e.outdoor_temp));
      const power = fmt(e.power);
      if (power && m.on) m.chips.push(this._chip("flash", power, "", e.power));
    }
    if (c.show_sensors && m.floorTemp) m.chips.push(this._chip("thermometer", `${this._t("floor_temp")} ${m.floorTemp}`, "", e.floor_temp || z.id));
    if (m.boiler && c.show_alerts) {
      if (m.boiler.pressureLow) m.chips.push(this._chip("gauge", `${this._t("pressure_low")} · ${m.boiler.pressure}`, "warn", e.pressure));
      if (m.boiler.fuelLow) m.chips.push(this._chip("fuel", this._t("fuel_low"), "warn", e.fuel));
      if (!m.stove && m.boiler.alarm) m.chips.push(this._chip("alert", m.boiler.alarm, "warn", e.stove_alarm || z.id));
    }
    if (m.stove && c.show_alerts) {
      if (m.stove.alarm) m.chips.push(this._chip("alert", m.stove.alarm, "warn", e.stove_alarm || z.id));
      if (m.stove.pelletsLow) m.chips.push(this._chip("pellets", this._t("pellets_low"), "warn", e.pellets_low || e.pellets));
    }
    if (!m.online) m.chips.push(this._chip("offline", this._t("offline"), "", z.id || z.pilots[0]));
    m.alert = m.chips.some((x) => x.includes("chip warn"));
    return m;
  }

  // A stove's own readings, from its device's entities, else from its climate entity's attributes (Duepi EVO and
  // others keep them there): phase, power level (a number to set), pellets, flue gas, fan, alarm and ignitions.
  _stoveModel(z, a, fmt) {
    const e = z.ent;
    const st = (id) => (id ? this._st(id) : null);
    const statusSt = st(e.stove_status);
    const statusText = statusSt && !unavailable(statusSt) ? this._fmtState(e.stove_status) : (a.burner_status ?? a.stove_status ?? a.status ?? null);
    const phase = stovePhase(statusSt?.state) ?? stovePhase(statusText);
    let power = null;
    const ps = st(e.stove_power);
    if (ps && !unavailable(ps)) {
      const pa = ps.attributes;
      power = { id: e.stove_power, value: numOf(ps), min: Number(pa.min ?? 1), max: Number(pa.max ?? 5), step: Number(pa.step ?? 1) || 1 };
    } else if (a.power_level != null && Number.isFinite(Number(a.power_level))) power = { value: Number(a.power_level) };
    const pel = st(e.pellets);
    const pelUnit = pel?.attributes.unit_of_measurement || "";
    const pellets = numOf(pel);
    const flue = fmt(e.flue_gas) || (a.flu_gas_temp != null ? `${fmtNum(this._locale(), Number(a.flu_gas_temp), 0)} ${this._unit()}` : null);
    const fs = st(e.stove_fan);
    let fan = null;
    if (fs && !unavailable(fs)) {
      const dom = e.stove_fan.split(".")[0];
      fan = dom === "fan" ? (fs.state === "off" ? this._t("st_off") : fs.attributes.percentage != null ? `${fs.attributes.percentage} %` : this._fmtState(e.stove_fan)) : dom === "number" ? fmt(e.stove_fan) : this._fmtState(e.stove_fan);
    }
    let alarm = this._alarm(e.stove_alarm);
    if (!alarm && phase === "alarm") alarm = statusText ? `${this._t("ph_alarm")} · ${statusText}` : this._t("ph_alarm");
    return {
      phase,
      power,
      pellets: pellets != null && pelUnit === "%" ? Math.max(0, Math.min(100, pellets)) : null,
      pelletsText: pellets != null && pelUnit !== "%" ? fmt(e.pellets) : null,
      pelletsLow: st(e.pellets_low)?.state === "on" || (pellets != null && pelUnit === "%" && pellets <= 10),
      flue,
      fan,
      alarm,
      ignitions: numOf(st(e.ignitions)),
    };
  }

  // A boiler's own readings, from its device's entities, else from its climate entity's attributes (OpenTherm Gateway
  // and others keep some there): flow and return water temperatures, the burner's modulation and flame, the water
  // pressure (flagged under PRESSURE_LOW bar), the fuel left in an oil tank (flagged at FUEL_LOW %) and an alarm.
  _boilerModel(z, a, fmt) {
    const e = z.ent;
    const st = (id) => (id ? this._st(id) : null);
    const temp = (id, attr) => fmt(id) || (a[attr] != null && Number.isFinite(Number(a[attr])) ? this._temp(Number(a[attr]), 0) : null);
    const mod = numOf(st(e.modulation)) ?? (a.relative_modulation_level != null ? Number(a.relative_modulation_level) : null);
    const bs = st(e.burner);
    const burner = bs && !unavailable(bs) ? bs.state === "on" : mod != null ? mod > 0 : null;
    const ps = st(e.pressure);
    const pv = numOf(ps);
    const unit = ps?.attributes.unit_of_measurement || "bar";
    const fuel = numOf(st(e.fuel));
    const fuelPct = fuel != null && (st(e.fuel)?.attributes.unit_of_measurement || "%") === "%";
    const alarm = this._alarm(e.stove_alarm);
    return {
      flow: temp(e.flow_temp, "flow_temperature"),
      ret: temp(e.return_temp, "return_temperature"),
      modulation: mod != null ? `${fmtNum(this._locale(), mod, 0)} %` : null,
      burner,
      pressure: pv != null ? `${fmtNum(this._locale(), pv, 1)} ${unit}` : null,
      pressureLow: pv != null && unit === "bar" && pv < PRESSURE_LOW,
      fuel: fuelPct ? Math.max(0, Math.min(100, fuel)) : null,
      fuelText: fuel != null && !fuelPct ? fmt(e.fuel) : null,
      fuelLow: fuelPct && fuel <= FUEL_LOW,
      alarm,
    };
  }

  // An alarm entity's text: a binary sensor on, or a sensor saying something else than "none" / "ok"; null otherwise.
  _alarm(id) {
    const as = id ? this._st(id) : null;
    if (!as || unavailable(as)) return null;
    if (id.startsWith("binary_sensor.")) return as.state === "on" ? this._t("ph_alarm") : null;
    return /^(none|ok|0|no_?alarm|no alarm|aucune?|keine?|ninguna?|nessun[oa]?|-|)$/i.test(String(as.state).trim()) ? null : `${this._t("ph_alarm")} · ${this._fmtState(id)}`;
  }

  // Minutes as a duration: *30 min*, *1 h 30 min*.
  _minutes(n) {
    const loc = this._locale();
    const unit = (u, v) => new Intl.NumberFormat(loc, { style: "unit", unit: u, unitDisplay: "short" }).format(v);
    const h = Math.floor(n / 60);
    const mn = Math.round(n % 60);
    return h ? (mn ? `${unit("hour", h)} ${unit("minute", mn)}` : unit("hour", h)) : unit("minute", mn);
  }

  // The pilot wire order of a radiator: the select's option, or the switch's state through switch_on / switch_off.
  _pilotState(z, id) {
    const st = this._st(id);
    if (unavailable(st)) return null;
    if (id.startsWith("switch.")) return st.state === "on" ? pilotMode(z.switch_on) || "comfort" : pilotMode(z.switch_off) || "off";
    return pilotMode(st.state);
  }

  // The power drawn by a radiator's relay (its `power` sensor), formatted, or "" without one.
  _pilotPower(z, id) {
    const sensor = z.pilot_power?.[id];
    return sensor && !unavailable(this._st(sensor)) ? this._fmtState(sensor) : "";
  }

  // Whether a radiator heats: with a power sensor, while it draws more than `power_threshold` (5 W by default);
  // without one, while its order is a comfort one.
  _pilotHeats(z, id, mode) {
    return this._pilotDraws(z, id) ?? !!mode?.startsWith("comfort");
  }

  // Whether a radiator's relay draws more than `power_threshold` (W, a kW sensor converted), or null without a
  // readable power sensor.
  _pilotDraws(z, id) {
    const sensor = z.pilot_power?.[id];
    const st = sensor ? this._st(sensor) : null;
    if (!st || unavailable(st)) return null;
    const w = Number(st.state) * (/^kw$/i.test(st.attributes?.unit_of_measurement || "") ? 1000 : 1);
    return Number.isFinite(w) ? w > Number(this._config.power_threshold ?? 5) : null;
  }

  _pilotOptions(z, id) {
    if (id.startsWith("switch.")) {
      const on = pilotMode(z.switch_on) || "comfort";
      const off = pilotMode(z.switch_off) || "off";
      return on === off ? [on] : [on, off].sort((a, b) => PILOT_ORDER.indexOf(a) - PILOT_ORDER.indexOf(b));
    }
    const seen = new Set();
    return (this._st(id)?.attributes.options || [])
      .map(pilotMode)
      .filter((m) => m && !seen.has(m) && seen.add(m))
      .sort((a, b) => PILOT_ORDER.indexOf(a) - PILOT_ORDER.indexOf(b));
  }

  // Labels: the card's own words for heating values, then Home Assistant's translation, then the value humanized.
  _actionLabel(id, action) {
    const own = { heating: "st_heating", preheating: "st_preheating", idle: "st_idle", off: "st_off", defrosting: "st_defrosting" }[action];
    if (own) return this._t(own);
    const st = this._st(id);
    return this._hass.formatEntityAttributeValue?.(st, "hvac_action", action) || humanize(action);
  }

  _presetLabel(id, preset) {
    const k = presetKey(preset);
    if (k) return this._t(`p_${k}`);
    const st = this._st(id);
    const ha = st && this._hass.formatEntityAttributeValue?.(st, "preset_mode", preset);
    return ha && ha !== preset ? ha : humanize(preset);
  }

  _modeLabel(id, mode) {
    if (STRINGS.en[`mode_${mode}`]) return this._t(`mode_${mode}`);
    const st = this._st(id);
    return (st && this._hass.formatEntityState?.(st, mode)) || humanize(mode);
  }

  _fmtState(id) {
    const st = this._st(id);
    return (st && this._hass.formatEntityState?.(st)) || humanize(st?.state);
  }

  _label(id) {
    const st = this._st(id);
    let name = String(st?.attributes.friendly_name || id);
    const dev = deviceName(this._hass, id);
    if (dev && name.toLowerCase().startsWith(dev.toLowerCase()) && name.length > dev.length) name = name.slice(dev.length);
    name = name.replace(/^[\s*·:-]+/, "").trim() || id;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  _chip(icon, text, cls, entity) {
    const more = entity ? ` data-entity="${esc(entity)}" role="button" tabindex="0"` : "";
    return `<span class="chip${cls ? ` ${cls}` : ""}"${more} title="${esc(text)}">${svgIcon(icon)}<span>${esc(text)}</span></span>`;
  }

  // ── Header: the radiator badge, tinted by the home's state, the title, and the status pill on the title's line ──
  _summary(models) {
    const any = (f) => models.some(f);
    const heating = any((m) => m.heating);
    const color = heating ? (any((m) => m.heating && m.boost) ? BOOST : HEAT) : any((m) => m.on) ? (models.find((m) => m.on).color ?? HEAT) : IDLE;
    let status;
    if (models.length === 1) status = models[0].status;
    else if (!any((m) => m.online)) status = this._t("st_unavailable");
    else status = this._t(heating ? "st_heating" : any((m) => m.on) ? "st_idle" : "st_off");
    const n = models.filter((m) => m.heating).length;
    const sub = models.length > 1 ? (n ? this._t("zones_heating", { n, total: models.length }) : this._t("zones_none", { total: models.length })) : "";
    return { color, heating, status, sub, models };
  }

  // `focus` (the zone the banner draws) asks for the illustrated header; without it, or with `illustration: false`,
  // the classic header.
  _header(title, sub, summary, focus) {
    if (focus && this._illustrated()) return this._banner(title, sub, summary, focus);
    return (
      `<div class="header" style="--hc-color:${summary.color}"><div class="badge${summary.heating ? " heating" : ""}">${svgIcon(summary.heating ? "radiator" : summary.color === IDLE ? "radiator_off" : "radiator")}</div>` +
      `<div class="titles"><div class="trow"><div class="name">${esc(title)}</div>` +
      `<span class="st${summary.heating ? " heating" : ""}" title="${esc(summary.status)}" role="status"><span class="dot"></span><span class="stt">${esc(summary.status)}</span></span></div>` +
      `${sub ? `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>` : ""}</div>` +
      `${this._zoomButton()}</div>`
    );
  }

  _illustrated() {
    return this._config.illustration !== false;
  }

  // Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day
  // picture after sunset).
  _isNight() {
    const theme = this._config.illustration_theme;
    if (theme === "night") return true;
    if (theme === "day") return false;
    return !!this._hass?.themes?.darkMode;
  }

  // The icon's color says the status: unavailable red, an alert (open window, low battery) amber, heating in the heat
  // (or boost) color, eco green and frost protection blue, idle or off grey.
  _iconColor(models, focus) {
    if (!models.some((m) => m.online)) return "var(--hc-crit)";
    if (models.some((m) => m.alert)) return "var(--hc-warn)";
    if (models.some((m) => m.heating)) return models.some((m) => m.heating && m.boost) ? BOOST : HEAT;
    const theme = bannerTheme(focus);
    if (theme === "heat" && focus.pilot?.startsWith("comfort")) return PILOT_COLORS[focus.pilot];
    return theme === "eco" ? PILOT_COLORS.eco : theme === "frost" ? PILOT_COLORS.frost : IDLE;
  }

  // The logo of the focused zone's integration, when the bundle has it.
  _brand(z) {
    const id = z.id || z.pilots[0];
    const platform = this._hass?.entities?.[id]?.platform;
    const logo = platform && BRAND_LOGOS[platform];
    return logo ? `<span class="brand"><img src="${esc(logo)}" alt=""></span>` : "";
  }

  _banner(title, sub, summary, m) {
    const z = m.z;
    const night = this._isNight();
    const theme = bannerTheme(m);
    const zoom = this._zoomButton();
    const right = zoom ? 172 : 198;
    let dev = "";
    let devW = 0;
    let devH = 0;
    let flat = false;
    if (!z.icon && !z.missing) {
      const variant = variantOf(this._hass, z.id, z.illustration);
      flat = variant === "floor";
      const box = BANNER_DEVICES[variant] || BANNER_DEVICES.dial;
      const [, , vw, vh] = box.vb;
      const k = Math.min(box.w / vw, box.h / vh);
      devW = vw * k;
      devH = vh * k;
      const cls = ["bdev", m.on ? "running" : "", m.heating ? "active" : "", m.boost ? "boost" : "", m.pilot ? `pw-${m.pilot}` : ""];
      if (m.pilotHeat) cls.push("active");
      const svg = art(variant, m, `b${this._uid}`).replace(
        '<svg viewBox="0 0 80 94" aria-hidden="true">',
        `<svg x="${(right - devW).toFixed(1)}" y="${(80 - devH).toFixed(1)}" width="${devW.toFixed(1)}" height="${devH.toFixed(1)}" viewBox="${box.vb.join(" ")}" preserveAspectRatio="xMidYMax meet" overflow="visible">`,
      );
      dev = `<g class="${cls.filter(Boolean).join(" ")}" style="--hc-color:${m.color}" data-entity="${esc(z.id || z.pilots[0] || "")}">${svg}</g>`;
    }
    const loc = this._locale();
    const cur = m.cur != null ? `${fmtNum(loc, m.cur)}°` : "";
    const tgt = this._showTarget(m) ? `→ ${m.range ? `${fmtNum(loc, m.range.low)}–${fmtNum(loc, m.range.high)}` : fmtNum(loc, m.target)}°` : "";
    const level = m.cur != null ? m.cur / 30 : BANNER_LEVELS[theme];
    const scene = bannerScene({ theme, night, uid: this._uid, dev, devW, devH, right, cur, tgt, level, active: m.heating || (m.pilot?.startsWith("comfort") && m.on), flat });
    const color = this._iconColor(summary.models || [m], m);
    const icon = z.icon && this._zonesNow?.length === 1 ? `<ha-icon icon="${esc(z.icon)}"></ha-icon>` : svgIcon(m.online && m.on ? "fire" : "radiator_off");
    const vars = `--hc-sw:${Math.ceil(200 - scene.tx + 8)}px;--hc-dw:${Math.ceil(200 - scene.devX + 4)}px;--hc-zw:${zoom ? 36 : 8}px`;
    return (
      `<div class="banner${night ? " night" : ""}" style="${vars}">${scene.svg}<div class="bground g-${theme}"></div>` +
      `<div class="htext"><div class="badge${summary.heating ? " heating" : ""}" style="--hc-color:${color}" title="${esc(summary.status)}">${icon}${this._brand(z)}</div>` +
      `<div class="titles"><div class="trow"><div class="name">${esc(title)}</div>` +
      `<span class="st bst${summary.heating ? " heating" : ""}" style="--hc-color:${color}" title="${esc(summary.status)}" role="status"><span class="dot"></span><span class="stt">${esc(summary.status)}</span></span></div>` +
      `${sub ? `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>` : ""}</div></div>` +
      `${zoom}</div>`
    );
  }

  _zoomButton() {
    return "";
  }

  _styles(color, own) {
    return `<style>${BASE_STYLE}${BANNER_STYLE}${own}</style><style>:host{--hc-color:${color};}</style>`;
  }

  _empty() {
    const c = this._config;
    const missing = c.entity || (Array.isArray(c.zones) && c.zones.length);
    return `${this._styles(IDLE, "")}<ha-card><div class="empty">${svgIcon("radiator_off")}${esc(this._t(missing ? "not_found" : "no_zone"))}</div></ha-card>`;
  }

  _picture(m) {
    const z = m.z;
    const cls = ["picture", m.on ? "running" : "", m.heating ? "active" : "", m.boost ? "boost" : "", m.pilot ? `pw-${m.pilot}` : ""];
    // A pilot wire radiator on comfort glows and gives off heat like a thermostat that heats.
    if (m.pilotHeat) cls.push("active");
    if (z.icon) return `<div class="${cls.filter(Boolean).join(" ")}"><div class="iconart"><ha-icon icon="${esc(z.icon)}"></ha-icon></div></div>`;
    const variant = variantOf(this._hass, z.id, z.illustration);
    return `<div class="${cls.filter(Boolean).join(" ")}" data-entity="${esc(z.id || z.pilots[0] || "")}" role="button" tabindex="0" aria-label="${esc(z.name)}">${art(variant, m, `${this._uid}-${z.index}`)}</div>`;
  }

  // ── Full card ──
  _render(zones) {
    if (!zones.length) return this._empty();
    const models = zones.map((z) => this._model(z));
    if (this._zone >= zones.length) this._zone = 0;
    const m = models[this._zone];
    const summary = this._summary(models);
    const c = this._config;
    const title = c.title || c.name || (zones.length === 1 ? zones[0].name : this._t("title"));
    // One zone: its name under a title of your own, and its preset (as the climate-air thermostat card's area · preset).
    // A top-level `name` is the zone's name too: the area then stands under it, never the title again.
    const z0 = zones[0];
    const place = [z0.name, areaName(this._hass, z0.id || z0.pilots[0])].find((x) => x && x !== title) || "";
    const banner = this._illustrated();
    const sub = zones.length === 1 ? [c.title || c.name ? place : "", m.radiatorHeat ? m.thermoStatus : "", m.presetText].filter(Boolean).join(" · ") : summary.sub;
    return (
      `${this._styles(m.color, FULL_STYLE)}<ha-card>` +
      this._header(title, sub, summary, m) +
      (zones.length > 1 ? this._tabs(models) : "") +
      this._zoneBody(m) +
      "</ha-card>"
    );
  }

  _tabs(models) {
    return `<div class="zones${models.length > 3 ? " many" : ""}" role="tablist">${models
      .map((m, i) => {
        const on = i === this._zone;
        const temp = m.cur != null ? `<span class="zt">${esc(fmtNum(this._locale(), m.cur))}°</span>` : "";
        return `<button class="zone${on ? " on" : ""}" role="tab" aria-selected="${on}" data-action="zone" data-zone="${i}" style="--zc:${m.color}">${svgIcon(m.heating ? "fire" : m.pilot ? PILOT_ICONS[m.pilot] : "radiator", m.heating ? "heating" : "")}<span>${esc(m.z.name)}</span>${temp}</button>`;
      })
      .join("")}</div>`;
  }

  _zoneBody(m) {
    const z = m.z;
    if (z.missing) return `<div class="empty">${svgIcon("alert")}${esc(`${this._t("not_found")}: ${z.entity || z.pilot_wire.join(", ")}`)}</div>`;
    const c = this._config;
    // The illustrated header draws the zone's device: the hero keeps the temperatures.
    const pic = this._illustrated() ? "" : this._picture(m);
    const parts = [`<div class="hero" style="--hc-color:${m.color}">${pic}<div class="info">${this._heroInfo(m)}${m.chips.length ? `<div class="chips">${m.chips.join("")}</div>` : ""}</div></div>`];
    if (c.show_controls && m.online && z.id) parts.push(this._controls(m));
    if (m.stove && m.online) parts.push(this._stoveSection(m));
    else if (m.boiler && m.online) parts.push(this._boilerSection(m));
    if (c.show_pilot_wire && z.pilots.length) parts.push(this._pilotSection(m));
    if (c.show_schedule && z.schedule) parts.push(this._scheduleSection(m));
    if (c.show_controls && c.show_options !== false && m.online && z.switches.length) parts.push(this._options(z));
    return parts.join("");
  }

  _heroInfo(m) {
    const loc = this._locale();
    const cur = m.cur != null ? `<span class="val">${esc(fmtNum(loc, m.cur))}<small> ${esc(this._unit())}</small></span>` : "";
    const target = this._showTarget(m) ? `<span class="arrow">→ ${esc(this._targetText(m))}</span>` : "";
    if (!cur) return `<div class="big"><span class="state-big">${esc(m.status)}</span></div>${m.presetText ? this._line(presetIcon(m.preset), m.presetText) : ""}`;
    const line = m.presetText ? this._line(presetIcon(m.preset), m.presetText) : m.pilot ? this._line(PILOT_ICONS[m.pilot], m.status) : "";
    return `<div class="big">${cur}${target}</div>${line}`;
  }

  _line(icon, text) {
    return `<div class="line">${svgIcon(icon)}<span>${esc(text)}</span></div>`;
  }

  _showTarget(m) {
    return m.on && (m.target != null || m.range != null);
  }

  _targetText(m) {
    if (!m.range) return this._temp(m.target);
    return `${fmtNum(this._locale(), m.range.low)}–${this._temp(m.range.high)}`;
  }

  // Segmented buttons, one per option; `action` gets the option in data-value. Many options: only the selected one
  // keeps its label, the others show their icon (with their label as tooltip and for screen readers).
  _segments(action, options, current, label, icon, extra = "", color) {
    // A single preset kept by a `presets` list still gets its button (a tap on it goes back to none).
    if (!options || options.length < (action === "preset" ? 1 : 2)) return "";
    const many = options.length > 4;
    return `<div class="segments" role="group">${options
      .map((o) => {
        const on = o === current;
        const text = esc(label(o));
        const short = many && !on;
        const tint = color ? ` style="--seg-color:${color(o)}"` : "";
        // Comfort −1 / −2 share comfort's icon: a button showing its icon only keeps its −1 / −2 to tell them apart
        // (shown on a short button, and on a narrow card where the labels not selected are hidden).
        const tag = COMFORT_TAGS[presetKey(o)] ? `<span class="tag" aria-hidden="true">${COMFORT_TAGS[presetKey(o)]}</span>` : "";
        return `<button class="seg${on ? " on" : ""}${short ? " short" : ""}" data-action="${action}" data-value="${esc(o)}"${extra} aria-pressed="${on}" title="${text}" aria-label="${text}"${tint}>${svgIcon(icon(o))}${short ? tag : `<span class="sl">${text}</span>${tag}`}</button>`;
      })
      .join("")}</div>`;
  }

  _controls(m) {
    const z = m.z;
    const c = this._config;
    const st = this._st(z.id);
    const a = st.attributes;
    const f = a.supported_features || 0;
    const hvac = a.hvac_modes || [];
    // Every mode but off (heat, auto, heat_cool; cool, dry or fan_only for a heat pump set by hand), off being the power
    // button next to them.
    const modes = hvac.filter((x) => x !== "off");
    const canOff = hvac.includes("off") || f & CLIMATE_TURN_OFF;
    const power = canOff
      ? `<button class="round power${m.on ? " on" : ""}" data-action="power" data-zone="${z.index}" aria-pressed="${m.on}" title="${esc(this._t("power"))}" aria-label="${esc(this._t("power"))}">${svgIcon("power")}</button>`
      : "";
    const segs = this._segments("hvac", modes, m.mode, (o) => this._modeLabel(z.id, o), (o) => MODE_ICONS[o], ` data-zone="${z.index}"`);
    // Without mode buttons, the power button sits next to the target instead of on a row of its own.
    const row = segs ? `<div class="controls-row">${segs}${power}</div>` : "";
    let stepper = "";
    if (m.range && this._showTarget(m)) {
      const low = this._t("target_low");
      const high = this._t("target_high");
      stepper = `<div class="steppers">${this._stepper(m, "temp_low", m.range.low, low, low)}${this._stepper(m, "temp_high", m.range.high, high, high)}</div>`;
    } else if (f & CLIMATE_TARGET && this._showTarget(m)) stepper = this._stepper(m, "temp", m.target, this._t("target")) + this._scale(m);
    // The presets (comfort, eco, away, boost, frost protection…) as segmented buttons; a tap on the selected one goes
    // back to none when the entity offers it.
    // `show_presets: false` hides them, a `presets` list keeps only those (an empty list hides the row too).
    const keep = Array.isArray(c.presets) ? new Set(c.presets.map(String)) : null;
    const presets = (a.preset_modes || []).filter((p) => !keep || keep.has(p) || p === "none");
    let presetHtml = "";
    if (c.show_presets !== false && m.on && f & CLIMATE_PRESET && presets.filter((p) => p !== "none").length >= (keep ? 1 : 2)) {
      const shown = presets.filter((p) => p !== "none");
      presetHtml =
        shown.length <= 7
          ? this._segments("preset", shown.length >= 2 || keep ? shown : presets, a.preset_mode, (o) => this._presetLabel(z.id, o), presetIcon, ` data-zone="${z.index}"`)
          : `<label class="field"><span>${esc(this._t("preset"))}</span><select data-action="preset" data-zone="${z.index}">${presets
              .map((p) => `<option value="${esc(p)}"${p === a.preset_mode ? " selected" : ""}>${esc(this._presetLabel(z.id, p))}</option>`)
              .join("")}</select></label>`;
    }
    if (!segs && power) stepper = stepper ? `<div class="controls-row"><div class="target">${stepper}</div>${power}</div>` : `<div class="controls-row"><span class="target"></span>${power}</div>`;
    return `<div class="section">${row}${stepper}${presetHtml}${m.on ? this._selects(z, a, f) : ""}</div>`;
  }

  // The fan and swing modes, and the target humidity, of a thermostat that has them (as ha-climate-air-card's thermostat
  // card): dropdowns calling climate.set_fan_mode, set_swing_mode, set_swing_horizontal_mode and set_humidity.
  _selects(z, a, f) {
    const field = (label, data, options, current, text) =>
      `<label class="field"><span>${esc(label)}</span><select ${data} data-zone="${z.index}">${options
        .map((o) => `<option value="${esc(o)}"${String(o) === String(current) ? " selected" : ""}>${esc(text(o))}</option>`)
        .join("")}</select></label>`;
    const attr = (flag, key, list, service) => {
      const options = a[list] || [];
      if (!(f & flag) || options.length < 2) return "";
      const text = (o) => this._hass.formatEntityAttributeValue?.(this._st(z.id), key, o) || humanize(o);
      return field(this._t(key), `data-action="attr" data-service="${service}" data-attr="${key}"`, options, a[key], text);
    };
    const items = [
      attr(CLIMATE_FAN_MODE, "fan_mode", "fan_modes", "set_fan_mode"),
      attr(CLIMATE_SWING, "swing_mode", "swing_modes", "set_swing_mode"),
      attr(CLIMATE_SWING_HORIZONTAL, "swing_horizontal_mode", "swing_horizontal_modes", "set_swing_horizontal_mode"),
    ];
    if (f & CLIMATE_TARGET_HUMIDITY && a.humidity != null) {
      const lo = Number(a.min_humidity ?? 30);
      const hi = Number(a.max_humidity ?? 99);
      const cur = Math.round(Number(a.humidity));
      const opts = new Set([cur]);
      for (let v = Math.ceil(lo / 5) * 5; v <= hi; v += 5) opts.add(v);
      const sorted = [...opts].filter((v) => v === cur || (v >= lo && v <= hi)).sort((x, y) => x - y);
      items.push(field(this._t("target_humidity"), 'data-action="attr" data-service="set_humidity" data-attr="humidity"', sorted, cur, (v) => `${v} %`));
    }
    const html = items.filter(Boolean).join("");
    return html ? `<div class="grid">${html}</div>` : "";
  }

  // One − / + stepper: `action` is temp (single target), temp_low or temp_high. The value is a spin button: arrow keys
  // (and Page Up / Down, Home / End) move it from the keyboard. At the entity's minimum or maximum its button is off.
  _stepper(m, action, value, label, hint) {
    const z = m.z;
    const pending = this._pending?.entity === z.id;
    const btn = (dir, key, icon, disabled) => {
      const text = hint ? `${this._t(key)} (${hint})` : this._t(key);
      return `<button class="round" data-action="${action}" data-value="${dir}" data-zone="${z.index}" title="${esc(text)}" aria-label="${esc(text)}"${disabled ? " disabled" : ""}>${svgIcon(icon)}</button>`;
    };
    const text = this._temp(value);
    return (
      '<div class="stepper">' +
      btn("-1", "temp_down", "minus", value != null && value <= m.min) +
      `<div class="tv${pending ? " pending" : ""}" role="spinbutton" tabindex="0" data-action="${action}" data-zone="${z.index}" aria-label="${esc(label)}" aria-valuenow="${value ?? ""}" aria-valuemin="${m.min}" aria-valuemax="${m.max}" aria-valuetext="${esc(text)}"><span class="tval">${esc(fmtNum(this._locale(), value))}<small> ${esc(this._unit())}</small></span><span class="tl">${esc(label)}</span></div>` +
      btn("1", "temp_up", "plus", value != null && value >= m.max) +
      "</div>"
    );
  }

  _scale(m) {
    const pct = (v) => Math.max(0, Math.min(100, ((v - m.min) / (m.max - m.min || 1)) * 100)).toFixed(1);
    const cur = m.cur != null ? `<div class="cur" style="left:${pct(m.cur)}%" title="${esc(this._temp(m.cur))}"></div>` : "";
    const loc = this._locale();
    return `<div class="scale" aria-hidden="true"><div class="fill" style="width:${pct(m.target)}%"></div>${cur}</div><div class="scale-labels" aria-hidden="true"><span>${esc(fmtNum(loc, m.min))}°</span><span>${esc(fmtNum(loc, m.max))}°</span></div>`;
  }

  _isCollapsed(key) {
    if (this._toggled?.has(key)) return this._toggled.get(key);
    const c = this._config.collapsed ?? DEFAULT_COLLAPSED;
    return (Array.isArray(c) ? c : [c]).includes(key);
  }

  _sectionTitle(key, icon, label) {
    const closed = this._isCollapsed(key);
    return `<div class="section-title toggle-section" role="button" tabindex="0" data-action="toggle_section" data-section="${key}" aria-expanded="${!closed}">${svgIcon(icon)}<span>${esc(label)}</span>${svgIcon("chevron", "chevron")}</div>`;
  }

  _pilotSection(m) {
    const z = m.z;
    const closed = this._isCollapsed("pilot_wire");
    const body = closed
      ? ""
      : z.pilots
          .map((id) => {
            const mode = this._pilotState(z, id);
            const st = this._st(id);
            const off = unavailable(st);
            const opts = this._pilotOptions(z, id);
            const name = deviceName(this._hass, id) || this._label(id);
            const segs = off
              ? `<div class="muted">${esc(this._t("st_unavailable"))}</div>`
              : this._segments("pilot", opts, mode, (o) => this._t(`p_${o}`), (o) => PILOT_ICONS[o], ` data-entity="${esc(id)}" data-zone="${z.index}"`, (o) => PILOT_COLORS[o]);
            const watts = this._pilotPower(z, id);
            const draw = watts ? `<span class="pw-power${this._pilotHeats(z, id, mode) && mode && mode !== "off" ? " on" : ""}" data-entity="${esc(z.pilot_power[id])}">${svgIcon("flash")}${esc(watts)}</span>` : "";
            return `<div class="pilot"><div class="pilot-name" style="--pc:${mode ? PILOT_COLORS[mode] : IDLE}">${svgIcon(mode ? PILOT_ICONS[mode] : "radiator")}<span>${esc(name)}</span>${draw}</div>${segs || `<div class="muted">${esc(mode ? this._t(`p_${mode}`) : this._fmtState(id))}</div>`}</div>`;
          })
          .join("");
    return `<div class="section">${this._sectionTitle("pilot_wire", "pilot", this._t("pilot_wire"))}${body}</div>`;
  }

  // A stove: where it is in its cycle (off → ignition → burning → cooling down), its power level as segmented buttons
  // (a number entity), the pellets left as a bar, and its flue gas, fan and ignitions as tiles.
  _stoveSection(m) {
    const z = m.z;
    const sv = m.stove;
    const closed = this._isCollapsed("stove");
    let body = "";
    if (!closed) {
      const at = sv.phase === "standby" ? 0 : STOVE_STEPS.indexOf(sv.phase);
      const steps = STOVE_STEPS.map((p, i) => {
        const label = i === 0 && sv.phase === "standby" ? this._t("ph_standby") : this._t(`ph_${p}`);
        const cls = i === at ? " on" : at > 0 && i < at ? " done" : "";
        return `${i ? `<span class="pline${at > 0 && i <= at ? " done" : ""}"></span>` : ""}<span class="phase${cls}"${i === at ? ' aria-current="step"' : ""}>${esc(label)}</span>`;
      }).join("");
      const phases = sv.phase === "alarm" ? `<div class="phases alarm">${svgIcon("alert")}<span>${esc(sv.alarm || this._t("ph_alarm"))}</span></div>` : `<div class="phases" role="list">${steps}</div>`;
      let power = "";
      const p = sv.power;
      if (p?.id && p.value != null) {
        const n = Math.round((p.max - p.min) / p.step) + 1;
        const opts = n >= 2 && n <= 9 ? Array.from({ length: n }, (_, i) => String(+(p.min + i * p.step).toFixed(2))) : null;
        const cur = String(+Number(p.value).toFixed(2));
        power = opts
          ? `<div class="field-label" id="sp-${this._uid}-${z.index}">${esc(this._t("stove_power"))}</div><div class="segments levels" role="group" aria-labelledby="sp-${this._uid}-${z.index}">${opts
              .map((o) => {
                const on = o === cur;
                return `<button class="seg${on ? " on" : ""}" data-action="stove_power" data-value="${esc(o)}" data-entity="${esc(p.id)}" data-zone="${z.index}" aria-pressed="${on}" aria-label="${esc(`${this._t("stove_power")} ${o}`)}"><span class="sl">${esc(o)}</span></button>`;
              })
              .join("")}</div>`
          : `<div class="line">${svgIcon("flash")}<span>${esc(`${this._t("stove_power")} ${fmtNum(this._locale(), p.value)}`)}</span></div>`;
      } else if (p?.value != null) power = `<div class="line">${svgIcon("flash")}<span>${esc(`${this._t("stove_power")} ${fmtNum(this._locale(), p.value)}`)}</span></div>`;
      const pel = this._bar("pellets", z.ent.pellets, "pellets", this._t("pellets"), sv.pellets, sv.pelletsLow);
      const tiles = [
        ...this._boilerTiles(m),
        this._tile("thermometer", this._t("flue_gas"), sv.flue, z.ent.flue_gas),
        this._tile("fan", this._t("stove_fan"), sv.fan, z.ent.stove_fan),
        this._tile("pellets", this._t("pellets"), sv.pelletsText, z.ent.pellets),
        this._tile("fire", this._t("ignitions"), sv.ignitions != null ? fmtNum(this._locale(), sv.ignitions, 0) : null, z.ent.ignitions),
      ].join("");
      body = `${phases}${power}${pel}${tiles ? `<div class="stiles">${tiles}</div>` : ""}`;
    }
    // A pellet boiler burns as a stove does: the same section, titled as a boiler, with its water readings.
    const boiler = !!m.boiler;
    return `<div class="section stove" style="--hc-color:${m.color}">${this._sectionTitle("stove", boiler ? "boiler" : "stove", this._t(boiler ? "sec_boiler" : "sec_stove"))}${body}</div>`;
  }

  // A level as a bar (a stove's pellets, an oil tank's fuel), in the warning color when low; "" without a level.
  _bar(cls, ent, icon, label, pct, low) {
    if (pct == null) return "";
    return `<div class="pellets ${cls}${low ? " low" : ""}" data-entity="${esc(ent || "")}" role="button" tabindex="0"><div class="pl"><span>${svgIcon(icon)}${esc(label)}</span><span>${esc(fmtNum(this._locale(), pct, 0))} %</span></div><div class="ptrack"><i style="width:${pct}%"></i></div></div>`;
  }

  // A reading as a tile, opening its entity; "" without a value.
  _tile(icon, label, value, ent) {
    return value == null || value === "" ? "" : `<div class="stile"${ent ? ` data-entity="${esc(ent)}" role="button" tabindex="0"` : ""}><span class="sl">${svgIcon(icon)}${esc(label)}</span><span class="sv">${esc(value)}</span></div>`;
  }

  // A boiler's water readings as tiles: flow, return, the burner's modulation and the pressure.
  _boilerTiles(m) {
    const b = m.boiler;
    if (!b) return [];
    const e = m.z.ent;
    return [
      this._tile("thermometer", this._t("flow_temp"), b.flow, e.flow_temp),
      this._tile("thermometer", this._t("return_temp"), b.ret, e.return_temp),
      this._tile("fire", this._t("modulation"), b.modulation, e.modulation || e.burner),
      this._tile("gauge", this._t("pressure"), b.pressure, e.pressure),
    ];
  }

  // A gas or oil boiler: its fuel tank as a bar, its water readings as tiles, its tank's level when not a %.
  _boilerSection(m) {
    const z = m.z;
    const b = m.boiler;
    const closed = this._isCollapsed("boiler");
    let body = "";
    if (!closed) {
      const tiles = [...this._boilerTiles(m), this._tile("fuel", this._t("fuel"), b.fuelText, z.ent.fuel)].join("");
      body = `${this._bar("fuel", z.ent.fuel, "fuel", this._t("fuel"), b.fuel, b.fuelLow)}${tiles ? `<div class="stiles">${tiles}</div>` : ""}`;
    }
    if (!body && !closed) return "";
    return `<div class="section boiler" style="--hc-color:${m.color}">${this._sectionTitle("boiler", "boiler", this._t("sec_boiler"))}${body}</div>`;
  }

  // A schedule's state: on or off, until its next change (*On until 22:00*, a weekday when it is not today).
  _scheduleState(id) {
    const st = this._st(id);
    const loc = this._locale();
    const time = new Intl.DateTimeFormat(loc, { hour: "2-digit", minute: "2-digit" });
    const next = st.attributes.next_event ? new Date(st.attributes.next_event) : null;
    const now = new Date();
    let when = "";
    if (next && !Number.isNaN(next.getTime())) {
      const sameDay = next.toDateString() === now.toDateString();
      when = sameDay ? time.format(next) : `${new Intl.DateTimeFormat(loc, { weekday: "short" }).format(next)} ${time.format(next)}`;
    }
    const on = st.state === "on";
    return { on, text: on ? (when ? this._t("sch_on_until", { time: when }) : this._t("sch_on")) : when ? this._t("sch_off_until", { time: when }) : this._t("sch_off") };
  }

  _scheduleSection(m) {
    const z = m.z;
    const st = this._st(z.schedule);
    const loc = this._locale();
    const now = new Date();
    const { on, text: state } = this._scheduleState(z.schedule);
    const label = `${this._t("schedule")} · ${st.attributes.friendly_name || z.schedule}`;
    const closed = this._isCollapsed("schedule");
    let body = `<div class="sched-state" role="button" tabindex="0" data-entity="${esc(z.schedule)}"><span class="dot ${on ? "on" : "off"}"></span><b>${esc(state)}</b></div>`;
    if (!closed) {
      const entry = SCHEDULES.get(z.schedule);
      if (!entry || (entry.week === undefined && entry.loading)) body += `<div class="muted">${esc(this._t("sch_loading"))}</div>`;
      else if (!entry.week) body += `<div class="muted">${esc(this._t("sch_none"))}</div>`;
      else body += this._week(entry.week, now, loc);
    }
    return `<div class="section">${this._sectionTitle("schedule", "calendar", label)}${body}</div>`;
  }

  // The week as seven rows (Monday first), the time slots on a 24 h track; today's row carries a "now" line.
  _week(week, now, loc) {
    const dayFmt = new Intl.DateTimeFormat(loc, { weekday: "short" });
    const today = (now.getDay() + 6) % 7;
    const minutes = now.getHours() * 60 + now.getMinutes();
    const time = new Intl.DateTimeFormat(loc, { hour: "2-digit", minute: "2-digit" });
    const at = (min) => time.format(new Date(2024, 0, 1, Math.floor(min / 60), min % 60));
    const rows = week
      .map((slots, i) => {
        // 2024-01-01 was a Monday.
        const name = dayFmt.format(new Date(2024, 0, 1 + i));
        const t = i === today ? " today" : "";
        const blocks = slots
          .map(([from, to]) => `<span class="slot" style="left:${((from / 1440) * 100).toFixed(2)}%;width:${(((to - from) / 1440) * 100).toFixed(2)}%" title="${esc(`${at(from)}–${to >= 1440 ? "24:00" : at(to)}`)}"></span>`)
          .join("");
        const nowLine = i === today ? `<span class="now" style="left:${((minutes / 1440) * 100).toFixed(2)}%"></span>` : "";
        const desc = slots.length ? slots.map(([from, to]) => `${at(from)}–${to >= 1440 ? "24:00" : at(to)}`).join(", ") : "—";
        return `<span class="day${t}">${esc(name)}</span><div class="track${t}" role="img" aria-label="${esc(`${name}: ${desc}`)}">${blocks}${nowLine}</div>`;
      })
      .join("");
    return `<div class="week">${rows}<div class="hours" aria-hidden="true"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div></div>`;
  }

  // The thermostat's other switches (child lock, window detection, display…) as option toggles.
  _options(z) {
    const items = z.switches
      .map((id) => {
        const st = this._st(id);
        const info = switchInfo(id);
        const on = st.state === "on";
        const label = info ? this._t(`sw_${info[2]}`) : this._label(id);
        return `<button class="toggle${on ? " on" : ""}" data-action="toggle" data-entity="${esc(id)}" aria-pressed="${on}"${unavailable(st) ? " disabled" : ""}>${svgIcon(info?.[1] || "toggle")}${esc(label)}</button>`;
      })
      .join("");
    return `<div class="section"><div class="section-title">${svgIcon("tune")}<span>${esc(this._t("options"))}</span></div><div class="toggles">${items}</div></div>`;
  }

  // ── Actions ──
  _zoneAt(el) {
    const i = Number(el?.dataset?.zone);
    return this._zonesNow?.[Number.isInteger(i) ? i : this._zone];
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.action || n.dataset.entity));
    if (!el || el.disabled) return;
    ev.stopPropagation();
    const d = el.dataset;
    const z = this._zoneAt(el);
    switch (d.action) {
      case "zoom":
        return this._toggleZoom(ev);
      case "zone":
        return this._selectZone(Number(d.zone), ev);
      case "toggle_section":
        this._toggled = new Map(this._toggled).set(d.section, !this._isCollapsed(d.section));
        return this._refresh();
      case "hvac":
        return this._call("climate", "set_hvac_mode", { entity_id: z.id, hvac_mode: d.value });
      case "power":
        return this._power(z);
      case "attr":
        return;
      case "preset": {
        if (el.tagName === "SELECT") return;
        const st = this._st(z.id);
        // A tap on the selected preset goes back to none (manual) when the entity offers it.
        const back = st.attributes.preset_mode === d.value && (st.attributes.preset_modes || []).includes("none");
        return this._call("climate", "set_preset_mode", { entity_id: z.id, preset_mode: back ? "none" : d.value });
      }
      case "pilot":
        return this._setPilot(z, d.entity, d.value);
      case "stove_power":
        return this._call("number", "set_value", { entity_id: d.entity, value: Number(d.value) });
      case "toggle":
        return this._call("switch", "toggle", { entity_id: d.entity });
      case "temp":
      case "temp_low":
      case "temp_high":
        if (el.tagName === "BUTTON") this._step(z, Number(d.value), d.action === "temp" ? null : d.action.slice(5));
        return;
      default:
        if (d.entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: d.entity }, bubbles: true, composed: true }));
    }
  }

  _onChange(ev) {
    const el = ev.target;
    const d = el?.dataset;
    if (el?.tagName !== "SELECT" || !["preset", "attr"].includes(d.action)) return;
    const z = this._zoneAt(el);
    if (d.action === "preset") this._call("climate", "set_preset_mode", { entity_id: z.id, preset_mode: el.value });
    else this._call("climate", d.service, { entity_id: z.id, [d.attr]: d.attr === "humidity" ? Number(el.value) : el.value });
    el.blur();
  }

  // Enter / Space act as a click on an element with the button role; arrows move a target spin button.
  _onKey(ev) {
    const el = ev.target;
    const role = el?.getAttribute?.("role");
    if (role === "spinbutton") {
      const dirs = { ArrowUp: 1, ArrowRight: 1, PageUp: 4, ArrowDown: -1, ArrowLeft: -1, PageDown: -4, Home: -1000, End: 1000 };
      if (!(ev.key in dirs)) return;
      ev.preventDefault();
      const action = el.dataset.action;
      this._step(this._zoneAt(el), dirs[ev.key], action === "temp" ? null : action.slice(5));
      return;
    }
    if ((ev.key === "Enter" || ev.key === " ") && (role === "button" || role === "tab") && el.tagName !== "BUTTON") {
      ev.preventDefault();
      el.click();
    }
  }

  _selectZone(i) {
    this._zone = i;
    this._refresh();
  }

  // Off, or back on: set_hvac_mode with the mode it had (heat first), which every thermostat takes, unlike turn_on.
  // An entity without an off mode but with the turn off feature is turned off with climate.turn_off.
  _power(z) {
    const st = this._st(z.id);
    const modes = st.attributes.hvac_modes || [];
    if (st.state !== "off") {
      this._lastMode = { ...this._lastMode, [z.id]: st.state };
      if (!modes.includes("off")) return this._call("climate", "turn_off", { entity_id: z.id });
      return this._call("climate", "set_hvac_mode", { entity_id: z.id, hvac_mode: "off" });
    }
    const mode = [this._lastMode?.[z.id], "heat", "auto", "heat_cool"].find((x) => x && modes.includes(x));
    return mode ? this._call("climate", "set_hvac_mode", { entity_id: z.id, hvac_mode: mode }) : this._call("climate", "turn_on", { entity_id: z.id });
  }

  // The service call that sets a pilot wire radiator to an order: [domain, service, data], or null when it has none.
  _pilotCall(z, id, mode) {
    if (id.startsWith("switch.")) return ["switch", (pilotMode(z.switch_on) || "comfort") === mode ? "turn_on" : "turn_off", { entity_id: id }];
    const option = (this._st(id)?.attributes.options || []).find((o) => pilotMode(o) === mode);
    return option == null ? null : ["select", "select_option", { entity_id: id, option }];
  }

  _setPilot(z, id, mode) {
    const call = this._pilotCall(z, id, mode);
    if (call) return this._call(...call);
  }

  // Each tap moves the target by one step at once on screen; the service is called once the taps stop, and the new
  // target stays shown until the entity reports it (TEMP_SETTLE at most, at once if the call is refused). `bound`
  // (low or high) moves that end of a range, which keeps at least one step between the two.
  _step(z, dir, bound) {
    const st = this._st(z?.id);
    if (!st || unavailable(st)) return;
    const a = st.attributes;
    const step = Number(a.target_temp_step) || (this._unit() === "°F" ? 1 : 0.5);
    const min = Number(a.min_temp ?? 7);
    const max = Number(a.max_temp ?? 35);
    const fix = (v) => +v.toFixed(2);
    const next = (cur, lo, hi) => fix(Math.min(hi, Math.max(lo, Math.round((cur + dir * step) / step) * step)));
    let data;
    if (bound) {
      const r = this._range(st);
      if (!r) return;
      data =
        bound === "low"
          ? { target_temp_low: next(r.low, min, Math.min(max, fix(r.high - step))), target_temp_high: r.high }
          : { target_temp_low: r.low, target_temp_high: next(r.high, Math.max(min, fix(r.low + step)), max) };
    } else {
      const cur = this._target(st);
      if (cur == null) return;
      data = { temperature: next(cur, min, max) };
    }
    const pending = { entity: z.id, data, sent: false };
    this._pending = pending;
    clearTimeout(this._settleTimer);
    this._refresh();
    clearTimeout(this._tempTimer);
    this._tempTimer = setTimeout(async () => {
      const ok = await this._call("climate", "set_temperature", { entity_id: pending.entity, ...pending.data });
      // Tapped again meanwhile: that newer target is the one waiting.
      if (this._pending !== pending) return;
      if (!ok) this._pending = null;
      else {
        pending.sent = true;
        this._settleTimer = setTimeout(() => {
          if (this._pending !== pending) return;
          this._pending = null;
          this._refresh();
        }, TEMP_SETTLE);
      }
      this._refresh();
    }, TEMP_DEBOUNCE);
  }

  // A target sent stays on screen until the entity reports it (then the entity's own value takes over).
  _settle() {
    const p = this._pending;
    const st = p?.sent && this._st(p.entity);
    if (!st) return;
    const a = st.attributes;
    const same = (x, y) => x != null && Math.abs(Number(x) - y) < 1e-6;
    const done = p.data.temperature != null ? same(a.temperature, p.data.temperature) : same(a.target_temp_low, p.data.target_temp_low) && same(a.target_temp_high, p.data.target_temp_high);
    if (done) {
      clearTimeout(this._settleTimer);
      this._pending = null;
    }
  }

  _toggleZoom() {}
}

// The mini card: one zone drawn compact (the climate-air thermostat mini card: illustration, temperatures, − / + and
// power), or the overview of every zone, one row each. Its detail button (top right, `zoom: false` removes it)
// switches it to the full card and back; a click on a row unfolds the full card on that zone, and a click anywhere
// else on the page brings the compact view back.
export class HeatingMiniCard extends HeatingCard {
  static getConfigElement() {
    return document.createElement("heating-mini-card-editor");
  }

  constructor() {
    super();
    this._unzoom = watchOutside(
      (ev) => isOutside(this, ev),
      () => {
        if (this._zoomed) this._setZoom(false);
      },
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen (see the full card).
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = !!this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-expanded="${z}">${svgIcon(z ? "collapse" : "expand")}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._refresh();
    // getCardSize()/getGridOptions() changed: the view re-measures the card.
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  // From the keyboard (Enter / Space: no click count), the focus follows to the button that replaced this one.
  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  _selectZone(i) {
    this._zone = i;
    if (!this._zoomed) this._setZoom(true);
    else this._refresh();
  }

  _render(zones) {
    if (this._zoomed || !zones.length) return super._render(zones);
    const models = zones.map((z) => this._model(z));
    const summary = this._summary(models);
    const c = this._config;
    if (zones.length === 1) return this._single(models[0], summary);
    return (
      `${this._styles(summary.color, MINI_STYLE)}<ha-card class="mini">` +
      this._header(c.title || c.name || this._t("title"), summary.sub, summary, this._focus(models)) +
      `<div class="rows">${models.map((m, i) => this._row(m, i)).join("")}</div></ha-card>`
    );
  }

  // The zone the banner of a zone list (mini card, overview) draws: the first one heating, else the first one on,
  // else the first.
  _focus(models) {
    return models.find((m) => m.heating) || models.find((m) => m.on) || models[0];
  }

  _row(m, i) {
    const z = m.z;
    const loc = this._locale();
    const sub = [m.status];
    if (m.presetText && !m.pilot) sub.push(m.presetText);
    const alert = m.chips.find((x) => x.includes("chip warn"));
    const alertText = alert ? alert.match(/title="([^"]*)"/)?.[1] : "";
    const target = this._showTarget(m) ? `<small>→ ${esc(m.range ? this._targetText(m) : `${fmtNum(loc, m.target)}°`)}</small>` : "";
    const temp = m.cur != null ? `<div class="rtemp"><b>${esc(this._temp(m.cur))}</b>${target}</div>` : target ? `<div class="rtemp">${target}</div>` : "";
    const icon = m.heating ? "fire" : m.pilot ? PILOT_ICONS[m.pilot] : m.on ? "radiator" : "radiator_off";
    return (
      `<div class="row" role="button" tabindex="0" data-action="zone" data-zone="${i}" style="--zc:${m.color}" aria-label="${esc(`${z.name}: ${m.status}`)}">` +
      `<div class="rbadge">${svgIcon(icon, m.heating ? "heating" : "")}</div>` +
      `<div class="rtext"><span class="rname">${esc(z.name)}</span><span class="rsub">${esc(sub.join(" · "))}${alertText ? ` · <span class="alert">${alertText}</span>` : ""}</span></div>${temp}</div>`
    );
  }

  // One zone: the climate-air thermostat mini card (illustration, temperature line, preset, alerts, − / + and power).
  _single(m, summary) {
    const z = m.z;
    const c = this._config;
    if (z.missing) return super._render(this._zonesNow);
    const lines = [];
    if (m.cur != null) {
      const target = this._showTarget(m) ? ` → ${this._targetText(m)}` : "";
      lines.push(`<div class="line">${svgIcon("thermometer")}<span><b>${esc(this._temp(m.cur))}</b>${esc(target)}</span></div>`);
    } else lines.push(`<div class="line">${svgIcon(m.pilot ? PILOT_ICONS[m.pilot] : "radiator")}<span><b>${esc(m.status)}</b></span></div>`);
    if (m.presetText) lines.push(this._line(presetIcon(m.preset), m.presetText));
    if (c.show_sensors && m.valve != null) lines.push(this._line("valve", `${this._t("valve")} ${fmtNum(this._locale(), m.valve, 0)} %`));
    // A stove: its power level and the pellets left on one line (its phase is the pill, a low stock an alert chip).
    const sv = m.online ? m.stove : null;
    if (sv) {
      const loc = this._locale();
      const parts = [];
      if (sv.power?.value != null) parts.push(`${this._t("stove_power")} ${fmtNum(loc, sv.power.value)}${sv.power.max ? `/${fmtNum(loc, sv.power.max)}` : ""}`);
      if (sv.pellets != null) parts.push(`${this._t("pellets")} ${fmtNum(loc, sv.pellets, 0)} %`);
      else if (sv.pelletsText) parts.push(`${this._t("pellets")} ${sv.pelletsText}`);
      if (parts.length) lines.push(this._line("pellets", parts.join(" · ")));
    }
    // A boiler: its flow temperature and burner, or the fuel left in its tank (a low pressure or stock is a chip).
    const bo = m.online ? m.boiler : null;
    if (bo) {
      const parts = [];
      if (bo.flow) parts.push(`${this._t("flow_temp")} ${bo.flow}`);
      if (bo.modulation) parts.push(`${this._t("modulation")} ${bo.modulation}`);
      if (bo.fuel != null) parts.push(`${this._t("fuel")} ${fmtNum(this._locale(), bo.fuel, 0)} %`);
      if (parts.length) lines.push(this._line("boiler", parts.join(" · ")));
    }
    const chips = m.chips.filter((x) => x.includes("chip warn") || !m.online);
    const btns = [];
    if (m.online && c.show_controls && z.id) {
      const st = this._st(z.id);
      const a = st.attributes;
      if (!m.range && this._showTarget(m) && (a.supported_features || 0) & CLIMATE_TARGET) {
        for (const [v, icon, key, off] of [
          ["-1", "minus", "temp_down", m.target <= m.min],
          ["1", "plus", "temp_up", m.target >= m.max],
        ])
          btns.push(`<button class="round tint" data-action="temp" data-value="${v}" data-zone="0" title="${esc(this._t(key))}" aria-label="${esc(this._t(key))}"${off ? " disabled" : ""}>${svgIcon(icon)}</button>`);
      }
      if ((a.hvac_modes || []).includes("off") || (a.supported_features || 0) & CLIMATE_TURN_OFF)
        btns.push(`<button class="round power${m.on ? " on" : ""}" data-action="power" data-zone="0" aria-pressed="${m.on}" title="${esc(this._t("power"))}" aria-label="${esc(this._t("power"))}">${svgIcon("power")}</button>`);
    }
    return (
      `${this._styles(m.color, MINI_STYLE)}<ha-card class="mini">` +
      this._header(c.title || c.name || z.name, this._illustrated() ? m.presetText : "", summary, m) +
      `<div class="content">${this._illustrated() ? "" : this._picture(m)}<div class="info">${lines.join("")}${chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}</div>` +
      `${btns.length ? `<div class="mcontrols">${btns.join("")}</div>` : ""}</div></ha-card>`
    );
  }
}
