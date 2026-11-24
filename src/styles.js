// ── Styles ─────────────────────────────────────────────────────────────────────────────────────────────────────
// The look of ha-climate-air-card (header badge, pill, segments, steppers, chips), on --hc-color.
import { IDLE } from "./colors.js";

export const ART_STYLE = `
  .picture { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 76px; height: 88px; }
  .picture svg { width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 3px 6px rgba(0,0,0,.18)); }
  :is(.picture, .bdev) .disp { font: 600 5.6px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--hc-color); }
  :is(.picture, .bdev) .disp.big { font-size: 8.4px; }
  :is(.picture, .bdev) .arc { stroke: var(--hc-color); transition: stroke .4s; }
  :is(.picture, .bdev) .led { fill: #9aa5b1; }
  :is(.picture, .bdev) .c-stop { stop-color: var(--hc-color); }
  :is(.picture, .bdev) .floor, :is(.picture, .bdev) .halo, :is(.picture, .bdev) .glow { opacity: 0; transition: opacity .6s; }
  :is(.picture, .bdev) .flame { fill: var(--hc-color); opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; }
  :is(.picture, .bdev) .heat { fill: none; stroke: var(--hc-color); stroke-width: 1.4; stroke-linecap: round; }
  :is(.picture, .bdev) .heat path { opacity: 0; transform-box: view-box; }
  :is(.picture, .bdev).running .led { fill: var(--hc-color); }
  :is(.picture, .bdev).running .floor { opacity: .45; }
  :is(.picture, .bdev).running.active .floor, :is(.picture, .bdev).running.active .halo { opacity: 1; }
  :is(.picture, .bdev).running.active .led { animation: hc-blink 2s ease-in-out infinite; }
  :is(.picture, .bdev).running.active .glow { opacity: 1; animation: hc-glow 3.2s ease-in-out infinite; }
  :is(.picture, .bdev).running.active .flame { opacity: 1; animation: hc-flame 1.3s ease-in-out infinite; }
  :is(.picture, .bdev).running.active .heat path { animation: hc-rise 2.8s ease-in-out infinite; }
  /* A heated floor's heat stays seen even on a still picture (screenshots), then rises with the animation. */
  :is(.picture, .bdev).running.active .heat.floorheat path { opacity: .7; stroke-width: 1.8; }
  :is(.picture, .bdev).running.active .heat.floorheat path:nth-child(2) { animation-delay: 1.4s; }
  :is(.picture, .bdev).running.active .heat path:nth-child(2) { animation-delay: .9s; }
  :is(.picture, .bdev).running.active .flame.f2 { animation-delay: .45s; animation-duration: 1.05s; }
  /* A gas burner's flame is blue; a heated floor's loop takes the zone's color, a towel stays a warm orange towel. */
  :is(.picture, .bdev) .flame.gas { fill: #4dabf7; }
  :is(.picture, .bdev) .pipe { stroke: var(--hc-color); }
  :is(.picture, .bdev) .towel { fill: #ff922b; }
  :is(.picture, .bdev) .towel.fold { fill: #e8590c; }
  :is(.picture, .bdev) .towel.stripe { fill: none; stroke: #fff; stroke-width: .8; opacity: .4; }
  /* A stove on but not burning (standby, cooling down): its embers still glow a little. */
  :is(.picture, .bdev).running:not(.active) .ember { opacity: .35; }
  :is(.picture, .bdev).running.active .heat path:nth-child(3) { animation-delay: 1.8s; }
  /* Boost: the flame and the heat go twice as fast. */
  :is(.picture, .bdev).boost.active .flame { animation-duration: .65s; }
  :is(.picture, .bdev).boost.active .heat path { animation-duration: 1.4s; }
  :is(.picture, .bdev).boost.active .heat path:nth-child(2) { animation-delay: .45s; }
  :is(.picture, .bdev).boost.active .heat path:nth-child(3) { animation-delay: .9s; }
  /* A pilot wire radiator on eco breathes slowly, on frost protection it barely glows. */
  :is(.picture, .bdev).pw-eco .glow { opacity: .7; animation: hc-breathe-glow 4s ease-in-out infinite; }
  :is(.picture, .bdev).pw-frost .glow { opacity: .35; }
  .iconart { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center;
             background: color-mix(in srgb, var(--hc-color) 15%, transparent); color: var(--hc-color); }
  .iconart ha-icon { --mdc-icon-size: 32px; }
  .running.active .iconart ha-icon { animation: hc-breathe 2.4s ease-in-out infinite; }
  @keyframes hc-glow { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
  @keyframes hc-breathe-glow { 0%, 100% { opacity: .35; } 50% { opacity: .8; } }
  @keyframes hc-flame { 0%, 100% { transform: scale(1, 1); } 30% { transform: scale(.9, 1.12); } 60% { transform: scale(1.06, .92); } }
  @keyframes hc-blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
  @keyframes hc-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(.9); } }
  @keyframes hc-rise { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-16px); } }
  @keyframes hc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
`;

