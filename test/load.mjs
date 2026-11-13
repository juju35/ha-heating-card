// Evaluates src/heating-card.js (a classic script, bundled as is by scripts/build.mjs) in a sandbox with minimal DOM
// stand-ins and returns the names the tests need. No dependency, no browser.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../src/heating-card.js", import.meta.url), "utf8");

// Shadow root stand-in: keeps the HTML it is given and the listeners it gets.
const fakeRoot = () => ({
  innerHTML: "",
  listeners: {},
  activeElement: null,
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
});

export const load = () => {
  const registry = new Map();
  class HTMLElement {
    attachShadow() {
      this.shadowRoot = fakeRoot();
      return this.shadowRoot;
    }
    dispatchEvent(ev) {
      (this.events ||= []).push(ev);
    }
    toggleAttribute(name, on) {
      (this.attrs ||= {})[name] = on;
    }
    appendChild(child) {
      (this.children ||= []).push(child);
    }
  }
  class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const sandbox = {
    HTMLElement,
    CustomEvent,
    Intl,
    Date,
    console: { info() {}, warn() {} },
    customElements: { get: (t) => registry.get(t), define: (t, c) => registry.set(t, c) },
    document: {
      createElement: (t) => (registry.has(t) ? new (registry.get(t))() : { tagName: String(t).toUpperCase(), addEventListener() {} }),
      addEventListener() {},
      removeEventListener() {},
    },
    setTimeout,
    clearTimeout,
    addEventListener() {},
    removeEventListener() {},
    setInterval: () => 0,
    clearInterval() {},
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return vm.runInContext(
    `${source}
    ({ STRINGS, ICONS, pilotMode, presetKey, presetIcon, isThermostat, isPilotSelect, discoverZones, zonesOf, weekOf, fetchWeek, guessVariant, lang, intlLocale,
       HeatingCard: customElements.get("heating-card"), HeatingMiniCard: customElements.get("heating-mini-card"),
       HeatingCardEditor: customElements.get("heating-card-editor"), HeatingMiniCardEditor: customElements.get("heating-mini-card-editor"),
       HeatingOverviewCard: customElements.get("heating-overview-card"), HeatingOverviewCardEditor: customElements.get("heating-overview-card-editor"), window, SCHEDULES })`,
    sandbox,
  );
};
