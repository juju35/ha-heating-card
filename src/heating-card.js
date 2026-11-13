/*
 * Heating Card for Home Assistant
 * https://github.com/juju35/ha-heating-card
 *
 * Lovelace cards for the heating of a home: thermostats (`climate` entities that heat but cannot cool, dry or blow:
 * wall thermostats, electric radiators, radiator valves), pilot wire radiators (`select` entities offering comfort,
 * eco, frost protection, off, comfort -1 / -2, or a `switch` relay) and their weekly `schedule` helpers, room by room.
 *
 * The thermostat part comes from the thermostat card of juju35/ha-climate-air-card (illustrations, device sensors
 * found through the registries, debounced target, presets, alerts), extended with zones, pilot wire and schedules;
 * the overview card takes over the thermostats of that repository's overview: the whole home floor by floor, with its
 * summary and quick actions for every zone.
 * Entities are resolved through the entity, device and area registries, so they work whatever the Home Assistant
 * language or entity ids.
 */

const VERSION = "__VERSION__";
const REPO = "https://github.com/juju35/ha-heating-card";

const STRINGS = {
  en: {
    title: "Heating",
    zone: "Zone",
    st_heating: "Heating",
    st_preheating: "Preheating",
    st_idle: "Idle",
    st_off: "Off",
    st_unavailable: "Unavailable",
    st_defrosting: "Defrosting",
    zones_heating: "{n} of {total} zones heating",
    zones_none: "{total} zones, none heating",
    target: "Target",
    target_low: "Heat to",
    target_high: "Cool to",
    temp_down: "Lower the target",
    temp_up: "Raise the target",
    outdoor: "Outdoor",
    valve: "Valve",
    window_open: "Window open",
    battery_low: "Low battery",
    offline: "Device offline",
    power: "Power",
    preset: "Preset",
    fan_mode: "Fan mode",
    swing_mode: "Swing mode",
    swing_horizontal_mode: "Horizontal swing",
    target_humidity: "Target humidity",
    options: "Options",
    pilot_wire: "Pilot wire",
    schedule: "Schedule",
    mode_heat: "Heat",
    mode_auto: "Auto",
    mode_heat_cool: "Heat/Cool",
    mode_off: "Off",
    p_none: "Manual",
    p_manual: "Manual",
    p_comfort: "Comfort",
    p_comfort_1: "Comfort −1",
    p_comfort_2: "Comfort −2",
    p_eco: "Eco",
    p_frost: "Frost protection",
    p_off: "Off",
    p_away: "Away",
    p_boost: "Boost",
    p_home: "Home",
    p_sleep: "Sleep",
    p_activity: "Activity",
    p_schedule: "Schedule",
    sch_on_until: "On until {time}",
    sch_off_until: "Off until {time}",
    sch_on: "On",
    sch_off: "Off",
    sch_loading: "Loading the week…",
    sch_none: "The week of this schedule could not be read",
    sw_child_lock: "Child lock",
    sw_window_detection: "Window detection",
    sw_frost: "Frost protection",
    sw_eco: "Eco",
    sw_display: "Display",
    sw_sound: "Sound",
    sw_boost: "Boost",
    sw_light: "Light",
    no_zone: "No heating thermostat or pilot wire radiator found",
    not_found: "Entity not found",
    zoom_in: "Show the full card",
    zoom_out: "Back to the compact view",
    ill_auto: "Automatic",
    ill_dial: "Wall thermostat",
    ill_radiator: "Radiator",
    ill_valve: "Radiator valve",
    ed_title: "Title",
    ed_zone: "Zone {n}",
    ed_add_zone: "Add a zone",
    ed_zones_auto: "Without zones, every heating thermostat and pilot wire radiator is found, grouped by area",
    ed_name: "Name",
    ed_entity: "Thermostat",
    ed_pilot_wire: "Pilot wire radiators",
    ed_temperature: "Room temperature",
    ed_humidity: "Humidity",
    ed_schedule: "Schedule",
    ed_window: "Window",
    ed_illustration: "Illustration",
    ed_switch_on: "Relay on",
    ed_switch_off: "Relay off",
    ed_switch_on_helper: "Order sent by a pilot wire relay (switch) when on",
    ed_switch_off_helper: "Order sent by a pilot wire relay (switch) when off",
    ed_show_title: "Title",
    ed_show_subtitle: "Subtitle",
    ed_show_controls: "Controls",
    ed_show_sensors: "Measurements",
    ed_show_alerts: "Alerts",
    ed_show_pilot_wire: "Pilot wire",
    ed_show_schedule: "Schedule",
    ed_zoom: "Detail button",
    ed_zoom_helper: "Button at the top right that switches the mini card to the full card and back",
    ed_collapsed: "Folded sections",
    ed_language: "Language",
    ed_language_auto: "Automatic (Home Assistant)",
    ov_average: "Average",
    ov_actions: "All zones",
    ov_confirm: "Set the heating to {mode}?",
    ov_skipped: "Not available in: {list}",
    ov_cancel: "Cancel",
    ov_apply: "Confirm",
    ov_coldest: "Coldest: {name}",
    ov_warmest: "Warmest: {name}",
    ov_other: "Other areas",
    ed_areas: "Areas",
    ed_areas_helper: "Only the zones of these areas (every area when empty)",
    ed_exclude_areas: "Areas to exclude",
    ed_floors: "Floors",
    ed_floors_helper: "Only the zones of these floors (every floor when empty)",
    ed_exclude_floors: "Floors to exclude",
    ed_include: "Entities to add",
    ed_include_helper: "Thermostats or pilot wire radiators not found on their own (hidden ones, say)",
    ed_exclude: "Entities to exclude",
    ed_sort: "Sort",
    ed_sort_area: "Area order",
    ed_sort_name: "Name",
    ed_sort_temperature: "Coldest first",
    ed_sort_state: "Alerts and heating first",
    ed_group_by: "Group by",
    ed_group_floor: "Floor",
    ed_group_none: "No grouping",
    ed_columns: "Columns",
    ed_columns_helper: "Automatic when empty",
    ed_compact: "Compact tiles",
    ed_show_summary: "Summary",
    ed_show_actions: "Quick actions",
    ed_actions: "Quick actions offered",
    ed_detail: "Tap on a zone",
    ed_detail_card: "Full card",
    ed_detail_more_info: "More info dialog",
    ed_detail_none: "Nothing",
    ed_ov_zoom_helper: "Button at the top right that switches to the full card and back",
  },
  fr: {
    title: "Chauffage",
    zone: "Zone",
    st_heating: "Chauffe",
    st_preheating: "Préchauffage",
    st_idle: "En veille",
    st_off: "Arrêt",
    st_unavailable: "Indisponible",
    st_defrosting: "Dégivrage",
    zones_heating: "{n} zones sur {total} chauffent",
    zones_none: "{total} zones, aucune ne chauffe",
    target: "Consigne",
    target_low: "Chauffer à",
    target_high: "Refroidir à",
    temp_down: "Baisser la consigne",
    temp_up: "Monter la consigne",
    outdoor: "Extérieur",
    valve: "Vanne",
    window_open: "Fenêtre ouverte",
    battery_low: "Batterie faible",
    offline: "Appareil hors ligne",
    power: "Marche / arrêt",
    preset: "Préréglage",
    fan_mode: "Mode de ventilation",
    swing_mode: "Oscillation",
    swing_horizontal_mode: "Oscillation horizontale",
    target_humidity: "Humidité cible",
    options: "Options",
    pilot_wire: "Fil pilote",
    schedule: "Planning",
    mode_heat: "Chauffage",
    mode_auto: "Auto",
    mode_heat_cool: "Chaud/froid",
    mode_off: "Arrêt",
    p_none: "Manuel",
    p_manual: "Manuel",
    p_comfort: "Confort",
    p_comfort_1: "Confort −1",
    p_comfort_2: "Confort −2",
    p_eco: "Éco",
    p_frost: "Hors-gel",
    p_off: "Arrêt",
    p_away: "Absence",
    p_boost: "Boost",
    p_home: "Présence",
    p_sleep: "Nuit",
    p_activity: "Activité",
    p_schedule: "Planning",
    sch_on_until: "Actif jusqu'à {time}",
    sch_off_until: "Inactif jusqu'à {time}",
    sch_on: "Actif",
    sch_off: "Inactif",
    sch_loading: "Chargement de la semaine…",
    sch_none: "La semaine de ce planning n'a pas pu être lue",
    sw_child_lock: "Sécurité enfant",
    sw_window_detection: "Détection de fenêtre",
    sw_frost: "Hors-gel",
    sw_eco: "Éco",
    sw_display: "Affichage",
    sw_sound: "Son",
    sw_boost: "Boost",
    sw_light: "Voyant",
    no_zone: "Aucun thermostat de chauffage ni radiateur fil pilote trouvé",
    not_found: "Entité introuvable",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Revenir à la vue compacte",
    ill_auto: "Automatique",
    ill_dial: "Thermostat mural",
    ill_radiator: "Radiateur",
    ill_valve: "Tête thermostatique",
    ed_title: "Titre",
    ed_zone: "Zone {n}",
    ed_add_zone: "Ajouter une zone",
    ed_zones_auto: "Sans zone, tous les thermostats de chauffage et radiateurs fil pilote sont trouvés, regroupés par pièce",
    ed_name: "Nom",
    ed_entity: "Thermostat",
    ed_pilot_wire: "Radiateurs fil pilote",
    ed_temperature: "Température de la pièce",
    ed_humidity: "Humidité",
    ed_schedule: "Planning",
    ed_window: "Fenêtre",
    ed_illustration: "Illustration",
    ed_switch_on: "Relais allumé",
    ed_switch_off: "Relais éteint",
    ed_switch_on_helper: "Ordre envoyé par un relais fil pilote (switch) allumé",
    ed_switch_off_helper: "Ordre envoyé par un relais fil pilote (switch) éteint",
    ed_show_title: "Titre",
    ed_show_subtitle: "Sous-titre",
    ed_show_controls: "Commandes",
    ed_show_sensors: "Mesures",
    ed_show_alerts: "Alertes",
    ed_show_pilot_wire: "Fil pilote",
    ed_show_schedule: "Planning",
    ed_zoom: "Bouton détail",
    ed_zoom_helper: "Bouton en haut à droite qui bascule la mini-carte vers la carte complète et inversement",
    ed_collapsed: "Sections repliées",
    ed_language: "Langue",
    ed_language_auto: "Automatique (Home Assistant)",
    ov_average: "Moyenne",
    ov_actions: "Toutes les zones",
    ov_confirm: "Passer le chauffage en {mode} ?",
    ov_skipped: "Non disponible dans : {list}",
    ov_cancel: "Annuler",
    ov_apply: "Confirmer",
    ov_coldest: "La plus froide : {name}",
    ov_warmest: "La plus chaude : {name}",
    ov_other: "Autres pièces",
    ed_areas: "Pièces",
    ed_areas_helper: "Seulement les zones de ces pièces (toutes si vide)",
    ed_exclude_areas: "Pièces à exclure",
    ed_floors: "Étages",
    ed_floors_helper: "Seulement les zones de ces étages (tous si vide)",
    ed_exclude_floors: "Étages à exclure",
    ed_include: "Entités à ajouter",
    ed_include_helper: "Thermostats ou radiateurs fil pilote non trouvés d'eux-mêmes (masqués, par exemple)",
    ed_exclude: "Entités à exclure",
    ed_sort: "Tri",
    ed_sort_area: "Ordre des pièces",
    ed_sort_name: "Nom",
    ed_sort_temperature: "Les plus froides d'abord",
    ed_sort_state: "Alertes et chauffe d'abord",
    ed_group_by: "Regrouper par",
    ed_group_floor: "Étage",
    ed_group_none: "Sans regroupement",
    ed_columns: "Colonnes",
    ed_columns_helper: "Automatique si vide",
    ed_compact: "Tuiles compactes",
    ed_show_summary: "Résumé",
    ed_show_actions: "Actions rapides",
    ed_actions: "Actions rapides proposées",
    ed_detail: "Appui sur une zone",
    ed_detail_card: "Carte complète",
    ed_detail_more_info: "Fenêtre d'informations",
    ed_detail_none: "Rien",
    ed_ov_zoom_helper: "Bouton en haut à droite qui bascule vers la carte complète et inversement",
  },
  de: {
    title: "Heizung",
    zone: "Zone",
    st_heating: "Heizt",
    st_preheating: "Vorheizen",
    st_idle: "Leerlauf",
    st_off: "Aus",
    st_unavailable: "Nicht verfügbar",
    st_defrosting: "Abtauen",
    zones_heating: "{n} von {total} Zonen heizen",
    zones_none: "{total} Zonen, keine heizt",
    target: "Soll",
    target_low: "Heizen auf",
    target_high: "Kühlen auf",
    temp_down: "Solltemperatur senken",
    temp_up: "Solltemperatur erhöhen",
    outdoor: "Außen",
    valve: "Ventil",
    window_open: "Fenster offen",
    battery_low: "Batterie schwach",
    offline: "Gerät offline",
    power: "Ein / Aus",
    preset: "Voreinstellung",
    fan_mode: "Lüftermodus",
    swing_mode: "Schwenkmodus",
    swing_horizontal_mode: "Horizontales Schwenken",
    target_humidity: "Zielfeuchtigkeit",
    options: "Optionen",
    pilot_wire: "Steuerdraht",
    schedule: "Zeitplan",
    mode_heat: "Heizen",
    mode_auto: "Auto",
    mode_heat_cool: "Heizen/Kühlen",
    mode_off: "Aus",
    p_none: "Manuell",
    p_manual: "Manuell",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Frostschutz",
    p_off: "Aus",
    p_away: "Abwesend",
    p_boost: "Boost",
    p_home: "Zuhause",
    p_sleep: "Schlafen",
    p_activity: "Aktivität",
    p_schedule: "Zeitplan",
    sch_on_until: "An bis {time}",
    sch_off_until: "Aus bis {time}",
    sch_on: "An",
    sch_off: "Aus",
    sch_loading: "Woche wird geladen…",
    sch_none: "Die Woche dieses Zeitplans konnte nicht gelesen werden",
    sw_child_lock: "Kindersicherung",
    sw_window_detection: "Fenstererkennung",
    sw_frost: "Frostschutz",
    sw_eco: "Eco",
    sw_display: "Anzeige",
    sw_sound: "Ton",
    sw_boost: "Boost",
    sw_light: "Licht",
    no_zone: "Kein Heizungsthermostat und kein Steuerdraht-Heizkörper gefunden",
    not_found: "Entität nicht gefunden",
    zoom_in: "Ganze Karte anzeigen",
    zoom_out: "Zurück zur kompakten Ansicht",
    ill_auto: "Automatisch",
    ill_dial: "Wandthermostat",
    ill_radiator: "Heizkörper",
    ill_valve: "Heizkörperthermostat",
    ed_title: "Titel",
    ed_zone: "Zone {n}",
    ed_add_zone: "Zone hinzufügen",
    ed_zones_auto: "Ohne Zonen werden alle Heizungsthermostate und Steuerdraht-Heizkörper gefunden, nach Bereich gruppiert",
    ed_name: "Name",
    ed_entity: "Thermostat",
    ed_pilot_wire: "Steuerdraht-Heizkörper",
    ed_temperature: "Raumtemperatur",
    ed_humidity: "Luftfeuchtigkeit",
    ed_schedule: "Zeitplan",
    ed_window: "Fenster",
    ed_illustration: "Illustration",
    ed_switch_on: "Relais an",
    ed_switch_off: "Relais aus",
    ed_switch_on_helper: "Befehl eines Steuerdraht-Relais (Switch), wenn an",
    ed_switch_off_helper: "Befehl eines Steuerdraht-Relais (Switch), wenn aus",
    ed_show_title: "Titel",
    ed_show_subtitle: "Untertitel",
    ed_show_controls: "Bedienelemente",
    ed_show_sensors: "Messwerte",
    ed_show_alerts: "Warnungen",
    ed_show_pilot_wire: "Steuerdraht",
    ed_show_schedule: "Zeitplan",
    ed_zoom: "Detail-Schaltfläche",
    ed_zoom_helper: "Schaltfläche oben rechts, die die Mini-Karte zur ganzen Karte umschaltet und zurück",
    ed_collapsed: "Eingeklappte Abschnitte",
    ed_language: "Sprache",
    ed_language_auto: "Automatisch (Home Assistant)",
    ov_average: "Durchschnitt",
    ov_actions: "Alle Zonen",
    ov_confirm: "Heizung auf {mode} stellen?",
    ov_skipped: "Nicht verfügbar in: {list}",
    ov_cancel: "Abbrechen",
    ov_apply: "Bestätigen",
    ov_coldest: "Am kältesten: {name}",
    ov_warmest: "Am wärmsten: {name}",
    ov_other: "Weitere Bereiche",
    ed_areas: "Bereiche",
    ed_areas_helper: "Nur die Zonen dieser Bereiche (alle, wenn leer)",
    ed_exclude_areas: "Auszuschließende Bereiche",
    ed_floors: "Etagen",
    ed_floors_helper: "Nur die Zonen dieser Etagen (alle, wenn leer)",
    ed_exclude_floors: "Auszuschließende Etagen",
    ed_include: "Hinzuzufügende Entitäten",
    ed_include_helper: "Thermostate oder Steuerdraht-Heizkörper, die nicht von selbst gefunden werden (z. B. ausgeblendete)",
    ed_exclude: "Auszuschließende Entitäten",
    ed_sort: "Sortierung",
    ed_sort_area: "Reihenfolge der Bereiche",
    ed_sort_name: "Name",
    ed_sort_temperature: "Kälteste zuerst",
    ed_sort_state: "Warnungen und Heizen zuerst",
    ed_group_by: "Gruppieren nach",
    ed_group_floor: "Etage",
    ed_group_none: "Keine Gruppierung",
    ed_columns: "Spalten",
    ed_columns_helper: "Automatisch, wenn leer",
    ed_compact: "Kompakte Kacheln",
    ed_show_summary: "Übersicht",
    ed_show_actions: "Schnellaktionen",
    ed_actions: "Angebotene Schnellaktionen",
    ed_detail: "Tippen auf eine Zone",
    ed_detail_card: "Ganze Karte",
    ed_detail_more_info: "Infodialog",
    ed_detail_none: "Nichts",
    ed_ov_zoom_helper: "Schaltfläche oben rechts, die zur ganzen Karte umschaltet und zurück",
  },
  es: {
    title: "Calefacción",
    zone: "Zona",
    st_heating: "Calentando",
    st_preheating: "Precalentando",
    st_idle: "En espera",
    st_off: "Apagado",
    st_unavailable: "No disponible",
    st_defrosting: "Descongelando",
    zones_heating: "{n} de {total} zonas calentando",
    zones_none: "{total} zonas, ninguna calentando",
    target: "Objetivo",
    target_low: "Calentar a",
    target_high: "Enfriar a",
    temp_down: "Bajar el objetivo",
    temp_up: "Subir el objetivo",
    outdoor: "Exterior",
    valve: "Válvula",
    window_open: "Ventana abierta",
    battery_low: "Batería baja",
    offline: "Dispositivo sin conexión",
    power: "Encender / apagar",
    preset: "Preajuste",
    fan_mode: "Modo del ventilador",
    swing_mode: "Oscilación",
    swing_horizontal_mode: "Oscilación horizontal",
    target_humidity: "Humedad objetivo",
    options: "Opciones",
    pilot_wire: "Hilo piloto",
    schedule: "Programa",
    mode_heat: "Calor",
    mode_auto: "Auto",
    mode_heat_cool: "Calor/frío",
    mode_off: "Apagado",
    p_none: "Manual",
    p_manual: "Manual",
    p_comfort: "Confort",
    p_comfort_1: "Confort −1",
    p_comfort_2: "Confort −2",
    p_eco: "Eco",
    p_frost: "Antihielo",
    p_off: "Apagado",
    p_away: "Ausente",
    p_boost: "Boost",
    p_home: "En casa",
    p_sleep: "Noche",
    p_activity: "Actividad",
    p_schedule: "Programa",
    sch_on_until: "Activo hasta las {time}",
    sch_off_until: "Inactivo hasta las {time}",
    sch_on: "Activo",
    sch_off: "Inactivo",
    sch_loading: "Cargando la semana…",
    sch_none: "No se pudo leer la semana de este programa",
    sw_child_lock: "Bloqueo infantil",
    sw_window_detection: "Detección de ventana",
    sw_frost: "Antihielo",
    sw_eco: "Eco",
    sw_display: "Pantalla",
    sw_sound: "Sonido",
    sw_boost: "Boost",
    sw_light: "Luz",
    no_zone: "No se encontró ningún termostato de calefacción ni radiador de hilo piloto",
    not_found: "Entidad no encontrada",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Volver a la vista compacta",
    ill_auto: "Automática",
    ill_dial: "Termostato de pared",
    ill_radiator: "Radiador",
    ill_valve: "Válvula termostática",
    ed_title: "Título",
    ed_zone: "Zona {n}",
    ed_add_zone: "Añadir una zona",
    ed_zones_auto: "Sin zonas, se encuentran todos los termostatos de calefacción y radiadores de hilo piloto, agrupados por área",
    ed_name: "Nombre",
    ed_entity: "Termostato",
    ed_pilot_wire: "Radiadores de hilo piloto",
    ed_temperature: "Temperatura de la habitación",
    ed_humidity: "Humedad",
    ed_schedule: "Programa",
    ed_window: "Ventana",
    ed_illustration: "Ilustración",
    ed_switch_on: "Relé encendido",
    ed_switch_off: "Relé apagado",
    ed_switch_on_helper: "Orden enviada por un relé de hilo piloto (switch) encendido",
    ed_switch_off_helper: "Orden enviada por un relé de hilo piloto (switch) apagado",
    ed_show_title: "Título",
    ed_show_subtitle: "Subtítulo",
    ed_show_controls: "Controles",
    ed_show_sensors: "Mediciones",
    ed_show_alerts: "Alertas",
    ed_show_pilot_wire: "Hilo piloto",
    ed_show_schedule: "Programa",
    ed_zoom: "Botón de detalle",
    ed_zoom_helper: "Botón arriba a la derecha que cambia la mini tarjeta a la tarjeta completa y viceversa",
    ed_collapsed: "Secciones plegadas",
    ed_language: "Idioma",
    ed_language_auto: "Automático (Home Assistant)",
    ov_average: "Media",
    ov_actions: "Todas las zonas",
    ov_confirm: "¿Poner la calefacción en {mode}?",
    ov_skipped: "No disponible en: {list}",
    ov_cancel: "Cancelar",
    ov_apply: "Confirmar",
    ov_coldest: "La más fría: {name}",
    ov_warmest: "La más cálida: {name}",
    ov_other: "Otras áreas",
    ed_areas: "Áreas",
    ed_areas_helper: "Solo las zonas de estas áreas (todas si está vacío)",
    ed_exclude_areas: "Áreas a excluir",
    ed_floors: "Plantas",
    ed_floors_helper: "Solo las zonas de estas plantas (todas si está vacío)",
    ed_exclude_floors: "Plantas a excluir",
    ed_include: "Entidades a añadir",
    ed_include_helper: "Termostatos o radiadores de hilo piloto que no se encuentran solos (ocultos, por ejemplo)",
    ed_exclude: "Entidades a excluir",
    ed_sort: "Orden",
    ed_sort_area: "Orden de las áreas",
    ed_sort_name: "Nombre",
    ed_sort_temperature: "Las más frías primero",
    ed_sort_state: "Alertas y calefacción primero",
    ed_group_by: "Agrupar por",
    ed_group_floor: "Planta",
    ed_group_none: "Sin agrupar",
    ed_columns: "Columnas",
    ed_columns_helper: "Automático si está vacío",
    ed_compact: "Mosaicos compactos",
    ed_show_summary: "Resumen",
    ed_show_actions: "Acciones rápidas",
    ed_actions: "Acciones rápidas ofrecidas",
    ed_detail: "Toque en una zona",
    ed_detail_card: "Tarjeta completa",
    ed_detail_more_info: "Diálogo de información",
    ed_detail_none: "Nada",
    ed_ov_zoom_helper: "Botón arriba a la derecha que cambia a la tarjeta completa y viceversa",
  },
  sr: {
    title: "Грејање",
    zone: "Зона",
    st_heating: "Греје",
    st_preheating: "Предгревање",
    st_idle: "Мировање",
    st_off: "Искључено",
    st_unavailable: "Недоступно",
    st_defrosting: "Одмрзавање",
    zones_heating: "{n} од {total} зона греје",
    zones_none: "{total} зона, ниједна не греје",
    target: "Циљ",
    target_low: "Грејати на",
    target_high: "Хладити на",
    temp_down: "Смањи циљ",
    temp_up: "Повећај циљ",
    outdoor: "Напољу",
    valve: "Вентил",
    window_open: "Прозор отворен",
    battery_low: "Слаба батерија",
    offline: "Уређај ван мреже",
    power: "Укључи / искључи",
    preset: "Унапред подешено",
    fan_mode: "Режим вентилатора",
    swing_mode: "Осциловање",
    swing_horizontal_mode: "Хоризонтално осциловање",
    target_humidity: "Циљна влажност",
    options: "Опције",
    pilot_wire: "Пилот жица",
    schedule: "Распоред",
    mode_heat: "Грејање",
    mode_auto: "Ауто",
    mode_heat_cool: "Грејање/хлађење",
    mode_off: "Искључено",
    p_none: "Ручно",
    p_manual: "Ручно",
    p_comfort: "Комфор",
    p_comfort_1: "Комфор −1",
    p_comfort_2: "Комфор −2",
    p_eco: "Еко",
    p_frost: "Заштита од мраза",
    p_off: "Искључено",
    p_away: "Одсутан",
    p_boost: "Појачано",
    p_home: "Код куће",
    p_sleep: "Спавање",
    p_activity: "Активност",
    p_schedule: "Распоред",
    sch_on_until: "Укључено до {time}",
    sch_off_until: "Искључено до {time}",
    sch_on: "Укључено",
    sch_off: "Искључено",
    sch_loading: "Учитавање недеље…",
    sch_none: "Недеља овог распореда није могла да се прочита",
    sw_child_lock: "Заштита за децу",
    sw_window_detection: "Детекција прозора",
    sw_frost: "Заштита од мраза",
    sw_eco: "Еко",
    sw_display: "Екран",
    sw_sound: "Звук",
    sw_boost: "Појачано",
    sw_light: "Светло",
    no_zone: "Није пронађен термостат за грејање ни радијатор са пилот жицом",
    not_found: "Ентитет није пронађен",
    zoom_in: "Прикажи целу картицу",
    zoom_out: "Назад на компактни приказ",
    ill_auto: "Аутоматски",
    ill_dial: "Зидни термостат",
    ill_radiator: "Радијатор",
    ill_valve: "Термостатски вентил",
    ed_title: "Наслов",
    ed_zone: "Зона {n}",
    ed_add_zone: "Додај зону",
    ed_zones_auto: "Без зона, сви термостати за грејање и радијатори са пилот жицом се проналазе, груписани по просторији",
    ed_name: "Назив",
    ed_entity: "Термостат",
    ed_pilot_wire: "Радијатори са пилот жицом",
    ed_temperature: "Температура просторије",
    ed_humidity: "Влажност",
    ed_schedule: "Распоред",
    ed_window: "Прозор",
    ed_illustration: "Илустрација",
    ed_switch_on: "Релеј укључен",
    ed_switch_off: "Релеј искључен",
    ed_switch_on_helper: "Налог који шаље релеј пилот жице (switch) када је укључен",
    ed_switch_off_helper: "Налог који шаље релеј пилот жице (switch) када је искључен",
    ed_show_title: "Наслов",
    ed_show_subtitle: "Поднаслов",
    ed_show_controls: "Команде",
    ed_show_sensors: "Мерења",
    ed_show_alerts: "Упозорења",
    ed_show_pilot_wire: "Пилот жица",
    ed_show_schedule: "Распоред",
    ed_zoom: "Дугме за детаље",
    ed_zoom_helper: "Дугме горе десно које пребацује мини картицу на целу картицу и назад",
    ed_collapsed: "Скупљени одељци",
    ed_language: "Језик",
    ed_language_auto: "Аутоматски (Home Assistant)",
    ov_average: "Просек",
    ov_actions: "Све зоне",
    ov_confirm: "Подесити грејање на {mode}?",
    ov_skipped: "Није доступно у: {list}",
    ov_cancel: "Откажи",
    ov_apply: "Потврди",
    ov_coldest: "Најхладнија: {name}",
    ov_warmest: "Најтоплија: {name}",
    ov_other: "Остале просторије",
    ed_areas: "Просторије",
    ed_areas_helper: "Само зоне ових просторија (све ако је празно)",
    ed_exclude_areas: "Просторије за изостављање",
    ed_floors: "Спратови",
    ed_floors_helper: "Само зоне ових спратова (сви ако је празно)",
    ed_exclude_floors: "Спратови за изостављање",
    ed_include: "Ентитети за додавање",
    ed_include_helper: "Термостати или радијатори са пилот жицом који се не проналазе сами (нпр. скривени)",
    ed_exclude: "Ентитети за изостављање",
    ed_sort: "Сортирање",
    ed_sort_area: "Редослед просторија",
    ed_sort_name: "Назив",
    ed_sort_temperature: "Најхладније прво",
    ed_sort_state: "Прво упозорења и грејање",
    ed_group_by: "Групиши по",
    ed_group_floor: "Спрат",
    ed_group_none: "Без груписања",
    ed_columns: "Колоне",
    ed_columns_helper: "Аутоматски ако је празно",
    ed_compact: "Компактне плочице",
    ed_show_summary: "Резиме",
    ed_show_actions: "Брзе радње",
    ed_actions: "Понуђене брзе радње",
    ed_detail: "Додир на зону",
    ed_detail_card: "Цела картица",
    ed_detail_more_info: "Дијалог са информацијама",
    ed_detail_none: "Ништа",
    ed_ov_zoom_helper: "Дугме горе десно које пребацује на целу картицу и назад",
  },
  "sr-Latn": {
    title: "Grejanje",
    zone: "Zona",
    st_heating: "Greje",
    st_preheating: "Predgrevanje",
    st_idle: "Mirovanje",
    st_off: "Isključeno",
    st_unavailable: "Nedostupno",
    st_defrosting: "Odmrzavanje",
    zones_heating: "{n} od {total} zona greje",
    zones_none: "{total} zona, nijedna ne greje",
    target: "Cilj",
    target_low: "Grejati na",
    target_high: "Hladiti na",
    temp_down: "Smanji cilj",
    temp_up: "Povećaj cilj",
    outdoor: "Napolju",
    valve: "Ventil",
    window_open: "Prozor otvoren",
    battery_low: "Slaba baterija",
    offline: "Uređaj van mreže",
    power: "Uključi / isključi",
    preset: "Unapred podešeno",
    fan_mode: "Režim ventilatora",
    swing_mode: "Oscilovanje",
    swing_horizontal_mode: "Horizontalno oscilovanje",
    target_humidity: "Ciljna vlažnost",
    options: "Opcije",
    pilot_wire: "Pilot žica",
    schedule: "Raspored",
    mode_heat: "Grejanje",
    mode_auto: "Auto",
    mode_heat_cool: "Grejanje/hlađenje",
    mode_off: "Isključeno",
    p_none: "Ručno",
    p_manual: "Ručno",
    p_comfort: "Komfor",
    p_comfort_1: "Komfor −1",
    p_comfort_2: "Komfor −2",
    p_eco: "Eko",
    p_frost: "Zaštita od mraza",
    p_off: "Isključeno",
    p_away: "Odsutan",
    p_boost: "Pojačano",
    p_home: "Kod kuće",
    p_sleep: "Spavanje",
    p_activity: "Aktivnost",
    p_schedule: "Raspored",
    sch_on_until: "Uključeno do {time}",
    sch_off_until: "Isključeno do {time}",
    sch_on: "Uključeno",
    sch_off: "Isključeno",
    sch_loading: "Učitavanje nedelje…",
    sch_none: "Nedelja ovog rasporeda nije mogla da se pročita",
    sw_child_lock: "Zaštita za decu",
    sw_window_detection: "Detekcija prozora",
    sw_frost: "Zaštita od mraza",
    sw_eco: "Eko",
    sw_display: "Ekran",
    sw_sound: "Zvuk",
    sw_boost: "Pojačano",
    sw_light: "Svetlo",
    no_zone: "Nije pronađen termostat za grejanje ni radijator sa pilot žicom",
    not_found: "Entitet nije pronađen",
    zoom_in: "Prikaži celu karticu",
    zoom_out: "Nazad na kompaktni prikaz",
    ill_auto: "Automatski",
    ill_dial: "Zidni termostat",
    ill_radiator: "Radijator",
    ill_valve: "Termostatski ventil",
    ed_title: "Naslov",
    ed_zone: "Zona {n}",
    ed_add_zone: "Dodaj zonu",
    ed_zones_auto: "Bez zona, svi termostati za grejanje i radijatori sa pilot žicom se pronalaze, grupisani po prostoriji",
    ed_name: "Naziv",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radijatori sa pilot žicom",
    ed_temperature: "Temperatura prostorije",
    ed_humidity: "Vlažnost",
    ed_schedule: "Raspored",
    ed_window: "Prozor",
    ed_illustration: "Ilustracija",
    ed_switch_on: "Relej uključen",
    ed_switch_off: "Relej isključen",
    ed_switch_on_helper: "Nalog koji šalje relej pilot žice (switch) kada je uključen",
    ed_switch_off_helper: "Nalog koji šalje relej pilot žice (switch) kada je isključen",
    ed_show_title: "Naslov",
    ed_show_subtitle: "Podnaslov",
    ed_show_controls: "Komande",
    ed_show_sensors: "Merenja",
    ed_show_alerts: "Upozorenja",
    ed_show_pilot_wire: "Pilot žica",
    ed_show_schedule: "Raspored",
    ed_zoom: "Dugme za detalje",
    ed_zoom_helper: "Dugme gore desno koje prebacuje mini karticu na celu karticu i nazad",
    ed_collapsed: "Skupljeni odeljci",
    ed_language: "Jezik",
    ed_language_auto: "Automatski (Home Assistant)",
    ov_average: "Prosek",
    ov_actions: "Sve zone",
    ov_confirm: "Podesiti grejanje na {mode}?",
    ov_skipped: "Nije dostupno u: {list}",
    ov_cancel: "Otkaži",
    ov_apply: "Potvrdi",
    ov_coldest: "Najhladnija: {name}",
    ov_warmest: "Najtoplija: {name}",
    ov_other: "Ostale prostorije",
    ed_areas: "Prostorije",
    ed_areas_helper: "Samo zone ovih prostorija (sve ako je prazno)",
    ed_exclude_areas: "Prostorije za izostavljanje",
    ed_floors: "Spratovi",
    ed_floors_helper: "Samo zone ovih spratova (svi ako je prazno)",
    ed_exclude_floors: "Spratovi za izostavljanje",
    ed_include: "Entiteti za dodavanje",
    ed_include_helper: "Termostati ili radijatori sa pilot žicom koji se ne pronalaze sami (npr. skriveni)",
    ed_exclude: "Entiteti za izostavljanje",
    ed_sort: "Sortiranje",
    ed_sort_area: "Redosled prostorija",
    ed_sort_name: "Naziv",
    ed_sort_temperature: "Najhladnije prvo",
    ed_sort_state: "Prvo upozorenja i grejanje",
    ed_group_by: "Grupiši po",
    ed_group_floor: "Sprat",
    ed_group_none: "Bez grupisanja",
    ed_columns: "Kolone",
    ed_columns_helper: "Automatski ako je prazno",
    ed_compact: "Kompaktne pločice",
    ed_show_summary: "Rezime",
    ed_show_actions: "Brze radnje",
    ed_actions: "Ponuđene brze radnje",
    ed_detail: "Dodir na zonu",
    ed_detail_card: "Cela kartica",
    ed_detail_more_info: "Dijalog sa informacijama",
    ed_detail_none: "Ništa",
    ed_ov_zoom_helper: "Dugme gore desno koje prebacuje na celu karticu i nazad",
  },
  it: {
    title: "Riscaldamento",
    zone: "Zona",
    st_heating: "Riscalda",
    st_preheating: "Preriscaldamento",
    st_idle: "Inattivo",
    st_off: "Spento",
    st_unavailable: "Non disponibile",
    st_defrosting: "Sbrinamento",
    zones_heating: "{n} zone su {total} in riscaldamento",
    zones_none: "{total} zone, nessuna in riscaldamento",
    target: "Obiettivo",
    target_low: "Riscalda a",
    target_high: "Raffredda a",
    temp_down: "Abbassa l'obiettivo",
    temp_up: "Alza l'obiettivo",
    outdoor: "Esterno",
    valve: "Valvola",
    window_open: "Finestra aperta",
    battery_low: "Batteria scarica",
    offline: "Dispositivo offline",
    power: "Accendi / spegni",
    preset: "Preimpostazione",
    fan_mode: "Modalità ventola",
    swing_mode: "Oscillazione",
    swing_horizontal_mode: "Oscillazione orizzontale",
    target_humidity: "Umidità desiderata",
    options: "Opzioni",
    pilot_wire: "Filo pilota",
    schedule: "Programma",
    mode_heat: "Caldo",
    mode_auto: "Auto",
    mode_heat_cool: "Caldo/freddo",
    mode_off: "Spento",
    p_none: "Manuale",
    p_manual: "Manuale",
    p_comfort: "Comfort",
    p_comfort_1: "Comfort −1",
    p_comfort_2: "Comfort −2",
    p_eco: "Eco",
    p_frost: "Antigelo",
    p_off: "Spento",
    p_away: "Fuori casa",
    p_boost: "Boost",
    p_home: "A casa",
    p_sleep: "Notte",
    p_activity: "Attività",
    p_schedule: "Programma",
    sch_on_until: "Attivo fino alle {time}",
    sch_off_until: "Inattivo fino alle {time}",
    sch_on: "Attivo",
    sch_off: "Inattivo",
    sch_loading: "Caricamento della settimana…",
    sch_none: "Impossibile leggere la settimana di questo programma",
    sw_child_lock: "Blocco bambini",
    sw_window_detection: "Rilevamento finestra",
    sw_frost: "Antigelo",
    sw_eco: "Eco",
    sw_display: "Display",
    sw_sound: "Suono",
    sw_boost: "Boost",
    sw_light: "Luce",
    no_zone: "Nessun termostato di riscaldamento né radiatore a filo pilota trovato",
    not_found: "Entità non trovata",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Torna alla vista compatta",
    ill_auto: "Automatica",
    ill_dial: "Termostato a parete",
    ill_radiator: "Radiatore",
    ill_valve: "Valvola termostatica",
    ed_title: "Titolo",
    ed_zone: "Zona {n}",
    ed_add_zone: "Aggiungi una zona",
    ed_zones_auto: "Senza zone, vengono trovati tutti i termostati di riscaldamento e i radiatori a filo pilota, raggruppati per area",
    ed_name: "Nome",
    ed_entity: "Termostato",
    ed_pilot_wire: "Radiatori a filo pilota",
    ed_temperature: "Temperatura della stanza",
    ed_humidity: "Umidità",
    ed_schedule: "Programma",
    ed_window: "Finestra",
    ed_illustration: "Illustrazione",
    ed_switch_on: "Relè acceso",
    ed_switch_off: "Relè spento",
    ed_switch_on_helper: "Ordine inviato da un relè a filo pilota (switch) acceso",
    ed_switch_off_helper: "Ordine inviato da un relè a filo pilota (switch) spento",
    ed_show_title: "Titolo",
    ed_show_subtitle: "Sottotitolo",
    ed_show_controls: "Comandi",
    ed_show_sensors: "Misure",
    ed_show_alerts: "Avvisi",
    ed_show_pilot_wire: "Filo pilota",
    ed_show_schedule: "Programma",
    ed_zoom: "Pulsante dettagli",
    ed_zoom_helper: "Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa",
    ed_collapsed: "Sezioni chiuse",
    ed_language: "Lingua",
    ed_language_auto: "Automatica (Home Assistant)",
    ov_average: "Media",
    ov_actions: "Tutte le zone",
    ov_confirm: "Impostare il riscaldamento su {mode}?",
    ov_skipped: "Non disponibile in: {list}",
    ov_cancel: "Annulla",
    ov_apply: "Conferma",
    ov_coldest: "La più fredda: {name}",
    ov_warmest: "La più calda: {name}",
    ov_other: "Altre aree",
    ed_areas: "Aree",
    ed_areas_helper: "Solo le zone di queste aree (tutte se vuoto)",
    ed_exclude_areas: "Aree da escludere",
    ed_floors: "Piani",
    ed_floors_helper: "Solo le zone di questi piani (tutti se vuoto)",
    ed_exclude_floors: "Piani da escludere",
    ed_include: "Entità da aggiungere",
    ed_include_helper: "Termostati o radiatori a filo pilota non trovati da soli (nascosti, per esempio)",
    ed_exclude: "Entità da escludere",
    ed_sort: "Ordinamento",
    ed_sort_area: "Ordine delle aree",
    ed_sort_name: "Nome",
    ed_sort_temperature: "Prima le più fredde",
    ed_sort_state: "Prima avvisi e riscaldamento",
    ed_group_by: "Raggruppa per",
    ed_group_floor: "Piano",
    ed_group_none: "Nessun raggruppamento",
    ed_columns: "Colonne",
    ed_columns_helper: "Automatico se vuoto",
    ed_compact: "Riquadri compatti",
    ed_show_summary: "Riepilogo",
    ed_show_actions: "Azioni rapide",
    ed_actions: "Azioni rapide proposte",
    ed_detail: "Tocco su una zona",
    ed_detail_card: "Scheda completa",
    ed_detail_more_info: "Finestra informazioni",
    ed_detail_none: "Niente",
    ed_ov_zoom_helper: "Pulsante in alto a destra che passa alla scheda completa e viceversa",
  },
  nl: {
    title: "Verwarming",
    zone: "Zone",
    st_heating: "Verwarmt",
    st_preheating: "Voorverwarmen",
    st_idle: "Inactief",
    st_off: "Uit",
    st_unavailable: "Niet beschikbaar",
    st_defrosting: "Ontdooien",
    zones_heating: "{n} van {total} zones verwarmen",
    zones_none: "{total} zones, geen enkele verwarmt",
    target: "Doel",
    target_low: "Verwarmen tot",
    target_high: "Koelen tot",
    temp_down: "Doel verlagen",
    temp_up: "Doel verhogen",
    outdoor: "Buiten",
    valve: "Klep",
    window_open: "Raam open",
    battery_low: "Batterij bijna leeg",
    offline: "Apparaat offline",
    power: "Aan / uit",
    preset: "Voorinstelling",
    fan_mode: "Ventilatorstand",
    swing_mode: "Zwenkmodus",
    swing_horizontal_mode: "Horizontaal zwenken",
    target_humidity: "Doelvochtigheid",
    options: "Opties",
    pilot_wire: "Stuurdraad",
    schedule: "Schema",
    mode_heat: "Verwarmen",
    mode_auto: "Auto",
    mode_heat_cool: "Verwarmen/koelen",
    mode_off: "Uit",
    p_none: "Handmatig",
    p_manual: "Handmatig",
    p_comfort: "Comfort",
    p_comfort_1: "Comfort −1",
    p_comfort_2: "Comfort −2",
    p_eco: "Eco",
    p_frost: "Vorstbeveiliging",
    p_off: "Uit",
    p_away: "Afwezig",
    p_boost: "Boost",
    p_home: "Thuis",
    p_sleep: "Slapen",
    p_activity: "Activiteit",
    p_schedule: "Schema",
    sch_on_until: "Aan tot {time}",
    sch_off_until: "Uit tot {time}",
    sch_on: "Aan",
    sch_off: "Uit",
    sch_loading: "Week laden…",
    sch_none: "De week van dit schema kon niet worden gelezen",
    sw_child_lock: "Kinderslot",
    sw_window_detection: "Raamdetectie",
    sw_frost: "Vorstbeveiliging",
    sw_eco: "Eco",
    sw_display: "Display",
    sw_sound: "Geluid",
    sw_boost: "Boost",
    sw_light: "Lampje",
    no_zone: "Geen verwarmingsthermostaat of stuurdraadradiator gevonden",
    not_found: "Entiteit niet gevonden",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Terug naar de compacte weergave",
    ill_auto: "Automatisch",
    ill_dial: "Wandthermostaat",
    ill_radiator: "Radiator",
    ill_valve: "Radiatorkraan",
    ed_title: "Titel",
    ed_zone: "Zone {n}",
    ed_add_zone: "Zone toevoegen",
    ed_zones_auto: "Zonder zones worden alle verwarmingsthermostaten en stuurdraadradiatoren gevonden, gegroepeerd per ruimte",
    ed_name: "Naam",
    ed_entity: "Thermostaat",
    ed_pilot_wire: "Stuurdraadradiatoren",
    ed_temperature: "Ruimtetemperatuur",
    ed_humidity: "Luchtvochtigheid",
    ed_schedule: "Schema",
    ed_window: "Raam",
    ed_illustration: "Illustratie",
    ed_switch_on: "Relais aan",
    ed_switch_off: "Relais uit",
    ed_switch_on_helper: "Opdracht van een stuurdraadrelais (switch) als het aan staat",
    ed_switch_off_helper: "Opdracht van een stuurdraadrelais (switch) als het uit staat",
    ed_show_title: "Titel",
    ed_show_subtitle: "Ondertitel",
    ed_show_controls: "Bediening",
    ed_show_sensors: "Metingen",
    ed_show_alerts: "Meldingen",
    ed_show_pilot_wire: "Stuurdraad",
    ed_show_schedule: "Schema",
    ed_zoom: "Detailknop",
    ed_zoom_helper: "Knop rechtsboven die de minikaart naar de volledige kaart wisselt en terug",
    ed_collapsed: "Ingeklapte secties",
    ed_language: "Taal",
    ed_language_auto: "Automatisch (Home Assistant)",
    ov_average: "Gemiddeld",
    ov_actions: "Alle zones",
    ov_confirm: "Verwarming op {mode} zetten?",
    ov_skipped: "Niet beschikbaar in: {list}",
    ov_cancel: "Annuleren",
    ov_apply: "Bevestigen",
    ov_coldest: "Koudste: {name}",
    ov_warmest: "Warmste: {name}",
    ov_other: "Overige ruimtes",
    ed_areas: "Ruimtes",
    ed_areas_helper: "Alleen de zones van deze ruimtes (alle als leeg)",
    ed_exclude_areas: "Uit te sluiten ruimtes",
    ed_floors: "Verdiepingen",
    ed_floors_helper: "Alleen de zones van deze verdiepingen (alle als leeg)",
    ed_exclude_floors: "Uit te sluiten verdiepingen",
    ed_include: "Toe te voegen entiteiten",
    ed_include_helper: "Thermostaten of stuurdraadradiatoren die niet vanzelf gevonden worden (verborgen, bijvoorbeeld)",
    ed_exclude: "Uit te sluiten entiteiten",
    ed_sort: "Sortering",
    ed_sort_area: "Volgorde van de ruimtes",
    ed_sort_name: "Naam",
    ed_sort_temperature: "Koudste eerst",
    ed_sort_state: "Waarschuwingen en verwarming eerst",
    ed_group_by: "Groeperen op",
    ed_group_floor: "Verdieping",
    ed_group_none: "Niet groeperen",
    ed_columns: "Kolommen",
    ed_columns_helper: "Automatisch als leeg",
    ed_compact: "Compacte tegels",
    ed_show_summary: "Samenvatting",
    ed_show_actions: "Snelle acties",
    ed_actions: "Aangeboden snelle acties",
    ed_detail: "Tik op een zone",
    ed_detail_card: "Volledige kaart",
    ed_detail_more_info: "Infovenster",
    ed_detail_none: "Niets",
    ed_ov_zoom_helper: "Knop rechtsboven die naar de volledige kaart wisselt en terug",
  },
  pt: {
    title: "Aquecimento",
    zone: "Zona",
    st_heating: "A aquecer",
    st_preheating: "Pré-aquecimento",
    st_idle: "Em espera",
    st_off: "Desligado",
    st_unavailable: "Indisponível",
    st_defrosting: "A descongelar",
    zones_heating: "{n} de {total} zonas a aquecer",
    zones_none: "{total} zonas, nenhuma a aquecer",
    target: "Objetivo",
    target_low: "Aquecer a",
    target_high: "Arrefecer a",
    temp_down: "Baixar o objetivo",
    temp_up: "Subir o objetivo",
    outdoor: "Exterior",
    valve: "Válvula",
    window_open: "Janela aberta",
    battery_low: "Bateria fraca",
    offline: "Dispositivo offline",
    power: "Ligar / desligar",
    preset: "Predefinição",
    fan_mode: "Modo da ventoinha",
    swing_mode: "Oscilação",
    swing_horizontal_mode: "Oscilação horizontal",
    target_humidity: "Humidade pretendida",
    options: "Opções",
    pilot_wire: "Fio piloto",
    schedule: "Horário",
    mode_heat: "Aquecer",
    mode_auto: "Auto",
    mode_heat_cool: "Aquecer/arrefecer",
    mode_off: "Desligado",
    p_none: "Manual",
    p_manual: "Manual",
    p_comfort: "Conforto",
    p_comfort_1: "Conforto −1",
    p_comfort_2: "Conforto −2",
    p_eco: "Eco",
    p_frost: "Anticongelamento",
    p_off: "Desligado",
    p_away: "Ausente",
    p_boost: "Boost",
    p_home: "Em casa",
    p_sleep: "Noite",
    p_activity: "Atividade",
    p_schedule: "Horário",
    sch_on_until: "Ativo até às {time}",
    sch_off_until: "Inativo até às {time}",
    sch_on: "Ativo",
    sch_off: "Inativo",
    sch_loading: "A carregar a semana…",
    sch_none: "Não foi possível ler a semana deste horário",
    sw_child_lock: "Bloqueio para crianças",
    sw_window_detection: "Deteção de janela",
    sw_frost: "Anticongelamento",
    sw_eco: "Eco",
    sw_display: "Ecrã",
    sw_sound: "Som",
    sw_boost: "Boost",
    sw_light: "Luz",
    no_zone: "Nenhum termóstato de aquecimento nem radiador de fio piloto encontrado",
    not_found: "Entidade não encontrada",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Voltar à vista compacta",
    ill_auto: "Automática",
    ill_dial: "Termóstato de parede",
    ill_radiator: "Radiador",
    ill_valve: "Válvula termostática",
    ed_title: "Título",
    ed_zone: "Zona {n}",
    ed_add_zone: "Adicionar uma zona",
    ed_zones_auto: "Sem zonas, todos os termóstatos de aquecimento e radiadores de fio piloto são encontrados, agrupados por divisão",
    ed_name: "Nome",
    ed_entity: "Termóstato",
    ed_pilot_wire: "Radiadores de fio piloto",
    ed_temperature: "Temperatura da divisão",
    ed_humidity: "Humidade",
    ed_schedule: "Horário",
    ed_window: "Janela",
    ed_illustration: "Ilustração",
    ed_switch_on: "Relé ligado",
    ed_switch_off: "Relé desligado",
    ed_switch_on_helper: "Ordem enviada por um relé de fio piloto (switch) ligado",
    ed_switch_off_helper: "Ordem enviada por um relé de fio piloto (switch) desligado",
    ed_show_title: "Título",
    ed_show_subtitle: "Subtítulo",
    ed_show_controls: "Controlos",
    ed_show_sensors: "Medições",
    ed_show_alerts: "Alertas",
    ed_show_pilot_wire: "Fio piloto",
    ed_show_schedule: "Horário",
    ed_zoom: "Botão de detalhe",
    ed_zoom_helper: "Botão no canto superior direito que alterna o mini cartão para o cartão completo e vice-versa",
    ed_collapsed: "Secções recolhidas",
    ed_language: "Idioma",
    ed_language_auto: "Automático (Home Assistant)",
    ov_average: "Média",
    ov_actions: "Todas as zonas",
    ov_confirm: "Colocar o aquecimento em {mode}?",
    ov_skipped: "Não disponível em: {list}",
    ov_cancel: "Cancelar",
    ov_apply: "Confirmar",
    ov_coldest: "A mais fria: {name}",
    ov_warmest: "A mais quente: {name}",
    ov_other: "Outras divisões",
    ed_areas: "Divisões",
    ed_areas_helper: "Apenas as zonas destas divisões (todas se vazio)",
    ed_exclude_areas: "Divisões a excluir",
    ed_floors: "Pisos",
    ed_floors_helper: "Apenas as zonas destes pisos (todos se vazio)",
    ed_exclude_floors: "Pisos a excluir",
    ed_include: "Entidades a adicionar",
    ed_include_helper: "Termóstatos ou radiadores de fio piloto não encontrados sozinhos (ocultos, por exemplo)",
    ed_exclude: "Entidades a excluir",
    ed_sort: "Ordenação",
    ed_sort_area: "Ordem das divisões",
    ed_sort_name: "Nome",
    ed_sort_temperature: "As mais frias primeiro",
    ed_sort_state: "Alertas e aquecimento primeiro",
    ed_group_by: "Agrupar por",
    ed_group_floor: "Piso",
    ed_group_none: "Sem agrupamento",
    ed_columns: "Colunas",
    ed_columns_helper: "Automático se vazio",
    ed_compact: "Mosaicos compactos",
    ed_show_summary: "Resumo",
    ed_show_actions: "Ações rápidas",
    ed_actions: "Ações rápidas propostas",
    ed_detail: "Toque numa zona",
    ed_detail_card: "Cartão completo",
    ed_detail_more_info: "Diálogo de informações",
    ed_detail_none: "Nada",
    ed_ov_zoom_helper: "Botão no canto superior direito que alterna para o cartão completo e vice-versa",
  },
  pl: {
    title: "Ogrzewanie",
    zone: "Strefa",
    st_heating: "Grzeje",
    st_preheating: "Wstępne grzanie",
    st_idle: "Bezczynny",
    st_off: "Wyłączony",
    st_unavailable: "Niedostępny",
    st_defrosting: "Odszranianie",
    zones_heating: "Grzeje {n} z {total} stref",
    zones_none: "{total} stref, żadna nie grzeje",
    target: "Cel",
    target_low: "Grzej do",
    target_high: "Chłodź do",
    temp_down: "Obniż temperaturę",
    temp_up: "Podnieś temperaturę",
    outdoor: "Na zewnątrz",
    valve: "Zawór",
    window_open: "Okno otwarte",
    battery_low: "Słaba bateria",
    offline: "Urządzenie offline",
    power: "Wł. / wył.",
    preset: "Ustawienie",
    fan_mode: "Tryb wentylatora",
    swing_mode: "Tryb nawiewu",
    swing_horizontal_mode: "Nawiew poziomy",
    target_humidity: "Docelowa wilgotność",
    options: "Opcje",
    pilot_wire: "Przewód sterujący",
    schedule: "Harmonogram",
    mode_heat: "Grzanie",
    mode_auto: "Auto",
    mode_heat_cool: "Grzanie/chłodzenie",
    mode_off: "Wyłączony",
    p_none: "Ręczny",
    p_manual: "Ręczny",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eko",
    p_frost: "Ochrona przed mrozem",
    p_off: "Wyłączony",
    p_away: "Poza domem",
    p_boost: "Boost",
    p_home: "W domu",
    p_sleep: "Sen",
    p_activity: "Aktywność",
    p_schedule: "Harmonogram",
    sch_on_until: "Włączony do {time}",
    sch_off_until: "Wyłączony do {time}",
    sch_on: "Włączony",
    sch_off: "Wyłączony",
    sch_loading: "Wczytywanie tygodnia…",
    sch_none: "Nie udało się odczytać tygodnia tego harmonogramu",
    sw_child_lock: "Blokada rodzicielska",
    sw_window_detection: "Wykrywanie okna",
    sw_frost: "Ochrona przed mrozem",
    sw_eco: "Eko",
    sw_display: "Wyświetlacz",
    sw_sound: "Dźwięk",
    sw_boost: "Boost",
    sw_light: "Lampka",
    no_zone: "Nie znaleziono termostatu grzewczego ani grzejnika z przewodem sterującym",
    not_found: "Nie znaleziono encji",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Wróć do widoku kompaktowego",
    ill_auto: "Automatyczna",
    ill_dial: "Termostat ścienny",
    ill_radiator: "Grzejnik",
    ill_valve: "Głowica termostatyczna",
    ed_title: "Tytuł",
    ed_zone: "Strefa {n}",
    ed_add_zone: "Dodaj strefę",
    ed_zones_auto: "Bez stref znajdowane są wszystkie termostaty grzewcze i grzejniki z przewodem sterującym, pogrupowane według obszaru",
    ed_name: "Nazwa",
    ed_entity: "Termostat",
    ed_pilot_wire: "Grzejniki z przewodem sterującym",
    ed_temperature: "Temperatura pomieszczenia",
    ed_humidity: "Wilgotność",
    ed_schedule: "Harmonogram",
    ed_window: "Okno",
    ed_illustration: "Ilustracja",
    ed_switch_on: "Przekaźnik włączony",
    ed_switch_off: "Przekaźnik wyłączony",
    ed_switch_on_helper: "Polecenie wysyłane przez przekaźnik przewodu sterującego (switch), gdy jest włączony",
    ed_switch_off_helper: "Polecenie wysyłane przez przekaźnik przewodu sterującego (switch), gdy jest wyłączony",
    ed_show_title: "Tytuł",
    ed_show_subtitle: "Podtytuł",
    ed_show_controls: "Sterowanie",
    ed_show_sensors: "Pomiary",
    ed_show_alerts: "Alerty",
    ed_show_pilot_wire: "Przewód sterujący",
    ed_show_schedule: "Harmonogram",
    ed_zoom: "Przycisk szczegółów",
    ed_zoom_helper: "Przycisk w prawym górnym rogu przełączający mini kartę na pełną kartę i z powrotem",
    ed_collapsed: "Zwinięte sekcje",
    ed_language: "Język",
    ed_language_auto: "Automatyczny (Home Assistant)",
    ov_average: "Średnia",
    ov_actions: "Wszystkie strefy",
    ov_confirm: "Ustawić ogrzewanie na {mode}?",
    ov_skipped: "Niedostępne w: {list}",
    ov_cancel: "Anuluj",
    ov_apply: "Potwierdź",
    ov_coldest: "Najzimniejsza: {name}",
    ov_warmest: "Najcieplejsza: {name}",
    ov_other: "Inne obszary",
    ed_areas: "Obszary",
    ed_areas_helper: "Tylko strefy tych obszarów (wszystkie, gdy puste)",
    ed_exclude_areas: "Obszary do wykluczenia",
    ed_floors: "Piętra",
    ed_floors_helper: "Tylko strefy tych pięter (wszystkie, gdy puste)",
    ed_exclude_floors: "Piętra do wykluczenia",
    ed_include: "Encje do dodania",
    ed_include_helper: "Termostaty lub grzejniki z przewodem sterującym, których nie znaleziono samodzielnie (np. ukryte)",
    ed_exclude: "Encje do wykluczenia",
    ed_sort: "Sortowanie",
    ed_sort_area: "Kolejność obszarów",
    ed_sort_name: "Nazwa",
    ed_sort_temperature: "Najzimniejsze najpierw",
    ed_sort_state: "Najpierw alerty i grzanie",
    ed_group_by: "Grupuj według",
    ed_group_floor: "Piętro",
    ed_group_none: "Bez grupowania",
    ed_columns: "Kolumny",
    ed_columns_helper: "Automatycznie, gdy puste",
    ed_compact: "Kompaktowe kafelki",
    ed_show_summary: "Podsumowanie",
    ed_show_actions: "Szybkie akcje",
    ed_actions: "Oferowane szybkie akcje",
    ed_detail: "Dotknięcie strefy",
    ed_detail_card: "Pełna karta",
    ed_detail_more_info: "Okno informacji",
    ed_detail_none: "Nic",
    ed_ov_zoom_helper: "Przycisk w prawym górnym rogu przełączający na pełną kartę i z powrotem",
  },
  ro: {
    title: "Încălzire",
    zone: "Zonă",
    st_heating: "Încălzește",
    st_preheating: "Preîncălzire",
    st_idle: "Inactiv",
    st_off: "Oprit",
    st_unavailable: "Indisponibil",
    st_defrosting: "Dezghețare",
    zones_heating: "{n} din {total} zone încălzesc",
    zones_none: "{total} zone, niciuna nu încălzește",
    target: "Țintă",
    target_low: "Încălzește la",
    target_high: "Răcește la",
    temp_down: "Scade ținta",
    temp_up: "Crește ținta",
    outdoor: "Exterior",
    valve: "Robinet",
    window_open: "Fereastră deschisă",
    battery_low: "Baterie descărcată",
    offline: "Dispozitiv offline",
    power: "Pornire / oprire",
    preset: "Presetare",
    fan_mode: "Mod ventilator",
    swing_mode: "Oscilare",
    swing_horizontal_mode: "Oscilare orizontală",
    target_humidity: "Umiditate țintă",
    options: "Opțiuni",
    pilot_wire: "Fir pilot",
    schedule: "Program",
    mode_heat: "Încălzire",
    mode_auto: "Auto",
    mode_heat_cool: "Încălzire/răcire",
    mode_off: "Oprit",
    p_none: "Manual",
    p_manual: "Manual",
    p_comfort: "Confort",
    p_comfort_1: "Confort −1",
    p_comfort_2: "Confort −2",
    p_eco: "Eco",
    p_frost: "Protecție la îngheț",
    p_off: "Oprit",
    p_away: "Plecat",
    p_boost: "Boost",
    p_home: "Acasă",
    p_sleep: "Somn",
    p_activity: "Activitate",
    p_schedule: "Program",
    sch_on_until: "Activ până la {time}",
    sch_off_until: "Inactiv până la {time}",
    sch_on: "Activ",
    sch_off: "Inactiv",
    sch_loading: "Se încarcă săptămâna…",
    sch_none: "Săptămâna acestui program nu a putut fi citită",
    sw_child_lock: "Blocare pentru copii",
    sw_window_detection: "Detectare fereastră",
    sw_frost: "Protecție la îngheț",
    sw_eco: "Eco",
    sw_display: "Afișaj",
    sw_sound: "Sunet",
    sw_boost: "Boost",
    sw_light: "Lumină",
    no_zone: "Nu s-a găsit niciun termostat de încălzire sau calorifer cu fir pilot",
    not_found: "Entitate negăsită",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Înapoi la vizualizarea compactă",
    ill_auto: "Automată",
    ill_dial: "Termostat de perete",
    ill_radiator: "Calorifer",
    ill_valve: "Robinet termostatic",
    ed_title: "Titlu",
    ed_zone: "Zona {n}",
    ed_add_zone: "Adaugă o zonă",
    ed_zones_auto: "Fără zone, sunt găsite toate termostatele de încălzire și caloriferele cu fir pilot, grupate pe zone",
    ed_name: "Nume",
    ed_entity: "Termostat",
    ed_pilot_wire: "Calorifere cu fir pilot",
    ed_temperature: "Temperatura camerei",
    ed_humidity: "Umiditate",
    ed_schedule: "Program",
    ed_window: "Fereastră",
    ed_illustration: "Ilustrație",
    ed_switch_on: "Releu pornit",
    ed_switch_off: "Releu oprit",
    ed_switch_on_helper: "Comanda trimisă de un releu cu fir pilot (switch) pornit",
    ed_switch_off_helper: "Comanda trimisă de un releu cu fir pilot (switch) oprit",
    ed_show_title: "Titlu",
    ed_show_subtitle: "Subtitlu",
    ed_show_controls: "Comenzi",
    ed_show_sensors: "Măsurători",
    ed_show_alerts: "Alerte",
    ed_show_pilot_wire: "Fir pilot",
    ed_show_schedule: "Program",
    ed_zoom: "Buton detalii",
    ed_zoom_helper: "Buton din dreapta sus care comută mini cardul la cardul complet și înapoi",
    ed_collapsed: "Secțiuni pliate",
    ed_language: "Limbă",
    ed_language_auto: "Automată (Home Assistant)",
    ov_average: "Medie",
    ov_actions: "Toate zonele",
    ov_confirm: "Treceți încălzirea pe {mode}?",
    ov_skipped: "Indisponibil în: {list}",
    ov_cancel: "Anulare",
    ov_apply: "Confirmare",
    ov_coldest: "Cea mai rece: {name}",
    ov_warmest: "Cea mai caldă: {name}",
    ov_other: "Alte încăperi",
    ed_areas: "Încăperi",
    ed_areas_helper: "Doar zonele acestor încăperi (toate dacă e gol)",
    ed_exclude_areas: "Încăperi excluse",
    ed_floors: "Etaje",
    ed_floors_helper: "Doar zonele acestor etaje (toate dacă e gol)",
    ed_exclude_floors: "Etaje excluse",
    ed_include: "Entități de adăugat",
    ed_include_helper: "Termostate sau calorifere cu fir pilot care nu sunt găsite singure (ascunse, de exemplu)",
    ed_exclude: "Entități excluse",
    ed_sort: "Sortare",
    ed_sort_area: "Ordinea încăperilor",
    ed_sort_name: "Nume",
    ed_sort_temperature: "Cele mai reci întâi",
    ed_sort_state: "Întâi alertele și încălzirea",
    ed_group_by: "Grupare după",
    ed_group_floor: "Etaj",
    ed_group_none: "Fără grupare",
    ed_columns: "Coloane",
    ed_columns_helper: "Automat dacă e gol",
    ed_compact: "Dale compacte",
    ed_show_summary: "Rezumat",
    ed_show_actions: "Acțiuni rapide",
    ed_actions: "Acțiuni rapide oferite",
    ed_detail: "Atingere pe o zonă",
    ed_detail_card: "Card complet",
    ed_detail_more_info: "Dialog de informații",
    ed_detail_none: "Nimic",
    ed_ov_zoom_helper: "Buton din dreapta sus care comută la cardul complet și înapoi",
  },
  da: {
    title: "Varme",
    zone: "Zone",
    st_heating: "Varmer",
    st_preheating: "Forvarmer",
    st_idle: "Inaktiv",
    st_off: "Slukket",
    st_unavailable: "Utilgængelig",
    st_defrosting: "Afrimer",
    zones_heating: "{n} af {total} zoner varmer",
    zones_none: "{total} zoner, ingen varmer",
    target: "Mål",
    target_low: "Varm til",
    target_high: "Køl til",
    temp_down: "Sænk måltemperaturen",
    temp_up: "Hæv måltemperaturen",
    outdoor: "Ude",
    valve: "Ventil",
    window_open: "Vindue åbent",
    battery_low: "Lavt batteri",
    offline: "Enhed offline",
    power: "Tænd / sluk",
    preset: "Forudindstilling",
    fan_mode: "Blæsertilstand",
    swing_mode: "Svingtilstand",
    swing_horizontal_mode: "Vandret sving",
    target_humidity: "Ønsket luftfugtighed",
    options: "Indstillinger",
    pilot_wire: "Styreledning",
    schedule: "Tidsplan",
    mode_heat: "Varme",
    mode_auto: "Auto",
    mode_heat_cool: "Varme/køl",
    mode_off: "Slukket",
    p_none: "Manuel",
    p_manual: "Manuel",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Frostsikring",
    p_off: "Slukket",
    p_away: "Ude",
    p_boost: "Boost",
    p_home: "Hjemme",
    p_sleep: "Søvn",
    p_activity: "Aktivitet",
    p_schedule: "Tidsplan",
    sch_on_until: "Tændt til {time}",
    sch_off_until: "Slukket til {time}",
    sch_on: "Tændt",
    sch_off: "Slukket",
    sch_loading: "Indlæser ugen…",
    sch_none: "Ugen for denne tidsplan kunne ikke læses",
    sw_child_lock: "Børnesikring",
    sw_window_detection: "Vinduesregistrering",
    sw_frost: "Frostsikring",
    sw_eco: "Eco",
    sw_display: "Skærm",
    sw_sound: "Lyd",
    sw_boost: "Boost",
    sw_light: "Lys",
    no_zone: "Ingen varmetermostat eller radiator med styreledning fundet",
    not_found: "Enhed ikke fundet",
    zoom_in: "Vis hele kortet",
    zoom_out: "Tilbage til den kompakte visning",
    ill_auto: "Automatisk",
    ill_dial: "Vægtermostat",
    ill_radiator: "Radiator",
    ill_valve: "Radiatortermostat",
    ed_title: "Titel",
    ed_zone: "Zone {n}",
    ed_add_zone: "Tilføj en zone",
    ed_zones_auto: "Uden zoner findes alle varmetermostater og radiatorer med styreledning, grupperet efter område",
    ed_name: "Navn",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radiatorer med styreledning",
    ed_temperature: "Rumtemperatur",
    ed_humidity: "Luftfugtighed",
    ed_schedule: "Tidsplan",
    ed_window: "Vindue",
    ed_illustration: "Illustration",
    ed_switch_on: "Relæ tændt",
    ed_switch_off: "Relæ slukket",
    ed_switch_on_helper: "Ordre sendt af et styreledningsrelæ (switch), når det er tændt",
    ed_switch_off_helper: "Ordre sendt af et styreledningsrelæ (switch), når det er slukket",
    ed_show_title: "Titel",
    ed_show_subtitle: "Undertitel",
    ed_show_controls: "Betjening",
    ed_show_sensors: "Målinger",
    ed_show_alerts: "Advarsler",
    ed_show_pilot_wire: "Styreledning",
    ed_show_schedule: "Tidsplan",
    ed_zoom: "Detaljeknap",
    ed_zoom_helper: "Knap øverst til højre, der skifter minikortet til hele kortet og tilbage",
    ed_collapsed: "Sammenfoldede sektioner",
    ed_language: "Sprog",
    ed_language_auto: "Automatisk (Home Assistant)",
    ov_average: "Gennemsnit",
    ov_actions: "Alle zoner",
    ov_confirm: "Sæt varmen til {mode}?",
    ov_skipped: "Ikke tilgængelig i: {list}",
    ov_cancel: "Annuller",
    ov_apply: "Bekræft",
    ov_coldest: "Koldest: {name}",
    ov_warmest: "Varmest: {name}",
    ov_other: "Andre områder",
    ed_areas: "Områder",
    ed_areas_helper: "Kun zonerne i disse områder (alle, hvis tom)",
    ed_exclude_areas: "Områder, der udelades",
    ed_floors: "Etager",
    ed_floors_helper: "Kun zonerne på disse etager (alle, hvis tom)",
    ed_exclude_floors: "Etager, der udelades",
    ed_include: "Enheder, der tilføjes",
    ed_include_helper: "Termostater eller radiatorer med styreledning, der ikke findes af sig selv (f.eks. skjulte)",
    ed_exclude: "Enheder, der udelades",
    ed_sort: "Sortering",
    ed_sort_area: "Områdernes rækkefølge",
    ed_sort_name: "Navn",
    ed_sort_temperature: "Koldeste først",
    ed_sort_state: "Advarsler og opvarmning først",
    ed_group_by: "Gruppér efter",
    ed_group_floor: "Etage",
    ed_group_none: "Ingen gruppering",
    ed_columns: "Kolonner",
    ed_columns_helper: "Automatisk, hvis tom",
    ed_compact: "Kompakte felter",
    ed_show_summary: "Oversigt",
    ed_show_actions: "Hurtige handlinger",
    ed_actions: "Tilbudte hurtige handlinger",
    ed_detail: "Tryk på en zone",
    ed_detail_card: "Hele kortet",
    ed_detail_more_info: "Informationsdialog",
    ed_detail_none: "Intet",
    ed_ov_zoom_helper: "Knap øverst til højre, der skifter til hele kortet og tilbage",
  },
  sv: {
    title: "Värme",
    zone: "Zon",
    st_heating: "Värmer",
    st_preheating: "Förvärmer",
    st_idle: "Inaktiv",
    st_off: "Av",
    st_unavailable: "Inte tillgänglig",
    st_defrosting: "Avfrostar",
    zones_heating: "{n} av {total} zoner värmer",
    zones_none: "{total} zoner, ingen värmer",
    target: "Mål",
    target_low: "Värm till",
    target_high: "Kyl till",
    temp_down: "Sänk måltemperaturen",
    temp_up: "Höj måltemperaturen",
    outdoor: "Ute",
    valve: "Ventil",
    window_open: "Fönster öppet",
    battery_low: "Lågt batteri",
    offline: "Enhet offline",
    power: "På / av",
    preset: "Förinställning",
    fan_mode: "Fläktläge",
    swing_mode: "Svängläge",
    swing_horizontal_mode: "Horisontell svängning",
    target_humidity: "Önskad luftfuktighet",
    options: "Alternativ",
    pilot_wire: "Styrtråd",
    schedule: "Schema",
    mode_heat: "Värme",
    mode_auto: "Auto",
    mode_heat_cool: "Värme/kyla",
    mode_off: "Av",
    p_none: "Manuell",
    p_manual: "Manuell",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Frostskydd",
    p_off: "Av",
    p_away: "Borta",
    p_boost: "Boost",
    p_home: "Hemma",
    p_sleep: "Sömn",
    p_activity: "Aktivitet",
    p_schedule: "Schema",
    sch_on_until: "På till {time}",
    sch_off_until: "Av till {time}",
    sch_on: "På",
    sch_off: "Av",
    sch_loading: "Läser in veckan…",
    sch_none: "Veckan för detta schema kunde inte läsas",
    sw_child_lock: "Barnlås",
    sw_window_detection: "Fönsterdetektering",
    sw_frost: "Frostskydd",
    sw_eco: "Eco",
    sw_display: "Display",
    sw_sound: "Ljud",
    sw_boost: "Boost",
    sw_light: "Lampa",
    no_zone: "Ingen värmetermostat eller radiator med styrtråd hittades",
    not_found: "Entiteten hittades inte",
    zoom_in: "Visa hela kortet",
    zoom_out: "Tillbaka till den kompakta vyn",
    ill_auto: "Automatisk",
    ill_dial: "Väggtermostat",
    ill_radiator: "Radiator",
    ill_valve: "Termostatventil",
    ed_title: "Titel",
    ed_zone: "Zon {n}",
    ed_add_zone: "Lägg till en zon",
    ed_zones_auto: "Utan zoner hittas alla värmetermostater och radiatorer med styrtråd, grupperade per område",
    ed_name: "Namn",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radiatorer med styrtråd",
    ed_temperature: "Rumstemperatur",
    ed_humidity: "Luftfuktighet",
    ed_schedule: "Schema",
    ed_window: "Fönster",
    ed_illustration: "Illustration",
    ed_switch_on: "Relä på",
    ed_switch_off: "Relä av",
    ed_switch_on_helper: "Order som ett styrtrådsrelä (switch) skickar när det är på",
    ed_switch_off_helper: "Order som ett styrtrådsrelä (switch) skickar när det är av",
    ed_show_title: "Titel",
    ed_show_subtitle: "Undertitel",
    ed_show_controls: "Reglage",
    ed_show_sensors: "Mätvärden",
    ed_show_alerts: "Varningar",
    ed_show_pilot_wire: "Styrtråd",
    ed_show_schedule: "Schema",
    ed_zoom: "Detaljknapp",
    ed_zoom_helper: "Knapp uppe till höger som växlar minikortet till hela kortet och tillbaka",
    ed_collapsed: "Hopfällda avsnitt",
    ed_language: "Språk",
    ed_language_auto: "Automatiskt (Home Assistant)",
    ov_average: "Medel",
    ov_actions: "Alla zoner",
    ov_confirm: "Ställ värmen på {mode}?",
    ov_skipped: "Inte tillgängligt i: {list}",
    ov_cancel: "Avbryt",
    ov_apply: "Bekräfta",
    ov_coldest: "Kallast: {name}",
    ov_warmest: "Varmast: {name}",
    ov_other: "Övriga områden",
    ed_areas: "Områden",
    ed_areas_helper: "Endast zonerna i dessa områden (alla om tomt)",
    ed_exclude_areas: "Områden att utesluta",
    ed_floors: "Våningar",
    ed_floors_helper: "Endast zonerna på dessa våningar (alla om tomt)",
    ed_exclude_floors: "Våningar att utesluta",
    ed_include: "Entiteter att lägga till",
    ed_include_helper: "Termostater eller radiatorer med styrtråd som inte hittas av sig själva (dolda, till exempel)",
    ed_exclude: "Entiteter att utesluta",
    ed_sort: "Sortering",
    ed_sort_area: "Områdenas ordning",
    ed_sort_name: "Namn",
    ed_sort_temperature: "Kallaste först",
    ed_sort_state: "Varningar och värme först",
    ed_group_by: "Gruppera efter",
    ed_group_floor: "Våning",
    ed_group_none: "Ingen gruppering",
    ed_columns: "Kolumner",
    ed_columns_helper: "Automatiskt om tomt",
    ed_compact: "Kompakta rutor",
    ed_show_summary: "Sammanfattning",
    ed_show_actions: "Snabbåtgärder",
    ed_actions: "Erbjudna snabbåtgärder",
    ed_detail: "Tryck på en zon",
    ed_detail_card: "Hela kortet",
    ed_detail_more_info: "Informationsdialog",
    ed_detail_none: "Inget",
    ed_ov_zoom_helper: "Knapp uppe till höger som växlar till hela kortet och tillbaka",
  },
  bg: {
    title: "Отопление",
    zone: "Зона",
    st_heating: "Отоплява",
    st_preheating: "Предварително загряване",
    st_idle: "В покой",
    st_off: "Изключено",
    st_unavailable: "Недостъпно",
    st_defrosting: "Размразяване",
    zones_heating: "{n} от {total} зони отопляват",
    zones_none: "{total} зони, никоя не отоплява",
    target: "Цел",
    target_low: "Отопли до",
    target_high: "Охлади до",
    temp_down: "Намали целта",
    temp_up: "Увеличи целта",
    outdoor: "Навън",
    valve: "Вентил",
    window_open: "Отворен прозорец",
    battery_low: "Слаба батерия",
    offline: "Устройството е офлайн",
    power: "Вкл. / изкл.",
    preset: "Предварителна настройка",
    fan_mode: "Режим на вентилатора",
    swing_mode: "Режим на люлеене",
    swing_horizontal_mode: "Хоризонтално люлеене",
    target_humidity: "Желана влажност",
    options: "Опции",
    pilot_wire: "Пилотен проводник",
    schedule: "График",
    mode_heat: "Отопление",
    mode_auto: "Авто",
    mode_heat_cool: "Отопление/охлаждане",
    mode_off: "Изключено",
    p_none: "Ръчно",
    p_manual: "Ръчно",
    p_comfort: "Комфорт",
    p_comfort_1: "Комфорт −1",
    p_comfort_2: "Комфорт −2",
    p_eco: "Еко",
    p_frost: "Защита от замръзване",
    p_off: "Изключено",
    p_away: "Отсъствие",
    p_boost: "Усилване",
    p_home: "Вкъщи",
    p_sleep: "Сън",
    p_activity: "Активност",
    p_schedule: "График",
    sch_on_until: "Включено до {time}",
    sch_off_until: "Изключено до {time}",
    sch_on: "Включено",
    sch_off: "Изключено",
    sch_loading: "Зареждане на седмицата…",
    sch_none: "Седмицата на този график не можа да бъде прочетена",
    sw_child_lock: "Детска защита",
    sw_window_detection: "Откриване на прозорец",
    sw_frost: "Защита от замръзване",
    sw_eco: "Еко",
    sw_display: "Дисплей",
    sw_sound: "Звук",
    sw_boost: "Усилване",
    sw_light: "Светлина",
    no_zone: "Не е намерен отоплителен термостат или радиатор с пилотен проводник",
    not_found: "Обектът не е намерен",
    zoom_in: "Покажи цялата карта",
    zoom_out: "Обратно към компактния изглед",
    ill_auto: "Автоматично",
    ill_dial: "Стенен термостат",
    ill_radiator: "Радиатор",
    ill_valve: "Термостатична глава",
    ed_title: "Заглавие",
    ed_zone: "Зона {n}",
    ed_add_zone: "Добави зона",
    ed_zones_auto: "Без зони се намират всички отоплителни термостати и радиатори с пилотен проводник, групирани по помещение",
    ed_name: "Име",
    ed_entity: "Термостат",
    ed_pilot_wire: "Радиатори с пилотен проводник",
    ed_temperature: "Температура в помещението",
    ed_humidity: "Влажност",
    ed_schedule: "График",
    ed_window: "Прозорец",
    ed_illustration: "Илюстрация",
    ed_switch_on: "Реле включено",
    ed_switch_off: "Реле изключено",
    ed_switch_on_helper: "Команда от реле на пилотен проводник (switch), когато е включено",
    ed_switch_off_helper: "Команда от реле на пилотен проводник (switch), когато е изключено",
    ed_show_title: "Заглавие",
    ed_show_subtitle: "Подзаглавие",
    ed_show_controls: "Управление",
    ed_show_sensors: "Измервания",
    ed_show_alerts: "Предупреждения",
    ed_show_pilot_wire: "Пилотен проводник",
    ed_show_schedule: "График",
    ed_zoom: "Бутон за подробности",
    ed_zoom_helper: "Бутон горе вдясно, който превключва мини картата към цялата карта и обратно",
    ed_collapsed: "Свити секции",
    ed_language: "Език",
    ed_language_auto: "Автоматично (Home Assistant)",
    ov_average: "Средно",
    ov_actions: "Всички зони",
    ov_confirm: "Да се превключи отоплението на {mode}?",
    ov_skipped: "Не е налично в: {list}",
    ov_cancel: "Отказ",
    ov_apply: "Потвърждаване",
    ov_coldest: "Най-студена: {name}",
    ov_warmest: "Най-топла: {name}",
    ov_other: "Други помещения",
    ed_areas: "Помещения",
    ed_areas_helper: "Само зоните на тези помещения (всички, ако е празно)",
    ed_exclude_areas: "Изключени помещения",
    ed_floors: "Етажи",
    ed_floors_helper: "Само зоните на тези етажи (всички, ако е празно)",
    ed_exclude_floors: "Изключени етажи",
    ed_include: "Обекти за добавяне",
    ed_include_helper: "Термостати или радиатори с пилотен проводник, които не се намират сами (например скрити)",
    ed_exclude: "Обекти за пропускане",
    ed_sort: "Сортиране",
    ed_sort_area: "Ред на помещенията",
    ed_sort_name: "Име",
    ed_sort_temperature: "Първо най-студените",
    ed_sort_state: "Първо предупрежденията и отоплението",
    ed_group_by: "Групиране по",
    ed_group_floor: "Етаж",
    ed_group_none: "Без групиране",
    ed_columns: "Колони",
    ed_columns_helper: "Автоматично, ако е празно",
    ed_compact: "Компактни плочки",
    ed_show_summary: "Обобщение",
    ed_show_actions: "Бързи действия",
    ed_actions: "Предлагани бързи действия",
    ed_detail: "Докосване на зона",
    ed_detail_card: "Цялата карта",
    ed_detail_more_info: "Диалог с информация",
    ed_detail_none: "Нищо",
    ed_ov_zoom_helper: "Бутон горе вдясно, който превключва към цялата карта и обратно",
  },
  ru: {
    title: "Отопление",
    zone: "Зона",
    st_heating: "Нагрев",
    st_preheating: "Предварительный нагрев",
    st_idle: "Ожидание",
    st_off: "Выключено",
    st_unavailable: "Недоступно",
    st_defrosting: "Оттаивание",
    zones_heating: "Греют {n} из {total} зон",
    zones_none: "{total} зон, ни одна не греет",
    target: "Цель",
    target_low: "Нагреть до",
    target_high: "Охладить до",
    temp_down: "Понизить цель",
    temp_up: "Повысить цель",
    outdoor: "На улице",
    valve: "Клапан",
    window_open: "Окно открыто",
    battery_low: "Низкий заряд батареи",
    offline: "Устройство не в сети",
    power: "Вкл. / выкл.",
    preset: "Предустановка",
    fan_mode: "Режим вентилятора",
    swing_mode: "Режим качания",
    swing_horizontal_mode: "Горизонтальное качание",
    target_humidity: "Целевая влажность",
    options: "Параметры",
    pilot_wire: "Пилотный провод",
    schedule: "Расписание",
    mode_heat: "Обогрев",
    mode_auto: "Авто",
    mode_heat_cool: "Обогрев/охлаждение",
    mode_off: "Выключено",
    p_none: "Вручную",
    p_manual: "Вручную",
    p_comfort: "Комфорт",
    p_comfort_1: "Комфорт −1",
    p_comfort_2: "Комфорт −2",
    p_eco: "Эко",
    p_frost: "Защита от замерзания",
    p_off: "Выключено",
    p_away: "Нет дома",
    p_boost: "Ускорение",
    p_home: "Дома",
    p_sleep: "Сон",
    p_activity: "Активность",
    p_schedule: "Расписание",
    sch_on_until: "Включено до {time}",
    sch_off_until: "Выключено до {time}",
    sch_on: "Включено",
    sch_off: "Выключено",
    sch_loading: "Загрузка недели…",
    sch_none: "Не удалось прочитать неделю этого расписания",
    sw_child_lock: "Защита от детей",
    sw_window_detection: "Обнаружение окна",
    sw_frost: "Защита от замерзания",
    sw_eco: "Эко",
    sw_display: "Дисплей",
    sw_sound: "Звук",
    sw_boost: "Ускорение",
    sw_light: "Подсветка",
    no_zone: "Не найден ни термостат отопления, ни радиатор с пилотным проводом",
    not_found: "Объект не найден",
    zoom_in: "Показать полную карточку",
    zoom_out: "Вернуться к компактному виду",
    ill_auto: "Автоматически",
    ill_dial: "Настенный термостат",
    ill_radiator: "Радиатор",
    ill_valve: "Термоголовка",
    ed_title: "Заголовок",
    ed_zone: "Зона {n}",
    ed_add_zone: "Добавить зону",
    ed_zones_auto: "Без зон находятся все термостаты отопления и радиаторы с пилотным проводом, сгруппированные по помещениям",
    ed_name: "Название",
    ed_entity: "Термостат",
    ed_pilot_wire: "Радиаторы с пилотным проводом",
    ed_temperature: "Температура в помещении",
    ed_humidity: "Влажность",
    ed_schedule: "Расписание",
    ed_window: "Окно",
    ed_illustration: "Иллюстрация",
    ed_switch_on: "Реле включено",
    ed_switch_off: "Реле выключено",
    ed_switch_on_helper: "Команда, которую реле пилотного провода (switch) отправляет во включённом состоянии",
    ed_switch_off_helper: "Команда, которую реле пилотного провода (switch) отправляет в выключенном состоянии",
    ed_show_title: "Заголовок",
    ed_show_subtitle: "Подзаголовок",
    ed_show_controls: "Управление",
    ed_show_sensors: "Измерения",
    ed_show_alerts: "Предупреждения",
    ed_show_pilot_wire: "Пилотный провод",
    ed_show_schedule: "Расписание",
    ed_zoom: "Кнопка подробностей",
    ed_zoom_helper: "Кнопка вверху справа, переключающая мини-карточку на полную и обратно",
    ed_collapsed: "Свёрнутые разделы",
    ed_language: "Язык",
    ed_language_auto: "Автоматически (Home Assistant)",
    ov_average: "Среднее",
    ov_actions: "Все зоны",
    ov_confirm: "Перевести отопление в режим {mode}?",
    ov_skipped: "Недоступно в: {list}",
    ov_cancel: "Отмена",
    ov_apply: "Подтвердить",
    ov_coldest: "Самая холодная: {name}",
    ov_warmest: "Самая тёплая: {name}",
    ov_other: "Другие помещения",
    ed_areas: "Помещения",
    ed_areas_helper: "Только зоны этих помещений (все, если пусто)",
    ed_exclude_areas: "Исключить помещения",
    ed_floors: "Этажи",
    ed_floors_helper: "Только зоны этих этажей (все, если пусто)",
    ed_exclude_floors: "Исключить этажи",
    ed_include: "Добавить объекты",
    ed_include_helper: "Термостаты или радиаторы с пилотным проводом, которые не находятся сами (например, скрытые)",
    ed_exclude: "Исключить объекты",
    ed_sort: "Сортировка",
    ed_sort_area: "Порядок помещений",
    ed_sort_name: "Название",
    ed_sort_temperature: "Сначала самые холодные",
    ed_sort_state: "Сначала предупреждения и нагрев",
    ed_group_by: "Группировать по",
    ed_group_floor: "Этаж",
    ed_group_none: "Без группировки",
    ed_columns: "Столбцы",
    ed_columns_helper: "Автоматически, если пусто",
    ed_compact: "Компактные плитки",
    ed_show_summary: "Сводка",
    ed_show_actions: "Быстрые действия",
    ed_actions: "Предлагаемые быстрые действия",
    ed_detail: "Нажатие на зону",
    ed_detail_card: "Полная карточка",
    ed_detail_more_info: "Окно сведений",
    ed_detail_none: "Ничего",
    ed_ov_zoom_helper: "Кнопка вверху справа, переключающая на полную карточку и обратно",
  },
  uk: {
    title: "Опалення",
    zone: "Зона",
    st_heating: "Нагрівання",
    st_preheating: "Попереднє нагрівання",
    st_idle: "Очікування",
    st_off: "Вимкнено",
    st_unavailable: "Недоступно",
    st_defrosting: "Розморожування",
    zones_heating: "Гріють {n} з {total} зон",
    zones_none: "{total} зон, жодна не гріє",
    target: "Ціль",
    target_low: "Нагріти до",
    target_high: "Охолодити до",
    temp_down: "Знизити ціль",
    temp_up: "Підвищити ціль",
    outdoor: "Надворі",
    valve: "Клапан",
    window_open: "Вікно відчинене",
    battery_low: "Низький заряд батареї",
    offline: "Пристрій не в мережі",
    power: "Увімк. / вимк.",
    preset: "Передустановка",
    fan_mode: "Режим вентилятора",
    swing_mode: "Режим гойдання",
    swing_horizontal_mode: "Горизонтальне гойдання",
    target_humidity: "Цільова вологість",
    options: "Параметри",
    pilot_wire: "Пілотний провід",
    schedule: "Розклад",
    mode_heat: "Обігрів",
    mode_auto: "Авто",
    mode_heat_cool: "Обігрів/охолодження",
    mode_off: "Вимкнено",
    p_none: "Вручну",
    p_manual: "Вручну",
    p_comfort: "Комфорт",
    p_comfort_1: "Комфорт −1",
    p_comfort_2: "Комфорт −2",
    p_eco: "Еко",
    p_frost: "Захист від замерзання",
    p_off: "Вимкнено",
    p_away: "Немає вдома",
    p_boost: "Прискорення",
    p_home: "Вдома",
    p_sleep: "Сон",
    p_activity: "Активність",
    p_schedule: "Розклад",
    sch_on_until: "Увімкнено до {time}",
    sch_off_until: "Вимкнено до {time}",
    sch_on: "Увімкнено",
    sch_off: "Вимкнено",
    sch_loading: "Завантаження тижня…",
    sch_none: "Не вдалося прочитати тиждень цього розкладу",
    sw_child_lock: "Захист від дітей",
    sw_window_detection: "Виявлення вікна",
    sw_frost: "Захист від замерзання",
    sw_eco: "Еко",
    sw_display: "Дисплей",
    sw_sound: "Звук",
    sw_boost: "Прискорення",
    sw_light: "Підсвічування",
    no_zone: "Не знайдено ні термостата опалення, ні радіатора з пілотним проводом",
    not_found: "Об'єкт не знайдено",
    zoom_in: "Показати повну картку",
    zoom_out: "Повернутися до компактного вигляду",
    ill_auto: "Автоматично",
    ill_dial: "Настінний термостат",
    ill_radiator: "Радіатор",
    ill_valve: "Термоголовка",
    ed_title: "Заголовок",
    ed_zone: "Зона {n}",
    ed_add_zone: "Додати зону",
    ed_zones_auto: "Без зон знаходяться всі термостати опалення та радіатори з пілотним проводом, згруповані за приміщеннями",
    ed_name: "Назва",
    ed_entity: "Термостат",
    ed_pilot_wire: "Радіатори з пілотним проводом",
    ed_temperature: "Температура в приміщенні",
    ed_humidity: "Вологість",
    ed_schedule: "Розклад",
    ed_window: "Вікно",
    ed_illustration: "Ілюстрація",
    ed_switch_on: "Реле увімкнене",
    ed_switch_off: "Реле вимкнене",
    ed_switch_on_helper: "Команда, яку реле пілотного проводу (switch) надсилає увімкненим",
    ed_switch_off_helper: "Команда, яку реле пілотного проводу (switch) надсилає вимкненим",
    ed_show_title: "Заголовок",
    ed_show_subtitle: "Підзаголовок",
    ed_show_controls: "Керування",
    ed_show_sensors: "Вимірювання",
    ed_show_alerts: "Попередження",
    ed_show_pilot_wire: "Пілотний провід",
    ed_show_schedule: "Розклад",
    ed_zoom: "Кнопка деталей",
    ed_zoom_helper: "Кнопка вгорі праворуч, що перемикає міні-картку на повну і назад",
    ed_collapsed: "Згорнуті розділи",
    ed_language: "Мова",
    ed_language_auto: "Автоматично (Home Assistant)",
    ov_average: "Середнє",
    ov_actions: "Усі зони",
    ov_confirm: "Перевести опалення в режим {mode}?",
    ov_skipped: "Недоступно в: {list}",
    ov_cancel: "Скасувати",
    ov_apply: "Підтвердити",
    ov_coldest: "Найхолодніша: {name}",
    ov_warmest: "Найтепліша: {name}",
    ov_other: "Інші приміщення",
    ed_areas: "Приміщення",
    ed_areas_helper: "Лише зони цих приміщень (усі, якщо порожньо)",
    ed_exclude_areas: "Виключити приміщення",
    ed_floors: "Поверхи",
    ed_floors_helper: "Лише зони цих поверхів (усі, якщо порожньо)",
    ed_exclude_floors: "Виключити поверхи",
    ed_include: "Додати сутності",
    ed_include_helper: "Термостати або радіатори з пілотним проводом, які не знаходяться самі (наприклад, приховані)",
    ed_exclude: "Виключити сутності",
    ed_sort: "Сортування",
    ed_sort_area: "Порядок приміщень",
    ed_sort_name: "Назва",
    ed_sort_temperature: "Спершу найхолодніші",
    ed_sort_state: "Спершу попередження та нагрів",
    ed_group_by: "Групувати за",
    ed_group_floor: "Поверх",
    ed_group_none: "Без групування",
    ed_columns: "Стовпці",
    ed_columns_helper: "Автоматично, якщо порожньо",
    ed_compact: "Компактні плитки",
    ed_show_summary: "Підсумок",
    ed_show_actions: "Швидкі дії",
    ed_actions: "Запропоновані швидкі дії",
    ed_detail: "Натискання на зону",
    ed_detail_card: "Повна картка",
    ed_detail_more_info: "Вікно відомостей",
    ed_detail_none: "Нічого",
    ed_ov_zoom_helper: "Кнопка вгорі праворуч, що перемикає на повну картку і назад",
  },
  hu: {
    title: "Fűtés",
    zone: "Zóna",
    st_heating: "Fűt",
    st_preheating: "Előfűtés",
    st_idle: "Tétlen",
    st_off: "Ki",
    st_unavailable: "Nem elérhető",
    st_defrosting: "Leolvasztás",
    zones_heating: "{total} zónából {n} fűt",
    zones_none: "{total} zóna, egyik sem fűt",
    target: "Cél",
    target_low: "Fűtés eddig",
    target_high: "Hűtés eddig",
    temp_down: "Célhőmérséklet csökkentése",
    temp_up: "Célhőmérséklet növelése",
    outdoor: "Kint",
    valve: "Szelep",
    window_open: "Nyitott ablak",
    battery_low: "Gyenge akkumulátor",
    offline: "Az eszköz offline",
    power: "Be / ki",
    preset: "Előbeállítás",
    fan_mode: "Ventilátor mód",
    swing_mode: "Lengetés",
    swing_horizontal_mode: "Vízszintes lengetés",
    target_humidity: "Cél páratartalom",
    options: "Beállítások",
    pilot_wire: "Vezérlővezeték",
    schedule: "Ütemezés",
    mode_heat: "Fűtés",
    mode_auto: "Auto",
    mode_heat_cool: "Fűtés/hűtés",
    mode_off: "Ki",
    p_none: "Kézi",
    p_manual: "Kézi",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Fagyvédelem",
    p_off: "Ki",
    p_away: "Távol",
    p_boost: "Boost",
    p_home: "Otthon",
    p_sleep: "Alvás",
    p_activity: "Aktivitás",
    p_schedule: "Ütemezés",
    sch_on_until: "Be {time}-ig",
    sch_off_until: "Ki {time}-ig",
    sch_on: "Be",
    sch_off: "Ki",
    sch_loading: "A hét betöltése…",
    sch_none: "Ennek az ütemezésnek a hetét nem sikerült beolvasni",
    sw_child_lock: "Gyerekzár",
    sw_window_detection: "Ablakérzékelés",
    sw_frost: "Fagyvédelem",
    sw_eco: "Eco",
    sw_display: "Kijelző",
    sw_sound: "Hang",
    sw_boost: "Boost",
    sw_light: "Fény",
    no_zone: "Nem található fűtési termosztát vagy vezérlővezetékes radiátor",
    not_found: "Az entitás nem található",
    zoom_in: "A teljes kártya megjelenítése",
    zoom_out: "Vissza a kompakt nézethez",
    ill_auto: "Automatikus",
    ill_dial: "Fali termosztát",
    ill_radiator: "Radiátor",
    ill_valve: "Termosztatikus szelep",
    ed_title: "Cím",
    ed_zone: "{n}. zóna",
    ed_add_zone: "Zóna hozzáadása",
    ed_zones_auto: "Zónák nélkül az összes fűtési termosztát és vezérlővezetékes radiátor megtalálható, területenként csoportosítva",
    ed_name: "Név",
    ed_entity: "Termosztát",
    ed_pilot_wire: "Vezérlővezetékes radiátorok",
    ed_temperature: "Szobahőmérséklet",
    ed_humidity: "Páratartalom",
    ed_schedule: "Ütemezés",
    ed_window: "Ablak",
    ed_illustration: "Illusztráció",
    ed_switch_on: "Relé be",
    ed_switch_off: "Relé ki",
    ed_switch_on_helper: "A vezérlővezetékes relé (switch) parancsa bekapcsolt állapotban",
    ed_switch_off_helper: "A vezérlővezetékes relé (switch) parancsa kikapcsolt állapotban",
    ed_show_title: "Cím",
    ed_show_subtitle: "Alcím",
    ed_show_controls: "Vezérlők",
    ed_show_sensors: "Mérések",
    ed_show_alerts: "Riasztások",
    ed_show_pilot_wire: "Vezérlővezeték",
    ed_show_schedule: "Ütemezés",
    ed_zoom: "Részletek gomb",
    ed_zoom_helper: "Jobb felső gomb, amely a mini kártyát a teljes kártyára váltja és vissza",
    ed_collapsed: "Összecsukott szakaszok",
    ed_language: "Nyelv",
    ed_language_auto: "Automatikus (Home Assistant)",
    ov_average: "Átlag",
    ov_actions: "Minden zóna",
    ov_confirm: "Fűtés átállítása erre: {mode}?",
    ov_skipped: "Nem érhető el itt: {list}",
    ov_cancel: "Mégse",
    ov_apply: "Megerősítés",
    ov_coldest: "Leghidegebb: {name}",
    ov_warmest: "Legmelegebb: {name}",
    ov_other: "Egyéb területek",
    ed_areas: "Területek",
    ed_areas_helper: "Csak ezen területek zónái (üresen mind)",
    ed_exclude_areas: "Kihagyott területek",
    ed_floors: "Szintek",
    ed_floors_helper: "Csak ezen szintek zónái (üresen mind)",
    ed_exclude_floors: "Kihagyott szintek",
    ed_include: "Hozzáadott entitások",
    ed_include_helper: "Magától nem talált termosztátok vagy vezérlővezetékes radiátorok (például rejtettek)",
    ed_exclude: "Kihagyott entitások",
    ed_sort: "Rendezés",
    ed_sort_area: "Területek sorrendje",
    ed_sort_name: "Név",
    ed_sort_temperature: "Leghidegebbek elöl",
    ed_sort_state: "Figyelmeztetések és fűtés elöl",
    ed_group_by: "Csoportosítás",
    ed_group_floor: "Szint",
    ed_group_none: "Nincs csoportosítás",
    ed_columns: "Oszlopok",
    ed_columns_helper: "Üresen automatikus",
    ed_compact: "Kompakt csempék",
    ed_show_summary: "Összegzés",
    ed_show_actions: "Gyors műveletek",
    ed_actions: "Felkínált gyors műveletek",
    ed_detail: "Koppintás egy zónára",
    ed_detail_card: "Teljes kártya",
    ed_detail_more_info: "Információs ablak",
    ed_detail_none: "Semmi",
    ed_ov_zoom_helper: "Jobb felső gomb, amely a teljes kártyára vált és vissza",
  },
  sk: {
    title: "Kúrenie",
    zone: "Zóna",
    st_heating: "Kúri",
    st_preheating: "Predhrievanie",
    st_idle: "Nečinný",
    st_off: "Vypnuté",
    st_unavailable: "Nedostupné",
    st_defrosting: "Odmrazovanie",
    zones_heating: "Kúri {n} z {total} zón",
    zones_none: "{total} zón, žiadna nekúri",
    target: "Cieľ",
    target_low: "Kúriť na",
    target_high: "Chladiť na",
    temp_down: "Znížiť cieľ",
    temp_up: "Zvýšiť cieľ",
    outdoor: "Vonku",
    valve: "Ventil",
    window_open: "Otvorené okno",
    battery_low: "Slabá batéria",
    offline: "Zariadenie je offline",
    power: "Zap. / vyp.",
    preset: "Predvoľba",
    fan_mode: "Režim ventilátora",
    swing_mode: "Režim kmitania",
    swing_horizontal_mode: "Vodorovné kmitanie",
    target_humidity: "Cieľová vlhkosť",
    options: "Možnosti",
    pilot_wire: "Pilotný vodič",
    schedule: "Rozvrh",
    mode_heat: "Kúrenie",
    mode_auto: "Auto",
    mode_heat_cool: "Kúrenie/chladenie",
    mode_off: "Vypnuté",
    p_none: "Manuálne",
    p_manual: "Manuálne",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Ochrana pred mrazom",
    p_off: "Vypnuté",
    p_away: "Preč",
    p_boost: "Boost",
    p_home: "Doma",
    p_sleep: "Spánok",
    p_activity: "Aktivita",
    p_schedule: "Rozvrh",
    sch_on_until: "Zapnuté do {time}",
    sch_off_until: "Vypnuté do {time}",
    sch_on: "Zapnuté",
    sch_off: "Vypnuté",
    sch_loading: "Načítava sa týždeň…",
    sch_none: "Týždeň tohto rozvrhu sa nepodarilo načítať",
    sw_child_lock: "Detská zámka",
    sw_window_detection: "Detekcia okna",
    sw_frost: "Ochrana pred mrazom",
    sw_eco: "Eco",
    sw_display: "Displej",
    sw_sound: "Zvuk",
    sw_boost: "Boost",
    sw_light: "Svetlo",
    no_zone: "Nenašiel sa žiadny termostat kúrenia ani radiátor s pilotným vodičom",
    not_found: "Entita sa nenašla",
    zoom_in: "Zobraziť celú kartu",
    zoom_out: "Späť na kompaktné zobrazenie",
    ill_auto: "Automaticky",
    ill_dial: "Nástenný termostat",
    ill_radiator: "Radiátor",
    ill_valve: "Termostatická hlavica",
    ed_title: "Názov",
    ed_zone: "Zóna {n}",
    ed_add_zone: "Pridať zónu",
    ed_zones_auto: "Bez zón sa nájdu všetky termostaty kúrenia a radiátory s pilotným vodičom, zoskupené podľa oblasti",
    ed_name: "Názov",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radiátory s pilotným vodičom",
    ed_temperature: "Teplota miestnosti",
    ed_humidity: "Vlhkosť",
    ed_schedule: "Rozvrh",
    ed_window: "Okno",
    ed_illustration: "Ilustrácia",
    ed_switch_on: "Relé zapnuté",
    ed_switch_off: "Relé vypnuté",
    ed_switch_on_helper: "Príkaz, ktorý posiela relé pilotného vodiča (switch), keď je zapnuté",
    ed_switch_off_helper: "Príkaz, ktorý posiela relé pilotného vodiča (switch), keď je vypnuté",
    ed_show_title: "Názov",
    ed_show_subtitle: "Podnázov",
    ed_show_controls: "Ovládanie",
    ed_show_sensors: "Merania",
    ed_show_alerts: "Upozornenia",
    ed_show_pilot_wire: "Pilotný vodič",
    ed_show_schedule: "Rozvrh",
    ed_zoom: "Tlačidlo podrobností",
    ed_zoom_helper: "Tlačidlo vpravo hore, ktoré prepne mini kartu na celú kartu a späť",
    ed_collapsed: "Zbalené sekcie",
    ed_language: "Jazyk",
    ed_language_auto: "Automaticky (Home Assistant)",
    ov_average: "Priemer",
    ov_actions: "Všetky zóny",
    ov_confirm: "Prepnúť kúrenie na {mode}?",
    ov_skipped: "Nedostupné v: {list}",
    ov_cancel: "Zrušiť",
    ov_apply: "Potvrdiť",
    ov_coldest: "Najchladnejšia: {name}",
    ov_warmest: "Najteplejšia: {name}",
    ov_other: "Ostatné oblasti",
    ed_areas: "Oblasti",
    ed_areas_helper: "Len zóny týchto oblastí (všetky, ak je prázdne)",
    ed_exclude_areas: "Vynechané oblasti",
    ed_floors: "Podlažia",
    ed_floors_helper: "Len zóny týchto podlaží (všetky, ak je prázdne)",
    ed_exclude_floors: "Vynechané podlažia",
    ed_include: "Pridané entity",
    ed_include_helper: "Termostaty alebo radiátory s pilotným vodičom, ktoré sa nenájdu samy (napríklad skryté)",
    ed_exclude: "Vynechané entity",
    ed_sort: "Zoradenie",
    ed_sort_area: "Poradie oblastí",
    ed_sort_name: "Názov",
    ed_sort_temperature: "Najchladnejšie najprv",
    ed_sort_state: "Najprv upozornenia a kúrenie",
    ed_group_by: "Zoskupiť podľa",
    ed_group_floor: "Podlažie",
    ed_group_none: "Bez zoskupenia",
    ed_columns: "Stĺpce",
    ed_columns_helper: "Automaticky, ak je prázdne",
    ed_compact: "Kompaktné dlaždice",
    ed_show_summary: "Prehľad",
    ed_show_actions: "Rýchle akcie",
    ed_actions: "Ponúkané rýchle akcie",
    ed_detail: "Ťuknutie na zónu",
    ed_detail_card: "Celá karta",
    ed_detail_more_info: "Informačné okno",
    ed_detail_none: "Nič",
    ed_ov_zoom_helper: "Tlačidlo vpravo hore, ktoré prepne na celú kartu a späť",
  },
  cs: {
    title: "Topení",
    zone: "Zóna",
    st_heating: "Topí",
    st_preheating: "Předehřev",
    st_idle: "Nečinný",
    st_off: "Vypnuto",
    st_unavailable: "Nedostupné",
    st_defrosting: "Odmrazování",
    zones_heating: "Topí {n} z {total} zón",
    zones_none: "{total} zón, žádná netopí",
    target: "Cíl",
    target_low: "Topit na",
    target_high: "Chladit na",
    temp_down: "Snížit cíl",
    temp_up: "Zvýšit cíl",
    outdoor: "Venku",
    valve: "Ventil",
    window_open: "Otevřené okno",
    battery_low: "Slabá baterie",
    offline: "Zařízení je offline",
    power: "Zap. / vyp.",
    preset: "Předvolba",
    fan_mode: "Režim ventilátoru",
    swing_mode: "Režim kmitání",
    swing_horizontal_mode: "Vodorovné kmitání",
    target_humidity: "Cílová vlhkost",
    options: "Možnosti",
    pilot_wire: "Pilotní vodič",
    schedule: "Rozvrh",
    mode_heat: "Topení",
    mode_auto: "Auto",
    mode_heat_cool: "Topení/chlazení",
    mode_off: "Vypnuto",
    p_none: "Ručně",
    p_manual: "Ručně",
    p_comfort: "Komfort",
    p_comfort_1: "Komfort −1",
    p_comfort_2: "Komfort −2",
    p_eco: "Eco",
    p_frost: "Ochrana proti mrazu",
    p_off: "Vypnuto",
    p_away: "Pryč",
    p_boost: "Boost",
    p_home: "Doma",
    p_sleep: "Spánek",
    p_activity: "Aktivita",
    p_schedule: "Rozvrh",
    sch_on_until: "Zapnuto do {time}",
    sch_off_until: "Vypnuto do {time}",
    sch_on: "Zapnuto",
    sch_off: "Vypnuto",
    sch_loading: "Načítání týdne…",
    sch_none: "Týden tohoto rozvrhu se nepodařilo načíst",
    sw_child_lock: "Dětský zámek",
    sw_window_detection: "Detekce okna",
    sw_frost: "Ochrana proti mrazu",
    sw_eco: "Eco",
    sw_display: "Displej",
    sw_sound: "Zvuk",
    sw_boost: "Boost",
    sw_light: "Světlo",
    no_zone: "Nebyl nalezen žádný termostat topení ani radiátor s pilotním vodičem",
    not_found: "Entita nebyla nalezena",
    zoom_in: "Zobrazit celou kartu",
    zoom_out: "Zpět na kompaktní zobrazení",
    ill_auto: "Automaticky",
    ill_dial: "Nástěnný termostat",
    ill_radiator: "Radiátor",
    ill_valve: "Termostatická hlavice",
    ed_title: "Název",
    ed_zone: "Zóna {n}",
    ed_add_zone: "Přidat zónu",
    ed_zones_auto: "Bez zón se najdou všechny termostaty topení a radiátory s pilotním vodičem, seskupené podle oblasti",
    ed_name: "Název",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radiátory s pilotním vodičem",
    ed_temperature: "Teplota místnosti",
    ed_humidity: "Vlhkost",
    ed_schedule: "Rozvrh",
    ed_window: "Okno",
    ed_illustration: "Ilustrace",
    ed_switch_on: "Relé zapnuto",
    ed_switch_off: "Relé vypnuto",
    ed_switch_on_helper: "Příkaz, který posílá relé pilotního vodiče (switch), když je zapnuté",
    ed_switch_off_helper: "Příkaz, který posílá relé pilotního vodiče (switch), když je vypnuté",
    ed_show_title: "Název",
    ed_show_subtitle: "Podnázev",
    ed_show_controls: "Ovládání",
    ed_show_sensors: "Měření",
    ed_show_alerts: "Upozornění",
    ed_show_pilot_wire: "Pilotní vodič",
    ed_show_schedule: "Rozvrh",
    ed_zoom: "Tlačítko podrobností",
    ed_zoom_helper: "Tlačítko vpravo nahoře, které přepne mini kartu na celou kartu a zpět",
    ed_collapsed: "Sbalené sekce",
    ed_language: "Jazyk",
    ed_language_auto: "Automaticky (Home Assistant)",
    ov_average: "Průměr",
    ov_actions: "Všechny zóny",
    ov_confirm: "Přepnout topení na {mode}?",
    ov_skipped: "Nedostupné v: {list}",
    ov_cancel: "Zrušit",
    ov_apply: "Potvrdit",
    ov_coldest: "Nejchladnější: {name}",
    ov_warmest: "Nejteplejší: {name}",
    ov_other: "Ostatní oblasti",
    ed_areas: "Oblasti",
    ed_areas_helper: "Jen zóny těchto oblastí (všechny, je-li prázdné)",
    ed_exclude_areas: "Vynechané oblasti",
    ed_floors: "Podlaží",
    ed_floors_helper: "Jen zóny těchto podlaží (všechna, je-li prázdné)",
    ed_exclude_floors: "Vynechaná podlaží",
    ed_include: "Přidané entity",
    ed_include_helper: "Termostaty nebo radiátory s pilotním vodičem, které se nenajdou samy (například skryté)",
    ed_exclude: "Vynechané entity",
    ed_sort: "Řazení",
    ed_sort_area: "Pořadí oblastí",
    ed_sort_name: "Název",
    ed_sort_temperature: "Nejchladnější nejdříve",
    ed_sort_state: "Nejdříve upozornění a topení",
    ed_group_by: "Seskupit podle",
    ed_group_floor: "Podlaží",
    ed_group_none: "Bez seskupení",
    ed_columns: "Sloupce",
    ed_columns_helper: "Automaticky, je-li prázdné",
    ed_compact: "Kompaktní dlaždice",
    ed_show_summary: "Přehled",
    ed_show_actions: "Rychlé akce",
    ed_actions: "Nabízené rychlé akce",
    ed_detail: "Klepnutí na zónu",
    ed_detail_card: "Celá karta",
    ed_detail_more_info: "Informační okno",
    ed_detail_none: "Nic",
    ed_ov_zoom_helper: "Tlačítko vpravo nahoře, které přepne na celou kartu a zpět",
  },
  sl: {
    title: "Ogrevanje",
    zone: "Cona",
    st_heating: "Greje",
    st_preheating: "Predgrevanje",
    st_idle: "Nedejaven",
    st_off: "Izklopljeno",
    st_unavailable: "Ni na voljo",
    st_defrosting: "Odtajevanje",
    zones_heating: "Greje {n} od {total} con",
    zones_none: "{total} con, nobena ne greje",
    target: "Cilj",
    target_low: "Ogrej na",
    target_high: "Ohladi na",
    temp_down: "Znižaj cilj",
    temp_up: "Zvišaj cilj",
    outdoor: "Zunaj",
    valve: "Ventil",
    window_open: "Okno odprto",
    battery_low: "Šibka baterija",
    offline: "Naprava ni povezana",
    power: "Vklop / izklop",
    preset: "Prednastavitev",
    fan_mode: "Način ventilatorja",
    swing_mode: "Način nihanja",
    swing_horizontal_mode: "Vodoravno nihanje",
    target_humidity: "Ciljna vlažnost",
    options: "Možnosti",
    pilot_wire: "Pilotna žica",
    schedule: "Urnik",
    mode_heat: "Ogrevanje",
    mode_auto: "Samodejno",
    mode_heat_cool: "Ogrevanje/hlajenje",
    mode_off: "Izklopljeno",
    p_none: "Ročno",
    p_manual: "Ročno",
    p_comfort: "Udobje",
    p_comfort_1: "Udobje −1",
    p_comfort_2: "Udobje −2",
    p_eco: "Eko",
    p_frost: "Zaščita pred zmrzaljo",
    p_off: "Izklopljeno",
    p_away: "Odsoten",
    p_boost: "Boost",
    p_home: "Doma",
    p_sleep: "Spanje",
    p_activity: "Aktivnost",
    p_schedule: "Urnik",
    sch_on_until: "Vklopljeno do {time}",
    sch_off_until: "Izklopljeno do {time}",
    sch_on: "Vklopljeno",
    sch_off: "Izklopljeno",
    sch_loading: "Nalaganje tedna…",
    sch_none: "Tedna tega urnika ni bilo mogoče prebrati",
    sw_child_lock: "Otroška zaščita",
    sw_window_detection: "Zaznavanje okna",
    sw_frost: "Zaščita pred zmrzaljo",
    sw_eco: "Eko",
    sw_display: "Zaslon",
    sw_sound: "Zvok",
    sw_boost: "Boost",
    sw_light: "Lučka",
    no_zone: "Ni najdenega termostata za ogrevanje ali radiatorja s pilotno žico",
    not_found: "Entiteta ni najdena",
    zoom_in: "Prikaži celotno kartico",
    zoom_out: "Nazaj na strnjen pogled",
    ill_auto: "Samodejno",
    ill_dial: "Stenski termostat",
    ill_radiator: "Radiator",
    ill_valve: "Termostatski ventil",
    ed_title: "Naslov",
    ed_zone: "Cona {n}",
    ed_add_zone: "Dodaj cono",
    ed_zones_auto: "Brez con se najdejo vsi termostati za ogrevanje in radiatorji s pilotno žico, združeni po prostoru",
    ed_name: "Ime",
    ed_entity: "Termostat",
    ed_pilot_wire: "Radiatorji s pilotno žico",
    ed_temperature: "Temperatura prostora",
    ed_humidity: "Vlažnost",
    ed_schedule: "Urnik",
    ed_window: "Okno",
    ed_illustration: "Ilustracija",
    ed_switch_on: "Rele vklopljen",
    ed_switch_off: "Rele izklopljen",
    ed_switch_on_helper: "Ukaz, ki ga pošlje rele pilotne žice (switch), ko je vklopljen",
    ed_switch_off_helper: "Ukaz, ki ga pošlje rele pilotne žice (switch), ko je izklopljen",
    ed_show_title: "Naslov",
    ed_show_subtitle: "Podnaslov",
    ed_show_controls: "Upravljanje",
    ed_show_sensors: "Meritve",
    ed_show_alerts: "Opozorila",
    ed_show_pilot_wire: "Pilotna žica",
    ed_show_schedule: "Urnik",
    ed_zoom: "Gumb za podrobnosti",
    ed_zoom_helper: "Gumb zgoraj desno, ki preklopi mini kartico na celotno kartico in nazaj",
    ed_collapsed: "Strnjeni razdelki",
    ed_language: "Jezik",
    ed_language_auto: "Samodejno (Home Assistant)",
    ov_average: "Povprečje",
    ov_actions: "Vse cone",
    ov_confirm: "Nastavim ogrevanje na {mode}?",
    ov_skipped: "Ni na voljo v: {list}",
    ov_cancel: "Prekliči",
    ov_apply: "Potrdi",
    ov_coldest: "Najhladnejša: {name}",
    ov_warmest: "Najtoplejša: {name}",
    ov_other: "Drugi prostori",
    ed_areas: "Prostori",
    ed_areas_helper: "Samo cone teh prostorov (vsi, če je prazno)",
    ed_exclude_areas: "Izpuščeni prostori",
    ed_floors: "Nadstropja",
    ed_floors_helper: "Samo cone teh nadstropij (vsa, če je prazno)",
    ed_exclude_floors: "Izpuščena nadstropja",
    ed_include: "Dodane entitete",
    ed_include_helper: "Termostati ali radiatorji s pilotno žico, ki niso najdeni sami (na primer skriti)",
    ed_exclude: "Izpuščene entitete",
    ed_sort: "Razvrščanje",
    ed_sort_area: "Vrstni red prostorov",
    ed_sort_name: "Ime",
    ed_sort_temperature: "Najprej najhladnejše",
    ed_sort_state: "Najprej opozorila in ogrevanje",
    ed_group_by: "Združi po",
    ed_group_floor: "Nadstropje",
    ed_group_none: "Brez združevanja",
    ed_columns: "Stolpci",
    ed_columns_helper: "Samodejno, če je prazno",
    ed_compact: "Kompaktne ploščice",
    ed_show_summary: "Povzetek",
    ed_show_actions: "Hitra dejanja",
    ed_actions: "Ponujena hitra dejanja",
    ed_detail: "Dotik cone",
    ed_detail_card: "Celotna kartica",
    ed_detail_more_info: "Okno s podatki",
    ed_detail_none: "Nič",
    ed_ov_zoom_helper: "Gumb zgoraj desno, ki preklopi na celotno kartico in nazaj",
  },
  lv: {
    title: "Apkure",
    zone: "Zona",
    st_heating: "Silda",
    st_preheating: "Priekšsildīšana",
    st_idle: "Dīkstāvē",
    st_off: "Izslēgts",
    st_unavailable: "Nav pieejams",
    st_defrosting: "Atkausēšana",
    zones_heating: "Silda {n} no {total} zonām",
    zones_none: "{total} zonas, neviena nesilda",
    target: "Mērķis",
    target_low: "Sildīt līdz",
    target_high: "Dzesēt līdz",
    temp_down: "Samazināt mērķi",
    temp_up: "Palielināt mērķi",
    outdoor: "Ārā",
    valve: "Vārsts",
    window_open: "Atvērts logs",
    battery_low: "Vājš akumulators",
    offline: "Ierīce bezsaistē",
    power: "Iesl. / izsl.",
    preset: "Iestatījums",
    fan_mode: "Ventilatora režīms",
    swing_mode: "Šūpošanas režīms",
    swing_horizontal_mode: "Horizontālā šūpošana",
    target_humidity: "Mērķa mitrums",
    options: "Opcijas",
    pilot_wire: "Vadības vads",
    schedule: "Grafiks",
    mode_heat: "Apkure",
    mode_auto: "Auto",
    mode_heat_cool: "Apkure/dzesēšana",
    mode_off: "Izslēgts",
    p_none: "Manuāli",
    p_manual: "Manuāli",
    p_comfort: "Komforts",
    p_comfort_1: "Komforts −1",
    p_comfort_2: "Komforts −2",
    p_eco: "Eko",
    p_frost: "Aizsardzība pret salu",
    p_off: "Izslēgts",
    p_away: "Prom",
    p_boost: "Boost",
    p_home: "Mājās",
    p_sleep: "Miegs",
    p_activity: "Aktivitāte",
    p_schedule: "Grafiks",
    sch_on_until: "Ieslēgts līdz {time}",
    sch_off_until: "Izslēgts līdz {time}",
    sch_on: "Ieslēgts",
    sch_off: "Izslēgts",
    sch_loading: "Ielādē nedēļu…",
    sch_none: "Šī grafika nedēļu neizdevās nolasīt",
    sw_child_lock: "Bērnu slēdzene",
    sw_window_detection: "Loga noteikšana",
    sw_frost: "Aizsardzība pret salu",
    sw_eco: "Eko",
    sw_display: "Displejs",
    sw_sound: "Skaņa",
    sw_boost: "Boost",
    sw_light: "Gaisma",
    no_zone: "Nav atrasts neviens apkures termostats vai radiators ar vadības vadu",
    not_found: "Vienība nav atrasta",
    zoom_in: "Rādīt pilno karti",
    zoom_out: "Atpakaļ uz kompakto skatu",
    ill_auto: "Automātiski",
    ill_dial: "Sienas termostats",
    ill_radiator: "Radiators",
    ill_valve: "Termostatiskais vārsts",
    ed_title: "Virsraksts",
    ed_zone: "Zona {n}",
    ed_add_zone: "Pievienot zonu",
    ed_zones_auto: "Bez zonām tiek atrasti visi apkures termostati un radiatori ar vadības vadu, grupēti pēc apgabala",
    ed_name: "Nosaukums",
    ed_entity: "Termostats",
    ed_pilot_wire: "Radiatori ar vadības vadu",
    ed_temperature: "Telpas temperatūra",
    ed_humidity: "Mitrums",
    ed_schedule: "Grafiks",
    ed_window: "Logs",
    ed_illustration: "Ilustrācija",
    ed_switch_on: "Relejs ieslēgts",
    ed_switch_off: "Relejs izslēgts",
    ed_switch_on_helper: "Komanda, ko vadības vada relejs (switch) sūta ieslēgts",
    ed_switch_off_helper: "Komanda, ko vadības vada relejs (switch) sūta izslēgts",
    ed_show_title: "Virsraksts",
    ed_show_subtitle: "Apakšvirsraksts",
    ed_show_controls: "Vadība",
    ed_show_sensors: "Mērījumi",
    ed_show_alerts: "Brīdinājumi",
    ed_show_pilot_wire: "Vadības vads",
    ed_show_schedule: "Grafiks",
    ed_zoom: "Detaļu poga",
    ed_zoom_helper: "Poga augšā pa labi, kas pārslēdz mini karti uz pilno karti un atpakaļ",
    ed_collapsed: "Sakļautās sadaļas",
    ed_language: "Valoda",
    ed_language_auto: "Automātiski (Home Assistant)",
    ov_average: "Vidēji",
    ov_actions: "Visas zonas",
    ov_confirm: "Pārslēgt apkuri uz {mode}?",
    ov_skipped: "Nav pieejams: {list}",
    ov_cancel: "Atcelt",
    ov_apply: "Apstiprināt",
    ov_coldest: "Aukstākā: {name}",
    ov_warmest: "Siltākā: {name}",
    ov_other: "Citi apgabali",
    ed_areas: "Apgabali",
    ed_areas_helper: "Tikai šo apgabalu zonas (visi, ja tukšs)",
    ed_exclude_areas: "Izslēgtie apgabali",
    ed_floors: "Stāvi",
    ed_floors_helper: "Tikai šo stāvu zonas (visi, ja tukšs)",
    ed_exclude_floors: "Izslēgtie stāvi",
    ed_include: "Pievienojamās entītijas",
    ed_include_helper: "Termostati vai radiatori ar vadības vadu, kas netiek atrasti paši (piemēram, slēptie)",
    ed_exclude: "Izslēgtās entītijas",
    ed_sort: "Kārtošana",
    ed_sort_area: "Apgabalu secība",
    ed_sort_name: "Nosaukums",
    ed_sort_temperature: "Vispirms aukstākās",
    ed_sort_state: "Vispirms brīdinājumi un apkure",
    ed_group_by: "Grupēt pēc",
    ed_group_floor: "Stāvs",
    ed_group_none: "Bez grupēšanas",
    ed_columns: "Kolonnas",
    ed_columns_helper: "Automātiski, ja tukšs",
    ed_compact: "Kompaktas flīzes",
    ed_show_summary: "Kopsavilkums",
    ed_show_actions: "Ātrās darbības",
    ed_actions: "Piedāvātās ātrās darbības",
    ed_detail: "Pieskāriens zonai",
    ed_detail_card: "Pilnā karte",
    ed_detail_more_info: "Informācijas logs",
    ed_detail_none: "Nekas",
    ed_ov_zoom_helper: "Poga augšā pa labi, kas pārslēdz uz pilno karti un atpakaļ",
  },
  el: {
    title: "Θέρμανση",
    zone: "Ζώνη",
    st_heating: "Θερμαίνει",
    st_preheating: "Προθέρμανση",
    st_idle: "Αδρανές",
    st_off: "Απενεργοποιημένο",
    st_unavailable: "Μη διαθέσιμο",
    st_defrosting: "Απόψυξη",
    zones_heating: "Θερμαίνουν {n} από {total} ζώνες",
    zones_none: "{total} ζώνες, καμία δεν θερμαίνει",
    target: "Στόχος",
    target_low: "Θέρμανση στους",
    target_high: "Ψύξη στους",
    temp_down: "Μείωση στόχου",
    temp_up: "Αύξηση στόχου",
    outdoor: "Έξω",
    valve: "Βαλβίδα",
    window_open: "Ανοιχτό παράθυρο",
    battery_low: "Χαμηλή μπαταρία",
    offline: "Η συσκευή είναι εκτός σύνδεσης",
    power: "Ενεργ. / απενεργ.",
    preset: "Προεπιλογή",
    fan_mode: "Λειτουργία ανεμιστήρα",
    swing_mode: "Λειτουργία ταλάντωσης",
    swing_horizontal_mode: "Οριζόντια ταλάντωση",
    target_humidity: "Επιθυμητή υγρασία",
    options: "Επιλογές",
    pilot_wire: "Πιλοτικό καλώδιο",
    schedule: "Πρόγραμμα",
    mode_heat: "Θέρμανση",
    mode_auto: "Αυτόματο",
    mode_heat_cool: "Θέρμανση/ψύξη",
    mode_off: "Απενεργοποιημένο",
    p_none: "Χειροκίνητο",
    p_manual: "Χειροκίνητο",
    p_comfort: "Άνεση",
    p_comfort_1: "Άνεση −1",
    p_comfort_2: "Άνεση −2",
    p_eco: "Eco",
    p_frost: "Αντιπαγετική προστασία",
    p_off: "Απενεργοποιημένο",
    p_away: "Εκτός σπιτιού",
    p_boost: "Boost",
    p_home: "Στο σπίτι",
    p_sleep: "Ύπνος",
    p_activity: "Δραστηριότητα",
    p_schedule: "Πρόγραμμα",
    sch_on_until: "Ενεργό έως {time}",
    sch_off_until: "Ανενεργό έως {time}",
    sch_on: "Ενεργό",
    sch_off: "Ανενεργό",
    sch_loading: "Φόρτωση εβδομάδας…",
    sch_none: "Δεν ήταν δυνατή η ανάγνωση της εβδομάδας αυτού του προγράμματος",
    sw_child_lock: "Κλείδωμα για παιδιά",
    sw_window_detection: "Ανίχνευση παραθύρου",
    sw_frost: "Αντιπαγετική προστασία",
    sw_eco: "Eco",
    sw_display: "Οθόνη",
    sw_sound: "Ήχος",
    sw_boost: "Boost",
    sw_light: "Φως",
    no_zone: "Δεν βρέθηκε θερμοστάτης θέρμανσης ούτε καλοριφέρ με πιλοτικό καλώδιο",
    not_found: "Η οντότητα δεν βρέθηκε",
    zoom_in: "Εμφάνιση πλήρους κάρτας",
    zoom_out: "Επιστροφή στη συμπαγή προβολή",
    ill_auto: "Αυτόματα",
    ill_dial: "Θερμοστάτης τοίχου",
    ill_radiator: "Καλοριφέρ",
    ill_valve: "Θερμοστατική κεφαλή",
    ed_title: "Τίτλος",
    ed_zone: "Ζώνη {n}",
    ed_add_zone: "Προσθήκη ζώνης",
    ed_zones_auto: "Χωρίς ζώνες, βρίσκονται όλοι οι θερμοστάτες θέρμανσης και τα καλοριφέρ με πιλοτικό καλώδιο, ομαδοποιημένα ανά χώρο",
    ed_name: "Όνομα",
    ed_entity: "Θερμοστάτης",
    ed_pilot_wire: "Καλοριφέρ με πιλοτικό καλώδιο",
    ed_temperature: "Θερμοκρασία χώρου",
    ed_humidity: "Υγρασία",
    ed_schedule: "Πρόγραμμα",
    ed_window: "Παράθυρο",
    ed_illustration: "Εικονογράφηση",
    ed_switch_on: "Ρελέ ενεργό",
    ed_switch_off: "Ρελέ ανενεργό",
    ed_switch_on_helper: "Εντολή που στέλνει ένα ρελέ πιλοτικού καλωδίου (switch) όταν είναι ενεργό",
    ed_switch_off_helper: "Εντολή που στέλνει ένα ρελέ πιλοτικού καλωδίου (switch) όταν είναι ανενεργό",
    ed_show_title: "Τίτλος",
    ed_show_subtitle: "Υπότιτλος",
    ed_show_controls: "Χειριστήρια",
    ed_show_sensors: "Μετρήσεις",
    ed_show_alerts: "Ειδοποιήσεις",
    ed_show_pilot_wire: "Πιλοτικό καλώδιο",
    ed_show_schedule: "Πρόγραμμα",
    ed_zoom: "Κουμπί λεπτομερειών",
    ed_zoom_helper: "Κουμπί πάνω δεξιά που αλλάζει τη μίνι κάρτα στην πλήρη κάρτα και πίσω",
    ed_collapsed: "Συμπτυγμένες ενότητες",
    ed_language: "Γλώσσα",
    ed_language_auto: "Αυτόματα (Home Assistant)",
    ov_average: "Μέσος όρος",
    ov_actions: "Όλες οι ζώνες",
    ov_confirm: "Ρύθμιση της θέρμανσης σε {mode};",
    ov_skipped: "Μη διαθέσιμο σε: {list}",
    ov_cancel: "Ακύρωση",
    ov_apply: "Επιβεβαίωση",
    ov_coldest: "Η πιο κρύα: {name}",
    ov_warmest: "Η πιο ζεστή: {name}",
    ov_other: "Άλλοι χώροι",
    ed_areas: "Χώροι",
    ed_areas_helper: "Μόνο οι ζώνες αυτών των χώρων (όλοι αν είναι κενό)",
    ed_exclude_areas: "Χώροι προς εξαίρεση",
    ed_floors: "Όροφοι",
    ed_floors_helper: "Μόνο οι ζώνες αυτών των ορόφων (όλοι αν είναι κενό)",
    ed_exclude_floors: "Όροφοι προς εξαίρεση",
    ed_include: "Οντότητες προς προσθήκη",
    ed_include_helper: "Θερμοστάτες ή καλοριφέρ με πιλοτικό καλώδιο που δεν βρίσκονται μόνα τους (π.χ. κρυφά)",
    ed_exclude: "Οντότητες προς εξαίρεση",
    ed_sort: "Ταξινόμηση",
    ed_sort_area: "Σειρά χώρων",
    ed_sort_name: "Όνομα",
    ed_sort_temperature: "Πρώτα οι πιο κρύες",
    ed_sort_state: "Πρώτα ειδοποιήσεις και θέρμανση",
    ed_group_by: "Ομαδοποίηση κατά",
    ed_group_floor: "Όροφος",
    ed_group_none: "Χωρίς ομαδοποίηση",
    ed_columns: "Στήλες",
    ed_columns_helper: "Αυτόματα αν είναι κενό",
    ed_compact: "Συμπαγή πλακίδια",
    ed_show_summary: "Σύνοψη",
    ed_show_actions: "Γρήγορες ενέργειες",
    ed_actions: "Προσφερόμενες γρήγορες ενέργειες",
    ed_detail: "Πάτημα σε ζώνη",
    ed_detail_card: "Πλήρης κάρτα",
    ed_detail_more_info: "Παράθυρο πληροφοριών",
    ed_detail_none: "Τίποτα",
    ed_ov_zoom_helper: "Κουμπί πάνω δεξιά που αλλάζει στην πλήρη κάρτα και πίσω",
  },
};

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The card's language: its `language` option, else Home Assistant's, else the page's; the full code when the card has
// it ("sr-Latn"), else the part before the dash ("fr-FR" → "fr"), else English.
const lang = (hass, config) => {
  const full = String(config?.language || hass?.locale?.language || hass?.language || globalThis.document?.documentElement?.lang || "en");
  if (STRINGS[full]) return full;
  const base = full.split("-")[0];
  return STRINGS[base] ? base : "en";
};

