+++
title = "I got a bunch of AI Code Review comments"
author = ["Gene Gi"]
date = 2026-08-17
draft = false
tags = ["ai", "code-review"]
summary = "Complains about AI code review comments and my thoughts about AI code review"
+++

Today, during work, I was doing some away team work on a partner team's code package. For the code review I submitted, I received about 15 comments about it. All comments are quite long and have a line saying that it is reviewed by AI. It took me quite a while to basically read through all of the comments and think about how to address them. Some of them do make sense and some are edge cases, I don't think worth adding this round. I did perform some code review from another model (my code written by Claude Opus and I had it reviewed by Codex Sol) before I published the CR. Some of them I kind of intentionally kept out of this CR, but all those comments came back on colleagues' AI review. It largely impacted my delivery speed of the day.

Some thoughts about the AI CR review are: for the AI review workflow it should be a standard across the team, so other team members can run the same flow and get the same feedback, so their coding agent can capture those comments and have those addressed. Humans should review AI CR comments they want to post; if those don't make sense to them, they should ask the CR author to address them. Another thing is, should I just throw those comments to AI and ask AI to help me address them? The major problem of that is currently AI is too strict about corner cases and pushes too hard on it, causing the code to be very complex and hard for humans to understand later.
