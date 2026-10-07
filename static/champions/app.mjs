import {
  sections as foundations,
  placement,
  finalQuiz,
  answerIndexes,
  passMark,
  PASS_RATIO,
  b,
} from "./curriculum.mjs";
import { meta, metaSection } from "./meta.mjs";
import {
  STORAGE_KEY,
  fresh,
  sanitize,
  streak,
  applyLevel,
  applyPlacement,
  unlocked,
  recordResult,
  correct,
  activeDays,
  LEVEL_SKIPS,
  XP_REWARDS,
} from "./progress.mjs";
const sections = [...foundations, metaSection];
const lessons = sections.flatMap((s) => s.lessons);
let storageAvailable = true;
let state;
try {
  state = sanitize(
    JSON.parse(localStorage.getItem(STORAGE_KEY)),
    lessons.map((l) => l.id),
    sections.map((s) => s.id),
    placement,
  );
} catch {
  state = fresh();
  storageAvailable = false;
}
let view = "path",
  currentSection = null,
  currentLesson = null,
  run = null,
  result = null;
const app = document.querySelector("#app");
const tr = (value) => (typeof value === "string" ? value : value[state.lang]);
const T = (zh, en) => (state.lang === "zh" ? zh : en);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const txt = (value) => escape(tr(value));
const button = (action, label, cls = "", extra = "") =>
  `<button type="button" data-action="${action}" class="${cls}" ${extra}>${label}</button>`;
const icon =
  '<span class="brand-mark" aria-hidden="true"><i></i><i></i></span>';
const LEVEL_LABELS = {
  foundation: { zh: "机制题", en: "Mechanic" },
  applied: { zh: "应用题", en: "Applied" },
  battle: { zh: "实战题", en: "Battle" },
};
const skipCopy = (count) =>
  count
    ? T(`跳过前 ${count} 个基础章节`, `Skip the first ${count} foundations`)
    : T("从属性与免疫出发", "Start with types and immunities");
const lessonMinutes = (lesson) =>
  Math.max(4, Math.ceil(lesson.cards.length + lesson.questions.length * 0.5));
