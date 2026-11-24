// ── Overview card ──────────────────────────────────────────────────────────────────────────────────────────────
// The heating of the whole home at a glance (what the overview of ha-climate-air-card showed of the thermostats, with
// the zones, pilot wire and schedules of this card): a summary (zones heating, average room temperature from the
// coldest to the warmest zone, average target, open windows, low batteries, pilot wire radiators per order), quick
// actions for every zone (comfort, eco, frost protection, away, off) confirmed at the top of the card, and the zones
// floor by floor, one tile each. A tap on a zone unfolds the full card on it (or opens its more-info dialog), the
// detail button at the top right switches to the full card and back, and a click elsewhere brings the overview back.
import { esc, fmtNum, numOf } from "./core.js";
import { svgIcon } from "./icons.js";
import { BOOST, HEAT, IDLE, PILOT_COLORS } from "./colors.js";
import { PILOT_ICONS, PILOT_ORDER, presetKey } from "./presets-pilot-wire.js";
import { BATTERY_LOW, CLIMATE_PRESET, CLIMATE_TURN_OFF } from "./feature-flags-timings.js";
import { areaIdOf, areaSensor, deviceName, nameOf, zonesOf } from "./discovery.js";
import { art, variantOf } from "./illustrations.js";
import { OVERVIEW_STYLE } from "./styles.js";
import { HeatingCard, HeatingMiniCard, isOutside, watchOutside } from "./cards.js";

export const OV_ORDERS = ["comfort", "eco", "frost", "away", "off"];
export const OV_DEFAULT_ACTIONS = ["comfort", "eco", "frost", "away"];
export const OV_ICONS = { comfort: "comfort", eco: "eco", frost: "frost", away: "away", off: "power" };
export const OV_COLORS = { ...PILOT_COLORS, away: "var(--purple-color, #926bc7)" };
// The presets a thermostat takes for each quick action, the first it offers wins ("none" is manual: back to its own
// target), and the orders a pilot wire radiator takes.
export const OV_PRESETS = { comfort: ["comfort", "home", "none"], eco: ["eco"], frost: ["frost", "away"], away: ["away", "frost", "eco"] };
export const OV_PILOT = { comfort: ["comfort"], eco: ["eco"], frost: ["frost"], away: ["frost", "eco"], off: ["off"] };
// Sorts of the zones within a floor; `area` keeps the order of the area registry.
export const OV_RANK = (m, alerts) => (alerts ? 0 : m.heating ? 1 : m.on ? 2 : m.online ? 3 : 4);
export const OV_SORTS = ["area", "name", "temperature", "state"];
export const OV_DETAILS = ["card", "more-info", "none"];
// After the confirmation closes, clicks on the card are ignored for this long: the second click of a double click on
// Confirm would otherwise land on the tile under it.
export const CONFIRM_GUARD = 400;
export const listOf = (v) => [].concat(v ?? []).filter((x) => x != null && x !== "");

export class HeatingOverviewCard extends HeatingMiniCard {
  static getConfigElement() {
    return document.createElement("heating-overview-card-editor");
  }

