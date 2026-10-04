# Gene Gi's Blog

Source for [genegi.github.io](https://genegi.github.io). Hugo + [PaperMod](https://github.com/adityatelange/hugo-PaperMod).

## Setup (once, or on a new machine)

```bash
git clone --recurse-submodules https://github.com/GeneGi/genegi.github.io.git
cd genegi.github.io
```

Already cloned without submodules? `git submodule update --init --recursive`

Needs `hugo` (extended). `brew install hugo`

## Writing a post

Two ways in. Both land in `content/posts/`.

**Straight markdown:**

```bash
make new SLUG=my-post-title    # creates content/posts/my-post-title.md, draft = true
make serve                     # preview at localhost:1313, drafts included
# write, then set draft = false
make publish M="post: my post title"
```

**From org-mode (ox-hugo):** write in org as before, export with `C-c C-e H H`
(or `M-x org-hugo-export-wim-to-md`). It writes into `content/posts/`. Then:

```bash
make serve       # check it
make publish
```

That's the whole flow. `make publish` commits and pushes; GitHub Actions builds
and deploys. Nothing to build by hand, nothing to commit into `docs/`.

Run `make` with no arguments to list every command.

## Layout

```
content/
  posts/            blog posts        -> /posts/
  projects/         project pages     -> /projects/
  about-me.md       -> /about-me/
  search.md         PaperMod search page
  archives.md       year-grouped archive
layouts/_default/
  seattle-puzzles.html   standalone template for the puzzle game
static/lottery/     built output of spring-festival-lottery, served at /lottery/
spring-festival-lottery/   React app source
.github/workflows/deploy.yml   build + deploy on push to main
```

`params.mainSections = ["posts"]` in `hugo.toml` is what makes the homepage list
posts. Without it Hugo guesses the section with the most pages.

## The lottery app

```bash
make lottery       # builds and copies into static/lottery/
make publish
```

## Adding a project

Drop a markdown file in `content/projects/`. It shows up on `/projects/`
automatically — no config change needed.

## Doubles Academy / 宝可梦双打学堂

The bilingual Pokémon Champions course lives at `/projects/pokemon-champions/`.
It follows the existing standalone Hugo project-template pattern, with no runtime
framework, backend, remote fonts, analytics, or external asset dependencies.

- `content/projects/pokemon-champions.md`: automatic Projects listing.
- `layouts/_default/champions.html`: document shell; Hugo fingerprints the CSS.
- `assets/champions/academy.css`: responsive academy styling.
- `static/champions/curriculum.mjs`: stable section/lesson/question IDs and paired
  Chinese/English content. 15 sections including the meta lab, 25 short lessons,
  45 independent mastery questions and 8 final decision questions. Placement is
  declared as explicit stable question IDs (`PLACEMENT_QUESTION_IDS`) and the
  sections it covers (`PLACEMENT_SECTION_IDS`), not by positional indexing.
- `static/champions/advanced.mjs`: eight applied lessons, independent scenario
  checks, the final exam and meta applications. Supplied Speed/damage values
  are training assumptions; each option has a bilingual rationale. Foundational
  recall checks remain alongside the applied checks.
- `static/champions/meta.mjs`: dated M-6/M-C snapshot, ID-tagged sources, rules,
  ranked roster and three meta lessons. Core examples are pedagogical interpretations, not
  claims about measured core usage. The official news index was accessible but
  the official announcement body was not; third-party rules are labeled.
- `static/champions/progress.mjs`: versioned progress, grading, unlocks, XP and
  local-calendar streaks. `app.mjs` renders the views and handles interaction.

Chinese is the first-visit default; the language switch translates navigation,
lessons, questions, answers and feedback without losing the current answer.
Beginner starts at section 1; Some experience skips 2 foundations; Competitive
skips 4. Placement draws its section list from the placement question IDs and
skips only a contiguous fully correct prefix. Retakes replace skips but retain completed lessons, mastery
and earned XP. Skips are never shown as mastery. All skipped lessons are reviewable.

Lesson, mastery and final passing requires 80% (`PASS_RATIO` in `curriculum.mjs`,
`passMark` for the required count). First passes award 30/50/100 XP for lesson,
mastery and final. Repeats cannot farm XP. Completing an attempt records a learning day;
visiting the page does not. Completed attempts persist, not an unfinished quiz.
Storage failure shows an explicit temporary-session notice. Reset touches only
`doubles-academy:v1`, preserving language and other projects’ data.

### Update the meta

1. Verify the current in-game regulation, season dates, legality and doubles
   rankings; distinguish ranked usage from tournament usage and win rates.
2. Update `meta.mjs` (version, verified/review dates, sources, rules and roster).
   Review all three meta lessons and the final scenarios against the new rules.
   Meta questions cite the ranking source by its stable ID (`ranking-season-6`),
   so reordering `meta.sources` cannot silently repoint the attribution.
3. Keep stable IDs for unchanged concepts; use new IDs when replacing a lesson
   with materially different content, so old completions do not prove new mastery.
4. Update both language fields together and run the checks below. The guide
   automatically labels its snapshot historical after `reviewAfter`; it does not
   fetch live data or silently carry old rankings forward as current.

### Validate

```bash
node --test tests/champions/progress.test.mjs
hugo --minify
npm ci --prefix tests/champions
npx --prefix tests/champions playwright install chromium
npm test --prefix tests/champions
```

Browser checks cover the complete course/final, placement, wrong answers,
language changes mid-question, reload persistence, XP deduplication, reset
isolation, unavailable storage, keyboard use, 320–1280px layout and automated
WCAG accessibility scans. Applied and final questions render a bilingual battle
brief, a note when the figures are supplied training assumptions, and one reason
per option after submission. They start Hugo on port 4174. GitHub Actions runs these
checks on relevant PRs and main pushes; the existing deploy workflow publishes
Hugo on main. Existing PaperMod deprecation warnings are unrelated to the academy.
