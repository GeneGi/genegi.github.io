import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  sections,
  placement,
  finalQuiz,
} from "../../static/champions/curriculum.mjs";
import { metaSection } from "../../static/champions/meta.mjs";
const url = "/projects/pokemon-champions/";
const allSections = [...sections, metaSection];
const totalLessons = allSections.reduce((n, s) => n + s.lessons.length, 0);
const totalXp = totalLessons * 30 + allSections.length * 50 + 100;
const action = (page, id) => page.locator(`[data-action="${id}"]`).first();
async function answer(page, q) {
  for (const i of Array.isArray(q.answer) ? q.answer : [q.answer])
    await page.locator(`input[value="${i}"]`).check();
  await page.locator('[type="submit"]').click();
  await expect(page.locator(".feedback")).toBeVisible();
  if (q.scenario) {
    await expect(page.locator(".briefing")).toBeVisible();
    await expect(page.locator(".briefing dd")).toHaveCount(
      Object.keys(q.scenario).filter(
        (k) => q.scenario[k] !== null && q.scenario[k] !== undefined,
      ).length,
    );
  }
  await expect(page.locator(".answer-slot .reason")).toHaveCount(
    q.why ? q.options.length : 0,
  );
  await action(page, "next").click();
}
async function solve(page, questions) {
  for (const q of questions) await answer(page, q);
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
}
test("full curriculum, exact scoring, final challenge, reload and English copy", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url);
  await action(page, "language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await action(page, "level:beginner").click();
  for (const s of allSections) {
    await action(page, `section:${s.id}`).click();
    await expect(page.locator(".mastery-card p")).toContainText(
      `${s.mastery.length} independent questions`,
    );
    for (const l of s.lessons) {
      await action(page, `lesson:${l.id}`).click();
      await expect(page.locator("h1")).toHaveText(l.title.en);
      await expect(page.locator(".idea")).toHaveCount(l.cards.length);
      await action(page, `practice:${l.id}`).click();
      await solve(page, l.questions);
      await expect(page.locator(".score")).toContainText(
        `${l.questions.length}`,
      );
      await action(page, `section:${s.id}`).click();
    }
    await action(page, `mastery:${s.id}`).click();
    await solve(page, s.mastery);
    await action(page, "home").click();
  }
  await action(page, "final").click();
  await solve(page, finalQuiz);
  await expect(page.locator(".score")).toContainText(`${finalQuiz.length}`);
  await expect(page.locator(".review article")).toHaveCount(finalQuiz.length);
  await page.reload();
  await expect(page.locator(".xp")).toContainText(`${totalXp} XP`);
  await expect(page.locator(".stats")).toContainText(`${allSections.length}`);
  await expect(action(page, "final")).toBeEnabled();
  expect(errors).toEqual([]);
});
test("placement, mid-question language switch, failed quiz, repeat XP and reset isolation", async ({
  page,
}) => {
  await page.goto(url);
  await page.evaluate(() => localStorage.setItem("other-project", "keep"));
  await action(page, "placement").click();
  await page.locator('input[value="2"]').check();
  await action(page, "language").click();
  await expect(page.locator('input[value="2"]')).toBeChecked();
  await page.locator('[type="submit"]').click();
  await action(page, "next").click();
  await solve(page, placement.slice(1));
  await expect(page.locator(".result")).toContainText("Skipped 4");
  await expect(page.locator(".score")).toContainText(`${placement.length}`);
  await action(page, "home").click();
  await expect(action(page, "section:position")).toBeEnabled();
  await expect(action(page, "section:doubles")).toBeDisabled();
  await action(page, "section:types").click();
  await action(page, "lesson:type-basics").click();
  await action(page, "practice:type-basics").click();
  await page.locator('input[value="0"]').check();
  await page.locator('[type="submit"]').click();
  await expect(page.locator(".feedback.wrong")).toBeVisible();
  await action(page, "next").click();
  await answer(page, sections[0].lessons[0].questions[1]);
  await expect(page.locator(".result")).toContainText("One more practice");
  await expect(page.locator(".xp")).toContainText("0 XP");
  await action(page, "retry").click();
  await solve(page, sections[0].lessons[0].questions);
  await action(page, "retry").click();
  await solve(page, sections[0].lessons[0].questions);
  await expect(page.locator(".xp")).toContainText("30 XP");
  await action(page, "settings").click();
  await action(page, "reset").click();
  await action(page, "settings").click();
  await expect(page.locator(".xp")).toContainText("30 XP");
  await action(page, "reset").click();
  await action(page, "confirm-reset").click();
  await expect(action(page, "level:beginner")).toBeVisible();
  await expect(page.locator(".xp")).toContainText("0 XP");
  expect(await page.evaluate(() => localStorage.getItem("other-project"))).toBe(
    "keep",
  );
});
test("mobile and desktop accessibility, keyboard, project index and storage failures", async ({
  page,
}) => {
  await page.goto("/projects/");
  await page.getByRole("link", { name: /Doubles Academy/ }).click();
  await expect(page.locator(".brand")).toContainText("双打学堂");
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    const a11y = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11y.violations).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await action(page, "level:beginner").focus();
  await page.keyboard.press("Enter");
  await action(page, "section:types").click();
  await action(page, "lesson:type-basics").click();
  await action(page, "practice:type-basics").click();
  await page.locator('input[value="2"]').focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator(".feedback")).toBeVisible();
  await noOverflow(page);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await action(page, "meta").click();
  await noOverflow(page);
  await action(page, "language").click();
  await noOverflow(page);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("storage disabled");
    };
  });
  await page.reload();
  await action(page, "language").click();
  await expect(page.locator(".storage-warning")).toBeVisible();
});

test("applied battle brief keeps selections across languages and is accessible", async ({
  page,
}) => {
  await page.goto(url);
  await action(page, "level:competitive").click();
  await action(page, "section:speed").click();
  await action(page, "lesson:speed-sequencing").click();
  await action(page, "practice:speed-sequencing").click();
  const q = sections.find((s) => s.id === "speed").lessons[1].questions[0];
  await page.locator('input[value="1"]').check();
  await action(page, "language").click();
  await expect(page.locator('input[value="1"]')).toBeChecked();
  await expect(page.locator(".briefing")).toContainText(q.scenario.known.en);
  await page.locator('[type="submit"]').click();
  await expect(page.locator(".feedback.right")).toBeVisible();
  await expect(page.locator(".reason")).toHaveCount(4);
  await expect(page.locator(".reason").nth(1)).toContainText(q.why[1].en);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  await action(page, "language").click();
  await expect(page.locator(".reason").nth(1)).toContainText(q.why[1].zh);
});