export const BASE_STYLE = `${ART_STYLE}
  :host { --hc-ok: var(--success-color, #43a047); --hc-warn: var(--warning-color, #ffa600); --hc-crit: var(--error-color, #db4437);
          /* Text in a state color is mixed with the text color, to read at 4.5:1 at least. */
          --hc-text: color-mix(in srgb, var(--hc-color) 60%, var(--primary-text-color)); }
  /* ha-card is a size container, so its content gives it no width: the empty, zero-height grid before it stands in
     for the content, a natural width without a minimum (see ha-vacuum-card). */
  :host { display: block; height: 100%; min-width: 0; --hc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--hc-natural-width)); height: 0; }
  ha-card { height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; container: hc-card / inline-size; overflow: hidden; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }
  .header { display: flex; align-items: center; gap: 10px; margin-bottom: -2px; }
  .badge { position: relative; flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
           background: color-mix(in srgb, var(--hc-color) 16%, transparent); color: var(--hc-color); transition: background .4s, color .4s; }
  .badge .icon { width: 24px; height: 24px; }
  /* While a zone heats, the header icon's heat waves rise. */
  .badge.heating .icon { animation: hc-badge 1.6s ease-in-out infinite; }
  @keyframes hc-badge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
  .titles { flex: 1 1 0; min-width: 5ch; font-size: 16px; align-self: flex-start; padding-top: 1px; }
  /* Without a subtitle, the title, its pill and the detail button are centered on the badge. */
  .header:not(:has(.sub)) :is(.titles, .st, .zoom) { align-self: center; margin-top: 0; padding-top: 0; }
  :host([hide-title]) .titles > .name, :host([hide-subtitle]) .titles > .sub { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  /* The status pill right after the title, when the whole title and the pill's whole label fit on that row (measured,
     see _fitPill); otherwise on a line of its own under the subtitle, which keeps one line; else its dot alone. */
  .header .titles { display: grid; grid-template-columns: minmax(0, 1fr); }
  .header .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .header .trow > .name { flex: 0 1 auto; min-width: 0; }
  .header .trow > .st { flex: none; max-width: none; align-self: center; margin-top: 0; }
  .header .titles.below .trow { display: contents; }
  .header .titles.below .trow > .st { grid-row: 3; justify-self: start; max-width: 100%; margin-top: 3px; }
  .header .titles.dot-only .st { padding: 4px; }
  .header .titles.dot-only .st .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .st { display: inline-flex; align-items: center; gap: 4px; flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box;
        padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap; align-self: flex-start; margin-top: 2px;
        background: color-mix(in srgb, var(--hc-color) 15%, transparent); color: var(--hc-text); }
  .stt { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--hc-color); }
  .st.heating .dot { animation: hc-blink 1.6s ease-in-out infinite; }
  button { font: inherit; cursor: pointer; border: none; }
  button:disabled { cursor: default; opacity: .45; }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%; align-self: flex-start;
          display: grid; place-items: center; color: var(--secondary-text-color); }
  .zoom .icon { width: 16px; height: 16px; }
  .zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }
  :is(.zoom, .seg, .toggle, .round, .zone, .row, .chip[data-entity], .section-title, .stepper .tv):focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }

  .hero { display: flex; align-items: center; gap: 14px; }
  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .big { display: flex; align-items: baseline; gap: 8px; min-width: 0; flex-wrap: wrap; }
  .big .val { font-size: 30px; font-weight: 400; line-height: 1.1; color: var(--primary-text-color); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .big .val small { font-size: 14px; color: var(--secondary-text-color); }
  .big .arrow { font-size: 14px; color: var(--secondary-text-color); white-space: nowrap; }
  .state-big { font-size: 22px; font-weight: 400; line-height: 1.2; color: var(--hc-text); overflow-wrap: break-word; }
  .line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
  .line .icon { width: 14px; height: 14px; }
  .line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line b { color: var(--primary-text-color); font-weight: 500; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  /* A stove: its phases on a line, the pellets as a bar, its readings as tiles. */
  .phases { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); flex-wrap: wrap; }
  .phases .phase.done { color: var(--hc-text); }
  .phases .phase.on { color: var(--hc-text); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .phases .phase.on::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--hc-color); }
  .phases .pline { flex: 1 1 12px; min-width: 8px; height: 2px; border-radius: 1px; background: var(--divider-color, rgba(127,127,127,.25)); }
  .phases .pline.done { background: var(--hc-color); }
  .phases.alarm { color: var(--hc-crit); font-weight: 500; }
  .phases.alarm .icon { width: 18px; height: 18px; }
  .field-label { font-size: 12px; color: var(--secondary-text-color); margin: 2px 0 -2px; }
  .pellets { cursor: pointer; }
  .pellets .pl { display: flex; justify-content: space-between; font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px; }
  .pellets .pl span { display: inline-flex; align-items: center; gap: 4px; }
  .pellets .pl .icon { width: 14px; height: 14px; }
  .pellets .ptrack { height: 8px; border-radius: 4px; background: var(--divider-color, rgba(127,127,127,.2)); overflow: hidden; }
  .pellets .ptrack i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, #b07a3e, #d9a066); }
  .pellets.fuel .ptrack i { background: linear-gradient(90deg, #e67700, #fab005); }
  .pellets.low .ptrack i { background: var(--hc-warn); }
  .stiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 6px; }
  .stile { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 12px; cursor: pointer;
           background: var(--secondary-background-color, rgba(127,127,127,.08)); min-width: 0; }
  .stile .sl { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stile .sl .icon { width: 14px; height: 14px; flex: none; }
  .stile .sv { font-size: 16px; font-weight: 500; }
  .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 1px 8px 1px 5px; border-radius: 12px;
          background: var(--secondary-background-color, rgba(128,128,128,.12)); color: var(--secondary-text-color); white-space: normal;
          max-width: 100%; box-sizing: border-box; overflow: hidden; }
  .chip .icon { width: 13px; height: 13px; }
  .chip[data-entity] { cursor: pointer; }
  .chip.warn { background: color-mix(in srgb, var(--hc-warn) 15%, transparent); color: color-mix(in srgb, var(--hc-warn) 60%, var(--primary-text-color)); }
  .chip.alert { background: color-mix(in srgb, var(--hc-crit) 15%, transparent); color: color-mix(in srgb, var(--hc-crit) 60%, var(--primary-text-color)); }

  .section { display: flex; flex-direction: column; gap: 6px; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title.toggle-section { cursor: pointer; user-select: none; }
  .section-title .chevron { margin-left: auto; transition: transform .2s ease; }
  .section-title[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  /* Segmented buttons: smoked glass, the selected one raised with its icon in the accent color, never filled. */
  .segments { display: flex; gap: 4px; padding: 3px; border-radius: 12px; background: var(--secondary-background-color, rgba(128,128,128,.1)); }
  .seg { flex: 1; min-width: 0; display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 4px; border-radius: 9px;
         font-size: 12px; font-weight: 500; background: none; color: var(--secondary-text-color); transition: background .2s, color .2s; }
  .seg span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .seg .tag { flex: none; font-size: 11px; font-variant-numeric: tabular-nums; margin-left: -2px; }
  .seg:not(.short) .tag { display: none; }
  .seg .icon { width: 16px; height: 16px; }
  .seg.short { flex: 0 0 auto; padding: 6px 10px; }
  .seg.on { background: var(--card-background-color, #fff); color: var(--seg-color, var(--hc-text)); box-shadow: 0 1px 3px rgba(0,0,0,.15); }
  .seg.on .icon { color: var(--seg-color, var(--hc-color)); }
  /* A stove's power levels: numbers only, every one always shown. */
  .segments.levels .seg { font-size: 14px; font-variant-numeric: tabular-nums; }
  .segments.levels .seg .sl, .segments.levels .seg:not(.on) .sl { display: inline; }
  .round { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex: none;
           background: var(--secondary-background-color, rgba(128,128,128,.12)); color: var(--primary-text-color); }
  .round .icon { width: 20px; height: 20px; }
  .round.on, .round.tint { background: color-mix(in srgb, var(--hc-color) 16%, transparent); color: var(--hc-color); }
  .round.on:hover:not(:disabled), .round.tint:hover:not(:disabled) { background: color-mix(in srgb, var(--hc-color) 24%, transparent); }
  .power.on .icon { color: var(--hc-color); }
  .toggles { display: flex; flex-wrap: wrap; gap: 6px; }
  .toggle { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 4px 9px 4px 6px; border-radius: 12px;
            background: var(--secondary-background-color, rgba(128,128,128,.12)); color: var(--secondary-text-color); }
  .toggle .icon { width: 15px; height: 15px; }
  .toggle.on { background: color-mix(in srgb, var(--hc-color) 16%, transparent); color: var(--hc-text); }
  .toggle.on .icon { color: var(--hc-color); }
  /* Narrow card: the status pill keeps only its dot, its text clipped (still in the tooltip and for screen readers). */
  @container hc-card (max-width: 230px) { .header { gap: 6px; } }
  @container hc-card (max-width: 200px) {
    .st { flex: none; padding: 4px; position: relative; }
    .st .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`;

