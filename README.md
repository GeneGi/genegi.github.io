# Gene Gi's Blog

This is the source code for my personal blog, hosted at [genegi.github.io](https://genegi.github.io).

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/GeneGi/genegi.github.io.git
   cd genegi.github.io
   ```

2. Build the site:
   ```
   hugo
   ```

3. Run locally:
   ```
   hugo server -D
   ```

## Writing New Posts

In Emacs:
1. Use `SPC X` to open the capture menu
2. Select `b` for Blog post
3. Fill in the required information
4. Write your post in org-mode
5. Export with `C-c C-e H H` or use `M-x org-hugo-export-wim-to-md`

## Publishing

1. Set draft to false in the front matter
2. Export the post
3. Commit and push to GitHub
