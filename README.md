# ha-heating-card

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-heating-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-heating-card/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-heating-card/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-heating-card/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-heating-card/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-heating-card/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-heating-card)](https://github.com/juju35/ha-heating-card/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-heating-card/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/icon.svg" alt="Heating Card" width="120"></p>

<p align="center">
  <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/netatmo.png" alt="Netatmo" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/tado.png" alt="tado°" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/zha.png" alt="ZHA" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/heatzy.png" alt="Heatzy" width="64">
</p>

Lovelace cards for the **heating** of your home in Home Assistant, zone by zone: **thermostats** (wall thermostats, electric radiators, radiator valves), **pilot wire radiators** (comfort, eco, frost protection, off, comfort −1 / −2) and their **weekly schedules**.

The cards work on top of the integrations you already use: any `climate` entity that heats (Netatmo, tado°, Zigbee2MQTT and ZHA radiator valves, Generic Thermostat, Heatzy…), any `select` entity offering pilot wire orders (Nodon, Legrand and other pilot wire modules through Zigbee2MQTT or ZHA, Heatzy…) or a `switch` relay, and Home Assistant's own `schedule` helpers. Zones are **found automatically** and grouped by area: you don't pick the entities one by one. Air conditioners, fans and purifiers are left to [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card): this card only shows heating.

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-heating-card&category=plugin)

| Heating Card | Heating Mini Card | Heating Overview Card |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card.png" alt="heating card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card.png" alt="heating mini card" width="380"><br><img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-dial.gif" alt="heating mini card on one thermostat, animated" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-heating.gif" alt="heating overview card, animated" width="400"> |

## Features

