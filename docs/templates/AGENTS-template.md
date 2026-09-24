<!--
Template for a repo's root AGENTS.md — the file every coding agent reads first,
in every session, whether or not it's relevant. That's the whole design
constraint: it is an INDEX, not a manual.

Symlink CLAUDE.md to it so one file serves every harness:
  ln -s AGENTS.md CLAUDE.md

Rules for keeping it useful:
  - Link, don't explain. Detail duplicated here goes stale silently, because
    nothing compiles it and no test covers it.
  - Say WHEN to read a doc, not what's in it. The agent is deciding whether to
    open the file, not learning its contents.
  - Mark empty docs as empty, or an agent burns a read on a blank file and
    concludes the guide doesn't exist.
  - If it fits on one screen, it gets read. Keep it there.

Delete this comment and every <placeholder>.
-->

# <Project name>

<One or two sentences: the stack and the shape — what kind of repo this is and
what's in it.> This file is an index — read the doc that covers what you're
about to change before you change it.

## Repo-wide standards

<!-- Only what applies everywhere AND lives nowhere else. Three or four lines.
     Anything longer is a guide, not a standard. -->

- **Naming:** <e.g. PascalCase for `.tsx`, kebab-case for `.ts`>
- **Comments:** <e.g. keep them concise>
- **Docs:** after any change, update whichever of these still describe it — this
  file, the `docs/` page, the folder's `README.md`.

## docs/

<!-- "Read it when" is the moment the agent should stop and open the file, in
     the agent's terms ("Building any UI"), not a summary ("UI documentation").
     Keep Status honest — it's what makes the table trustworthy. -->

| Doc                                       | Read it when                                   | Status  |
| ----------------------------------------- | ---------------------------------------------- | ------- |
| [guides/<name>.md](docs/guides/<name>.md) | <Building **any** UI — a page, a component>    | Written |
| [guides/<name>.md](docs/guides/<name>.md) | <Touching the **API** — an endpoint, a schema> | Written |
| [<area>/<name>.md](docs/<area>/<name>.md) | <You're unsure which folder a file belongs in> | Empty   |

**Empty means empty.** Those files are placeholders with no content yet. Don't
read them expecting answers, and don't infer that a guide doesn't exist because
its page is blank — fall back to the READMEs below, then the code.

## Folder READMEs

The detail lives next to the code. The guides above link into these; go straight
to one when you already know where you're working.

| README                               | Covers                    |
| ------------------------------------ | ------------------------- |
| [<path>/README.md](<path>/README.md) | <what it covers, briefly> |
| [<path>/README.md](<path>/README.md) | <…>                       |
