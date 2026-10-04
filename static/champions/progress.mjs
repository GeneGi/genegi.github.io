export const STORAGE_KEY = "doubles-academy:v1";
export const fresh = () => ({
  version: 1,
  lang: "zh",
  level: null,
  completed: [],
  mastered: [],
  skipped: [],
  scores: {},
  xp: 0,
  days: [],
  placement: null,
});
export function sanitize(raw, validLessons, validSections) {
  const state = fresh();
  if (!raw || raw.version !== 1) return state;
  state.lang = raw.lang === "en" ? "en" : "zh";
  state.level = ["beginner", "some", "competitive"].includes(raw.level)
    ? raw.level
    : null;
  const pick = (values, allowed) =>
    Array.isArray(values)
      ? [...new Set(values.filter((v) => allowed.includes(v)))]
      : [];
  state.completed = pick(raw.completed, validLessons);
  state.mastered = pick(raw.mastered, [...validSections, "final"]);
  state.skipped = pick(raw.skipped, validSections.slice(0, 4));
  state.days = Array.isArray(raw.days)
    ? [
        ...new Set(
          raw.days.filter(
            (d) =>
              typeof d === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(d) &&
              !Number.isNaN(Date.parse(d)),
          ),
        ),
      ].sort()
    : [];
  state.xp = Number.isSafeInteger(raw.xp) && raw.xp >= 0 ? raw.xp : 0;
  state.scores = Object.fromEntries(
    Object.entries(raw.scores || {}).filter(
      ([k, v]) =>
        [
          ...validLessons,
          ...validSections.map((s) => `mastery:${s}`),
          "final",
        ].includes(k) &&
        Number.isFinite(v) &&
        v >= 0 &&
        v <= 100,
    ),
  );
  state.placement =
    raw.placement &&
    Number.isInteger(raw.placement.score) &&
    raw.placement.score >= 0 &&
    raw.placement.score <= 8
      ? { score: raw.placement.score }
      : null;
  return state;
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function streak(days, date = new Date()) {
  const cursor = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  const seen = new Set(days);
  if (!seen.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (seen.has(localDay(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
export function activeDays(state) {
  const day = localDay();
  if (!state.days.includes(day)) state.days.push(day);
}
export function applyLevel(state, level, sections) {
  state.level = level;
  const count = level === "competitive" ? 4 : level === "some" ? 2 : 0;
  state.skipped = sections.slice(0, count).map((s) => s.id);
}
export function applyPlacement(state, answers, sections) {
  // Two questions per foundation; only a contiguous fully-correct prefix is skipped.
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (answers[i * 2] && answers[i * 2 + 1]) count++;
    else break;
  }
  state.skipped = sections.slice(0, count).map((s) => s.id);
  state.placement = { score: answers.filter(Boolean).length };
}
export function unlocked(state, sections, index) {
  return (
    index === 0 ||
    sections
      .slice(0, index)
      .every(
        (s) => state.mastered.includes(s.id) || state.skipped.includes(s.id),
      )
  );
}
export function recordResult(state, key, score, kind) {
  state.scores[key] = Math.max(state.scores[key] || 0, score);
  activeDays(state);
  if (score < 80) return false;
  const list = kind === "lesson" ? state.completed : state.mastered;
  const id = key.replace(/^mastery:/, "");
  if (!list.includes(id)) {
    list.push(id);
    state.xp += kind === "lesson" ? 30 : kind === "final" ? 100 : 50;
  }
  return true;
}
export const correct = (question, selection) => {
  const expected = Array.isArray(question.answer)
    ? question.answer
    : [question.answer];
  return (
    selection.length === expected.length &&
    expected.every((i) => selection.includes(i))
  );
};
