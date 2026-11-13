# Changelog

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
