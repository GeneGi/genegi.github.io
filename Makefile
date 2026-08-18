# Blog workflow. Run `make` to see everything.

.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | sed 's/:.*##/\t/' | expand -t20

new: ## Start a post:  make new SLUG=my-post-title
	@test -n "$(SLUG)" || { echo "usage: make new SLUG=my-post-title"; exit 1; }
	hugo new content posts/$(SLUG).md
	@echo "-> content/posts/$(SLUG).md  (draft = true; flip to false to publish)"

serve: ## Preview locally with drafts, at http://localhost:1313
	hugo server -D --navigateToChanged

build: ## Build the site into public/
	hugo --minify

lottery: ## Rebuild the lottery app into static/lottery/
	cd spring-festival-lottery && npm run deploy

publish: ## Commit everything and push — CI builds and deploys
	@git add -A
	@git diff --cached --quiet && { echo "nothing to publish"; exit 0; } || true
	git commit -m "$(if $(M),$(M),post: update site)"
	git push
	@echo "-> pushed. watch: gh run watch"

clean: ## Remove build output
	rm -rf public resources/_gen

.PHONY: help new serve build lottery publish clean
