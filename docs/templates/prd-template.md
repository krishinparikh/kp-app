<!--
Template for a product requirements doc, saved to docs/product/prd.md.

It answers what we're building and why, in enough detail that someone can
design and build from it without asking. It is not a spec for HOW — no
frameworks, no schemas, no endpoints. Those live in docs/architecture/ and get
written after this is agreed.

Write it in order. Each section leans on the one before: the Problem justifies
the Solution, the Solution produces the Features, and Success Criteria measure
the Problem.

Delete this comment and every <placeholder>.
-->

# <Product name>

## 1. Overview

<!-- One paragraph. Name the users, the domain, and the key differentiator. Be
     specific — "a tool that helps with X" says nothing.

     Weak:   An AI tool that helps with due diligence.
     Strong: An AI-powered due diligence tool for <org> that <specific
             mechanism> to deliver <specific outcome>. -->

<One paragraph.>

## 2. Problem

<!-- 3-5 bullets. Each is a specific, observable problem in the user's real
     workflow today, and one this product directly addresses.

     "They don't have this tool yet" is not a problem. Neither is a missing
     feature. Describe what goes wrong now, and what it costs. -->

- <Concrete pain point, grounded in how the work happens today.>
- <…>
- <…>

## 3. Solution

<!-- The central mechanism — how it works, conceptually. This is the section
     that makes the product unique, so it gets the most detail.

     No technology choices. Describe what the system does, not what it's built
     with. If a framework name appears here, it belongs in architecture. -->

<The mental model the user should hold — the one sentence they'd use to explain
it to a colleague.>

### How it works

<!-- If the approach is novel (adversarial debate, collaborative filtering,
     multi-agent review), explain it properly here — this is the part a reader
     can't infer. -->

<The approach, in detail.>

### Components

<!-- Name each agent, pipeline or stage and give it one role. Show the
     hierarchy and any specializations. -->

| Component | Role                        |
| --------- | --------------------------- |
| <name>    | <what it's responsible for> |
| <name>    | <…>                         |

### Flow

<!-- How the phases connect: inputs, processing, outputs. Say explicitly what
     runs in parallel and what must wait. -->

1. **<Phase>** — <input> → <what happens> → <output>
2. **<Phase>** — <…> <runs in parallel with / waits for …>
3. **<Phase>** — <…>

## 4. User Stories

<!-- As a [role], I want to [action], so that [outcome].

     Each one: tied to a pain point in section 2, testable (you can tell when
     it's done), and independent enough to ship on its own. Group under
     sub-headings once there are more than a handful. -->

### <Group, e.g. a role or a stage of the workflow>

- As a <role>, I want to <action>, so that <outcome>.
- As a <role>, I want to <action>, so that <outcome>.

### <Group>

- As a <role>, I want to <action>, so that <outcome>.

## 5. Core Features

<!-- One numbered section per feature, named for what the user does.

     Walk through what the user sees and does, screen by screen, in enough
     detail that a designer could wireframe it without asking. Be opinionated
     about layout — say "side-by-side", "three-step stepper", "left sidebar",
     not "some way to navigate". Ambiguity here becomes a decision someone else
     makes later, worse. -->

### 1. <What the user does, e.g. "Upload a pitch deck">

<What the user sees on arrival, and the layout it's in.>

<What they do, step by step, and what changes on screen as they do it.>

**Behind the scenes:** <what the system does with the input.>

**Live behaviour:** <what updates without a reload, what streams in, what the
user waits on and what they see while waiting.>

### 2. <…>

## 6. Out of Scope

<!-- What this version deliberately does NOT do. The tempting-but-not-essential
     list is the important one — name the things a reader would otherwise
     assume are included. -->

- <Feature that's tempting but not essential for v1.>
- <Adjacent problem this product won't solve.>
- <Integration or platform not supported yet.>

## 7. Success Criteria

<!-- 3-5 measurable outcomes. Each maps back to a pain point in section 2 and
     can be checked — a number, a threshold, or an observable behaviour.
     "Users like it" is not a criterion. -->

- <Specific, observable, measurable outcome.>
- <…>
- <…>