// Locale for Intl: Home Assistant's full locale ("pt-BR", "de-CH") when it is in the card's language, else the card's
// language; a bare "pt" (Home Assistant's European Portuguese) becomes "pt-PT", or Intl formats it the Brazilian way.
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = String(config?.language || hass?.locale?.language || hass?.language || "");
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)]?.[key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const unavailable = (st) => !st || st.state === "unavailable" || st.state === "unknown";
const numOf = (st) => (unavailable(st) ? null : Number.isFinite(Number.parseFloat(st.state)) ? Number.parseFloat(st.state) : null);
const fmtNum = (locale, v, digits = 1) => (v == null || !Number.isFinite(v) ? "—" : v.toLocaleString(locale, { maximumFractionDigits: digits }));
const humanize = (v) => {
  const s = String(v ?? "").replace(/_/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
};

// ── Icons (Material Design Icons paths, inlined: the card needs no icon element) ───────────────────────────────
const ICONS = {
  radiator: "M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z",
  radiator_off: "M3.28,2L2,3.27L4.77,6.04L5.64,7.39L4.22,9.6L5.95,10.5L7.23,8.5L10.73,12H4A2,2 0 0,0 2,14V22H4V20H18.73L20,21.27V22H22V20.73L22,20.72V20.72L3.28,2M7,17A1,1 0 0,1 6,18A1,1 0 0,1 5,17V15A1,1 0 0,1 6,14A1,1 0 0,1 7,15V17M11,17A1,1 0 0,1 10,18A1,1 0 0,1 9,17V15A1,1 0 0,1 10,14A1,1 0 0,1 11,15V17M15,17A1,1 0 0,1 14,18A1,1 0 0,1 13,17V15C13,14.79 13.08,14.61 13.18,14.45L15,16.27V17M16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5M22,14V18.18L19,15.18V15A1,1 0 0,0 18,14C17.95,14 17.9,14 17.85,14.03L15.82,12H20C21.11,12 22,12.9 22,14M11.64,7.3L10.22,5.1L12.22,2L13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L12.84,9L11.44,7.62L11.64,7.3M7.5,3.69L6.1,2.28L6.22,2.09L7.95,3L7.5,3.69Z",
  fire: "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",
  thermometer: "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  minus: "M19,13H5V11H19V13Z",
  plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  power: "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",
  calendar: "M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z",
  chevron: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
  auto: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22C12.4 22 12.7 22 13.1 21.9L15.4 15.3L14.8 14.7C15.5 14 16 13 16 11.9C16 11.2 15.8 10.5 15.4 9.9L17.6 7.7C18.5 9 19 10.4 19 12H20C20.3 12 20.6 12.1 20.8 12.2C20.8 12.2 20.9 12.2 20.9 12.3C21.3 12.5 21.7 12.9 21.9 13.4C22 12.9 22 12.5 22 12C22 6.5 17.5 2 12 2M14 8.6C13.4 8.2 12.7 8 12 8C9.8 8 8 9.8 8 12C8 13.1 8.4 14.1 9.2 14.8L7.1 16.9C5.8 15.7 5 13.9 5 12C5 8.1 8.1 5 12 5C13.6 5 15 5.5 16.2 6.4L14 8.6M20 14H18L14.8 23H16.7L17.4 21H20.6L21.3 23H23.2L20 14M17.8 19.7L19 16L20.2 19.7H17.8Z",
  heat_cool: "M12.92 1.58L11.18 2.58L12.39 4.67L11.8 6.85L9 7.6L7.38 6L7.42 3.59L5.43 3.59L5.43 5.42L3.59 5.42L3.6 7.42L6 7.42L7.65 9.03L6.9 11.82L4.68 12.4L2.59 11.2L1.59 12.93L3.17 13.84L2.26 15.42L4 16.42L5.19 14.33L7.42 13.75L7.92 14.26L9.32 12.86L8.78 12.32L9.53 9.54L12.32 8.78L12.85 9.32L14.26 7.91L13.73 7.37L14.32 5.19L16.41 4L15.41 2.25L13.83 3.16L12.92 1.58M20.72 4L4 20.72L5.27 22L10.16 17.11C10.63 17.43 11.15 17.68 11.71 17.83C14.38 18.55 17.12 16.96 17.83 14.29C18.22 12.86 17.93 11.36 17.11 10.16L22 5.27L20.72 4M18.74 9C19.18 9.63 19.53 10.38 19.75 11.19C19.97 12 20.03 12.81 19.96 13.61L22.65 10.41L18.74 9M19.32 15.95C19 16.67 18.5 17.35 17.93 17.94C17.34 18.53 16.66 19 15.96 19.34L20.05 20.06L19.32 15.95M9 18.71L10.41 22.66L13.59 19.95C12.81 20 12 19.97 11.19 19.76C10.36 19.54 9.62 19.17 9 18.71Z",
  window: "M21 20V2H3V20H1V23H23V20M19 4V11H17V4M5 4H7V11H5M5 20V13H7V20M9 20V4H15V20M17 20V13H19V20Z",
  battery: "M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  battery_low: "M14 20H6V6H14M14.67 4H13V2H7V4H5.33C4.6 4 4 4.6 4 5.33V20.67C4 21.4 4.6 22 5.33 22H14.67C15.4 22 16 21.4 16 20.67V5.33C16 4.6 15.4 4 14.67 4M21 7H19V13H21V8M21 15H19V17H21V15Z",
  valve: "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z",
  outdoor: "M19 8C20.11 8 21 8.9 21 10V16.76C21.61 17.31 22 18.11 22 19C22 20.66 20.66 22 19 22C17.34 22 16 20.66 16 19C16 18.11 16.39 17.31 17 16.76V10C17 8.9 17.9 8 19 8M19 9C18.45 9 18 9.45 18 10V11H20V10C20 9.45 19.55 9 19 9M12 5.69L7 10.19V18H14.1L14 19L14.1 20H5V12H2L12 3L16.4 6.96C15.89 7.4 15.5 7.97 15.25 8.61L12 5.69Z",
  flash: "M7,2V13H10V22L17,10H13L17,2H7Z",
  offline: "M19.8 22.6L17.15 20H6.5Q4.2 20 2.6 18.4T1 14.5Q1 12.58 2.19 11.08 3.38 9.57 5.25 9.15 5.33 8.95 5.4 8.76 5.5 8.57 5.55 8.35L1.4 4.2L2.8 2.8L21.2 21.2M6.5 18H15.15L7.1 9.95Q7.05 10.23 7.03 10.5 7 10.73 7 11H6.5Q5.05 11 4.03 12.03 3 13.05 3 14.5 3 15.95 4.03 17 5.05 18 6.5 18M11.13 14M21.6 18.75L20.15 17.35Q20.58 17 20.79 16.54 21 16.08 21 15.5 21 14.45 20.27 13.73 19.55 13 18.5 13H17V11Q17 8.93 15.54 7.46 14.08 6 12 6 11.33 6 10.7 6.16 10.07 6.33 9.5 6.68L8.05 5.23Q8.93 4.63 9.91 4.31 10.9 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 16.5 22.63 17.31 22.25 18.15 21.6 18.75M14.83 12.03Z",
  none: "M22.11 21.46L2.39 1.73L1.11 3L4.06 5.95C2.78 7.63 2 9.72 2 12C2 17.5 6.5 22 12 22C14.28 22 16.37 21.23 18.05 19.94L20.84 22.73L22.11 21.46M12 20C7.58 20 4 16.42 4 12C4 10.27 4.56 8.68 5.5 7.38L16.62 18.5C15.32 19.45 13.73 20 12 20M8.17 4.97L6.72 3.5C8.25 2.56 10.06 2 12 2C17.5 2 22 6.5 22 12C22 13.94 21.44 15.75 20.5 17.28L19.03 15.83C19.65 14.69 20 13.39 20 12C20 7.58 16.42 4 12 4C10.61 4 9.31 4.35 8.17 4.97Z",
  away: "M18 16H14V18H18V20L21 17L18 14V16M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 6C12.1 6 13 6.9 13 8S12.1 10 11 10 9 9.1 9 8 9.9 6 11 6M11 13C8.3 13 3 14.3 3 17V20H12.5C12.2 19.4 12.1 18.8 12 18.1H4.9V17C4.9 16.4 8 14.9 11 14.9C11.5 14.9 12 15 12.5 15C12.8 14.4 13.1 13.8 13.6 13.3C12.6 13.1 11.7 13 11 13",
  boost: "M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.5 4 19.75 4 19.96 4.05C20.13 5.44 19.94 8.3 16.66 11.58C14.96 13.29 12.93 14.6 10.65 15.47L8.5 13.37C9.42 11.06 10.73 9.03 12.42 7.34C15.18 4.58 17.64 4 19.22 4M19.22 2C17.24 2 14.24 2.69 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.62 17.27 10.13 17.5 10.66 17.5C10.89 17.5 11.13 17.44 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39S20.7 2 19.22 2M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z",
  sleep: "M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z",
  home: "M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",
  frost: "M14.46 9.41L11 7.38V5.12L12.71 3.41L11.29 2L10 3.29L8.71 2L7.29 3.41L9 5.12V7.38L6.5 8.82L4.5 7.69L3.92 5.36L2 5.88L2.47 7.65L.7 8.12L1.22 10.05L3.55 9.43L5.55 10.56V13.45L3.55 14.58L1.22 13.96L.7 15.89L2.47 16.36L2 18.12L3.93 18.64L4.55 16.31L6.55 15.18L9 16.62V18.88L7.29 20.59L8.71 22L10 20.71L11.29 22L12.7 20.59L11 18.88V16.62L14.46 14.61M7.5 10.56L10 9.11L12.5 10.56V13.44L10 14.89L7.5 13.44M19 5C17.89 5 17 5.89 17 7V13.76C16.36 14.33 16 15.15 16 16C16 17.66 17.34 19 19 19S22 17.66 22 16C22 15.15 21.64 14.33 21 13.77V7C21 5.89 20.11 5 19 5M19 6C19.55 6 20 6.45 20 7V8H18V7C18 6.45 18.45 6 19 6",
  activity: "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",
  manual: "M21 7C21 5.62 19.88 4.5 18.5 4.5C18.33 4.5 18.16 4.5 18 4.55V4C18 2.62 16.88 1.5 15.5 1.5C15.27 1.5 15.04 1.53 14.83 1.59C14.46 .66 13.56 0 12.5 0C11.27 0 10.25 .89 10.04 2.06C9.87 2 9.69 2 9.5 2C8.12 2 7 3.12 7 4.5V10.39C6.66 10.08 6.24 9.85 5.78 9.73L5 9.5C4.18 9.29 3.31 9.61 2.82 10.35C2.44 10.92 2.42 11.66 2.67 12.3L5.23 18.73C6.5 21.91 9.57 24 13 24C17.42 24 21 20.42 21 16V7M19 16C19 19.31 16.31 22 13 22C10.39 22 8.05 20.41 7.09 18L4.5 11.45L5 11.59C5.5 11.71 5.85 12.05 6 12.5L7 15H9V4.5C9 4.22 9.22 4 9.5 4S10 4.22 10 4.5V12H12V2.5C12 2.22 12.22 2 12.5 2S13 2.22 13 2.5V12H15V4C15 3.72 15.22 3.5 15.5 3.5S16 3.72 16 4V12H18V7C18 6.72 18.22 6.5 18.5 6.5S19 6.72 19 7V16Z",
  tune: "M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z",
  toggle: "M17 6H7C3.69 6 1 8.69 1 12S3.69 18 7 18H17C20.31 18 23 15.31 23 12S20.31 6 17 6M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16M17 9C15.34 9 14 10.34 14 12S15.34 15 17 15 20 13.66 20 12 18.66 9 17 9Z",
  comfort: "M21 9V7C21 5.35 19.65 4 18 4H14C13.23 4 12.53 4.3 12 4.78C11.47 4.3 10.77 4 10 4H6C4.35 4 3 5.35 3 7V9C1.35 9 0 10.35 0 12V17C0 18.65 1.35 20 3 20V22H5V20H19V22H21V20C22.65 20 24 18.65 24 17V12C24 10.35 22.65 9 21 9M14 6H18C18.55 6 19 6.45 19 7V9.78C18.39 10.33 18 11.12 18 12V14H13V7C13 6.45 13.45 6 14 6M5 7C5 6.45 5.45 6 6 6H10C10.55 6 11 6.45 11 7V14H6V12C6 11.12 5.61 10.33 5 9.78V7M22 17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V12C2 11.45 2.45 11 3 11S4 11.45 4 12V16H20V12C20 11.45 20.45 11 21 11S22 11.45 22 12V17Z",
  eco: "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z",
  monitor: "M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z",
  sound: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  light: "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  lock: "M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  pilot: "M16.5,21C13.5,21 12.31,16.76 11.05,12.28C10.14,9.04 9,5 7.5,5C4.11,5 4,11.93 4,12H2C2,11.63 2.06,3 7.5,3C10.5,3 11.71,7.25 12.97,11.74C13.83,14.8 15,19 16.5,19C19.94,19 20.03,12.07 20.03,12H22.03C22.03,12.37 21.97,21 16.5,21Z",
  alert: "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  // A target (bullseye): the average target of the overview.
  target: "M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2m0 2a8 8 0 1 1-8 8 8 8 0 0 1 8-8m0 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6m0 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4m0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2z",
};

const svgIcon = (name, cls = "") => `<svg class="icon${cls ? ` ${cls}` : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ICONS.tune}"/></svg>`;

// ── Colors ───────────────────────────────────────────────────────────────────────────────────────────────────
// Home Assistant's own climate state colors, as in ha-climate-air-card.
const IDLE = "var(--disabled-text-color, #9e9e9e)";
const HEAT = "var(--state-climate-heat-color, #ff8100)";
const MODE_COLORS = {
  heat: HEAT,
  auto: "var(--state-climate-auto-color, #008000)",
  heat_cool: "var(--state-climate-heat-cool-color, #008000)",
  // A heat pump set by hand in a zone: its other modes keep Home Assistant's colors.
  cool: "var(--state-climate-cool-color, #2b9af3)",
  dry: "var(--state-climate-dry-color, #efbd07)",
  fan_only: "var(--state-climate-fan_only-color, #8a8a8a)",
};
const BOOST = "var(--error-color, #db4437)";
// Pilot wire orders: comfort in the heat color (lighter for -1 / -2), eco green, frost protection blue, off grey.
const PILOT_COLORS = {
  comfort: HEAT,
  comfort_1: "color-mix(in srgb, var(--state-climate-heat-color, #ff8100) 80%, #ffd54f)",
  comfort_2: "color-mix(in srgb, var(--state-climate-heat-color, #ff8100) 60%, #ffd54f)",
  eco: "var(--success-color, #43a047)",
  frost: "var(--state-climate-cool-color, #2b9af3)",
  off: IDLE,
};
const MODE_ICONS = { heat: "fire", auto: "auto", heat_cool: "heat_cool", off: "power", cool: "frost", dry: "humidity", fan_only: "tune" };

// ── Presets and pilot wire orders ──────────────────────────────────────────────────────────────────────────────
// A pilot wire order from an option or a preset name, whatever the integration spells it (Nodon and Legrand
// through Zigbee2MQTT or ZHA: comfort, comfort_-1, eco, frost_protection, off; Heatzy: comfort-1, away; French
// names: confort, hors_gel, arrêt), or null.
const pilotMode = (value) => {
  const s = String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
  if (/^(comfort|confort|komfort)$/.test(s)) return "comfort";
  const minus = s.match(/^(?:comfort|confort|komfort)(?:minus|moins|m)?([12])$/);
  if (minus) return `comfort_${minus[1]}`;
  if (/^(eco|economy|economie|reduced|reduit)$/.test(s)) return "eco";
  if (/^(frost|frostprotection|horsgel|antifreeze|antigel|nofrost|hg)$/.test(s)) return "frost";
  if (/^(off|arret|stop|standby)$/.test(s)) return "off";
  return null;
};
const PILOT_ORDER = ["comfort", "comfort_1", "comfort_2", "eco", "frost", "off"];
const COMFORT_TAGS = { comfort_1: "−1", comfort_2: "−2" };
const PILOT_ICONS = { comfort: "comfort", comfort_1: "comfort", comfort_2: "comfort", eco: "eco", frost: "frost", off: "power" };

// A climate preset as one of the card's keys (p_<key>), or null for a preset of its own.
const presetKey = (p) => {
  const s = String(p ?? "").toLowerCase();
  if (s === "none") return "none";
  const pilot = pilotMode(s);
  if (pilot) return pilot;
  if (/away|absent|vacation|holiday|vacances/.test(s)) return "away";
  if (/boost|turbo/.test(s)) return "boost";
  if (/sleep|night|nuit/.test(s)) return "sleep";
  if (/home|maison/.test(s)) return "home";
  if (/activity|activit/.test(s)) return "activity";
  if (/schedule|program|planning/.test(s)) return "schedule";
  if (/manual|manuel/.test(s)) return "manual";
  return null;
};
// Icon of a climate preset (Home Assistant's own ones, the frost protection and schedule of radiator valves).
const presetIcon = (p) => {
  const k = presetKey(p);
  if (k === "comfort_1" || k === "comfort_2") return "comfort";
  if (k === "off") return "power";
  if (k === "schedule") return "calendar";
  return k && ICONS[k] ? k : "tune";
};

// ── Feature flags (homeassistant.components.climate) and timings ────────────────────────────────────────────────
const CLIMATE_TARGET = 1;
const CLIMATE_RANGE = 2;
const CLIMATE_TARGET_HUMIDITY = 4;
const CLIMATE_FAN_MODE = 8;
const CLIMATE_PRESET = 16;
const CLIMATE_SWING = 32;
const CLIMATE_TURN_OFF = 128;
const CLIMATE_SWING_HORIZONTAL = 512;
// A radiator valve's battery at or under this level (%) is flagged.
const BATTERY_LOW = 15;
// Taps on − / + (and arrow keys on the target): the service is called once they stop for this long.
const TEMP_DEBOUNCE = 900;
// Once sent, a target stays on screen until the entity reports it, or for this long at most (a device that rounds it).
const TEMP_SETTLE = 10000;

// ── Discovery ──────────────────────────────────────────────────────────────────────────────────────────────────
const dc = (cls) => (st) => st?.attributes.device_class === cls;

// Entities a thermostat's device may have next to its climate entity (ported from ha-climate-air-card). Each role is
// looked up by its registry translation_key, then by the entity_id (English, French, German and Spanish slugs), then
// by its attributes, so that it works with Zigbee2MQTT, ZHA, Netatmo, tado° or Heatzy entities alike.
const ROLES = {
  indoor_temp: {
    domain: "sensor",
    id: /(indoor_temperature|temperature_interieure|innentemperatur|temperatura_interior|local_temperature)$/,
    test: dc("temperature"),
  },
  outdoor_temp: { domain: "sensor", id: /(outdoor_temperature|temperature_exterieure|aussentemperatur|temperatura_exterior)(_\d+)?$/ },
  humidity: { domain: "sensor", test: dc("humidity") },
  power: { domain: "sensor", id: /(real_time_power|current_power|puissance_instantanee)/, test: dc("power") },
  valve: {
    domain: ["sensor", "number"],
    keys: ["valve_position", "pi_heating_demand", "heating_demand"],
    id: /(valve_(position|opening|state)|pi_heating_demand|heating_demand|position_vanne|ouverture_vanne|ventilstellung|ventilposition)$/,
  },
  window: {
    domain: "binary_sensor",
    keys: ["window_open", "window_detection"],
    id: /(window_open|window_detection|open_window|fenetre_ouverte|fenster_offen|ventana_abierta)$/,
    test: dc("window"),
  },
  battery: { domain: "sensor", test: dc("battery") },
};
// The outdoor sensor never stands for the room: skip it when looking for the indoor one.
const OUTDOOR = /(outdoor|exterieur|aussen|exterior)/;

// The device switches listed as options: icon and label (`sw_<key>`) from the entity ID, since integrations often
// name them in English only. The first match wins; others keep their own name.
const SWITCHES = [
  [/child_?lock|lock|verrou|kindersicherung/, "lock", "child_lock"],
  [/window|fenetre|fenster/, "window", "window_detection"],
  [/frost|freeze|antigel|hors_?gel/, "frost", "frost"],
  [/eco/, "eco", "eco"],
  [/display|screen|ecran|led/, "monitor", "display"],
  [/tone|sound|buzzer|beep|bip/, "sound", "sound"],
  [/boost|turbo/, "boost", "boost"],
  [/light|lamp/, "light", "light"],
];
const switchInfo = (id) => SWITCHES.find(([re]) => re.test(id.split(".")[1] || id));

// Memo for the lookups that scan the registry or all of `hass.states`, keyed on the `hass.entities` object (it only
// changes with the registry) and started over when the number of states changes (states still arriving at start-up)
// or the area or device registry changes (an area renamed, a device moved to another area).
const MEMO = new WeakMap();
const memo = (hass, key, compute) => {
  const reg = hass?.entities;
  if (!reg) return compute();
  const count = Object.keys(hass.states || {}).length;
  let m = MEMO.get(reg);
  if (!m || m.count !== count || m.areas !== hass.areas || m.devices !== hass.devices) {
    MEMO.set(reg, (m = { count, areas: hass.areas, devices: hass.devices, map: new Map() }));
  }
  if (!m.map.has(key)) m.map.set(key, compute());
  return m.map.get(key);
};

const byDevice = (hass) =>
  memo(hass, "devices", () => {
    const index = new Map();
    for (const e of Object.values(hass.entities || {})) {
      if (!e.device_id || e.hidden) continue;
      if (!index.has(e.device_id)) index.set(e.device_id, []);
      index.get(e.device_id).push(e);
    }
    return index;
  });

const deviceOf = (hass, id) => hass?.entities?.[id]?.device_id;
const deviceEntities = (hass, deviceId) => (deviceId ? (byDevice(hass).get(deviceId) || []).filter((e) => hass.states[e.entity_id]) : []);
const areaIdOf = (hass, id) => {
  const e = hass?.entities?.[id];
  return e?.area_id || (e?.device_id && hass.devices?.[e.device_id]?.area_id) || null;
};
const areaName = (hass, id) => hass?.areas?.[areaIdOf(hass, id)]?.name || "";

const findRole = (hass, list, role) => {
  const m = ROLES[role];
  const domains = [].concat(m.domain);
  const inDomain = list.filter((e) => domains.includes(e.entity_id.split(".")[0]) && !(role === "indoor_temp" && OUTDOOR.test(e.entity_id)));
  let hit = m.keys && inDomain.find((e) => m.keys.includes(e.translation_key));
  if (!hit && m.id) hit = inDomain.find((e) => m.id.test(e.entity_id));
  if (!hit && m.test && role !== "indoor_temp") hit = inDomain.find((e) => m.test(hass.states[e.entity_id]));
  return hit?.entity_id;
};

const roleOf = (hass, id, role) => memo(hass, `role:${id}:${role}`, () => findRole(hass, deviceEntities(hass, deviceOf(hass, id)), role));

// A heating thermostat: a climate entity that heats and cannot cool, dry or only blow (those are air conditioners,
// for ha-climate-air-card).
const isThermostat = (st) => {
  const modes = st?.attributes?.hvac_modes || [];
  return modes.some((m) => m === "heat" || m === "auto" || m === "heat_cool") && !modes.some((m) => m === "cool" || m === "dry" || m === "fan_only");
};

// A pilot wire radiator: a select offering at least three pilot wire orders.
const isPilotSelect = (st) => new Set((st?.attributes?.options || []).map(pilotMode).filter(Boolean)).size >= 3;

// The first temperature (indoor) or humidity sensor of an area, for a zone without thermostat.
const areaSensor = (hass, area, cls) =>
  Object.keys(hass.states).find(
    (id) =>
      id.startsWith("sensor.") &&
      areaIdOf(hass, id) === area &&
      dc(cls)(hass.states[id]) &&
      !(cls === "temperature" && OUTDOOR.test(id)) &&
      !hass.entities?.[id]?.hidden &&
      !hass.entities?.[id]?.entity_category,
  );

const deviceName = (hass, id) => {
  const dev = hass.devices?.[deviceOf(hass, id)];
  return String(dev?.name_by_user || dev?.name || "").trim();
};

// The name shown for an entity: its device's name, else its own.
const nameOf = (hass, id) => deviceName(hass, id) || String(hass.states[id]?.attributes.friendly_name || id);

// Every zone found on the instance: one per area holding heating thermostats or pilot wire radiators (its first
// thermostat, all its pilot wire radiators, its temperature and humidity sensors when there is no thermostat, and its
// schedule helper), in the order of the area registry; a thermostat beyond the first of its area, and entities
// without an area, get a zone of their own. Hidden and configuration entities are left out.
const discoverZones = (hass) =>
  memo(hass, "zones", () => {
    const shown = (id) => {
      const e = hass.entities?.[id];
      return !e?.hidden && !(e?.entity_category && !id.startsWith("select."));
    };
    const ids = Object.keys(hass.states).filter(shown);
    const thermostats = ids.filter((id) => id.startsWith("climate.") && isThermostat(hass.states[id]));
    // The selects of an air conditioner or a fan (a mode select whose options read like pilot wire orders) are theirs,
    // not a pilot wire radiator's: ha-climate-air-card's.
    const notHeating = new Set(
      Object.keys(hass.states)
        .filter((id) => id.startsWith("fan.") || (id.startsWith("climate.") && !isThermostat(hass.states[id])))
        .map((id) => deviceOf(hass, id))
        .filter(Boolean),
    );
    const pilots = ids.filter((id) => id.startsWith("select.") && isPilotSelect(hass.states[id]) && !notHeating.has(deviceOf(hass, id)));
    const areas = new Map(Object.keys(hass.areas || {}).map((a) => [a, { climates: [], pilots: [] }]));
    const loose = [];
    for (const [list, key] of [
      [thermostats, "climates"],
      [pilots, "pilots"],
    ]) {
      for (const id of list) {
        const a = areaIdOf(hass, id);
        if (a && areas.has(a)) areas.get(a)[key].push(id);
        else loose.push(key === "climates" ? { entity: id } : { pilot_wire: [id], name: nameOf(hass, id) });
      }
    }
    const inArea = (area, test) => ids.find((id) => areaIdOf(hass, id) === area && test(id));
    const zones = [];
    for (const [area, { climates, pilots: pw }] of areas) {
      if (!climates.length && !pw.length) continue;
      const name = hass.areas[area]?.name;
      const zone = { name, area, pilot_wire: pw };
      if (climates.length) zone.entity = climates[0];
      else {
        zone.temperature = areaSensor(hass, area, "temperature");
        zone.humidity = areaSensor(hass, area, "humidity");
      }
      zone.schedule = inArea(area, (id) => id.startsWith("schedule."));
      // A second thermostat of the area gets its own zone, named after its device (not the area again).
      zones.push(zone, ...climates.slice(1).map((entity) => ({ entity, area, name: nameOf(hass, entity) })));
    }
    return [...zones, ...loose];
  });

// The zones of a card: `zones`, else the top-level `entity` / `pilot_wire` (one zone), else every zone found.
// A zone given as a bare entity id is a thermostat, or a pilot wire radiator for a select or a switch.
const ZONE_KEYS = ["entity", "name", "icon", "illustration", "pilot_wire", "temperature", "humidity", "schedule", "window", "entities", "switch_on", "switch_off"];
const normZone = (z) => {
  const zone = typeof z === "string" ? { entity: z } : { ...z };
  if (zone.entity && /^(select|switch)\./.test(zone.entity)) {
    zone.pilot_wire = [zone.entity, ...[].concat(zone.pilot_wire || [])];
    delete zone.entity;
  }
  zone.pilot_wire = [].concat(zone.pilot_wire || []).filter(Boolean);
  return zone;
};
const zonesOf = (hass, config) => {
  if (Array.isArray(config.zones) && config.zones.length) return config.zones.filter(Boolean).map(normZone);
  if (config.entity || config.pilot_wire) return [normZone(Object.fromEntries(ZONE_KEYS.filter((k) => config[k] != null).map((k) => [k, config[k]])))];
  // Discovered zones go through normZone too: a thermostat without an area, or the second one of an area, has no
  // pilot_wire list of its own.
  return hass ? discoverZones(hass).map(normZone) : [];
};

// ── Schedules ──────────────────────────────────────────────────────────────────────────────────────────────────
// The week of a `schedule` helper: schedule.get_schedule (Home Assistant 2025.1+, every schedule), else the
// schedule/list of the helpers created in the UI, matched by unique id or name. Kept per entity until its state
// object changes (it does at each start or end of a time slot, and when the schedule is edited).
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const SCHEDULES = new Map();
const toMinutes = (s) => {
  const [h, m] = String(s || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
const weekOf = (data) =>
  data && DAYS.some((d) => Array.isArray(data[d]))
    ? DAYS.map((d) =>
        (data[d] || [])
          .map((b) => {
            const from = toMinutes(b.from);
            const to = toMinutes(b.to);
            return [from, to <= from ? 1440 : to];
          })
          .sort((a, b) => a[0] - b[0]),
      )
    : null;
async function fetchWeek(hass, id) {
  try {
    const r = await hass.callWS({ type: "call_service", domain: "schedule", service: "get_schedule", target: { entity_id: id }, return_response: true });
    const week = weekOf(r?.response?.[id]);
    if (week) return week;
  } catch (_err) {
    /* older Home Assistant: no get_schedule */
  }
  try {
    const list = await hass.callWS({ type: "schedule/list" });
    let uid;
    try {
      uid = (await hass.callWS({ type: "config/entity_registry/get", entity_id: id }))?.unique_id;
    } catch (_err) {
      /* not an admin */
    }
    const name = hass.states[id]?.attributes.friendly_name;
    const item = (list || []).find((i) => uid && i.id === uid) || (list || []).find((i) => i.name === name);
    return weekOf(item);
  } catch (_err) {
    return null;
  }
}

// ── Illustrations (ported from ha-climate-air-card's thermostat card) ─────────────────────────────────────────────
// Heat rises while it actually heats (hvac_action, else the valve opening), the radiator glows from the bottom up and
// the dial's flame flickers; the display shows the target and the dial's arc where it sits between the entity's min
// and max. Three shapes: a round wall thermostat, a column radiator and a radiator valve on the corner of its
// radiator; `illustration: auto` picks one from the device model and name. A pilot wire radiator is the column
// radiator, glowing in the color of its order.
const waves = (xs, y) => `<g class="heat">${xs.map((x) => `<path d="M${x} ${y}q-2-2.5 0-5t0-5"/>`).join("")}</g>`;

const columns = (x, n, w, step, y1, y2) =>
  Array.from({ length: n }, (_, i) => {
    const cx = x + i * step;
    const r = w / 2;
    return (
      `<rect x="${cx}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${r}" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width=".9"/>` +
      `<rect class="glow" x="${cx}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${r}" fill="url(#hc-tg)"/>`
    );
  }).join("");

const arc = (cx, cy, r, level) => {
  const len = 2 * Math.PI * r;
  const part = len * 0.75;
  const at = `transform="rotate(135 ${cx} ${cy})"`;
  const lvl = Math.max(0, Math.min(1, level ?? 0));
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3a434e" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${part.toFixed(2)} ${len.toFixed(2)}" ${at}/>` +
    `<circle class="arc" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, part * lvl).toFixed(2)} ${len.toFixed(2)}" ${at}/>`
  );
};

const ARTS = {
  dial: (s) =>
    '<circle class="halo" cx="40" cy="52" r="34" fill="url(#hc-th)"/>' +
    waves([31, 40, 49], 24) +
    '<rect x="13" y="25" width="54" height="54" rx="12" fill="url(#hc-tb)" stroke="#c3cad2" stroke-width="1.1"/>' +
    '<circle cx="40" cy="52" r="22" fill="url(#hc-tr)" stroke="#aab3bd" stroke-width=".8"/>' +
    '<circle cx="40" cy="52" r="18" fill="#1d2632"/>' +
    arc(40, 52, 14.5, s.level) +
    `<text class="disp big" x="40" y="54.6" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<path class="flame" d="M40 57.4c2 1.7 2.6 3 2.6 4.3a2.6 2.6 0 0 1-5.2 0c0-1 .5-1.8 1.1-2.3c.1.8.5 1.2 1 1.2c.5-1 .5-2.1.5-3.2Z"/>' +
    '<circle class="led" cx="40" cy="74" r="1.3"/>',
  radiator: () =>
    '<ellipse class="floor" cx="40" cy="89" rx="31" ry="4" fill="url(#hc-af)"/>' +
    waves([22, 40, 58], 22) +
    '<rect x="12" y="82" width="4" height="6" rx="1" fill="#8f9aa6"/><rect x="60" y="82" width="4" height="6" rx="1" fill="#8f9aa6"/>' +
    columns(8, 7, 7, 8.6, 28, 84) +
    '<rect x="6" y="31" width="64" height="3.4" rx="1.7" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="6" y="77" width="64" height="3.4" rx="1.7" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="70" y="42" width="7" height="22" rx="2.2" fill="#3a434e"/>' +
    '<circle class="led" cx="73.5" cy="47" r="1.3"/>' +
    '<circle cx="73.5" cy="56" r="2.2" fill="#5d6874" stroke="#8f9aa6" stroke-width=".5"/>',
  valve: (s) =>
    '<ellipse class="floor" cx="26" cy="89" rx="24" ry="3.6" fill="url(#hc-af)"/>' +
    waves([11, 20, 29], 22) +
    columns(2, 4, 7, 8.6, 30, 86) +
    '<rect x="0" y="33" width="38" height="3.2" rx="1.6" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="0" y="79" width="38" height="3.2" rx="1.6" fill="#dfe4ea" stroke="#c3cad2" stroke-width=".6"/>' +
    '<rect x="36" y="77" width="40" height="6" rx="1.5" fill="#cfd5dc" stroke="#aab3bd" stroke-width=".6"/>' +
    '<rect x="51" y="66" width="12" height="18" rx="2" fill="#dfe4ea" stroke="#aab3bd" stroke-width=".7"/>' +
    '<rect x="48" y="16" width="18" height="51" rx="8" fill="url(#hc-tc)" stroke="#c3cad2" stroke-width="1.1"/>' +
    '<path d="M50 50h14M50 53.5h14M50 57h14M50 60.5h14" stroke="#d5dbe2" stroke-width="1"/>' +
    `<rect x="50" y="26" width="14" height="10" rx="2.5" fill="#1d2632"/><text class="disp" x="57" y="33.2" text-anchor="middle">${esc(s.display || "")}</text>` +
    '<circle class="led" cx="57" cy="42" r="1.3"/>',
};
const ILLUSTRATIONS = Object.keys(ARTS);

const art = (variant, s, uid) =>
  (
    '<svg viewBox="0 0 80 94" aria-hidden="true"><defs>' +
    '<linearGradient id="hc-tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e1e6eb"/></linearGradient>' +
    '<linearGradient id="hc-tc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d5dbe2"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d0d8"/></linearGradient>' +
    '<linearGradient id="hc-tr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#c9d0d8"/><stop offset="1" stop-color="#eef1f4"/></linearGradient>' +
    '<linearGradient id="hc-tg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" class="c-stop" stop-opacity=".75"/><stop offset=".7" class="c-stop" stop-opacity=".18"/><stop offset="1" class="c-stop" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="hc-th" cx=".5" cy=".5" r=".5"><stop offset=".55" class="c-stop" stop-opacity=".35"/><stop offset="1" class="c-stop" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="hc-af" cx=".5" cy=".5" r=".5"><stop offset="0" class="c-stop" stop-opacity=".45"/><stop offset="1" class="c-stop" stop-opacity="0"/></radialGradient></defs>' +
    (ARTS[variant] || ARTS.dial)(s) +
    "</svg>"
  ).replace(/(id="|url\(#)(hc-[a-z]+)/g, `$1$2-${uid}`);

// The shape that looks most like the device, from its model and name: a valve first (a "radiator valve" is one).
const guessVariant = (text) => {
  const s = String(text).toLowerCase();
  if (/valve|vanne|trv|t[eê]te.?thermo|thermostatic|thermostatique|heizk[oö]rperthermostat|ventil|spirit|eurotronic|danfoss.?ally|e1.?thermostat/.test(s)) return "valve";
  if (/radiat|convect|heater|chauffage|panel|panneau|towel|s[eè]che|heizk[oö]rper|radiador|heatzy/.test(s)) return "radiator";
  return "dial";
};
const variantOf = (hass, id, illustration) => {
  if (illustration && ILLUSTRATIONS.includes(illustration)) return illustration;
  if (id?.split(".")[0] !== "climate") return "radiator";
  const dev = hass.devices?.[deviceOf(hass, id)];
  return guessVariant([dev?.model, dev?.name, dev?.name_by_user, id, hass.states[id]?.attributes.friendly_name].filter(Boolean).join(" "));
};

// ── Styles ─────────────────────────────────────────────────────────────────────────────────────────────────────
// The look of ha-climate-air-card (header badge, pill, segments, steppers, chips), on --hc-color.
const ART_STYLE = `
  .picture { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 76px; height: 88px; }
  .picture svg { width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 3px 6px rgba(0,0,0,.18)); }
  .picture .disp { font: 600 5.6px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--hc-color); }
  .picture .disp.big { font-size: 8.4px; }
  .picture .arc { stroke: var(--hc-color); transition: stroke .4s; }
  .picture .led { fill: #9aa5b1; }
  .picture .c-stop { stop-color: var(--hc-color); }
  .picture .floor, .picture .halo, .picture .glow { opacity: 0; transition: opacity .6s; }
  .picture .flame { fill: var(--hc-color); opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; }
  .picture .heat { fill: none; stroke: var(--hc-color); stroke-width: 1.4; stroke-linecap: round; }
  .picture .heat path { opacity: 0; transform-box: view-box; }
  .picture.running .led { fill: var(--hc-color); }
  .picture.running .floor { opacity: .45; }
  .picture.running.active .floor, .picture.running.active .halo { opacity: 1; }
  .picture.running.active .led { animation: hc-blink 2s ease-in-out infinite; }
  .picture.running.active .glow { opacity: 1; animation: hc-glow 3.2s ease-in-out infinite; }
  .picture.running.active .flame { opacity: 1; animation: hc-flame 1.3s ease-in-out infinite; }
  .picture.running.active .heat path { animation: hc-rise 2.8s ease-in-out infinite; }
  .picture.running.active .heat path:nth-child(2) { animation-delay: .9s; }
  .picture.running.active .heat path:nth-child(3) { animation-delay: 1.8s; }
  /* Boost: the flame and the heat go twice as fast. */
  .picture.boost.active .flame { animation-duration: .65s; }
  .picture.boost.active .heat path { animation-duration: 1.4s; }
  .picture.boost.active .heat path:nth-child(2) { animation-delay: .45s; }
  .picture.boost.active .heat path:nth-child(3) { animation-delay: .9s; }
  /* A pilot wire radiator on eco breathes slowly, on frost protection it barely glows. */
  .picture.pw-eco .glow { opacity: .7; animation: hc-breathe-glow 4s ease-in-out infinite; }
  .picture.pw-frost .glow { opacity: .35; }
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

const BASE_STYLE = `${ART_STYLE}
  :host { --hc-ok: var(--success-color, #43a047); --hc-warn: var(--warning-color, #ffa600); --hc-crit: var(--error-color, #db4437);
          /* Text in a state color is mixed with the text color, to read at 4.5:1 at least. */
          --hc-text: color-mix(in srgb, var(--hc-color) 60%, var(--primary-text-color)); }
  /* ha-card is a size container, so its content gives it no width: the empty, zero-height grid before it stands in
     for the content, a natural width without a minimum (see ha-vacuum-card). */
  :host { display: block; height: 100%; min-width: 0; --hc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--hc-natural-width)); height: 0; }
  ha-card { height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; container-type: inline-size; overflow: hidden; }
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
  /* The status pill sits on the title's line, at the right of the header. */
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
  @container (max-width: 230px) {
    .header { gap: 6px; }
    .st { flex: none; padding: 4px; position: relative; }
    .st .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`;

const FULL_STYLE = `
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

const MINI_STYLE = `
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
const OVERVIEW_STYLE = `
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
  }
`;

// ── Cards ──────────────────────────────────────────────────────────────────────────────────────────────────────
const DEFAULT_COLLAPSED = ["schedule"];
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app) a
// tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to the
// page. It counts when the press and the release are both outside the card (a slider dragged out of the card does not
// fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through the click
// event. `tap(ev)` (a press and a release at the same spot) is for the tests.
const watchOutside = (isOut, handler) => {
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
// What identifies the focused control across a render (its tag and data attributes).
const focusKey = (el) => {
  const data = [...(el?.attributes || [])].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value]);
  return data.length ? { tag: el.localName, data } : null;
};
let UID = 0;