// The illustrated header (full, mini and overview cards), edge to edge over the card's padding.
// The width of an element's whole text in its own font, in fractional pixels (scrollWidth is rounded).
export let textCtx;
export const textWidth = (el) => {
  const cs = getComputedStyle(el);
  textCtx ??= document.createElement("canvas").getContext?.("2d");
  if (!textCtx) return el.scrollWidth;
  textCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return Math.max(el.scrollWidth, textCtx.measureText(el.textContent.trim()).width + pad);
};

export const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; flex: none; height: 90px; margin: -12px -12px 0; color: #0d2a45;
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { color: #fff; background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .bscene { position: absolute; right: 0; bottom: 10px; width: 200px; height: 80px;
            -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 14%); mask-image: linear-gradient(90deg, transparent 0, #000 14%); }
  .bground { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; }
  .g-heat { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 1px, transparent 1px 12px), linear-gradient(90deg, #ffb36b, #e8572e); box-shadow: inset 0 2px 0 #ffcf9a; }
  .night .g-heat { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 1px, transparent 1px 12px), linear-gradient(90deg, #7a3a1e, #5a2414); box-shadow: inset 0 2px 0 #8a4a2a; }
  .g-eco { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px 12px), linear-gradient(90deg, #8fd47a, #43a047); box-shadow: inset 0 2px 0 #b5e3a5; }
  .night .g-eco { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 12px), linear-gradient(90deg, #2a5a2c, #1c4220); box-shadow: inset 0 2px 0 #356a38; }
  .g-frost { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.7) 0 1px, transparent 1px 12px), linear-gradient(90deg, #bfe4fb, #6fb6ea); box-shadow: inset 0 2px 0 #e6f5ff; }
  .night .g-frost { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 1px, transparent 1px 12px), linear-gradient(90deg, #2a4a6a, #1c3552); box-shadow: inset 0 2px 0 #3a5c80; }
  .g-off { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 1px, transparent 1px 12px), linear-gradient(90deg, #d3d8de, #aab2bb); box-shadow: inset 0 2px 0 #e6e9ed; }
  .night .g-off { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.2) 0 1px, transparent 1px 12px), linear-gradient(90deg, #3a414b, #2b3139); box-shadow: inset 0 2px 0 #4a525d; }
  /* The title on the sky, up to the thermometer. */
  .htext { position: absolute; left: 12px; top: 0; bottom: 10px; right: calc(var(--hc-sw) + 4px); display: flex; align-items: center; gap: 10px; min-width: 0; }
  .htext .titles { flex: 1 1 auto; min-width: 0; align-self: center; padding-top: 0; display: grid; grid-template-columns: minmax(0, 1fr); }
  /* The status pill on the title's row, in the icon's colour, when the whole title and the pill's whole label fit
     there (measured, see _fitPill). */
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .trow .name { flex: 0 1 auto; min-width: 0; }
  .banner .bst { flex: none; align-self: center; margin: 0; background: color-mix(in srgb, var(--hc-color) 18%, rgba(255,255,255,.78));
                 color: color-mix(in srgb, var(--hc-color) 45%, #0d2a45); }
  .banner.night .bst { background: color-mix(in srgb, var(--hc-color) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--hc-color) 35%, #ffffff); }
  .banner .bst .dot { width: 7px; height: 7px; }
  /* Otherwise the pill on a line of its own under the subtitle, which keeps one line; when that does not fit above the
     ground strip, or on a card of 200 px or less, its dot alone (its label kept for screen readers and in its title). */
  .titles.below .trow { display: contents; } .banner .titles.below .bst { grid-row: 3; justify-self: start; max-width: 100%; margin-top: 3px; }
  .banner .titles.below .sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  @container hc-card (min-width: 201px) { .banner .bst { flex: none; padding: 1px 8px; } .banner .bst .stt { position: static; width: auto; height: auto; clip-path: none; } }
  @container hc-card (max-width: 200px) { .banner .bst { padding: 4px; } .banner .bst .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } }
  .banner .titles.dot-only .bst { padding: 4px; }
  .banner .titles.dot-only .bst .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .banner .name { color: inherit; }
  .banner .sub { color: #3b5b78; }
  .banner.night .sub { color: rgba(255,255,255,.78); }
  .banner .badge { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(13,42,69,.1); }
  .banner.night .badge { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .badge ha-icon { --mdc-icon-size: 24px; }
  /* The integration's logo on a white tile at the icon's bottom right. */
  .brand { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; padding: 2px; box-sizing: border-box;
           display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  .brand img { width: 100%; height: 100%; object-fit: contain; }
  .banner .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; color: #33506b; background: rgba(255,255,255,.55);
                  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner .zoom:hover { background: rgba(255,255,255,.75); }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); }
  /* The scene: thermometer and readout in the theme's color, the zone's device drawn by \`art\`. */
  .btube { fill: #fff; stroke: #d3d9e0; }
  .night .btube { fill: #2a3446; stroke: #55617a; }
  .bmerc, .bbulb { fill: var(--bc); }
  .bmerc { transform-box: fill-box; transform-origin: 50% 100%; }
  .bmerc.rise { animation: hcb-rise 3.2s ease-in-out infinite; }
  .bcur { font: 700 13px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--bc); }
  .btgt { font: 400 6.4px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #5c6470; }
  .night .btgt { fill: #a0a6ae; }
  .bhalo { opacity: .2; animation: hcb-glow 3.2s ease-in-out infinite; }
  .night .bhalo { opacity: .16; }
  .bleaf { fill: #43a047; opacity: .85; transform-box: fill-box; transform-origin: 30% 100%; animation: hcb-sway 4s ease-in-out infinite; }
  .bflake path { fill: none; stroke: #9fd0f3; stroke-width: .9; stroke-linecap: round; }
  .bflake { animation: hcb-fall 4.5s ease-in-out infinite; }
  .bflake.f1 { animation-delay: -1.5s; }
  .bflake.f2 { animation-delay: -3s; }
  .bdev { cursor: pointer; filter: drop-shadow(0 2px 3px rgba(0,0,0,.18)); }
  .night .bdev { filter: drop-shadow(0 0 4px rgba(255,255,255,.22)); }
  .bdev:focus-visible { outline: none; }
  @keyframes hcb-rise { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.06); } }
  @keyframes hcb-glow { 0%, 100% { opacity: .12; } 50% { opacity: .26; } }
  @keyframes hcb-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes hcb-fall { 0% { opacity: 0; transform: translate(0, -3px); } 30%, 70% { opacity: 1; } 100% { opacity: 0; transform: translate(1px, 5px); } }
  /* Narrow card: the device alone, then the sky alone. */
  @container (max-width: 340px) { .bthermo { display: none; } .htext { right: calc(var(--hc-dw) + 4px); } }
  @container (max-width: 190px) { .bscene { display: none; } .htext { right: var(--hc-zw, 8px); } }
`;

export const FULL_STYLE = `
  /* Zones: text tabs, the selected one underlined in its color. */
  .zones { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; margin: 0 -2px; padding: 0 2px;
           border-bottom: 1px solid var(--divider-color, rgba(128,128,128,.2)); }
  .zone { display: inline-flex; align-items: center; gap: 4px; padding: 6px 8px; font-size: 13px; font-weight: 500; white-space: nowrap; flex: 0 1 auto; min-width: 0;
          background: none; color: var(--secondary-text-color); border-bottom: 2px solid transparent; margin-bottom: -1px; border-radius: 6px 6px 0 0; }
  .zone .icon { width: 14px; height: 14px; color: var(--zc); }
  .zone .icon.heating { animation: hc-flame 1.3s ease-in-out infinite; transform-origin: 50% 100%; }
  .zone > span:not(.zt) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .zone .zt { font-weight: 400; font-variant-numeric: tabular-nums; }
  /* Four zones or more: the tabs keep their names, the temperatures stay on the hero and the mini card. */
  .zones.many .zt { display: none; }
  .zone.on { color: var(--primary-text-color); border-bottom-color: var(--zc); }
  .stepper { display: flex; align-items: center; justify-content: center; gap: 18px; }
  .steppers { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 20px; }
  .steppers .stepper { gap: 8px; }
  .steppers .tv { min-width: 72px; }
  .steppers .tval { font-size: 24px; }
  .tv { display: flex; flex-direction: column; align-items: center; min-width: 96px; border-radius: 10px; cursor: ns-resize; }
  .tval { font-size: 30px; font-weight: 400; line-height: 1.1; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .tval small { font-size: 14px; color: var(--secondary-text-color); }
  .tv.pending .tval { color: var(--hc-text); }
  .tl { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .04em; }
  .stepper .round { width: 44px; height: 44px; background: color-mix(in srgb, var(--hc-color) 16%, transparent); color: var(--hc-color); }
  .stepper .round:hover:not(:disabled) { background: color-mix(in srgb, var(--hc-color) 24%, transparent); }
  /* The scale under the target: from the entity's minimum to its maximum, filled up to the target, the room
     temperature as a tick. */
  .scale { position: relative; height: 6px; border-radius: 3px; margin: 2px 6px 0; background: var(--secondary-background-color, rgba(128,128,128,.18)); }
  .scale .fill { position: absolute; inset: 0 auto 0 0; border-radius: 3px; background: linear-gradient(to right, color-mix(in srgb, var(--hc-color) 35%, transparent), var(--hc-color)); transition: width .4s ease; }
  .scale .cur { position: absolute; top: -3px; width: 2px; height: 12px; margin-left: -1px; border-radius: 1px; background: var(--primary-text-color); }
  .scale-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--secondary-text-color); margin: 0 6px; font-variant-numeric: tabular-nums; }
  /* Dropdowns (many presets, fan / swing mode, target humidity): smoked glass, never filled. */
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
  .field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .field > span { font-size: 11px; color: var(--secondary-text-color); }
  select { font: inherit; font-size: 13px; color: var(--primary-text-color); padding: 7px 28px 7px 10px; border-radius: 10px; width: 100%;
           border: 1px solid var(--divider-color, rgba(128,128,128,.25)); appearance: none; -webkit-appearance: none; cursor: pointer;
           background: var(--secondary-background-color, rgba(128,128,128,.1)) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23888' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 6px center / 20px; }
  select:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }
  .controls-row { display: flex; align-items: center; gap: 8px; }
  .controls-row .segments, .controls-row .target { flex: 1; min-width: 0; }
  /* The power button next to the target: the stepper stays centered on the card, the button keeps its room. */
  .controls-row .target { padding-left: 48px; }
  .pilot { display: flex; flex-direction: column; gap: 4px; }
  .pilot-name { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--primary-text-color); min-width: 0; }
  .pilot-name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pilot-name .icon { width: 16px; height: 16px; color: var(--pc, var(--secondary-text-color)); }
  .pilot-name .pw-power { display: inline-flex; align-items: center; gap: 2px; margin-inline-start: auto; font-weight: 500; font-size: 12px; color: var(--secondary-text-color); cursor: pointer; white-space: nowrap; }
  .pilot-name .pw-power .icon { width: 14px; height: 14px; }
  .pilot-name .pw-power.on { color: var(--pc); }
  /* Weekly schedule: one row per day, its time slots in the accent color, today highlighted with a "now" line. */
  .week { display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; align-items: center; font-size: 11px; }
  .week .day { color: var(--secondary-text-color); text-transform: capitalize; font-variant-numeric: tabular-nums; }
  .week .day.today { color: var(--primary-text-color); font-weight: 600; }
  .week .track { position: relative; height: 10px; border-radius: 5px; background: var(--secondary-background-color, rgba(128,128,128,.15)); overflow: hidden; }
  .week .slot { position: absolute; top: 0; bottom: 0; border-radius: 5px; background: color-mix(in srgb, var(--hc-color) 75%, transparent); }
  .week .track.today { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--hc-color) 45%, transparent); }
  .week .now { position: absolute; top: -1px; bottom: -1px; width: 2px; margin-left: -1px; background: var(--primary-text-color); border-radius: 1px; animation: hc-pulse 2s ease-in-out infinite; }
  .week .hours { grid-column: 2; display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 10px; font-variant-numeric: tabular-nums; }
  .sched-state { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); }
  .sched-state b { color: var(--primary-text-color); font-weight: 500; }
  .sched-state .dot.on { background: var(--hc-color); animation: hc-blink 1.6s ease-in-out infinite; }
  .sched-state .dot.off { background: ${IDLE}; }
  .muted { font-size: 12px; color: var(--secondary-text-color); }
  /* Narrow cards (inner width): the target stepper tightens, the illustration shrinks, then moves above the info. */
  /* Narrow: the tabs keep their names and scroll; the segments not selected show their icon only (their label stays
     in the tooltip and for screen readers). */
  @container (max-width: 300px) {
    .hero { gap: 10px; }
    .picture { width: 60px; height: 70px; }
    .zone { flex: none; }
    .segments .seg:not(.on) { flex: 0 0 auto; padding: 6px 8px; }
    .segments .seg:not(.on) .sl { display: none; }
    .segments .seg:not(.on) .tag { display: inline; }
  }
  @container (max-width: 230px) { .stepper { gap: 8px; } .tv { min-width: 0; } .header { gap: 8px; } }
  @container (max-width: 190px) {
    .stepper { gap: 4px; }
    .stepper .round { width: 36px; height: 36px; }
    .tval { font-size: 24px; }
    .hero { flex-wrap: wrap; justify-content: center; row-gap: 6px; }
    .hero .info { flex-basis: 100%; }
    .segments:has(.short) .seg { flex: 1 1 0; padding: 6px 2px; }
  }
`;

export const MINI_STYLE = `
  :host { --hc-natural-width: 300px; }
  ha-card { gap: 8px; }
  .header { margin-bottom: 0; }
  .content { display: flex; align-items: center; gap: 12px; }
  .content .picture { width: 56px; height: 66px; }
  .mcontrols { display: flex; gap: 6px; flex-shrink: 0; }
  .mcontrols .round { width: 36px; height: 36px; }
  /* Overview of the zones: one row each, a click unfolds the full card on that zone. */
  .rows { display: flex; flex-direction: column; gap: 2px; }
  .row { display: flex; align-items: center; gap: 10px; padding: 5px 6px; margin: 0 -6px; border-radius: 10px; cursor: pointer; min-width: 0; }
  .row:hover { background: color-mix(in srgb, var(--secondary-text-color) 8%, transparent); }
  .rbadge { flex: none; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
            background: color-mix(in srgb, var(--zc) 16%, transparent); color: var(--zc); }
  .rbadge .icon { width: 18px; height: 18px; }
  .rbadge .icon.heating { animation: hc-flame 1.3s ease-in-out infinite; transform-origin: 50% 100%; }
  .rtext { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .rname { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rsub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rsub .alert { color: color-mix(in srgb, var(--hc-warn) 60%, var(--primary-text-color)); }
  .rtemp { flex: none; text-align: right; font-variant-numeric: tabular-nums; }
  .rtemp b { display: block; font-size: 16px; font-weight: 500; color: var(--primary-text-color); }
  .rtemp small { font-size: 11px; color: var(--secondary-text-color); }
  @container (max-width: 300px) {
    .content { flex-wrap: wrap; row-gap: 8px; }
    .content .info { flex: 0 0 calc(100% - 68px); }
    .mcontrols { flex-basis: 100%; justify-content: flex-end; }
  }
  @container (max-width: 190px) {
    .content > .picture { display: none; }
    .content .info { flex-basis: 100%; }
    .rbadge { display: none; }
  }
`;

// The overview: the summary tiles, the quick actions, then the zones floor by floor, one tile each; the confirmation of a
// quick action opens at the top of the card (as in ha-vacuum-card).
export const OVERVIEW_STYLE = `
  :host { --hc-natural-width: 400px; }
  ha-card.overview { position: relative; }
  ha-card.dialog-open { min-height: 190px; }
  .overview .header { margin-bottom: 0; }
  :is(.tile, .act, .btn):focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }
  /* Summary: zones heating, average temperature (coldest – warmest), average target. */
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); gap: 6px; }
  .stat { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 7px 9px; border-radius: 12px;
          background: var(--secondary-background-color, rgba(128,128,128,.1)); }
  .si { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
        background: color-mix(in srgb, var(--sc) 16%, transparent); color: var(--sc); }
  .si .icon { width: 18px; height: 18px; }
  .stat.heating .si .icon { animation: hc-flame 1.3s ease-in-out infinite; transform-origin: 50% 100%; }
  .stat.boost .si .icon { animation-duration: .65s; }
  .sv { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
  .sv small { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sv b { font-size: 16px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; font-variant-numeric: tabular-nums; }
  /* Alerts and pilot wire orders of the whole home, a count each. */
  .counts { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip b { font-weight: 600; font-variant-numeric: tabular-nums; }
  .chip.pw { background: color-mix(in srgb, var(--pc) 14%, transparent); color: color-mix(in srgb, var(--pc) 60%, var(--primary-text-color)); }
  .chip.pw .icon { color: var(--pc); }
  /* An alert's icon pulses, wherever it shows. */
  .overview .chip.warn .icon { animation: hc-pulse 2s ease-in-out infinite; }
  /* Quick actions for every zone: smoked glass, the icon in the order's color, never filled. */
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .al { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; color: var(--secondary-text-color); margin-right: 2px; }
  .act { position: relative; display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px 5px 7px; border-radius: 16px; font-size: 12px; font-weight: 500;
         background: var(--secondary-background-color, rgba(128,128,128,.12)); color: var(--primary-text-color); border: 1px solid transparent; transition: background .2s, border-color .2s; }
  .act .icon { width: 16px; height: 16px; color: var(--ac); }
  .act:hover:not(:disabled) { background: color-mix(in srgb, var(--ac) 14%, var(--secondary-background-color, rgba(128,128,128,.12))); }
  .act.on { border-color: color-mix(in srgb, var(--ac) 45%, transparent); background: color-mix(in srgb, var(--ac) 12%, transparent); }
  /* The zones, floor by floor. */
  .groups { display: flex; flex-direction: column; gap: 10px; }
  .gtitle { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
            letter-spacing: .04em; color: var(--secondary-text-color); min-width: 0; }
  .gtitle .icon { width: 16px; height: 16px; }
  .gtitle > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .gmeta { margin-left: auto; flex: none; display: inline-flex; align-items: center; gap: 3px; text-transform: none; letter-spacing: 0; font-variant-numeric: tabular-nums; }
  .gmeta .icon { width: 14px; height: 14px; color: var(--gc, var(--secondary-text-color)); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
  .tiles.fixed { grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
  /* A zone: its state icon, name, room temperature and target, state, and what needs a look. */
  .tile { position: relative; isolation: isolate; overflow: hidden; box-sizing: border-box; min-width: 0; display: grid; grid-template-columns: 32px minmax(0, 1fr);
          grid-template-areas: "ic name" "ic temp" "ic sub" "more more"; column-gap: 8px; align-items: center; align-content: start; padding: 8px;
          border-radius: 12px; background: var(--secondary-background-color, rgba(128,128,128,.1)); border: 1px solid transparent; transition: background .2s, border-color .2s; }
  .tile[role="button"] { cursor: pointer; }
  .tile[role="button"]:hover { background: color-mix(in srgb, var(--zc) 10%, var(--secondary-background-color, rgba(128,128,128,.1))); }
  .tile.on { border-color: color-mix(in srgb, var(--zc) 25%, transparent); }
  .tile.alert { border-color: color-mix(in srgb, var(--hc-warn) 50%, transparent); }
  .tile.na { opacity: .6; }
  /* The warmth of a zone: a glow rising from the bottom of its tile, breathing while it heats. */
  .tile::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0; transition: opacity .6s;
                  background: linear-gradient(to top, color-mix(in srgb, var(--zc) 24%, transparent), transparent 75%); }
  .tile.active::before { opacity: 1; animation: hc-glow 3.2s ease-in-out infinite; }
  .tile.pw-eco::before { opacity: .6; animation: hc-breathe-glow 4s ease-in-out infinite; }
  .tile.pw-frost::before { opacity: .3; }
  .tbadge { grid-area: ic; align-self: start; position: relative; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
            background: color-mix(in srgb, var(--zc) 16%, transparent); color: var(--zc); }
  .tbadge .icon { width: 18px; height: 18px; }
  .tile.heating .tbadge .icon { animation: hc-flame 1.3s ease-in-out infinite; transform-origin: 50% 100%; }
  .tile.boost .tbadge .icon { animation-duration: .65s; }
  .tbadge ha-icon { --mdc-icon-size: 18px; display: flex; }
  /* The zone's device drawn instead of the round icon (as the climate-air overview), over the rows of its text. */
  .tile:has(.tpic) { grid-template-columns: 40px minmax(0, 1fr); padding-left: 6px; }
  .tbadge.tpic { width: 40px; height: 46px; border-radius: 0; background: none; align-self: center; }
  .tpic .picture { width: 40px; height: 46px; transition: transform .2s; }
  .tpic .picture svg { filter: drop-shadow(0 1.5px 3px rgba(0,0,0,.2)); }
  .tile:not(.on) .tpic .picture { opacity: .8; }
  .tile[role="button"]:hover .tpic .picture { transform: scale(1.06); }
  .tbadge .adot { position: absolute; top: 0; right: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--hc-warn);
                  box-shadow: 0 0 0 2px var(--card-background-color, #fff); animation: hc-pulse 2s ease-in-out infinite; }
  .tname { grid-area: name; font-size: 13px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ttemp { grid-area: temp; display: flex; align-items: baseline; gap: 6px; min-width: 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .ttemp b { font-size: 17px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); }
  .ttemp small { font-size: 11px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; }
  .tsub { grid-area: sub; font-size: 11px; line-height: 1.3; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile.on .tsub { color: var(--hc-text); }
  .tile { --hc-text: color-mix(in srgb, var(--zc) 60%, var(--primary-text-color)); }
  .tmore { grid-area: more; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 6px; min-width: 0; }
  .tmore:empty { display: none; }
  .tmore .chip { font-size: 10.5px; }
  .tline { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--secondary-text-color); min-width: 0; }
  .tline .icon { width: 13px; height: 13px; }
  .tline span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pws { display: inline-flex; gap: 1px; }
  .pws .icon { width: 14px; height: 14px; color: var(--pc); }
  /* Heat rising over a zone that heats (twice as fast on boost). */
  .tile .heat { position: absolute; right: 6px; bottom: 4px; width: 30px; height: 44px; z-index: -1; fill: none; stroke: var(--zc); stroke-width: 1.6; stroke-linecap: round; overflow: visible; }
  .tile .heat path { opacity: 0; animation: hc-rise 2.8s ease-in-out infinite; }
  .tile .heat path:nth-child(2) { animation-delay: .9s; }
  .tile .heat path:nth-child(3) { animation-delay: 1.8s; }
  .tile.boost .heat path { animation-duration: 1.4s; }
  .tile.boost .heat path:nth-child(2) { animation-delay: .45s; }
  .tile.boost .heat path:nth-child(3) { animation-delay: .9s; }
  /* Compact tiles: one line each, the temperature at the right, an alert as a dot on the icon. */
  .tiles.compact { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .tiles.compact.fixed { grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
  .compact .tile { grid-template-columns: 28px minmax(0, 1fr) auto; grid-template-areas: "ic name temp"; padding: 6px 8px 6px 6px; }
  .compact .tbadge { width: 28px; height: 28px; align-self: center; }
  .compact .tbadge .icon { width: 16px; height: 16px; }
  .compact .tile:has(.tpic) { grid-template-columns: 30px minmax(0, 1fr) auto; padding: 4px 8px 4px 4px; }
  .compact .tbadge.tpic, .compact .tpic .picture { width: 30px; height: 35px; }
  .compact .ttemp b { font-size: 14px; }
  .compact .ttemp small, .compact .tsub, .compact .tmore, .compact .heat { display: none; }
  /* Confirmation of a quick action, at the top of the card. */
  .backdrop { position: absolute; inset: 0; z-index: 9; display: flex; align-items: flex-start; justify-content: center; padding-top: 12px;
              box-sizing: border-box; background: rgba(0,0,0,.45); border-radius: inherit; }
  .modal { width: min(92%, 340px); max-height: calc(100% - 24px); overflow: auto; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; padding: 16px;
           border-radius: 14px; background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); box-shadow: 0 8px 30px rgba(0,0,0,.4); }
  .msg { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; line-height: 1.4; }
  .msg .icon { width: 22px; height: 22px; color: var(--ac); }
  .mzones { font-size: 13px; line-height: 1.4; color: var(--primary-text-color); }
  .mskip { font-size: 12px; line-height: 1.4; color: var(--secondary-text-color); }
  .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 2px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 0; padding: 6px 12px; border-radius: 18px; font-size: 13px; font-weight: 500;
         background: var(--secondary-background-color, rgba(127,127,127,.12)); color: var(--primary-text-color); }
  .btn .icon { width: 18px; height: 18px; }
  .btn:hover { background: color-mix(in srgb, var(--ac) 12%, var(--secondary-background-color, rgba(127,127,127,.12))); }
  .btn.primary { background: color-mix(in srgb, var(--ac) 16%, transparent); color: color-mix(in srgb, var(--ac) 60%, var(--primary-text-color)); }
  .btn.primary .icon { color: var(--ac); }
  .btn.primary:hover { background: color-mix(in srgb, var(--ac) 24%, transparent); }
  /* Narrow: the quick actions keep their icon (their label stays in the tooltip and for screen readers), then the
     summary stacks. */
  @container (max-width: 360px) {
    .act { padding: 6px 8px; }
    .act .al2 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  }
  /* Narrow: the summary keeps one row, its icons and ranges left out (the range stays in the tooltip). */
  @container (max-width: 300px) {
    .stats { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; }
    .stat { padding: 6px 7px; }
    .si, .sv small + b + small { display: none; }
    .sv b { font-size: 14px; }
  }
  @container (max-width: 230px) {
    .al { flex-basis: 100%; }
    .tile { grid-template-columns: 26px minmax(0, 1fr); column-gap: 6px; padding: 6px; }
    .tbadge { width: 26px; height: 26px; }
    .tbadge .icon { width: 15px; height: 15px; }
    .tile:has(.tpic) { grid-template-columns: 34px minmax(0, 1fr); padding-left: 4px; }
    .tbadge.tpic, .tpic .picture { width: 34px; height: 39px; }
  }
`;
