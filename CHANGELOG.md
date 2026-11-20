# Changelog

## 1.5.1 - 2026-11-20

### Fixes
- The frosted status pill gets the `-webkit-backdrop-filter` prefix for older Safari and the iOS companion app.
- The page no longer jumps on state updates: the cards patch their content in place instead of rewriting it. The rewrite replaced `<ha-card>` and the icons, which Home Assistant draws a moment later: the status pill was measured with the card collapsed to its border, the page got shorter and its scroll position moved. The illustration's animations no longer restart on each update, and a new card measures its pill again once `<ha-card>` has rendered.

### Performance
- The registry lookups count the states once per update instead of on every lookup (each role of each zone): less work on every state change of a large home.
- The card resolves its zones (thermostat roles, pilot wire radiators, sensors) again only when its configuration, the registries, the language or the number of entities change, instead of on every state push before comparing what it shows.

## 1.5.0 - 2026-11-18

### Features
- **Boilers**: a **gas boiler** (the blue flame of its burner while it fires), an **oil boiler** or diesel heater (its flame and the gauge of its tank) and a **pellet boiler** (its fire and its hopper, its phases and pellets as a stove's) are zone devices, in the card, the illustrated header and the overview tiles. A *Boiler* section shows the flow and return temperatures, the burner's modulation, the water pressure and the fuel left, with *Low pressure* and *Low fuel* alerts; the mini card shows the flow and burner (or the fuel) on one line. Found from the integration, the brand or the name (OpenTherm Gateway, ebusd, EMS-ESP, ViCare, myVAILLANT, ÖkoFEN, Hargassner, Fröling…), or `illustration: gas_boiler | oil_boiler | pellet_boiler`; `collapsed: [boiler]` folds the section.
- **Underfloor heating**: the water loop glows in the floor and heat rises from it; the floor probe is a chip. Found from its name or brand (Danfoss Icon, Heatmiser, Uponor…), or `illustration: floor`.
- **Towel rail**: its own ladder with a towel (it was drawn as a radiator), its bars glowing while it heats; on *Boost*, the time left follows its state. Found from its name (*towel*, *sèche-serviettes*, *Handtuch*…), or `illustration: towel`.

### Maintenance
- The screenshot script renders the new devices (full cards and one animation each); the screenshot test flags only orphan files, so a capture just listed no longer fails before the Screenshots workflow renders it.

## 1.4.0 - 2026-11-18

### Features
- **Stove**: a pellet or wood stove is one more device of a zone, drawn with its fire behind the glass (flames while it burns, embers on standby), in the card, the illustrated header and the overview tiles. Its **phase** (*Off → Ignition → Burning → Cooling down*, *Standby*, or its alarm), its **power level** as numbered buttons, the **pellets** left as a bar with a *Low pellets* alert, and its flue gas, fan and ignitions as tiles, read from its device or its entity's attributes. Found from the integration, the device or the name (Palazzetti, Fumis, Edilkamin, MCZ Maestro, Rika Firenet, Duepi EVO…; *stove*, *poêle*, *pellet*… in every language), or `illustration: stove`; `collapsed: [stove]` folds its section.
- **Stove on the mini card**: its power level and the pellets left on one line (*Power 3/5 · Pellets 35 %*), next to its phase in the pill.

## 1.3.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.3.0 - 2026-11-18

### Features
- **Heating Overview Card**: each tile draws its zone's own device (wall thermostat, radiator or radiator valve, from its `illustration` or found from the device), as the tiles of the climate-air overview, instead of the round state icon — with the device's animations (glow and heat while it heats, pilot wire colors). Compact and narrow tiles draw it smaller; a zone with its own `icon` keeps it.

## 1.2.1 - 2026-11-17

### Fixes
- **Heating Overview Card**: the illustrated header was missing (it kept the classic one). It now has it like the full and mini cards: the scene draws the first zone that heats (else the first one on, else the first), with its device, room temperature → target and theme; the subtitle counts the zones heating. `illustration: false` and `illustration_theme` apply to the overview itself as well as to the full card a zone unfolds into.

## 1.2.0 - 2026-11-17

### Features
- Illustrated header on the full and mini cards (90 px): the title on the sky at the left, a temperature scene at the right (thermometer, room temperature → target, the zone's own wall thermostat, radiator or radiator valve drawn big) and a 10 px ground strip edge to edge, themed by the zone: *Heating* orange (halo, heat rising, the mercury breathing), *Eco* green with a swaying leaf, *Frost protection* blue with drifting snowflakes, *Off* grey.
- Night colors after sunset (`sun.sun`) or with Home Assistant's dark theme, forced with `illustration_theme: day | night`; `illustration: false` keeps the classic header. Both are in the visual editor of every card (the overview's for the full card a zone unfolds into).
- The header icon always says the status: heating in the heat (or boost) color, eco green, frost protection blue, idle or off grey, an open window or low battery amber, unavailable red; the integration's logo (Netatmo, tado°, Heatzy, ZHA) sits in a badge on it.
- Animations stop with `prefers-reduced-motion`; each card keeps its own SVG ids, so several cards share a page.
- The **status pill** is back on the illustrated header (full and mini cards) and sits right after the title on the classic one too (`illustration: false`, where it was at the far end), on the title's row in the header icon's colour, on frosted glass; it stays beside the title only when the whole title and its whole label fit there (measured, in every language), else it takes a line of its own under the subtitle (the subtitle then on one line), and keeps its dot alone when its label does not fit there or above the ground strip, and on cards of 200 px or less. The subtitle no longer repeats the status. The mini card's detail button sits in the banner's top-right corner on the same glass as the other cards.
- Night picture with the dark theme even while the sun is up.

## 1.1.2 - 2026-11-14

### Fixes
- Mini card visual editor: **Pilot wire**, **Schedule** and **Folded sections** (`show_pilot_wire`, `show_schedule`, `collapsed`) are now offered; they set the unfolded full card.
- Overview visual editor: **Controls**, **Measurements** and **Folded sections** (`show_controls`, `show_sensors`, `collapsed`) are now offered, for the full card a zone unfolds into; an empty list of folded sections is kept (nothing folded).
- README: on the overview, `zones` is marked YAML only (the visual editor keeps it).

## 1.1.1 - 2026-11-13

### Fixes
- Folding back on a tap elsewhere now works on iOS (Safari and the companion app): a tap on something that is not clickable sent no click to the page, so the unfolded schedule, the detailed view of the mini card and the confirmation of the overview card stayed open. The press and the release are caught instead; a slider dragged out of the card and a scroll do not fold anything.
- Leaving the card (another dashboard view, a conditional card hidden) brings it back in its default state: sections folded as configured, mini card compact, confirmation closed.
- Clicks lost under an update: Home Assistant updates the card several times a second, and an update that rewrote the card between the press and the release replaced the element pressed, so that the click landed on the card itself and did nothing. The card is no longer rewritten while a press is in progress; the pending update is drawn right after the click.
- Focus ring after a mouse click: the focus was put back on the clicked element after each update, which drew the focus ring. It is now kept across updates only for the keyboard.

## 1.1.0 - 2026-11-13

### Features
- **Heating Overview Card** (`custom:heating-overview-card`): the heating of the whole home at a glance, taking over the thermostats of ha-climate-air-card's overview (removed there in 2.0.0).
  - The zones **floor by floor** (Home Assistant's floors, in the order of their levels, the areas without floor under *Other areas*), one tile each: state icon, room temperature and target, what it does and its preset, its pilot wire radiators in the color of their order, its schedule (*On until 22:00*), *Window open*, *Low battery* and *Device offline* alerts; each floor's heading counts its zones heating and gives its average temperature.
  - A **summary**: zones heating (and which), average room temperature from the coldest to the warmest zone, average target, then the open windows, low batteries, devices offline and the pilot wire radiators per order, a count each.
  - **Quick actions** for every zone: *Comfort*, *Eco*, *Frost protection*, *Away* and *Off* (`actions`), confirmed at the top of the card with the zones they set and those they cannot reach; each thermostat takes the closest preset it offers, each pilot wire radiator its own spelling of the order; a quick action every zone has already taken shows as pressed.
  - **Animations**: a zone that heats glows from the bottom of its tile, its flame flickers and heat rises over it (twice as fast and in red on Boost); a pilot wire radiator on comfort glows too, on eco its tile breathes; an alert's icon pulses.
  - A tap on a zone unfolds the full card on it (`detail: card`), or opens its more-info dialog (`more-info`); the detail button switches to the full card and back, and a click elsewhere brings the overview back.
  - Filters by area and floor (`areas`, `exclude_areas`, `floors`, `exclude_floors`) and entity (`include`, `exclude`), `group_by`, `sort` (area order, name, coldest first, alerts and heating first), `columns`, `compact` tiles, `show_summary`, `show_actions`, `show_alerts`, `show_pilot_wire`, `show_schedule`, `zoom`, and a visual editor for all of them.
  - Its new texts in the 22 languages of the cards.

## 1.0.0 - 2026-11-13

### Features
- **Heating Card** (`custom:heating-card`): the heating of the home zone by zone, as text tabs under the header (the selected one underlined in its color, a flickering flame on a zone that heats).
  - Thermostat part taken from the thermostat card of [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card): animated illustration (round wall thermostat, column radiator or radiator valve, picked from the device model and name or set with `illustration`), room temperature and target, − / + sent once the taps stop (a low / high range gets both ends), heating modes, presets as segmented buttons, valve, battery, humidity, outdoor temperature and power chips, *Window open* and *Low battery* alerts, the device's other switches (child lock…) as option toggles.
  - Target: a scale from the entity's minimum to its maximum under the stepper, with the room temperature as a tick; the value is a keyboard spin button (arrows, Page Up / Down, Home / End); the − / + buttons turn off at the limits; the pending target shows in the accent color until the entity reports it.
  - `hvac_action`: *Heating*, *Preheating*, *Idle*, *Off*, *Defrosting*; the animations run only while it really heats (or, without `hvac_action`, while its valve is open); Boost doubles their speed, in red.
  - Presets: a tap on the selected preset goes back to none (manual) when the entity offers it; frost protection and comfort −1 / −2 recognized with their own label and icon.
  - Power button only when the thermostat can be turned off (`climate.turn_off` when it has no off mode); back on with the mode it had (`set_hvac_mode`, which every thermostat takes).
  - Fan mode, swing mode and target humidity as dropdowns for the thermostats that have them, and every mode of a heat pump set by hand, as in the ha-climate-air-card thermostat card; its options keep their names (`entity`, `name`, `icon`, `illustration`, `entities`, `show_*`, `zoom`, `language`).
  - **Pilot wire** radiators: `select` entities offering at least three pilot wire orders (comfort, comfort −1, comfort −2, eco, frost protection, off, whatever the integration spells them: Zigbee2MQTT, ZHA, Heatzy, French option names…), or a `switch` relay with `switch_on` / `switch_off`; one segmented row per radiator, each order in its color, the radiator glowing on comfort and breathing on eco.
  - **Weekly schedule**: a `schedule` helper read with `schedule.get_schedule` (or the helpers' list created in the UI), drawn as seven rows of time slots with a pulsing "now" line on today, and its state (*On until 22:00*).
  - Zones found automatically, grouped by area (thermostat, pilot wire radiators, schedule, room temperature and humidity sensors), or set with `zones`, `entity` or `pilot_wire`.
- **Heating Mini Card** (`custom:heating-mini-card`): the overview of the zones, one row each (state, preset, alert, room temperature and target), a click unfolding the full card on that zone; on one zone, the compact thermostat with − / + and power. Detail button at the top right, back to the compact view on a click elsewhere.
- Visual editor for both cards, the zones as folded sections; English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek, each language but English loaded on demand.