class HeatingCard extends HTMLElement {
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
    // The "now" line and the next change of the schedule move on their own: redrawn every minute while the card is on
    // the page and shows a schedule (no other card is rebuilt, nor its animations restarted, for nothing).
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      const folded = this._setZoom && !this._zoomed; // a mini card in its compact view draws no schedule
      if (!folded && this._config?.show_schedule !== false && this._zonesNow?.some((z) => z.schedule)) this._refresh();
    }, 60000);
  }

  disconnectedCallback() {
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
  _zones() {
    return zonesOf(this._hass, this._config).map((z, i) => this._resolve(z, i));
  }

  // A zone with its entities found: the thermostat's device roles (overridable with `entities`), the zone's own
  // temperature / humidity / window sensors winning, and its pilot wire radiators.
  _resolve(z, index) {
    const hass = this._hass;
    const id = z.entity && hass.states[z.entity] ? z.entity : null;
    const ent = { main: id };
    const over = z.entities || {};
    for (const role of Object.keys(ROLES)) ent[role] = over[role] || (id ? roleOf(hass, id, role) : undefined);
    if (z.temperature) ent.indoor_temp = z.temperature;
    if (z.humidity) ent.humidity = z.humidity;
    if (z.window) ent.window = z.window;
    const pilots = z.pilot_wire.filter((p) => hass.states[p]);
    const missing = (z.entity && !id) || (!z.entity && z.pilot_wire.length && !pilots.length);
    const used = new Set(Object.values(ent).filter(Boolean));
    const switches = id ? deviceEntities(hass, deviceOf(hass, id)).map((e) => e.entity_id).filter((s) => s.startsWith("switch.") && !used.has(s) && !pilots.includes(s)) : [];
    const name = z.name || (id ? areaName(hass, id) || nameOf(hass, id) : pilots[0] ? areaName(hass, pilots[0]) || nameOf(hass, pilots[0]) : "") || this._t("zone");
    return { ...z, index, id, ent, pilots, switches, name, missing, schedule: z.schedule && hass.states[z.schedule] ? z.schedule : null };
  }

  // Every entity the card shows, for the render signature.
  _ids(zones) {
    return zones.flatMap((z) => [z.id, ...Object.values(z.ent), ...z.pilots, ...z.switches, z.schedule]).filter(Boolean);
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
    this.shadowRoot.innerHTML = this._render(zones);
    if (key) [...this.shadowRoot.querySelectorAll(key.tag)].find((n) => key.data.every(([k, v]) => n.getAttribute(k) === v))?.focus({ preventScroll: true });
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
      // Whether it heats right now: what the entity says it does, else whether its valve is open.
      m.heating = m.on && (action ? ["heating", "preheating"].includes(action) : m.valve != null ? m.valve > 0 : m.mode === "heat");
      m.preset = m.on && a.preset_mode && a.preset_mode !== "none" ? a.preset_mode : "";
      m.boost = presetKey(m.preset) === "boost";
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
    if (!m.online) m.chips.push(this._chip("offline", this._t("offline"), "", z.id || z.pilots[0]));
    m.alert = m.chips.some((x) => x.includes("chip warn"));
    return m;
  }

  // The pilot wire order of a radiator: the select's option, or the switch's state through switch_on / switch_off.
  _pilotState(z, id) {
    const st = this._st(id);
    if (unavailable(st)) return null;
    if (id.startsWith("switch.")) return st.state === "on" ? pilotMode(z.switch_on) || "comfort" : pilotMode(z.switch_off) || "off";
    return pilotMode(st.state);
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
    return { color, heating, status, sub };
  }

  _header(title, sub, summary) {
    return (
      `<div class="header" style="--hc-color:${summary.color}"><div class="badge${summary.heating ? " heating" : ""}">${svgIcon(summary.heating ? "radiator" : summary.color === IDLE ? "radiator_off" : "radiator")}</div>` +
      `<div class="titles"><div class="name">${esc(title)}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div>` +
      `<span class="st${summary.heating ? " heating" : ""}" title="${esc(summary.status)}" role="status"><span class="dot"></span><span class="stt">${esc(summary.status)}</span></span>` +
      `${this._zoomButton()}</div>`
    );
  }

  _zoomButton() {
    return "";
  }

  _styles(color, own) {
    return `<style>${BASE_STYLE}${own}</style><style>:host{--hc-color:${color};}</style>`;
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
    if (m.pilot && m.on && m.pilot.startsWith("comfort")) cls.push("active");
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
    const sub = zones.length === 1 ? [c.title || c.name ? place : "", m.presetText].filter(Boolean).join(" · ") : summary.sub;
    return (
      `${this._styles(m.color, FULL_STYLE)}<ha-card>` +
      this._header(title, sub, summary) +
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
    const parts = [`<div class="hero" style="--hc-color:${m.color}">${this._picture(m)}<div class="info">${this._heroInfo(m)}${m.chips.length ? `<div class="chips">${m.chips.join("")}</div>` : ""}</div></div>`];
    if (c.show_controls && m.online && z.id) parts.push(this._controls(m));
    if (c.show_pilot_wire && z.pilots.length) parts.push(this._pilotSection(m));
    if (c.show_schedule && z.schedule) parts.push(this._scheduleSection(m));
    if (c.show_controls && m.online && z.switches.length) parts.push(this._options(z));
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
    if (!options || options.length < 2) return "";
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
    const presets = a.preset_modes || [];
    let presetHtml = "";
    if (m.on && f & CLIMATE_PRESET && presets.length >= 2) {
      const shown = presets.filter((p) => p !== "none");
      presetHtml =
        shown.length <= 7
          ? this._segments("preset", shown.length >= 2 ? shown : presets, a.preset_mode, (o) => this._presetLabel(z.id, o), presetIcon, ` data-zone="${z.index}"`)
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
            return `<div class="pilot"><div class="pilot-name" style="--pc:${mode ? PILOT_COLORS[mode] : IDLE}">${svgIcon(mode ? PILOT_ICONS[mode] : "radiator")}<span>${esc(name)}</span></div>${segs || `<div class="muted">${esc(mode ? this._t(`p_${mode}`) : this._fmtState(id))}</div>`}</div>`;
          })
          .join("");
    return `<div class="section">${this._sectionTitle("pilot_wire", "pilot", this._t("pilot_wire"))}${body}</div>`;
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
class HeatingMiniCard extends HeatingCard {
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
      this._header(c.title || c.name || this._t("title"), summary.sub, summary) +
      `<div class="rows">${models.map((m, i) => this._row(m, i)).join("")}</div></ha-card>`
    );
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
      this._header(c.title || c.name || z.name, "", summary) +
      `<div class="content">${this._picture(m)}<div class="info">${lines.join("")}${chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}</div>` +
      `${btns.length ? `<div class="mcontrols">${btns.join("")}</div>` : ""}</div></ha-card>`
    );
  }
}

