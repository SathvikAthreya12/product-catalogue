# AI usage

> Replace the placeholders below with what actually happened. The follow-up interview will check this against your decisions.

## Tools and models

- Claude (claude.ai chat) for planning and scaffolding the first version of the code, docs and tests. [Confirm the model and any other tools you used, such as an IDE assistant or Claude Code.]
- Agent instruction file: `CLAUDE.md` in the repo root.

## Plan and spec

The plan was: a ports-and-adapters backend with an in-memory cached Fake Store adapter, a thin Express layer, a React client that talks only to `/api`, one test per acceptance criterion, and documentation covering assumptions. [Add or link any spec you wrote before prompting.]

## Key prompts and moments that shaped the solution

1. [Your first prompt, with the constraints you gave: the acceptance criteria, the no-direct-Fake-Store rule, and the 10-minute local run requirement.]
2. [The moment you chose the ports-and-adapters split, and why you preferred it to a simpler service-plus-fetch approach.]
3. [The prompt where you asked for assumptions to be recorded rather than asked about.]
4. [The review prompt where you asked for edge cases: header injection in the enquiry name, empty search terms, malformed IDs.]
5. [Any prompt that changed a decision, such as the category top-rated split or the console email default.]

## Where the AI got things wrong, and how I caught it

- [Fill in real examples. Candidates often find things like a wrong library API, a test that passes for the wrong reason, or an over-engineered abstraction. Describe how you found each one.]
- Review checklist I applied to all generated code: does every test assert a behaviour rather than an implementation detail? Does every external input go through Zod? Are there any secrets or hard-coded hosts?

## What I reviewed or changed by hand

- [List the files you read line by line and any you rewrote.]