const levelChip = (level) => {
  const label = LEVEL_LABELS[level] ?? LEVEL_LABELS.foundation;
  return `<span class="chip chip-${escape(level)}">${T(label.zh, label.en)}</span>`;
};
const briefing = (question) => {
  if (!question.scenario) return "";
  const scene = question.scenario;
  const rows = [
    [T("我方", "Your side"), scene.side],
    [T("对手", "Opponents"), scene.foes],
    [T("场地", "Field"), scene.field],
    [T("已知信息", "Known"), scene.known],
    scene.goal ? [T("目标", "Goal"), scene.goal] : null,
  ].filter(Boolean);
  return `<section class="briefing"><h2>${T("对局简报", "Battle brief")}</h2><dl>${rows
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${txt(v)}</dd></div>`)
    .join(
      "",
    )}</dl>${question.note ? `<p class="briefing-note">${txt(question.note)}</p>` : ""}</section>`;
};
const optionReason = (question, index) => {
  const reason = question.why?.[index];
  return reason
    ? `<p class="reason"><strong>${T("为什么", "Why")}</strong> ${txt(reason)}</p>`
    : "";
};
const correctLabel = (question) =>
  answerIndexes(question)
    .map((i) => txt(question.options[i]))
    .join(" · ");
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}
function header() {
  return `<header class="header"><a class="brand" href="#" data-action="home">${icon}<span>${T("双打学堂", "Doubles Academy")}<small>POKÉMON CHAMPIONS</small></span></a><div class="header-actions"><span class="xp">✦ ${state.xp} XP</span><button type="button" class="language" data-action="language" aria-label="${T("Switch to English", "切换到中文")}">${T("EN", "中文")}</button>${button("settings", "⚙", "icon-button", `aria-label="${T("学习设置", "Learning settings")}"`)}</div></header>`;
}
function nav() {
  return `<nav class="tabs" aria-label="${T("主导航", "Main navigation")}">${button("home", `<span aria-hidden="true">⌘</span> ${T("学习路径", "Learning path")}`, view === "path" ? "selected" : "", view === "path" ? 'aria-current="page"' : "")}${button("meta", `<span aria-hidden="true">◉</span> ${T("环境手册", "Meta field guide")}`, view === "meta" ? "selected" : "", view === "meta" ? 'aria-current="page"' : "")}${button("sources", `<span aria-hidden="true">↗</span> ${T("课程来源", "Sources")}`, view === "sources" ? "selected" : "", view === "sources" ? 'aria-current="page"' : "")}</nav>`;
}
function stats() {
  const mastered = sections.filter((s) => state.mastered.includes(s.id)).length;
  return `<div class="stats"><div><strong>${mastered}<small> / ${sections.length}</small></strong><span>${T("章节掌握", "Sections mastered")}</span></div><div><strong>${streak(state.days)}<small> ${T("天", "days")}</small></strong><span>${T("连续学习", "Learning streak")}</span></div><div><strong>${state.completed.length}<small> / ${lessons.length}</small></strong><span>${T("短课完成", "Lessons completed")}</span></div></div>`;
}
function arena() {
  return `<div class="arena" aria-hidden="true"><div class="arena-orbit"></div><div class="arena-label">DOUBLES / 02 × 02</div><div class="piece p1"><span>✦</span><i></i></div><div class="piece p2"><span>❋</span><i></i></div><div class="piece p3"><span>↯</span><i></i></div><div class="piece p4"><span>◈</span><i></i></div><div class="arena-center">VS</div><div class="arena-note">YOUR NEXT MOVE MATTERS</div></div>`;
}
function onboarding() {
  const levels = [
    ["beginner", "刚刚开始", "Beginner", "01"],
    ["some", "玩过一些", "Some experience", "02"],
    ["competitive", "有竞技经验", "Competitive", "03"],
  ];
  return `<section class="onboarding card"><div><span class="eyebrow">${T("从适合你的起点开始", "FIND YOUR STARTING POINT")}</span><h2>${T("你对双打有多熟悉？", "How well do you know doubles?")}</h2><p>${T(
    `选择经验即可开始，也可以做 ${placement.length} 题定级。跳过的基础课随时能回来复习。`,
    `Choose your experience or take a ${placement.length}-question placement check. Skipped foundations remain available for review.`,
  )}</p></div><div class="level-grid">${levels
    .map(([id, zh, en, n], i) =>
      button(
        `level:${id}`,
        `<span class="level-number">${n}</span><strong>${T(zh, en)}</strong><small>${skipCopy(LEVEL_SKIPS[id])}</small> →`,
        "level-card",
      ),
    )
    .join(
      "",
    )}</div><div class="placement-cta">${button("placement", T(`不确定？用 ${placement.length} 题找到起点 →`, `Not sure? Find your level in ${placement.length} questions →`), "text-button")}<small>${T("约 3 分钟 · 没有倒计时", "About 3 minutes · No timer")}</small></div></section>`;
}
function path() {
  const next = sections.find(
    (s, i) =>
      unlocked(state, sections, i) &&
      !state.mastered.includes(s.id) &&
      !state.skipped.includes(s.id),
  );
  const all = sections.every(
    (s) => state.mastered.includes(s.id) || state.skipped.includes(s.id),
  );
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">${T("小步学习 · 每一步都为实战", "SMALL LESSONS. SMARTER BATTLES.")}</span><h1>${T("下一回合，<br>做出更好的决定。", "A better decision.<br>One turn at a time.")}</h1><p>${T("从看懂属性，到读懂整个战场。每天几分钟，把知识变成双打直觉。", "From reading a type matchup to reading the whole field. Turn a few minutes a day into doubles intuition.")}</p><div class="hero-tags"><span>${T("中英双语", "中文 / English")}</span><span>${lessons.length} ${T("节短课", "short lessons")}</span><span>${T("免费 · 无需账号", "Free · No account")}</span></div>${state.level && next ? button(`section:${next.id}`, `${T("继续学习", "Continue learning")} <span aria-hidden="true">↗</span>`, "primary") : ""}${state.level && all ? button("final", T("进入实战挑战 ↗", "Take the battle challenge ↗"), "primary") : ""}</div>${arena()}</section>${stats()}${!state.level ? onboarding() : ""}<div class="path-layout"><section aria-labelledby="path-title"><div class="section-heading"><div><span class="eyebrow">THE LEARNING PATH</span><h2 id="path-title">${T("你的训练路线", "Your training route")}</h2></div><span class="muted">${T("短课 → 练习 → 考核", "Learn → Practice → Master")}</span></div><ol class="path-list">${sections.map((s, i) => node(s, i)).join("")}</ol><div class="final-card"><span class="medal" aria-hidden="true">✧</span><div><span class="eyebrow">FINAL CHALLENGE</span><h3>${T("把知识带上战场", "Bring it to the battlefield")}</h3><p>${T(
    `${finalQuiz.length} 个决策场景。读局面、选路线、解释原因。`,
    `${finalQuiz.length} decision scenarios. Read the board, choose a line, understand why.`,
  )}</p>${button("final", state.mastered.includes("final") ? T("✓ 再战一次", "✓ Battle again") : all ? T("开始实战挑战 →", "Start battle challenge →") : T("完成路径后解锁", "Unlock by finishing the path"), "primary", all ? "" : "disabled")}</div></div></section><aside class="sidebar"><div class="card coach"><span class="eyebrow">COACH’S NOTE</span><h3>${T("你不是在背图鉴。", "You’re learning decisions.")}</h3><p>${T("每回合先问：谁必须活下来？对方最危险的行动是什么？我的两只如何配合？", "Each turn, ask: who must survive? What is their most dangerous play? How do my two Pokémon work together?")}</p><div class="coach-line"></div><small>${T("答错不扣生命。读懂解析，再来一次。", "No hearts lost. Read the explanation and try again.")}</small></div><div class="card season-card"><span class="live-dot"></span><span class="eyebrow">${meta.current.season} · ${meta.regulation}</span><h3>${T("赛季环境实战室", "Season meta lab")}</h3><p>${T("场地争夺、威吓轮转与雨天残局。结合 M-7 规则与 M-6 常见成员备战。", "Terrain wars, Intimidate pivots and rain endgames. Prepare with M-7 rules and common M-6 members.")}</p><small>${T("核实于", "Checked")} ${meta.verified}</small>${button("meta", T("打开环境手册 ↗", "Open field guide ↗"), "text-button")}</div>${state.level ? `<div class="card"><h3>${T("起点可以调整", "Change your starting point")}</h3><p>${T("重新定级仅调整基础跳过状态，保留已完成课程和 XP。", "Placement changes foundation skips while preserving earned progress and XP.")}</p>${button("placement", T("重新定级", "Retake placement"), "secondary")}</div>` : ""}</aside></div>`;
}
function node(s, i) {
  const open = !!state.level && unlocked(state, sections, i),
    done = state.mastered.includes(s.id),
    skip = state.skipped.includes(s.id),
    count = s.lessons.filter((l) => state.completed.includes(l.id)).length;
  const status = done
    ? T("已掌握", "Mastered")
    : skip
      ? T("已跳过 · 可复习", "Skipped · Review")
      : !open
        ? T("待解锁", "Locked")
        : count
          ? T("进行中", "In progress")
          : T("可开始", "Ready");
  return `<li class="path-node ${done ? "done" : skip ? "skipped" : open ? "available" : "locked"}"><span class="node-track" aria-hidden="true"><span>${done ? "✓" : s.icon}</span></span><button type="button" class="node-card" data-action="section:${s.id}" ${open ? "" : "disabled"}><div class="node-top"><span class="eyebrow">${String(i + 1).padStart(2, "0")}</span><span class="status">${status}</span></div><h3>${txt(s.title)}</h3><p>${txt(s.summary)}</p><div class="node-bottom"><span>${s.lessons.length} ${T("节短课", "lesson" + (s.lessons.length > 1 ? "s" : ""))} · ${T("章节考核", "Mastery check")}</span><span aria-hidden="true">${open ? "↗" : "○"}</span></div></button></li>`;
}
function back() {
  return button(
    "home",
    `← ${T("学习路径", "Learning path")}`,
    "text-button back",
  );
}
function sectionPage() {
  const s = currentSection;
  const ready =
    s.lessons.every((l) => state.completed.includes(l.id)) ||
    state.skipped.includes(s.id) ||
    state.mastered.includes(s.id);
  return `${back()}<section class="page-heading"><span class="eyebrow">SECTION ${String(sections.indexOf(s) + 1).padStart(2, "0")}</span><h1>${txt(s.title)}</h1><p>${txt(s.summary)}</p></section>${s.id === "meta" ? metaNotice() : ""}<div class="lesson-grid">${s.lessons
    .map(
      (l, i) =>
        `<article class="card lesson-card"><span class="lesson-index">${String(i + 1).padStart(2, "0")}</span><h2>${txt(l.title)}</h2><p>${T(
          `${l.cards.length} 个要点 · ${l.questions.length} 道练习 · 约 ${lessonMinutes(l)} 分钟`,
          `${l.cards.length} key ideas · ${l.questions.length} practice questions · About ${lessonMinutes(l)} min`,
        )}</p>${button(`lesson:${l.id}`, state.completed.includes(l.id) ? T("✓ 复习短课", "✓ Review lesson") : T("开始短课 →", "Start lesson →"), "primary")}</article>`,
    )
    .join(
      "",
    )}<article class="card mastery-card"><span class="eyebrow">MASTERY CHECK</span><h2>${T("用自己的判断过关", "Make the call yourself")}</h2><p>${T(
    `${s.mastery.length} 道独立题目，答对 ${passMark(s.mastery.length)} 道即可掌握本章，解锁下一章。可以无限重试。`,
    `Answer ${passMark(s.mastery.length)} of ${s.mastery.length} independent questions correctly to master this section and unlock the next. Unlimited retries.`,
  )}</p>${button(`mastery:${s.id}`, state.mastered.includes(s.id) ? T("✓ 再次考核", "✓ Retake check") : T("开始章节考核", "Start mastery check"), "secondary", ready ? "" : "disabled")}${!ready ? `<small>${T("先完成本章短课。", "Complete this section’s lessons first.")}</small>` : ""}</article></div>`;
}
function lessonPage() {
  return `<div class="reading">${button(`section:${currentSection.id}`, `← ${txt(currentSection.title)}`, "text-button back")}<span class="eyebrow">${T(`MICRO LESSON · 约 ${lessonMinutes(currentLesson)} 分钟`, `MICRO LESSON · About ${lessonMinutes(currentLesson)} min`)}</span><h1>${txt(currentLesson.title)}</h1><p class="muted">${T(
    `点开每个要点，读完就用 ${currentLesson.questions.length} 道题练一练。`,
    `Open each idea, then put it into practice with ${currentLesson.questions.length} questions.`,
  )}</p><div class="idea-list">${currentLesson.cards.map((c, i) => `<details class="idea" ${i === 0 ? "open" : ""}><summary><span class="idea-number">0${i + 1}</span>${txt(currentLesson.labels[i] ?? currentLesson.labels[currentLesson.labels.length - 1])}<span class="plus" aria-hidden="true">+</span></summary><p>${txt(c)}</p></details>`).join("")}</div><div class="tip">${T("准备好了吗？题目会立即解释每个答案。课程完成时保存进度。", "Ready? Every answer gets an immediate explanation. Progress saves on lesson completion.")}</div>${button(`practice:${currentLesson.id}`, T("开始练习 →", "Practice now →"), "primary wide")}</div>`;
}
function begin(kind, key, questions) {
  run = {
    kind,
    key,
    questions,
    index: 0,
    selected: [],
    answers: [],
    submitted: false,
  };
  view = "quiz";
  render();
}
function quiz() {
  const question = run.questions[run.index];
  const isCorrect = run.submitted && run.answers[run.index];
  const title =
    run.kind === "placement"
      ? T("起点检查", "Placement check")
      : run.kind === "final"
        ? T("实战决策挑战", "Battle decision challenge")
        : run.kind === "mastery"
          ? T("章节掌握考核", "Section mastery check")
          : txt(currentLesson.title);
  return `<div class="quiz-shell"><div class="quiz-top">${button("exit", `✕ <span>${T("退出", "Exit")}</span>`, "text-button")}<span>${run.index + 1} / ${run.questions.length}</span></div><progress value="${run.index}" max="${run.questions.length}" aria-label="${T("答题进度", "Quiz progress")}"></progress><span class="eyebrow">${title}</span>${levelChip(question.level)}${briefing(question)}<h1>${txt(question.prompt)}</h1><p class="muted">${question.type === "multi" ? T("多选：选出所有正确答案", "Select all correct answers") : T("单选：选择一个答案", "Choose one answer")}</p><form id="answer-form"><fieldset ${run.submitted ? "disabled" : ""}><legend class="sr-only">${txt(question.prompt)}</legend><div class="answers">${question.options.map((o, i) => `<div class="answer-slot"><label class="answer ${run.selected.includes(i) ? "chosen" : ""} ${run.submitted && answerIndexes(question).includes(i) ? "answer-right" : ""}"><input type="${question.type === "multi" ? "checkbox" : "radio"}" name="answer" value="${i}" ${run.selected.includes(i) ? "checked" : ""}><span class="answer-letter">${String.fromCharCode(65 + i)}</span><span>${txt(o)}</span></label>${run.submitted ? optionReason(question, i) : ""}</div>`).join("")}</div></fieldset>${!run.submitted ? `<button type="submit" class="primary wide" ${run.selected.length ? "" : "disabled"}>${T("检查答案", "Check answer")}</button>` : ""}</form>${run.submitted ? `<section class="feedback ${isCorrect ? "right" : "wrong"}" role="status"><h2>${isCorrect ? T("✓ 判断正确", "✓ Good call") : T("再看一下这一步", "Let’s unpack this one")}</h2>${!isCorrect ? `<p><strong>${T("正确答案：", "Correct answer: ")}${correctLabel(question)}</strong></p>` : ""}<p>${txt(question.explanation)}</p></section>${button("next", run.index === run.questions.length - 1 ? T("查看结果 →", "See results →") : T("下一题 →", "Next question →"), "primary wide")}` : ""}<p class="quiz-foot">${run.kind === "placement" ? T(`仅连续通过的基础章节会被跳过（每章 ${placement.length / Math.max(1, new Set(placement.map((q) => q.sectionId)).size)} 题）。已获得的进度不受影响。`, `Only consecutive fully passed foundations are skipped (${placement.length / Math.max(1, new Set(placement.map((q) => q.sectionId)).size)} questions each). Earned progress stays intact.`) : T("没有计时压力，理解比速度更重要。", "No timer. Understanding matters more than speed.")}</p></div>`;
}
function finish() {
  const score = Math.round(
    (run.answers.filter(Boolean).length / run.questions.length) * 100,
  );
  if (run.kind === "placement") {
    applyPlacement(state, run.answers, placement);
    if (!state.level) state.level = "beginner";
    activeDays(state);
  } else {
    recordResult(state, run.key, score, run.kind);
  }
  result = { ...run, score };
  save();
  view = "result";
  render();
}
function resultPage() {
  const placementRun = result.kind === "placement",
    pass = result.score >= PASS_RATIO * 100;
  return `<section class="result card"><div class="result-symbol" aria-hidden="true">${placementRun ? "⌘" : pass ? "✦" : "↻"}</div><span class="eyebrow">${placementRun ? "YOUR STARTING POINT" : pass ? "WELL PLAYED" : "KEEP PRACTICING"}</span><h1>${placementRun ? T("找到你的下一步", "Your next step is ready") : pass ? T("这一步，拿下了。", "Another step forward.") : T("再练一次，会更清楚。", "One more practice makes it clearer.")}</h1><div class="score">${result.answers.filter(Boolean).length}<span> / ${result.questions.length}</span></div><p>${
    placementRun
      ? T(
          `已跳过 ${state.skipped.length} 个连续通过的基础章节。其余从路径继续学习。`,
          `Skipped ${state.skipped.length} consecutive fully passed foundations. Continue with the rest on your path.`,
        )
      : pass
        ? T(
            `进度已记录。首次通过短课 +${XP_REWARDS.lesson} XP，章节考核 +${XP_REWARDS.mastery} XP，最终挑战 +${XP_REWARDS.final} XP。重复练习不重复刷分。`,
            `Progress recorded. First passes earn ${XP_REWARDS.lesson} XP per lesson, ${XP_REWARDS.mastery} per mastery check and ${XP_REWARDS.final} for the final. Reviews do not farm extra XP.`,
          )
        : T(
            `达到 ${Math.round(PASS_RATIO * 100)}% 才记录通过。可以查看下方每题解析并重试。`,
            `Passing requires ${Math.round(PASS_RATIO * 100)}%. Review the per-answer explanations below and retry.`,
          )
  }</p><div class="result-actions">${button("home", T("回到学习路径", "Back to learning path"), "primary")}${!placementRun ? button("retry", T("再练一次", "Try again"), "secondary") : ""}${!placementRun && result.kind === "lesson" ? button(`section:${currentSection.id}`, T("进入章节考核", "Go to mastery check"), "secondary") : ""}</div><details class="review"><summary>${T("回顾全部答案", "Review all answers")}</summary>${result.questions
    .map(
      (q, i) =>
        `<article><h3>${result.answers[i] ? "✓" : "↻"} ${txt(q.prompt)}</h3><p>${txt(q.explanation)}</p>${
          q.why
            ? `<ol class="review-why">${q.why.map((reason, index) => `<li>${txt(reason)}</li>`).join("")}</ol>`
            : ""
        }</article>`,
    )
    .join("")}</details></section>`;
}
function rankingSource() {
  const found = meta.sources.find((source) => source.id === "ranking-season-6");
  if (!found) throw new Error("Missing ranking-season-6 source");
  return found;
}
function metaNotice() {
  const stale = new Date() >= new Date(`${meta.reviewAfter}T00:00:00Z`);
  return `<div class="notice"><strong>${T("赛季更新", "Season update")} · ${meta.current.verified}</strong><p>${txt(meta.current.note)}</p></div><div class="notice ${stale ? "stale" : ""}"><strong>${stale ? T("使用榜为历史快照：M-7 排名待核实", "Historical usage snapshot: M-7 ranks not yet verified") : T("有日期的环境快照", "A dated meta snapshot")} · ${meta.verified}</strong><p>${txt(meta.scope)}</p></div>`;
}
function metaPage() {
  const ranking = rankingSource();
  return `${back()}<section class="page-heading"><span class="eyebrow">THE META FIELD GUIDE</span><h1>${T("认识你会遇到的对手。", "Know who you’re up against.")}</h1><p>Season ${meta.current.season} · Regulation ${meta.regulation}</p></section>${metaNotice()}<div class="card rules"><h2>${T("M-C 规则", "M-C rules")}</h2><p>${txt(meta.rules)}</p><div class="date-row"><span>${T("赛季", "Season")}: ${meta.current.start} → ${meta.current.end.replace("T", " ").replace(":00Z", " UTC")}</span><span>${T("规则结束", "Regulation ends")}: ${meta.regulationEnd}</span></div></div><h2>${T("M-6 双打快照：使用排名前 12", "M-6 doubles snapshot: top 12 in usage")}</h2><p class="muted">${T("角色标签是学习提示。没有列出使用率百分比，也不保证对方采用某个配置。", "Role labels are learning prompts. No usage percentages are implied, and sets are never guaranteed.")}</p><div class="roster">${meta.roster.map((p) => `<article class="roster-card"><span class="rank">${String(p.rank).padStart(2, "0")}</span><div><h3>${txt(p.name)}</h3><p>${txt(p.role)}</p></div></article>`).join("")}</div><div class="card"><h2>${T("从名单到决策", "Turn the roster into decisions")}</h2><p>${T("环境课程分为场地核心、轮转反威吓、雨天与残局三个短课。完成前面的训练路径后解锁。", "The meta section has three lessons: terrain cores, pivots and anti-Intimidate, and rain endgames. Unlock it through the learning path.")}</p>${button("home", T("查看训练路线 →", "View learning path →"), "primary")}</div><p class="muted">${T("排名来源：", "Ranking source: ")}<a href="${ranking.url}" target="_blank" rel="noopener">${txt(ranking.label)} ↗</a></p>`;
}
function sourcesPage() {
  return `${back()}<section class="page-heading"><span class="eyebrow">SOURCES & CONTENT NOTES</span><h1>${T("知道依据，也知道边界。", "Know the evidence and its limits.")}</h1><p>${T("基础内容与使用榜核实于 2026-10-03；M-7 官方赛季信息核实于 2026-10-07。机制、规则和使用榜分别维护。", "Core content and usage checked 2026-10-03; official M-7 season information checked 2026-10-07. Mechanics, rules and usage are maintained separately.")}</p></section><div class="card"><h2>${T("来源与更新", "Sources and updates")}</h2><ul class="sources">${meta.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${txt(s.label)} ↗</a>${s.note ? `<p>${txt(s.note)}</p>` : ""}</li>`).join("")}</ul><p>${T("第三方资料与社区模拟器用作交叉核实，不能替代游戏内规则。环境页显示核实日期，赛季结束后自动标为待更新。题目中未说明的特殊特性、道具和穿透效果不假定存在。", "Third-party references and a community simulator provide cross-checks, not a replacement for in-game rules. The meta guide shows its verification date and marks itself due for review after the season ends. Unstated exceptional abilities, items and bypass effects are not assumed in quiz scenarios.")}</p><p>${T("本项目为非官方学习工具，与 Pokémon、Nintendo、Creatures、GAME FREAK 无关联。名称归其权利人所有。", "An unofficial learning project, not affiliated with Pokémon, Nintendo, Creatures or GAME FREAK. Names belong to their respective owners.")}</p></div>`;
}
function settings() {
  return `${back()}<section class="page-heading"><h1>${T("你的学习设置", "Your learning settings")}</h1><p>${T("无需账号，进度只保存在当前浏览器。清除浏览器数据会删除进度。", "No account. Progress lives only in this browser; clearing browser data deletes it.")}</p></section><div class="settings-grid"><section class="card"><h2>${T("调整起点", "Change starting point")}</h2><p>${T("重新定级可增加或减少基础跳过章节，不会删除已掌握内容。", "Placement can increase or reduce foundation skips without deleting earned mastery.")}</p>${button("placement", T(`重新做 ${placement.length} 题定级`, `Retake the ${placement.length}-question placement`), "primary")}</section><section class="card"><h2>${T("语言", "Language")}</h2><p>${T("切换后会保留当前答题位置与进度。", "Switching keeps your current quiz position and progress.")}</p>${button("language", T("Switch to English", "切换到中文"), "secondary")}</section><section class="card danger-zone"><h2>${T("重置学习进度", "Reset learning progress")}</h2><p>${T("清除本学堂的 XP、连续天数、成绩和解锁记录。不会清除站点其他项目的数据。", "Clear this academy’s XP, streak, scores and unlocks. Other projects’ data is unaffected.")}</p>${button("reset", T("重置进度…", "Reset progress…"), "danger")}</section></div>`;
}
function resetPage() {
  return `<section class="card result"><h1>${T("确定重新开始？", "Start over?")}</h1><p>${T("此操作会删除当前浏览器的学堂进度，无法撤销。", "This deletes this browser’s academy progress and cannot be undone.")}</p><div class="result-actions">${button("settings", T("取消，保留进度", "Cancel, keep progress"), "primary")}${button("confirm-reset", T("删除进度并重新开始", "Delete progress and restart"), "danger")}</div></section>`;
}
function render(focus = true) {
  document.documentElement.lang = state.lang === "zh" ? "zh-Hans" : "en";
  document.title = T(
    "双打学堂 · Pokémon Champions",
    "Doubles Academy · Pokémon Champions",
  );
  const pages = {
    path,
    section: sectionPage,
    lesson: lessonPage,
    quiz,
    result: resultPage,
    meta: metaPage,
    sources: sourcesPage,
    settings,
    reset: resetPage,
  };
  app.innerHTML = `<div class="shell">${header()}${nav()}${!storageAvailable ? `<p class="storage-warning" role="status">${T("浏览器存储不可用，本次进度仅暂存在页面中。", "Browser storage is unavailable; progress is kept in this page only.")}</p>` : ""}<main id="main" tabindex="-1">${pages[view]()}</main><footer><a href="/projects/">← ${T("Gene 的项目", "Gene’s projects")}</a><span>${T("每天一点，下一回合见。", "A little every day. See you next turn.")} · ${T("非官方学习项目", "Unofficial learning project")}</span></footer></div>`;
  if (focus) {
    document.querySelector("#main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
app.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;
  event.preventDefault();
  const [action, id] = el.dataset.action.split(":");
  if (action === "language") {
    state.lang = state.lang === "zh" ? "en" : "zh";
    save();
    const y = window.scrollY;
    render(false);
    window.scrollTo(0, y);
    document
      .querySelector('[data-action="language"]')
      .focus({ preventScroll: true });
    return;
  }
  if (action === "home") {
    view = "path";
  } else if (["meta", "sources", "settings", "reset"].includes(action)) {
    view = action;
  } else if (action === "level") {
    applyLevel(state, id, placement);
    save();
    view = "path";
  } else if (action === "placement") {
    begin("placement", "placement", placement);
    return;
  } else if (action === "section") {
    const i = sections.findIndex((s) => s.id === id);
    if (i < 0 || !state.level || !unlocked(state, sections, i)) return;
    currentSection = sections[i];
    view = "section";
  } else if (action === "lesson" || action === "practice") {
    currentLesson = lessons.find((l) => l.id === id);
    currentSection = sections.find((s) => s.lessons.includes(currentLesson));
    if (
      !currentLesson ||
      !unlocked(state, sections, sections.indexOf(currentSection))
    )
      return;
    if (action === "practice") {
      begin("lesson", id, currentLesson.questions);
      return;
    }
    view = "lesson";
  } else if (action === "mastery") {
    currentSection = sections.find((s) => s.id === id);
    if (
      !currentSection ||
      !unlocked(state, sections, sections.indexOf(currentSection)) ||
      !(
        currentSection.lessons.every((l) => state.completed.includes(l.id)) ||
        state.skipped.includes(id) ||
        state.mastered.includes(id)
      )
    )
      return;
    begin("mastery", `mastery:${id}`, currentSection.mastery);
    return;
  } else if (action === "final") {
    if (
      !sections.every(
        (s) => state.mastered.includes(s.id) || state.skipped.includes(s.id),
      )
    )
      return;
    begin("final", "final", finalQuiz);
    return;
  } else if (action === "next") {
    if (!run.submitted) return;
    if (run.index === run.questions.length - 1) {
      finish();
      return;
    }
    run.index++;
    run.selected = [];
    run.submitted = false;
  } else if (action === "exit") {
    view = "path";
    run = null;
  } else if (action === "retry") {
    begin(result.kind, result.key, result.questions);
    return;
  } else if (action === "confirm-reset") {
    const lang = state.lang;
    state = fresh();
    state.lang = lang;
    run = null;
    result = null;
    save();
    view = "path";
  }
  render();
});
app.addEventListener("change", (event) => {
  if (event.target.name !== "answer" || !run || run.submitted) return;
  run.selected = [...app.querySelectorAll('input[name="answer"]:checked')].map(
    (x) => Number(x.value),
  );
  app
    .querySelectorAll(".answer")
    .forEach((label) =>
      label.classList.toggle("chosen", label.querySelector("input").checked),
    );
  app.querySelector('[type="submit"]').disabled = !run.selected.length;
});
app.addEventListener("submit", (event) => {
  if (event.target.id !== "answer-form") return;
  event.preventDefault();
  if (!run || run.submitted || !run.selected.length) return;
  run.answers[run.index] = correct(run.questions[run.index], run.selected);
  run.submitted = true;
  render(false);
  const feedback = app.querySelector(".feedback");
  feedback.setAttribute("tabindex", "-1");
  feedback.focus({ preventScroll: true });
  feedback.scrollIntoView({ block: "nearest", behavior: "instant" });
});
render(false);