// ── Overview card ──────────────────────────────────────────────────────────────────────────────────────────────
// The heating of the whole home at a glance (what the overview of ha-climate-air-card showed of the thermostats, with
// the zones, pilot wire and schedules of this card): a summary (zones heating, average room temperature from the
// coldest to the warmest zone, average target, open windows, low batteries, pilot wire radiators per order), quick
// actions for every zone (comfort, eco, frost protection, away, off) confirmed at the top of the card, and the zones
// floor by floor, one tile each. A tap on a zone unfolds the full card on it (or opens its more-info dialog), the
// detail button at the top right switches to the full card and back, and a click elsewhere brings the overview back.
const OV_ORDERS = ["comfort", "eco", "frost", "away", "off"];
const OV_DEFAULT_ACTIONS = ["comfort", "eco", "frost", "away"];
const OV_ICONS = { comfort: "comfort", eco: "eco", frost: "frost", away: "away", off: "power" };
const OV_COLORS = { ...PILOT_COLORS, away: "var(--purple-color, #926bc7)" };
// The presets a thermostat takes for each quick action, the first it offers wins ("none" is manual: back to its own
// target), and the orders a pilot wire radiator takes.
const OV_PRESETS = { comfort: ["comfort", "home", "none"], eco: ["eco"], frost: ["frost", "away"], away: ["away", "frost", "eco"] };
const OV_PILOT = { comfort: ["comfort"], eco: ["eco"], frost: ["frost"], away: ["frost", "eco"], off: ["off"] };
// Sorts of the zones within a floor; `area` keeps the order of the area registry.
const OV_RANK = (m, alerts) => (alerts ? 0 : m.heating ? 1 : m.on ? 2 : m.online ? 3 : 4);
const OV_SORTS = ["area", "name", "temperature", "state"];
const OV_DETAILS = ["card", "more-info", "none"];
// After the confirmation closes, clicks on the card are ignored for this long: the second click of a double click on
// Confirm would otherwise land on the tile under it.
const CONFIRM_GUARD = 400;
const listOf = (v) => [].concat(v ?? []).filter((x) => x != null && x !== "");

