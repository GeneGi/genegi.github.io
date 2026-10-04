import test from "node:test";
import assert from "node:assert/strict";
import {
  sections,
  placement,
  placementFoundations,
  finalQuiz,
  answerIndexes,
  passMark,
  PASS_RATIO,
  PLACEMENT_QUESTION_IDS,
  PLACEMENT_SECTION_IDS,
} from "../../static/champions/curriculum.mjs";
import { meta, metaSection } from "../../static/champions/meta.mjs";
import {
  fresh,
  sanitize,
  streak,
  applyLevel,
  applyPlacement,
  unlocked,
  recordResult,
  correct,
} from "../../static/champions/progress.mjs";
const all = [...sections, metaSection];
const lessonIds = all.flatMap((s) => s.lessons.map((l) => l.id));
const sectionIds = all.map((s) => s.id);
test("beginner, experienced, and competitive routes preserve earned progress", () => {
  const s = fresh();
  s.completed = ["type-basics"];
  s.xp = 30;
  applyLevel(s, "competitive", placement);
  assert.equal(s.skipped.length, 4);
  assert.ok(unlocked(s, all, 4));
  assert.ok(!unlocked(s, all, 5));
  applyLevel(s, "some", placement);
  assert.equal(s.skipped.length, 2);
  applyLevel(s, "beginner", placement);
  assert.equal(s.skipped.length, 0);
  assert.equal(s.xp, 30);
  assert.deepEqual(s.completed, ["type-basics"]);
});
test("placement only skips a contiguous proven foundation prefix; retake can reduce skips", () => {
  const s = fresh();
  applyPlacement(
    s,
    [true, true, true, true, false, true, true, true],
    placement,
  );
  assert.equal(s.placement.score, 7);
  assert.deepEqual(s.skipped, ["types", "damage"]);
  applyPlacement(
    s,
    [false, true, true, true, true, true, true, true],
    placement,
  );
  assert.equal(s.skipped.length, 0);
  applyPlacement(s, Array(8).fill(true), placement);
  assert.deepEqual(s.skipped, PLACEMENT_SECTION_IDS);
});
test("placement questions resolve by stable ID and stay inside the placement sections", () => {
  assert.deepEqual(
    placement.map((q) => q.id),
    PLACEMENT_QUESTION_IDS,
  );
  assert.deepEqual(
    placementFoundations.map((s) => s.id),
    PLACEMENT_SECTION_IDS,
  );
  const foundationIds = PLACEMENT_SECTION_IDS.map(
    (id) => all.find((s) => s.id === id).mastery.length,
  );
  assert.ok(
    foundationIds.every((count) => count >= 2),
    foundationIds.join(","),
  );
  for (const question of placement) {
    assert.ok(PLACEMENT_SECTION_IDS.includes(question.sectionId));
    const owner = all.find((s) => s.id === question.sectionId);
    const source = [
      ...owner.lessons.flatMap((l) => l.questions),
      ...owner.mastery,
    ].find((q) => q.id === question.id);
    assert.ok(source, question.id);
    assert.deepEqual({ ...source, sectionId: question.sectionId }, question);
  }
  const storage = fresh();
  applyPlacement(
    storage,
    [true, true, false, true, true, true, true, true],
    placement,
  );
  assert.deepEqual(storage.skipped, ["types"]);
});
test("failed lesson does not unlock mastery; first pass earns XP once", () => {
  const s = fresh();
  assert.equal(recordResult(s, "type-basics", 50, "lesson"), false);
  assert.equal(s.completed.length, 0);
  assert.equal(s.xp, 0);
  assert.equal(recordResult(s, "type-basics", 100, "lesson"), true);
  recordResult(s, "type-basics", 100, "lesson");
  assert.equal(s.xp, 30);
  recordResult(s, "mastery:types", 100, "mastery");
  assert.ok(unlocked(s, all, 1));
  assert.equal(s.xp, 80);
  recordResult(s, "final", 88, "final");
  recordResult(s, "final", 100, "final");
  assert.equal(s.xp, 180);
  assert.equal(s.scores.final, 100);
});
test("multi-answer grading requires exact selections regardless of order", () => {
  const q = { answer: [0, 2] };
  assert.ok(correct(q, [2, 0]));
  assert.ok(!correct(q, [0]));
  assert.ok(!correct(q, [0, 1, 2]));
  assert.ok(correct({ answer: 1 }, [1]));
  assert.deepEqual(answerIndexes(q), [0, 2]);
  assert.deepEqual(answerIndexes({ answer: 3 }), [3]);
});
test("passing thresholds derive from the shared ratio", () => {
  assert.equal(PASS_RATIO, 0.8);
  assert.equal(passMark(3), 3);
  assert.equal(passMark(4), 4);
  assert.equal(passMark(8), 7);
  const s = fresh();
  assert.equal(recordResult(s, "type-basics", 79, "lesson"), false);
  assert.equal(recordResult(s, "type-basics", 80, "lesson"), true);
  assert.equal(s.xp, 30);
  assert.equal(recordResult(s, "mastery:types", 67, "mastery"), false);
  assert.equal(s.xp, 30);
  assert.equal(recordResult(s, "mastery:types", 80, "mastery"), true);
  assert.equal(s.xp, 80);
  assert.equal(recordResult(s, "final", 79, "final"), false);
  assert.equal(recordResult(s, "final", 86, "final"), true);
  assert.equal(s.xp, 180);
});
test("storage normalization recovers malformed fields and unknown schema", () => {
  const raw = {
    ...fresh(),
    lang: "xx",
    level: "impossible",
    completed: ["type-basics", "type-basics", "bad"],
    mastered: ["types", "bad"],
    skipped: ["meta", "types"],
    xp: -1,
    days: ["invalid", "2026-10-01", "2026-10-01"],
    scores: { bad: 100, "type-basics": 100, final: NaN },
  };
  const s = sanitize(raw, lessonIds, sectionIds, placement);
  assert.equal(s.lang, "zh");
  assert.equal(s.level, null);
  assert.equal(s.xp, 0);
  assert.deepEqual(s.completed, ["type-basics"]);
  assert.deepEqual(s.skipped, ["types"]);
  assert.deepEqual(s.days, ["2026-10-01"]);
  assert.deepEqual(s.scores, { "type-basics": 100 });
  assert.deepEqual(
    sanitize({ version: 999 }, lessonIds, sectionIds, placement),
    fresh(),
  );
  assert.deepEqual(
    sanitize(JSON.parse(JSON.stringify(s)), lessonIds, sectionIds, placement),
    s,
  );
});
test("streak allows today or yesterday, expires after a missed day and handles month boundaries", () => {
  assert.equal(
    streak(["2026-09-29", "2026-09-30"], new Date(2026, 9, 1, 12)),
    2,
  );
  assert.equal(
    streak(["2026-09-29", "2026-09-30"], new Date(2026, 9, 2, 12)),
    0,
  );
  assert.equal(
    streak(["2026-09-30", "2026-10-01"], new Date(2026, 9, 1, 12)),
    2,
  );
});
test("published curriculum has complete bilingual data and executable question contracts", () => {
  const ids = new Set();
  const bilingual = (o) => {
    assert.equal(typeof o.zh, "string");
    assert.ok(o.zh.length);
    assert.equal(typeof o.en, "string");
    assert.ok(o.en.length);
    assert.ok(!/\p{Script=Han}/u.test(o.en), `Untranslated English: ${o.en}`);
  };
  for (const s of all) {
    bilingual(s.title);
    bilingual(s.summary);
    assert.ok(s.mastery.length >= 3);
    for (const l of s.lessons) {
      bilingual(l.title);
      l.cards.forEach(bilingual);
      assert.ok(l.questions.length >= 2 && l.questions.length <= 5);
      assert.equal(l.labels.length, l.cards.length);
      l.labels.forEach(bilingual);
    }
  }
  for (const q of [
    ...all.flatMap((s) => [
      ...s.lessons.flatMap((l) => l.questions),
      ...s.mastery,
    ]),
    ...finalQuiz,
  ]) {
    assert.ok(!ids.has(q.id), q.id);
    ids.add(q.id);
    bilingual(q.prompt);
    bilingual(q.explanation);
    q.options.forEach(bilingual);
    const expected = answerIndexes(q);
    assert.ok(expected.every((i) => i >= 0 && i < q.options.length));
    assert.ok(correct(q, expected));
    assert.ok(!correct(q, []));
    if (q.level !== "foundation") {
      assert.ok(q.scenario, q.id);
      bilingual(q.scenario.side);
      bilingual(q.scenario.foes);
      bilingual(q.scenario.field);
      bilingual(q.scenario.known);
      assert.equal(q.why.length, q.options.length);
      q.why.forEach(bilingual);
      if (q.scenario.goal) bilingual(q.scenario.goal);
      if (q.note) bilingual(q.note);
    }
  }
  for (const s of all) {
    assert.ok(
      s.mastery.some((q) => q.level !== "foundation"),
      s.id,
    );
  }
  assert.equal(placement.length, 8);
  assert.equal(finalQuiz.length, 8);
  assert.equal(meta.roster.length, 12);
});
