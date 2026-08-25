+++
title = "How to write a design doc in the AI era"
author = ["Gene Gi"]
date = 2026-08-20
draft = false
tags = ["ai", "design-doc"]
summary = "AI can draft a design doc cheaply, but iterating on it means reviewing your own document — and attention fades. Why design docs still matter for alignment, and my workflow: research with AI, write your own ideas, let AI polish and cross-reference."
+++

Design docs used to be a core part of any serious project. Writing one meant your project had enough scope to warrant upfront design: understanding the problem, clarifying requirements, learning the existing system, weighing options, and landing on a recommendation. It usually took more than two weeks, plus a couple rounds of design review to get the team aligned.

AI has changed the whole nature of development, and it also impacts how we write design docs. There's a saying these days that people don't do design anymore: instead of arguing about options on paper, you should build a live prototype. AI can generate one easily now, letting you quickly experiment with multiple options, which gives you a better feel for what it actually looks like and where the limitations are. I think this approach works well for most front-end work like UI interfaces (though AI still isn't very good at UX design yet). But for back-end work, there are usually multiple dependencies across teams, and you don't have full control of the system — we can't rely on AI to build all of those as mocks.

Also, for projects running in production with many dependencies, the design doc is still the better way to seek alignment: it lets our dependency teams know what changes are coming. As a stakeholder upstream or downstream, they will understand clearly the impact of your changes on their services.

I recently did one of these design reviews, and I'd say AI helped a lot — but it totally changed my way of writing a design doc. We have a template for writing design reviews, so I provided the template to AI, and it generated a version that was more or less correct. It can do some research, and you can provide context documents and requirements. Basically, it's very cheap to get an initial version of your design. But how you iterate on top of that is still an open question.

One issue I'm noticing with AI-generated design review docs is that they tend to be very lengthy and hard to read. Yes, you could use something like an agents.md or specific writing guidelines, ask the agent to follow them, maybe even profile your previous artifacts so the agent writes in your style — but the problem remains. After AI generates the initial draft, you need to read it and effectively review it. Before, you would write the doc and others reviewed it; now AI provides the draft and you're doing the design review for your own document. That tends to be time consuming.

Another issue: because the doc is so long, my attention drops over time. The first half of my document was much more thoroughly revised — I read it carefully and gave feedback to the agent, which iterated based on my comments. But by the later version, the effort required to read the whole doc kept increasing, so the second half ended up sloppier and didn't get my full attention. Quite a few sections remain where you don't agree with the agent or want to confirm certain things — and AI sometimes includes unrelated or questionable claims that you have no idea where they came from. If you leave those in, it gets quite awkward when a colleague asks you what a particular section means and you don't know. You'll likely just copy-paste the same question into your AI agent.

That's the big issue with writing design docs this way, in my mind.

So here's my ideal way to write a design doc currently. First, definitely keep what we did before AI: you need to do research. You work with your research agent together — you provide the direction, it produces a small research summary — and you read that first. Based on the AI research summary, you write down your own ideas and insights.

Maybe draft a few bullet points, then ask AI to rewrite them — to make them more readable and follow the best format for the audience. Things like clarifying requirements and listing use cases, AI can help with, but you need to review everything. I'm leaning toward not letting AI write your thoughts: you should write yourself based on the AI output, and only ask AI to modify on top of your ideas. One thing AI does better than any of us, though, is cross-referencing. When you update one part of a design, a human tends to miss one or two other places that referenced it — AI can catch all of them and update every related place consistently. Similarly for the design options — the main part of the doc, the options you considered with their pros and cons. Write your own thinking first; you should already have some ideas from the AI research summary. Once those notes are done, you can ask the agent about other approaches, compare against what you have, surface any pros or cons you missed, and add them back into your own doc.

That's my current ideal way to write a design doc in the AI era. I expect it will keep evolving with the models' abilities, but for now, this is what works best for me.
