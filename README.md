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
