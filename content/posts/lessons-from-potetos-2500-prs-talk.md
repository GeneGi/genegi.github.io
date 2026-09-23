+++
title = "Lessons from lauren's 'How I Shipped 2,500 PRs in a Month' Talk"
author = ["Gene Gi"]
date = 2026-09-22
draft = false
tags = ["ai", "agents", "code-review", "productivity"]
summary = "My takeaways from lauren's (@poteto) talk on shipping 2,500 PRs in a month with AI agents — trust, verification, and agent-friendly codebases."
+++
The talk link: https://x.com/poteto/status/2102050467505430555/video/1

- Treat your codebase as your agent memory
- Record decisions/rules the agent needs to follow inside the code package
- Clean up tech debt — agents tend to copy the anti-patterns and short-term solutions in the codebase
- Create verification skills to improve trust in agent work, so the agent can verify its own work
- Identify the mistakes agents make and consolidate them into the codebase/static analysis (linter/compiler/CI)/rules (AGENTS.md)/skills/'style guide'
- How to verify UI work? How can we decouple the UI layer and the data layer?
- Scale the agent in the loop — make each step an agent, and remove the human from the loop as trust in the agent increases