class HeatingOverviewCard extends HeatingMiniCard {
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
    const parts = [this._header(c.title || c.name || this._t("title"), summary.sub, summary)];
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
    const comfort = !!(m.pilot && m.on && m.pilot.startsWith("comfort"));
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
        const text = `${deviceName(this._hass, id) || this._label(id)}: ${mode ? this._t(`p_${mode}`) : this._t("st_unavailable")}`;
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
      `<div class="tbadge">${svgIcon(icon)}${c.compact && m.alerts.length ? '<span class="adot"></span>' : ""}</div>` +
      `<div class="tname">${esc(z.name)}</div><div class="ttemp">${temp}${target}</div><div class="tsub">${esc(status)}</div>` +
      `<div class="tmore">${more.join("")}</div></div>`
    );
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

// ── Visual editors (ha-form) ─────────────────────────────────────────────────────────────────────────────────────
// Every option of the card, and its zones as folded sections (one per zone, plus an empty one to add a zone).
const LANGUAGES = [
  ["en", "English"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["sr", "Српски"], ["sr-Latn", "Srpski (latinica)"],
  ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português (Portugal)"], ["pl", "Polski"], ["ro", "Română"], ["da", "Dansk"],
  ["sv", "Svenska"], ["bg", "Български"], ["ru", "Русский"], ["uk", "Українська"], ["hu", "Magyar"], ["sk", "Slovenčina"],
  ["cs", "Čeština"], ["sl", "Slovenščina"], ["lv", "Latviešu"], ["el", "Ελληνικά"],
];

// The language option of the editors: automatic (Home Assistant's), or one of the card's languages.
const languageField = (tr) => ({
  name: "language",
  selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("ed_language_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
});

// The sections folded at first (`collapsed`), on every card: the mini card and the overview unfold into the full card.
const collapsedField = (tr) => ({
  name: "collapsed",
  selector: { select: { multiple: true, mode: "list", options: [["pilot_wire", "pilot_wire"], ["schedule", "schedule"]].map(([value, k]) => ({ value, label: tr(k) })) } },
});

class HeatingCardEditor extends HTMLElement {
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
    const d = { show_title: true, show_subtitle: true, show_controls: true, show_sensors: true, show_alerts: true, show_pilot_wire: true, show_schedule: true };
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
      collapsedField(tr),
      languageField(tr),
    ];
  }

  _data() {
    const data = { ...this._defaults(), ...this._config };
    if (data.collapsed === undefined) data.collapsed = DEFAULT_COLLAPSED;
    const zones = this._zoneList();
    for (const k of ZONE_KEYS) delete data[k];
    delete data.zones;
    [...zones, {}].forEach((z, i) => {
      data[`zone_${i}`] = { illustration: "auto", ...z };
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
    for (const k of Object.keys(value).filter((k) => /^zone_\d+$/.test(k)).sort((a, b) => a.slice(5) - b.slice(5))) {
      const z = Object.fromEntries(Object.entries(value[k] || {}).filter(([kk, v]) => v !== "" && v != null && !(Array.isArray(v) && !v.length) && !(kk === "illustration" && v === "auto")));
      delete value[k];
      if (z.entity || z.pilot_wire?.length || z.temperature) zones.push(z);
    }
    const out = { ...this._config };
    for (const k of [...ZONE_KEYS, "zones"]) delete out[k];
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

class HeatingMiniCardEditor extends HeatingCardEditor {
  static get mini() {
    return true;
  }
}

// The overview's editor: which zones (areas, floors, entities to add or leave out), how they are grouped and sorted,
// what a tap on a zone does, the parts shown and the quick actions offered.
class HeatingOverviewCardEditor extends HeatingCardEditor {
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
      { name: "actions", selector: { select: { multiple: true, mode: "list", options: OV_ORDERS.map((value) => ({ value, label: tr(`p_${value}`) })) } } },
      collapsedField(tr),
      languageField(tr),
    ];
  }

  _data() {
    return { ...this._defaults(), collapsed: DEFAULT_COLLAPSED, ...this._config };
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
    // An option the form no longer sends (a list emptied) is left out too.
    const names = this._schema().flatMap((s) => (s.schema ? s.schema : [s]).map((x) => x.name));
    for (const k of names) if (!(k in ev.detail.value)) delete out[k];
    for (const [k, v] of Object.entries(ev.detail.value)) {
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

// ── Registration ───────────────────────────────────────────────────────────────────────────────────────────────
const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("heating-card", HeatingCard);
define("heating-mini-card", HeatingMiniCard);
define("heating-card-editor", HeatingCardEditor);
define("heating-mini-card-editor", HeatingMiniCardEditor);
define("heating-overview-card", HeatingOverviewCard);
define("heating-overview-card-editor", HeatingOverviewCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "heating-card",
    name: "Heating Card",
    description: "Thermostats, pilot wire radiators and weekly schedules, zone by zone: target, presets, heating modes and animated radiators.",
  },
  { type: "heating-mini-card", name: "Heating Mini Card", description: "Overview of the heating zones, unfolding into the full Heating Card." },
  {
    type: "heating-overview-card",
    name: "Heating Overview Card",
    description: "The heating of the whole home: zones heating, temperatures, open windows, low batteries, pilot wire orders and quick actions, floor by floor.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: REPO });
}

console.info(`%c HEATING-CARD %c v${VERSION} `, "color: white; background: #ff8100; font-weight: 700;", "color: #ff8100; background: white; font-weight: 700;");
