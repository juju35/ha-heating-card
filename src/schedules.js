// ── Schedules ──────────────────────────────────────────────────────────────────────────────────────────────────
// The week of a `schedule` helper: schedule.get_schedule (Home Assistant 2025.1+, every schedule), else the
// schedule/list of the helpers created in the UI, matched by unique id or name. Kept per entity until its state
// object changes (it does at each start or end of a time slot, and when the schedule is edited).
export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export const SCHEDULES = new Map();
export const toMinutes = (s) => {
  const [h, m] = String(s || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
export const weekOf = (data) =>
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
export async function fetchWeek(hass, id) {
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