- Three cards: a full **Heating Card** (`custom:heating-card`), a compact **Heating Mini Card** (`custom:heating-mini-card`) and a **Heating Overview Card** (`custom:heating-overview-card`) for the whole home
- Several **zones**, as text tabs under the header (the selected one underlined in its color, a flickering flame on a zone that heats); found automatically by area or set with `zones`
- **Thermostat** (from the thermostat card of [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card)): animated illustration (round wall thermostat, column radiator or radiator valve, picked from the device model and name), room temperature and target, heating modes (*Heat*, *Auto*) and a power button
- **Target**: − / + buttons sent once the taps stop, a scale from the entity's minimum to its maximum with the room temperature as a tick, keyboard spin button (arrows, Page Up / Down, Home / End), buttons off at the limits, a low / high range for thermostats that set one
- **What it does** from `hvac_action` (*Heating*, *Preheating*, *Idle*, *Off*, *Defrosting*): the flame flickers and warm air rises only while it really heats; **Boost** doubles the animation speed, in red
- **Presets** as segmented buttons (*Comfort*, *Eco*, *Away*, *Boost*, *Frost protection*, *Comfort −1 / −2*…), a dropdown when there are more than seven; a tap on the selected one goes back to manual
- The fan mode, swing mode and target humidity of the thermostats that have them, as dropdowns
- **Pilot wire** radiators: one row of orders per radiator (`select` or `switch` relay), each order in its color (*−1* / *−2* stay on the icon-only buttons of comfort −1 / −2); the radiator glows on comfort and breathes on eco
- **Weekly schedule**: the week of a `schedule` helper as seven rows of time slots, today highlighted with a pulsing "now" line, and its state (*On until 22:00*)
- Valve opening, battery, humidity, outdoor temperature and power chips; *Window open* and *Low battery* (15 % or less) alerts; the thermostat's other switches (child lock, window detection…) as option toggles
- The header icon and status pill follow the whole home: heating, idle, off or unavailable; the subtitle counts the zones heating
- Mini card: the overview of the zones, one row each, a click unfolding the full card on that zone; on one zone, the compact thermostat with − / + and power. Detail button at the top right; a click anywhere outside the card brings the compact view back
- **Overview card**: the heating of the whole home at a glance, **floor by floor** (one tile per zone: state, room temperature and target, preset, pilot wire radiators, schedule, alerts), a **summary** (zones heating, average room temperature from the coldest to the warmest zone, average target, open windows, low batteries, devices offline, pilot wire radiators per order) and **quick actions** for every zone (*Comfort*, *Eco*, *Frost protection*, *Away*, *Off*) confirmed at the top of the card; a tap on a zone unfolds the full card on it. The zones that heat glow, their flame flickers and heat rises over them; filters by area, floor and entity, sorts, compact tiles
- Collapsible sections (the schedule folded by default), folded back on a click elsewhere
- Sections view: the full card and the overview take 12 columns and at least 6, the mini card 6; narrow widths get their own layout (see [Screenshots](#screenshots))
- Click a chip, the illustration or the schedule state to open its Home Assistant history (more-info dialog)
- Visual editor in the dashboard UI for every card, zones and overview filters included (no YAML needed)
- Light and dark mode, English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek
- Single file, no external dependency, the illustrations and icons are embedded

## Supported integrations

| Entities | Integrations (examples) | What the cards show |
|---|---|---|
| `climate` that heats and cannot cool, dry or only blow | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/netatmo.png" alt="" width="16"> [Netatmo](https://www.home-assistant.io/integrations/netatmo/), <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/tado.png" alt="" width="16"> [tado°](https://www.home-assistant.io/integrations/tado/), [Zigbee2MQTT](https://www.zigbee2mqtt.io/) and <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/zha.png" alt="" width="16"> [ZHA](https://www.home-assistant.io/integrations/zha/) radiator valves and thermostats, [Generic Thermostat](https://www.home-assistant.io/integrations/generic_thermostat/), <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/heatzy.png" alt="" width="16"> [Heatzy](https://github.com/Cyr-ius/hass-heatzy) | Thermostat: target, modes, presets, `hvac_action`, and the valve, window and battery sensors of its device |
| `select` offering pilot wire orders | [Zigbee2MQTT](https://www.zigbee2mqtt.io/) / <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/images/zha.png" alt="" width="16"> [ZHA](https://www.home-assistant.io/integrations/zha/) pilot wire modules (Nodon SIN-4-FP-21, Legrand cable outlet…), any select whose options are pilot wire orders | Pilot wire orders, comfort / comfort −1 / comfort −2 / eco / frost protection / off |
| `switch` | A relay on the pilot wire (with or without a diode) | The two orders set with `switch_on` / `switch_off` |
| `schedule` | Home Assistant's [Schedule](https://www.home-assistant.io/integrations/schedule/) helper | Weekly plan and current state |
| `sensor` | Any temperature and humidity sensor | Room temperature and humidity of a zone without thermostat |

Pilot wire orders are recognized whatever the integration spells them: `comfort`, `comfort_-1`, `comfort-2`, `eco`, `frost_protection`, `off`, and French names (`Confort`, `Hors-gel`, `Arrêt`…). Air conditioners and heat pumps that can cool are left out (see [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card)).

## Prerequisites

Home Assistant 2024.8 or later. The week of every schedule is read with the `schedule.get_schedule` action (Home Assistant 2025.1 or later); on earlier versions, only the schedules created in the UI are drawn.

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-heating-card&category=plugin)

Then click **Install**, and reload your browser when the Marketplace asks you to.

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-heating-card` — Type: **Dashboard**
3. Open **Heating Card** and click **Install**
4. Check that **Settings → Dashboards → ⋮ → Resources** lists `/local/community/ha-heating-card/heating-card.js`
5. Clear your browser cache and refresh

### Manual

1. Download `heating-card.js` and the `heating-card.i18n.*.js` translation files from the [latest release](https://github.com/juju35/ha-heating-card/releases/latest)
2. Copy them all to `/config/www/` (without the translation files, the cards show in English)
3. Go to **Settings → Dashboards → ⋮ → Resources** → Add resource:
   - URL: `/local/heating-card.js`
   - Type: **JavaScript Module**
4. Clear your browser cache and refresh

## Configuration

### Card types

| Card | Type |
|---|---|
| Heating Card | `custom:heating-card` |
| Heating Mini Card | `custom:heating-mini-card` |
| Heating Overview Card | `custom:heating-overview-card` |

### Visual editor

Edit a dashboard, click **Add card** and search for **Heating Card**, **Heating Mini Card** or **Heating Overview Card**. Without zones, every heating thermostat and pilot wire radiator is found and grouped by area. Open **Add a zone** to set your own: name, thermostat, pilot wire radiators, room temperature and humidity sensors, schedule, window sensor, illustration and, for a relay, the orders it sends. The overview's editor sets the areas and floors to show or leave out, the entities to add or leave out, the grouping, the sort, what a tap on a zone does, the parts shown and the quick actions offered. The preview updates live, and options left at their default are kept out of the generated YAML.

### Minimal

```yaml
type: custom:heating-card
```

```yaml
type: custom:heating-mini-card
```

```yaml
type: custom:heating-overview-card
```

One thermostat:

```yaml
type: custom:heating-card
entity: climate.living_room
schedule: schedule.living_room_heating
```

### Coming from ha-climate-air-card

The thermostat card of [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card) lives on here: replace `custom:climate-air-thermostat-card` with `custom:heating-card` and `custom:climate-air-thermostat-mini-card` with `custom:heating-mini-card`. Its options keep their names and meaning: `entity`, `name`, `icon`, `illustration`, `entities`, `show_title`, `show_subtitle`, `show_controls`, `show_sensors`, `show_alerts`, `zoom` and `language`.

```yaml
type: custom:heating-card
entity: climate.bedroom_radiator
illustration: valve
```

Since ha-climate-air-card 2.0.0, its `custom:climate-air-overview-card` shows air conditioners, purifiers and fans only: the thermostats moved to `custom:heating-overview-card`, which shows them by zone (an area's thermostat, pilot wire radiators and schedule together), floor by floor. What the old overview showed of a thermostat is here: what it does (*Heating*, *Idle*, *Off*), its target, the room temperature, the *Window open* and *Low battery* alerts, the flickering flame while it heats, a tap unfolding its full card, and the detail button. These options keep their name and meaning: `title`, `columns`, `show_title`, `show_alerts`, `include`, `exclude` and `language`. `zoom` still shows or hides the detail button, which now switches to the full card. `group_by: area` needs no option any more (a zone is an area; `group_by: floor`, the default, groups the areas by floor); `show_all` neither (every zone is always shown, the summary tells which ones heat); the tiles show the zone's state icon, so `icon`, `icons`, `illustrations` and `devices` are not used.

```yaml
type: custom:heating-overview-card
exclude:
  - climate.garage_frost_guard
```

### Full options

```yaml
type: custom:heating-card
title: Heating
zones:
  - name: Living room
    entity: climate.living_room_thermostat
    pilot_wire:
      - select.living_room_radiator_pilot_wire_mode
    schedule: schedule.living_room_heating
  - name: Bedroom
    entity: climate.bedroom_radiator_valve
    illustration: valve
    window: binary_sensor.bedroom_window
  - name: Bathroom
    pilot_wire: select.towel_radiator_mode
    temperature: sensor.bathroom_temperature
    humidity: sensor.bathroom_humidity
  - name: Hallway
    pilot_wire: switch.hallway_radiator_relay
    switch_on: eco
    switch_off: comfort
show_title: true
show_subtitle: true
show_controls: true
show_sensors: true
show_alerts: true
show_pilot_wire: true
show_schedule: true
collapsed:
  - schedule
language: en
```

```yaml
type: custom:heating-mini-card
zoom: true
```

```yaml
type: custom:heating-overview-card
title: Home heating
floors:
  - ground_floor
  - first_floor
exclude_areas:
  - garage
include:
  - climate.hidden_radiator_valve
exclude:
  - select.attic_radiator_pilot_wire_mode
group_by: floor
sort: state
columns: 2
compact: false
detail: card
show_title: true
show_subtitle: true
show_summary: true
show_actions: true
show_alerts: true
show_pilot_wire: true
show_schedule: true
actions:
  - comfort
  - eco
  - frost
  - away
zoom: true
language: en
```

### Options reference

| Option | Card | Default | Description |
|---|---|---|---|
| `zones` | All | Auto | The zones (see [Zone options](#zone-options)); a zone may also be a bare entity id: a thermostat, or a pilot wire `select` / `switch`. Without `zones`, `entity` or `pilot_wire`, every zone is found by area |
| `entity`, `pilot_wire`, … | Full, Mini | — | One zone set at the top level: every [zone option](#zone-options) works there too |
| `title` | All | *Heating*, or the zone name with one zone | Card title (`name` is accepted too) |
| `show_title` | All | `true` | Show the title in the header (e.g. `false` under a section heading of your own) |
| `show_subtitle` | All | `true` | Show the subtitle (zones heating, or the zone and its preset) |
| `show_controls` | All | `true` | Modes, power, target, presets and option toggles (the overview's full card) |
| `show_sensors` | All | `true` | Valve, battery, humidity, outdoor temperature and power chips (the overview's full card) |
| `show_alerts` | All | `true` | *Window open* and *Low battery* alerts (and *Device offline* on the overview) |
| `show_pilot_wire` | Full, Overview | `true` | Pilot wire section; on the overview, the pilot wire orders of the summary and of the tiles |
| `show_schedule` | Full, Overview | `true` | Weekly schedule section; on the overview, the schedule state of the tiles |
| `collapsed` | Full | `[schedule]` | Sections folded at first: `pilot_wire`, `schedule` |
| `zoom` | Mini, Overview | `true` | Detail button at the top right that unfolds the full card (a click elsewhere folds it back) |
| `language` | All | Auto | Force language: `en`, `fr`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings; `pt-BR` gets European Portuguese) |

### Overview options

| Option | Default | Description |
|---|---|---|
| `areas` | Every area | Only the zones of these areas (area ids) |
| `exclude_areas` | — | Areas left out |
| `floors` | Every floor | Only the zones of these floors (floor ids) |
| `exclude_floors` | — | Floors left out |
| `include` | — | Thermostats (`climate`) or pilot wire radiators (`select` / `switch`) not found on their own (a hidden entity, say): added to their area's zone, else as a zone of their own |
| `exclude` | — | Entities left out: a thermostat (its zone goes too, unless it has pilot wire radiators, which then show with the area's room temperature) or a pilot wire radiator |
| `group_by` | `floor` | `floor`: the zones under their floor's name (in the order of the floor levels, the areas without floor last, under *Other areas*); `none`: all together. Without floors in Home Assistant, the zones are not grouped |
| `sort` | `area` | Order of the zones within a floor: `area` (the area registry's), `name`, `temperature` (coldest first) or `state` (alerts, then heating, on, off, offline) |
| `columns` | Auto | Number of tile columns (1 to 6); by default as many as fit, 150 px each at least |
| `compact` | `false` | One line per zone: state icon, name and room temperature (an alert shows as a dot on the icon) |
| `detail` | `card` | What a tap on a zone does: `card` unfolds the full card on that zone (back to the overview with the detail button or a click elsewhere), `more-info` opens the more-info dialog of its thermostat (or first pilot wire radiator), `none` nothing |
| `show_summary` | `true` | The summary: zones heating, average room temperature (coldest – warmest), average target, then the open windows, low batteries, devices offline and pilot wire radiators per order |
| `show_actions` | `true` | The quick actions for every zone |
| `actions` | `[comfort, eco, frost, away]` | The quick actions offered: `comfort`, `eco`, `frost`, `away`, `off` (see [Overview](#overview)) |

The `zones` option works on the overview too: its zones are then the ones shown, grouped by the floor of their area.

### Zone options

| Option | Default | Description |
|---|---|---|
| `name` | Area or device name | Zone name (tab and row) |
| `entity` | — | The thermostat (`climate`) |
| `pilot_wire` | — | Pilot wire radiators: one entity or a list (`select` or `switch`) |
| `temperature` / `humidity` | The thermostat's, or the area's sensors (automatic zones) | Room temperature and humidity sensors |
| `schedule` | The area's schedule helper (automatic zones) | A `schedule` helper drawn as the zone's week |
| `window` | The device's open-window sensor | `binary_sensor` raising the *Window open* alert |
| `illustration` | `auto` | `dial` (round wall thermostat), `radiator` or `valve` (radiator valve); `auto` picks one from the device model and name, `radiator` for a pilot wire zone |
| `icon` | — | An `mdi:` icon instead of the illustration |
| `switch_on` / `switch_off` | `comfort` / `off` | The orders a `switch` relay sends when on and off: `comfort`, `comfort_1`, `comfort_2`, `eco`, `frost`, `off` (e.g. `eco` / `comfort` for a relay with a diode) |
| `entities` | Auto | Override the sensors found on the thermostat's device: `indoor_temp`, `outdoor_temp`, `humidity`, `power`, `valve`, `window`, `battery` |

## Screenshots

All screenshots are rendered from the cards' own code with mock data (`npm run screenshots`), in the light and dark themes.

### Animations

The wall thermostat heats: its flame flickers, warm air rises above it, its halo glows and its LED blinks; the arc shows where the target sits between the minimum and the maximum.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-dial.gif" alt="wall thermostat heating" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-dial-dark.gif" alt="wall thermostat heating, dark theme" width="380"> |

The same thermostat drawn as a column radiator (`illustration: radiator`): its columns glow from the bottom up and heat rises.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-radiator.gif" alt="radiator heating" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-radiator-dark.gif" alt="radiator heating, dark theme" width="380"> |

A radiator valve open at 45 %: its radiator glows and heat rises.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-valve.gif" alt="radiator valve heating" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/heating-valve-dark.gif" alt="radiator valve heating, dark theme" width="380"> |

Boost: the flame and the heat go twice as fast, in red.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/boost.gif" alt="boost" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/boost-dark.gif" alt="boost, dark theme" width="380"> |

A pilot wire radiator on comfort glows and gives off heat.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/pilot-comfort.gif" alt="pilot wire comfort" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/pilot-comfort-dark.gif" alt="pilot wire comfort, dark theme" width="380"> |

On eco, it breathes slowly in green.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/pilot-eco.gif" alt="pilot wire eco" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/pilot-eco-dark.gif" alt="pilot wire eco, dark theme" width="380"> |

The overview: the flame of each zone that heats flickers, and the heat waves of the header radiator rise.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview.gif" alt="zones overview" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-dark.gif" alt="zones overview, dark theme" width="380"> |

The overview card with two zones heating: their flame flickers, their tile glows from the bottom up and heat rises over it; the bathroom's tile on eco breathes in green, and the icon of the open window's alert pulses.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-heating.gif" alt="overview card, zones heating" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-heating-dark.gif" alt="overview card, zones heating, dark theme" width="400"> |

The living room on Boost: its tile turns red and its flame and heat go twice as fast; the bathroom's pilot wire radiator on comfort glows and gives off heat.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-boost.gif" alt="overview card, boost and pilot wire comfort" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-boost-dark.gif" alt="overview card, boost and pilot wire comfort, dark theme" width="400"> |

### Heating Card

Every zone found on its own: the living room's wall thermostat heating, its presets, its pilot wire radiator and its schedule (folded).

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card.png" alt="heating card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-dark.png" alt="heating card, dark theme" width="400"> |

The weekly schedule unfolded, today highlighted with its "now" line.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-schedule.png" alt="weekly schedule" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-schedule-dark.png" alt="weekly schedule, dark theme" width="400"> |

The bedroom's radiator valve: idle, window open, battery and valve chips; with heat as its only mode, the power button sits next to the target.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-valve.png" alt="radiator valve" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-valve-dark.png" alt="radiator valve, dark theme" width="400"> |

The bathroom's towel radiator on pilot wire, with the room's temperature and humidity.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-pilot-wire.png" alt="pilot wire radiator" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-pilot-wire-dark.png" alt="pilot wire radiator, dark theme" width="400"> |

### Heating Mini Card

The overview of the zones (state, preset, alert, room temperature and target), and the mini card on one thermostat.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card.png" alt="mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-dark.png" alt="mini card, dark theme" width="380"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-thermostat.png" alt="mini card on one thermostat" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-thermostat-dark.png" alt="mini card on one thermostat, dark theme" width="380"> |

A click on a row unfolds the full card on that zone (here the bedroom).

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-zoom.png" alt="mini card unfolded" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-zoom-dark.png" alt="mini card unfolded, dark theme" width="400"> |

### Heating Overview Card

The whole home floor by floor: the summary (one zone of four heating, average room temperature from the office, the coldest, to the bathroom, the warmest, average target), the open window and the pilot wire radiators per order, the quick actions and one tile per zone (the living room's pilot wire radiator and schedule on its tile).

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card.png" alt="overview card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-dark.png" alt="overview card, dark theme" width="400"> |

A quick action asks first, at the top of the card: the zones it sets, and those it cannot reach (here the office, turned off). The thermostats without a frost protection preset take *Away*, the pilot wire radiators their frost protection order.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-confirm.png" alt="quick action confirmation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-confirm-dark.png" alt="quick action confirmation, dark theme" width="400"> |

Compact tiles without the quick actions, coldest zone first (`compact: true`, `show_actions: false`, `sort: temperature`): the bedroom's open window is a dot on its icon.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-compact.png" alt="compact overview" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-compact-dark.png" alt="compact overview, dark theme" width="380"> |

A tap on a zone unfolds the full card on it, as on the mini card (see [above](#heating-mini-card)).

### Narrow cards

The full card at 6 columns of a narrow Sections view (238 px): the tabs scroll, the segments not selected keep their icon only. The mini card at 6 columns of a phone (170 px): the status pill keeps its dot, the rows drop their icon.

| Full card | Mini card |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-narrow.png" alt="narrow card" width="240"> <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/card-narrow-dark.png" alt="narrow card, dark theme" width="240"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-narrow.png" alt="narrow mini card" width="180"> <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/mini-card-narrow-dark.png" alt="narrow mini card, dark theme" width="180"> |

The overview at 6 columns of a narrow Sections view (238 px): the summary keeps one row without its icons, the quick actions keep their icon, one tile per row.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-narrow.png" alt="narrow overview" width="240"> | <img src="https://raw.githubusercontent.com/juju35/ha-heating-card/main/screenshots/overview-card-narrow-dark.png" alt="narrow overview, dark theme" width="240"> |

## How it works

### Zones

Without `zones`, the cards take every heating thermostat (a `climate` entity with a heating mode and no cooling, drying or fan-only mode) and every pilot wire `select` of the instance (except the selects of an air conditioner's or a fan's device), hidden entities left out, and group them by area, in the order of the area registry: an area's first thermostat, all its pilot wire radiators and its schedule helper make one zone; a zone without thermostat takes the area's temperature and humidity sensors. A second thermostat in an area (named after its device), and entities without an area, get a zone of their own.

### Thermostats

The sensors of a thermostat's device are found through the entity registry, by translation key, entity id (English, French, German and Spanish) or device class: room and outdoor temperature, humidity, power, valve opening, open-window detection and battery. A thermostat heats when its `hvac_action` says so (`heating`, `preheating`), or, without `hvac_action`, while its valve is open. The power button turns the thermostat off with `climate.set_hvac_mode` (`climate.turn_off` when it has no off mode) and back on with `set_hvac_mode` in the mode it had before the card turned it off (else *Heat*, *Auto*, then *Heat/Cool*), which every thermostat takes, unlike `climate.turn_on`. A target change is shown at once, sent 0.9 s after the last tap, and kept on screen until the entity reports it (10 s at most); a target still waiting when the card is removed is sent right away.

### Pilot wire

A `select` is a pilot wire radiator when at least three of its options are pilot wire orders. A button calls `select.select_option` with the select's own spelling of the order. A `switch` relay offers the two orders of `switch_on` and `switch_off` and calls `switch.turn_on` / `turn_off`.

### Overview

The overview takes the same zones as the other cards (found by area, or `zones`), less `exclude`, plus `include`, kept by `areas` / `floors` and their exclusions, and groups them by the floor of their area (`hass.floors`, Home Assistant 2024.4 or later). A zone heats as on the other cards (`hvac_action`, else its valve); the averages take every zone with a room temperature, and the thermostats that are on with a single target.

A quick action sets every zone it can reach, once confirmed:

| Quick action | Thermostat (on) | Pilot wire radiator |
|---|---|---|
| `comfort` | Preset *comfort*, else *home*, else *none* (manual) | Comfort |
| `eco` | Preset *eco* | Eco |
| `frost` | Preset *frost protection*, else *away* | Frost protection |
| `away` | Preset *away*, else *frost protection*, else *eco* | Frost protection, else eco |
| `off` | Turned off (`set_hvac_mode: off`, else `climate.turn_off`) | Off |

A thermostat turned off or offline is left as it is (only `off` reaches it, as already off), and so is a device without such a preset or order: the confirmation lists the zones left out. A quick action every zone it reaches has already taken shows as pressed.

### Schedules

The week is read once per state change of the schedule with `schedule.get_schedule`, else with the list of the schedule helpers created in the UI (matched by unique id or name), and shared by every card of the page. The "now" line moves every minute.

## Development

```bash
npm install
npm run build        # bundles src/heating-card.js into dist/heating-card.js and its dist/heating-card.i18n.<lang>.js translations
npm run check        # builds and checks the card (run in CI)
npm test             # unit tests (and, with Playwright and Chromium installed, the layout tests)
npm run screenshots  # renders the cards (and one GIF per animated state, needs ffmpeg) with mock data into screenshots/
```

`dist/` is not committed: `npm run build` creates it locally, CI builds it on every push, and the release workflow attaches the built files to the release, which is where the Marketplace installs it from. Screenshots are compared pixel by pixel with the committed ones, exactly: the **Screenshots** workflow commits them on the pull request's branch only when they change.

### Releasing

1. Bump `version` in `package.json` (and `package-lock.json`, with `npm install`)
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-heating-card/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow builds the card, creates the tag and the GitHub release with the changelog section as notes, and attaches `heating-card.js` and its translation files

## Translations

The cards auto-detect the language from your Home Assistant settings. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (European; also used for `pt-BR`) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Contributions for additional languages are welcome!

## Credits

The thermostat illustrations and the thermostat logic come from [ha-climate-air-card](https://github.com/juju35/ha-climate-air-card). Icons from [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache License 2.0). Netatmo, tado°, Heatzy, Nodon and Legrand are trademarks of their respective owners; this project is not affiliated with them.

## License

[MIT](https://github.com/juju35/ha-heating-card/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