  constructor() {
    super();
    // A tap elsewhere on the page closes the confirmation (as Cancel); Escape too.
    this._dismiss = watchOutside(
      (ev) => isOutside(this, ev),
      () => {
        if (this._confirm) this._closeConfirm();
      },
    );
    this._onEscape = (ev) => {
      if (ev.key !== "Escape" || !this._confirm) return;
      ev.stopPropagation();
      this._closeConfirm();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._dismiss.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._dismiss.off();
    window.removeEventListener?.("keydown", this._onEscape);
    // Left with the confirmation open: closed, as Cancel.
    this._confirm = null;
  }

  getCardSize() {
    if (this._zoomed) return super.getCardSize();
    const n = this._zonesNow?.length || 1;
    return 2 + (this._config?.show_summary === false ? 0 : 2) + Math.ceil(n / 2) * (this._config?.compact ? 1 : 2);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  // ── Zones: found (or `zones`), less `exclude`, plus `include`, kept by area and floor ──
  _zones() {
    const h = this._hass;
    const c = this._config;
    const ex = new Set(listOf(c.exclude));
    const floorOf = (area) => h.areas?.[area]?.floor_id ?? null;
    let zones = zonesOf(h, c).map((z) => ({ ...z, area: z.area || areaIdOf(h, z.entity || z.pilot_wire[0]) }));
    if (ex.size) {
      zones = zones
        .map((z) => {
          const out = { ...z, pilot_wire: z.pilot_wire.filter((p) => !ex.has(p)) };
          // A zone whose thermostat is left out keeps its pilot wire radiators, with the area's room sensors.
          if (ex.has(z.entity)) {
            delete out.entity;
            if (z.area) {
              out.temperature ??= areaSensor(h, z.area, "temperature");
              out.humidity ??= areaSensor(h, z.area, "humidity");
            }
          }
          return out;
        })
        .filter((z) => z.entity || z.pilot_wire.length);
    }
    for (const id of listOf(c.include)) {
      if (!h.states[id] || ex.has(id) || zones.some((z) => z.entity === id || z.pilot_wire.includes(id))) continue;
      const area = areaIdOf(h, id);
      const home = area && zones.find((z) => z.area === area);
      if (/^(select|switch)\./.test(id)) {
        if (home) home.pilot_wire = [...home.pilot_wire, id];
        else zones.push({ pilot_wire: [id], area, name: h.areas?.[area]?.name || nameOf(h, id), temperature: area ? areaSensor(h, area, "temperature") : undefined });
      } else if (home && !home.entity) home.entity = id;
      else zones.push({ entity: id, pilot_wire: [], area, ...(home ? { name: nameOf(h, id) } : {}) });
    }
    const areas = listOf(c.areas);
    const floors = listOf(c.floors);
    const exAreas = listOf(c.exclude_areas);
    const exFloors = listOf(c.exclude_floors);
    return zones
      .filter((z) => (!areas.length || areas.includes(z.area)) && !exAreas.includes(z.area))
      .filter((z) => (!floors.length || floors.includes(floorOf(z.area))) && !exFloors.includes(floorOf(z.area)))
      .map((z, i) => this._resolve(z, i));
  }

  // What needs a look in a zone: an open window, a low battery, a device offline ([icon, text, entity, kind]).
  _alertsOf(m) {
    if (this._config.show_alerts === false) return [];
    const e = m.z.ent;
    const out = [];
    if (this._st(e.window)?.state === "on") out.push(["window", this._t("window_open"), e.window, "window"]);
    const battery = numOf(this._st(e.battery));
    if (battery != null && battery <= BATTERY_LOW) out.push(["battery_low", `${this._t("battery_low")} · ${fmtNum(this._locale(), battery, 0)} %`, e.battery, "battery"]);
    if (!m.online) out.push(["offline", this._t("offline"), m.z.id || m.z.pilots[0], "offline"]);
    return out;
  }

  // What a quick action does: the service calls for every zone that takes it (its thermostat's preset, or off; the
  // order of each pilot wire radiator), the zones already there, and the zones it cannot reach (a thermostat turned
  // off or offline, without such a preset).
  _plan(order, models) {
    const zones = [];
    const skipped = [];
    for (const m of models) {
      const z = m.z;
      const calls = [];
      let there = false;
      if (z.id && m.online) {
        const a = this._st(z.id).attributes;
        const f = a.supported_features || 0;
        if (order === "off") {
          if (!m.on) there = true;
          else if ((a.hvac_modes || []).includes("off")) calls.push(["climate", "set_hvac_mode", { entity_id: z.id, hvac_mode: "off" }]);
          else if (f & CLIMATE_TURN_OFF) calls.push(["climate", "turn_off", { entity_id: z.id }]);
        } else if (m.on && f & CLIMATE_PRESET) {
          const presets = a.preset_modes || [];
          const preset = OV_PRESETS[order].map((k) => presets.find((p) => (k === "none" ? p === "none" : presetKey(p) === k))).find((p) => p != null);
          if (preset != null && preset === a.preset_mode) there = true;
          else if (preset != null) calls.push(["climate", "set_preset_mode", { entity_id: z.id, preset_mode: preset }]);
        }
      }
      for (const id of z.pilots) {
        const cur = this._pilotState(z, id);
        const want = cur && OV_PILOT[order].find((o) => this._pilotOptions(z, id).includes(o));
        if (!want) continue;
        if (want === cur) there = true;
        else {
          const call = this._pilotCall(z, id, want);
          if (call) calls.push(call);
        }
      }
      if (calls.length || there) zones.push({ m, calls });
      else skipped.push(m);
    }
    return { zones, skipped, calls: zones.flatMap((x) => x.calls) };
  }

  // ── Render ──
  _render(zones) {
    if (this._zoomed || !zones.length) return HeatingCard.prototype._render.call(this, zones);
    const c = this._config;
    const models = zones.map((z) => this._model(z));
    for (const m of models) m.alerts = this._alertsOf(m);
    const summary = this._summary(models);
    const parts = [this._header(c.title || c.name || this._t("title"), summary.sub, summary, this._focus(models))];
    if (c.show_summary !== false) parts.push(this._stats(models));
    if (c.show_actions !== false) parts.push(this._actions(models));
    parts.push(this._groups(models));
    const confirm = this._confirm ? this._confirmHtml(models) : "";
    return `${this._styles(summary.color, OVERVIEW_STYLE)}<ha-card class="overview${confirm ? " dialog-open" : ""}">${parts.join("")}${confirm}</ha-card>`;
  }

  _stat(icon, color, label, value, sub, cls = "", title = "") {
    return (
      `<div class="stat${cls ? ` ${cls}` : ""}" style="--sc:${color}"${title ? ` title="${esc(title)}"` : ""}><div class="si">${svgIcon(icon)}</div>` +
      `<div class="sv"><small>${esc(label)}</small><b>${esc(value)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div></div>`
    );
  }

  _count(icon, text, n, cls, attrs = "") {
    return `<span class="chip ${cls}"${attrs}>${svgIcon(icon)}<span>${esc(text)}</span><b>${n}</b></span>`;
  }

  _stats(models) {
    const loc = this._locale();
    const c = this._config;
    const heating = models.filter((m) => m.heating);
    const boost = heating.some((m) => m.boost);
    const stats = [
      this._stat("fire", heating.length ? (boost ? BOOST : HEAT) : IDLE, this._t("st_heating"), `${heating.length}/${models.length}`, heating.map((m) => m.z.name).join(", "), heating.length ? `heating${boost ? " boost" : ""}` : ""),
    ];
    const temps = models.filter((m) => m.cur != null);
    if (temps.length) {
      const avg = temps.reduce((s, m) => s + m.cur, 0) / temps.length;
      const lo = temps.reduce((a, b) => (b.cur < a.cur ? b : a));
      const hi = temps.reduce((a, b) => (b.cur > a.cur ? b : a));
      const many = temps.length > 1;
      const range = many ? `${fmtNum(loc, lo.cur)}–${fmtNum(loc, hi.cur)}°` : "";
      const title = many ? `${this._t("ov_coldest", { name: `${lo.z.name} (${this._temp(lo.cur)})` })} · ${this._t("ov_warmest", { name: `${hi.z.name} (${this._temp(hi.cur)})` })}` : "";
      stats.push(this._stat("thermometer", "var(--primary-color, #03a9f4)", this._t("ov_average"), this._temp(avg), range, "", title));
    }
    const targets = models.filter((m) => m.on && m.target != null);
    if (targets.length) {
      const avg = targets.reduce((s, m) => s + m.target, 0) / targets.length;
      const lo = Math.min(...targets.map((m) => m.target));
      const hi = Math.max(...targets.map((m) => m.target));
      stats.push(this._stat("target", HEAT, this._t("target"), this._temp(avg), lo !== hi ? `${fmtNum(loc, lo)}–${fmtNum(loc, hi)}°` : ""));
    }
    // Counts: open windows, low batteries, devices offline, then the pilot wire radiators per order.
    const counts = [];
    for (const [kind, icon, key] of [
      ["window", "window", "window_open"],
      ["battery", "battery_low", "battery_low"],
      ["offline", "offline", "offline"],
    ]) {
      const hits = models.filter((m) => m.alerts.some((a) => a[3] === kind));
      if (!hits.length) continue;
      const one = hits.length === 1 ? hits[0].alerts.find((a) => a[3] === kind)[2] : "";
      const names = hits.map((m) => m.z.name).join(", ");
      const attrs = ` title="${esc(`${this._t(key)}: ${names}`)}"${one ? ` data-entity="${esc(one)}" role="button" tabindex="0"` : ""}`;
      counts.push(this._count(icon, this._t(key), hits.length, kind === "offline" ? "" : "warn", attrs));
    }
    if (c.show_pilot_wire !== false) {
      const per = new Map();
      for (const m of models) for (const id of m.z.pilots) {
        const mode = this._pilotState(m.z, id);
        if (mode) per.set(mode, (per.get(mode) || 0) + 1);
      }
      for (const mode of PILOT_ORDER.filter((o) => per.has(o))) {
        const n = per.get(mode);
        counts.push(this._count(PILOT_ICONS[mode], this._t(`p_${mode}`), n, "pw", ` style="--pc:${PILOT_COLORS[mode]}" title="${esc(`${this._t("pilot_wire")} · ${this._t(`p_${mode}`)}: ${n}`)}"`));
      }
    }
    return `<div class="stats">${stats.join("")}</div>${counts.length ? `<div class="counts">${counts.join("")}</div>` : ""}`;
  }

  _actions(models) {
    const orders = listOf(this._config.actions ?? OV_DEFAULT_ACTIONS).filter((o) => OV_ORDERS.includes(o));
    if (!orders.length) return "";
    const label = this._t("ov_actions");
    const buttons = orders.map((o) => {
      const plan = this._plan(o, models);
      // Every zone it reaches already there: shown as the home's current order.
      const done = plan.zones.length > 0 && !plan.calls.length;
      const text = this._t(`p_${o}`);
      return `<button class="act${done ? " on" : ""}" data-action="order" data-value="${o}" style="--ac:${OV_COLORS[o]}" title="${esc(`${label} · ${text}`)}" aria-pressed="${done}"${plan.calls.length ? "" : " disabled"}>${svgIcon(OV_ICONS[o])}<span class="al2">${esc(text)}</span></button>`;
    });
    return `<div class="actions" role="group" aria-label="${esc(label)}"><span class="al">${esc(label)}</span>${buttons.join("")}</div>`;
  }

  // The zones by floor (in the floor registry's level order, the areas without floor last), or all together.
  _groups(models) {
    const c = this._config;
    const h = this._hass;
    const sort = OV_SORTS.includes(c.sort) ? c.sort : "area";
    const sorted = models.map((m, i) => ({ m, i }));
    if (sort === "name") sorted.sort((a, b) => a.m.z.name.localeCompare(b.m.z.name, this._locale()));
    else if (sort === "temperature") sorted.sort((a, b) => (a.m.cur ?? Number.POSITIVE_INFINITY) - (b.m.cur ?? Number.POSITIVE_INFINITY));
    else if (sort === "state") sorted.sort((a, b) => OV_RANK(a.m, a.m.alerts.length) - OV_RANK(b.m, b.m.alerts.length));
    const floors = h.floors || {};
    const floorOf = (m) => {
      const f = h.areas?.[m.z.area]?.floor_id;
      return f && floors[f] ? f : null;
    };
    const byFloor = c.group_by !== "none" && sorted.some((x) => floorOf(x.m));
    let groups = [[null, sorted]];
    if (byFloor) {
      const ids = [...new Set(sorted.map((x) => floorOf(x.m)))];
      const level = (f) => (f == null ? Number.POSITIVE_INFINITY : Number(floors[f].level ?? 0));
      ids.sort((a, b) => level(a) - level(b) || String(floors[a]?.name ?? "").localeCompare(String(floors[b]?.name ?? "")));
      groups = ids.map((f) => [f, sorted.filter((x) => floorOf(x.m) === f)]);
    }
    const cols = Number(c.columns) > 0 ? Math.min(6, Math.round(Number(c.columns))) : 0;
    const tilesCls = ["tiles", c.compact ? "compact" : "", cols ? "fixed" : ""].filter(Boolean).join(" ");
    const html = groups
      .map(([f, items]) => {
        const title = byFloor ? this._groupTitle(f == null ? this._t("ov_other") : floors[f].name, items.map((x) => x.m)) : "";
        return `<div class="group">${title}<div class="${tilesCls}"${cols ? ` style="--cols:${cols}"` : ""}>${items.map((x) => this._tile(x.m, x.i)).join("")}</div></div>`;
      })
      .join("");
    return `<div class="groups">${html}</div>`;
  }

  // A floor's heading: its name, then how many of its zones heat and its average room temperature.
  _groupTitle(name, models) {
    const temps = models.filter((m) => m.cur != null);
    const heating = models.filter((m) => m.heating).length;
    const avg = temps.length ? this._temp(temps.reduce((s, m) => s + m.cur, 0) / temps.length) : "";
    const meta = [heating ? `${svgIcon("fire")}<span>${heating}</span>` : "", avg ? `<span>${esc(avg)}</span>` : ""].filter(Boolean).join(" · ");
    return `<div class="gtitle">${svgIcon("home")}<span>${esc(name)}</span>${meta ? `<span class="gmeta" style="--gc:${HEAT}">${meta}</span>` : ""}</div>`;
  }

  _tile(m, i) {
    const z = m.z;
    const c = this._config;
    const loc = this._locale();
    const comfort = !!m.pilotHeat;
    const cls = [
      "tile",
      m.on ? "on" : "",
      m.heating ? "heating" : "",
      m.heating || comfort ? "active" : "",
      m.heating && m.boost ? "boost" : "",
      m.pilot ? `pw-${m.pilot}` : "",
      m.online ? "" : "na",
      m.alerts.length ? "alert" : "",
    ].filter(Boolean);
    const icon = m.heating ? "fire" : m.pilot ? PILOT_ICONS[m.pilot] : m.on ? "radiator" : "radiator_off";
    const temp = m.cur != null ? `<b>${esc(this._temp(m.cur))}</b>` : "";
    const target = this._showTarget(m) ? `<small>→ ${esc(m.range ? this._targetText(m) : `${fmtNum(loc, m.target)}°`)}</small>` : "";
    const status = [m.status, m.presetText && !m.pilot ? m.presetText : ""].filter(Boolean).join(" · ");
    const more = m.alerts.map(([ic, text, entity]) => this._chip(ic, text, "warn", entity));
    // The pilot wire radiators of a zone, each in the color of its order (a zone's only radiator already sets its state).
    if (c.show_pilot_wire !== false && z.pilots.length && (z.id || z.pilots.length > 1)) {
      const icons = z.pilots.map((id) => {
        const mode = this._pilotState(z, id);
        const watts = this._pilotPower(z, id);
        const text = `${deviceName(this._hass, id) || this._label(id)}: ${mode ? this._t(`p_${mode}`) : this._t("st_unavailable")}${watts ? ` · ${watts}` : ""}`;
        return `<span style="--pc:${mode ? PILOT_COLORS[mode] : IDLE}" title="${esc(text)}">${svgIcon(mode ? PILOT_ICONS[mode] : "radiator_off")}</span>`;
      });
      more.push(`<span class="tline">${svgIcon("pilot")}<span class="pws">${icons.join("")}</span></span>`);
    }
    if (c.show_schedule !== false && z.schedule) {
      const s = this._scheduleState(z.schedule);
      more.push(`<span class="tline" title="${esc(`${this._t("schedule")} · ${s.text}`)}">${svgIcon("calendar")}<span>${esc(s.text)}</span></span>`);
    }
    const heat = cls.includes("active") ? '<svg class="heat" viewBox="0 0 30 44" aria-hidden="true"><path d="M6 40q-2.5-3 0-6t0-6"/><path d="M15 40q-2.5-3 0-6t0-6"/><path d="M24 40q-2.5-3 0-6t0-6"/></svg>' : "";
    const open = c.detail !== "none";
    const label = `${z.name}: ${[m.cur != null ? this._temp(m.cur) : "", status, ...m.alerts.map((a) => a[1])].filter(Boolean).join(", ")}`;
    return (
      `<div class="${cls.join(" ")}" style="--zc:${m.color}"${open ? ` role="button" tabindex="0" data-action="open" data-zone="${i}"` : ""} aria-label="${esc(label)}">${heat}` +
      `${this._tileLook(m, icon)}${c.compact && m.alerts.length ? '<span class="adot"></span>' : ""}</div>` +
      `<div class="tname">${esc(z.name)}</div><div class="ttemp">${temp}${target}</div><div class="tsub">${esc(status)}</div>` +
      `<div class="tmore">${more.join("")}</div></div>`
    );
  }

  // The zone's own device drawn small (wall thermostat, radiator or valve, with its animations), as the tiles of the
  // climate-air overview; a zone with its own `icon`, or not found, keeps the round state icon.
  _tileLook(m, icon) {
    const z = m.z;
    if (z.icon || z.missing || !(z.id || z.pilots.length)) return `<div class="tbadge">${z.icon ? `<ha-icon icon="${esc(z.icon)}"></ha-icon>` : svgIcon(icon)}`;
    const cls = ["picture", m.on ? "running" : "", m.heating ? "active" : "", m.boost ? "boost" : "", m.pilot ? `pw-${m.pilot}` : ""];
    if (m.pilotHeat) cls.push("active");
    const variant = variantOf(this._hass, z.id, z.illustration);
    return `<div class="tbadge tpic"><div class="${cls.filter(Boolean).join(" ")}" style="--hc-color:${m.color}">${art(variant, m, `${this._uid}-t${z.index}`)}</div>`;
  }

  _confirmHtml(models) {
    const o = this._confirm.order;
    const plan = this._plan(o, models);
    const text = this._t(`p_${o}`);
    const names = plan.zones.map((x) => x.m.z.name).join(", ");
    const skipped = plan.skipped.map((m) => m.z.name).join(", ");
    return (
      `<div class="backdrop" data-action="confirm_backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="hc-ov-${this._uid}" style="--ac:${OV_COLORS[o]}">` +
      `<div class="msg" id="hc-ov-${this._uid}">${svgIcon(OV_ICONS[o])}<span>${esc(this._t("ov_confirm", { mode: text }))}</span></div>` +
      `<div class="mzones">${esc(names)}</div>${skipped ? `<div class="mskip">${esc(this._t("ov_skipped", { list: skipped }))}</div>` : ""}` +
      `<div class="modal-actions"><button class="btn" data-action="confirm_cancel">${esc(this._t("ov_cancel"))}</button>` +
      `<button class="btn primary" data-action="confirm_ok">${svgIcon(OV_ICONS[o])}<span>${esc(this._t("ov_apply"))}</span></button></div></div></div>`
    );
  }

  // ── Actions ──
  _onClick(ev) {
    const path = ev.composedPath();
    const el = path.find((n) => n.dataset && (n.dataset.action || n.dataset.entity));
    if (!this._confirm && Date.now() - (this._confirmClosed || 0) < CONFIRM_GUARD) return ev.stopPropagation();
    if (this._confirm) {
      ev.stopPropagation();
      const action = el?.dataset.action;
      if (action === "confirm_ok") this._applyOrder(this._confirm.order);
      if (action === "confirm_ok" || action === "confirm_cancel" || (action === "confirm_backdrop" && path[0] === el)) this._closeConfirm();
      return;
    }
    if (el?.dataset.action === "order" && !el.disabled) {
      ev.stopPropagation();
      return this._openConfirm(el.dataset.value, ev.detail === 0);
    }
    if (el?.dataset.action === "open") {
      ev.stopPropagation();
      const z = this._zonesNow?.[Number(el.dataset.zone)];
      if (!z) return;
      if (this._config.detail === "more-info") {
        const id = z.id || z.pilots[0] || z.ent.indoor_temp;
        if (id) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
        return;
      }
      return this._selectZone(Number(el.dataset.zone));
    }
    return super._onClick(ev);
  }

  // Opened from the keyboard (Enter / Space: no click count), the focus goes to Confirm.
  _openConfirm(order, keyboard) {
    this._confirm = { order };
    window.addEventListener?.("keydown", this._onEscape);
    this._refresh();
    if (keyboard) this.shadowRoot.querySelector('.modal [data-action="confirm_ok"]')?.focus({ preventScroll: true });
  }

  _closeConfirm() {
    this._confirm = null;
    this._confirmClosed = Date.now();
    window.removeEventListener?.("keydown", this._onEscape);
    this._refresh();
  }

  // Sends the calls of a quick action, with the states of the moment.
  _applyOrder(order) {
    const models = (this._zonesNow || []).map((z) => this._model(z));
    for (const call of this._plan(order, models).calls) this._call(...call);
  }
}
