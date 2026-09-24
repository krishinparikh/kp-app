---
Guide: update-harness
Description: Which documentation an agent may update on its own, which requires asking first, and where the templates are.
---

# update-harness

There are three kinds of documentation in this repo, and one rule that sits
above all of them:

> **Escalate before changing anything that changes how an agent behaves.**
> Describing the code is your job. Rewriting your own instructions is not — ask
> first, every time, even when the change looks obviously right.

The reason is blast radius. A wrong line in a README misleads whoever opens that
folder. A wrong line in `AGENTS.md` or a guide silently steers **every agent
in every future session**, and nothing compiles it, tests it, or flags it. You
won't be there to notice.

## The three layers

| Layer       | Describes                         | Read by                     | May you edit it?                      |
| ----------- | --------------------------------- | --------------------------- | ------------------------------------- |
| `README.md` | One folder                        | Whoever opens that folder   | **Yes** — keep it true                |
| `docs/`     | The system, or how to build in it | Whoever follows the pointer | **Yes** for facts, **ask** for guides |
| `AGENTS.md` | The whole repo                    | Every agent, every session  | **Ask first**                         |

### READMEs — update them yourself

A folder's `README.md` is the most specific documentation there is. If your
change makes one wrong, fix it in the same change. That is not a separate task
and does not need permission.

Fix it when you change the folder's layout, its scripts, its conventions, or add
a gotcha worth warning about. Leave it alone when you've only changed behaviour
the README never described.

### docs/ — depends which folder

`docs/architecture/`, `docs/product/` and `docs/workflows/` **describe** things.
Correcting them to match reality is ordinary work — do it.

`docs/guides/` is different. Those files tell agents how to build, so they are
part of the harness even though they live under `docs/`:

- **Correcting a fact** in a guide — a renamed path, a changed command, a gotcha
  that no longer applies — go ahead.
- **Adding, removing or reversing a guide** — ask first. "Components go here
  now", "always use X", a new constraint: that is a decision about how the
  codebase gets built, and it is the user's to make.

### AGENTS.md — ask first

`AGENTS.md` is loaded into every session whether or not it's relevant, which is
why it is an index rather than a manual. `CLAUDE.md` is a symlink to it, so one
file serves every harness.

Two edits are safe without asking, because they only keep the index honest:

- Flipping a **Status** cell when a doc gains or loses content.
- Fixing a **broken link or path**.

Everything else — a new row, a new standard, reworded guidance, anything that
adds instruction rather than correcting a fact — ask first.

## The rest of the harness

Beyond documentation, anything that configures an agent is off-limits without
being asked directly:

- `.claude/` — settings, permissions, hooks, skills, slash commands, MCP servers
- Any equivalent for another tool (`.cursor/`, Copilot instructions, and so on)
- `apps/landing/AGENTS.md` — **generated**. `next dev` writes that block back
  every run, so deleting it from a diff just re-creates the change. Commit it
  with your work rather than fighting it. (`apps/landing/CLAUDE.md` is a
  one-line `@AGENTS.md` pointer to it.)

Hooks deserve a specific warning: they run automatically, on the user's machine,
for every session afterwards. Never add one to satisfy a request you could
satisfy by just doing the thing.

## How to escalate

Don't stop the whole task. Finish everything that doesn't depend on the answer,
then raise it in a sentence or two:

- what you'd change, and where
- why the current text is wrong or missing
- the exact wording you propose

Then let the user decide. If they've already told you to make the change, that
is the authorization — make it, and don't ask twice.

## Writing a new doc

Start from [`docs/templates/`](../templates/) — it carries this repo's shape, so
a new file reads like the ones already there:

| Creating                  | Start from                                            | Status           |
| ------------------------- | ----------------------------------------------------- | ---------------- |
| A folder `README.md`      | [README-template.md](../templates/README-template.md) | Written          |
| A root `AGENTS.md`        | [AGENTS-template.md](../templates/AGENTS-template.md) | Written          |
| A guide in `docs/guides/` | [guide-template.md](../templates/guide-template.md)   | Frontmatter only |
| A PRD                     | [prd-template.md](../templates/prd-template.md)       | Written          |

Each template carries its own guidance in HTML comments — delete them, and every
`<placeholder>`, before committing.

Two things hold wherever you write:

- **One home per fact.** If it's already in a README, link to it rather than
  restating it. A fact in two places is a fact that will disagree with itself.
- **A new guide needs a row in `AGENTS.md`** to be found at all — which is an
  `AGENTS.md` edit, so it goes in the same conversation you got approval in.

## Reference

- [`AGENTS.md`](../../AGENTS.md) — the index this guide protects
- [`docs/templates/`](../templates/) — starting points
