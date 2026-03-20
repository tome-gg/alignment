# 2026 Revamp: Dual UI, Shared Tome Model

Status: Draft  
Date: 2026-03-19  
Branch: `feat/revamp`

## Summary

Tome.gg should move from a growth-journal frontend that reads GitHub repositories into a product with:

- two distinct UI surfaces
- one shared `Tome Entry` domain model
- one monorepo backend owned by Tome.gg
- one persistence layer built on Node.js, TypeScript, and SQLite

The key product decision is explicit:

> We will not build one identical UI for everyone.

We will build:

- a software engineer UI optimized for speed, text, and flexibility
- a manufacturing UI optimized for structure, clarity, and low cognitive load

These are separate UIs, not a single adaptive mode. The unification happens in the data model, evaluation system, and progression logic.

## Why This Changes the Product

The current repo is centered on:

- DSU-like training entries
- separate evaluation files
- a calendar heatmap view
- GitHub repository ingestion as the source of truth

That architecture is useful for displaying growth history, but it is not the right foundation for Tome as a product where users author competence through real work.

The redesign shifts the product from:

> a journal with scores

to:

> a system for capturing applied knowledge with evidence and correction

## Product Position

Tome.gg is a system where people author, test, and refine their knowledge through real work.

It is not primarily:

- a journaling app
- a task tracker
- a course platform
- a repository viewer

Its durable object is the `Tome Entry`.

## Core Invariant

Every entry, regardless of persona, must preserve the same five-part skeleton:

1. Situation
2. Action
3. Evidence
4. Insight
5. Evaluation

This is the invariant across all industries and all UI surfaces.

## Decision: Separate UIs, Shared Domain

### We are intentionally branching at the UX layer

The software engineer and technician operate in different cognitive environments:

- software engineer: high-context, async, self-directed, text-heavy
- technician: low-context, time-constrained, action-first, structured

Forcing them through one identical authoring surface would create the wrong kind of friction in both cases.

### We are not branching at the product logic layer

The following stay shared:

- `Tome Entry` schema
- evaluation model
- progression logic
- persistence layer
- API contracts
- evidence and feedback lifecycle

This is the KISS/DRY boundary:

- different UI components and workflows
- shared backend, domain model, and storage

## Design Principles

### 1. Write after doing

Entries start from action in the real world, not abstract reflection.

The sequence is:

1. What happened?
2. What did you do?
3. What proves it?
4. What did you learn?
5. Were you correct?

### 2. Evidence is required

Without required evidence, Tome collapses back into journaling.

### 3. Insight must stay visible

Even the manufacturing UI must preserve authorship. The insight field can be constrained, but it cannot disappear.

### 4. Evaluation must challenge belief

Tome entries are authored by the user, but truth is not self-declared. Evaluation closes the loop.

### 5. Keep the system simple

Do not create separate data models, separate backends, or separate business rules per persona unless reality forces it.

## Shared Domain Model

`Tome Entry` is the single source of truth for both UIs.

```ts
type TomeEntryMode = "software_engineering" | "manufacturing";

type EvaluationStatus =
  | "correct"
  | "incorrect"
  | "partially_correct"
  | "unresolved";

interface TomeEntry {
  id: string;
  userId: string;
  mode: TomeEntryMode;
  performedAt: string;
  situation: TomeSituation;
  action: TomeAction;
  evidence: TomeEvidence[];
  insight: TomeInsight;
  evaluation: TomeEvaluation | null;
  createdAt: string;
  updatedAt: string;
}

interface TomeSituation {
  summary: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

interface TomeAction {
  summary: string;
  metadata?: Record<string, unknown>;
}

interface TomeEvidence {
  id: string;
  type: string;
  uri?: string;
  fileId?: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

interface TomeInsight {
  text: string;
  surprising: boolean;
  confidence: 1 | 2 | 3 | 4 | 5;
}

interface TomeEvaluation {
  status: EvaluationStatus;
  score?: number;
  evaluatorId?: string;
  feedback?: string;
  dimensions?: Array<{
    key: string;
    score?: number;
    feedback?: string;
  }>;
}
```

### Shared constraints

- `situation.summary` is always required.
- `action.summary` is always required.
- At least one evidence item is required.
- `insight.text` is always present, though UI-specific length constraints may vary.
- `evaluation` can be null at submission time, but not after review.

### Persona-specific metadata

Different UIs are allowed to attach different structured metadata under the same shared objects.

Examples:

- software `situation.metadata`: repo, issue type, service name
- manufacturing `situation.metadata`: product line, defect type, environment
- software `action.metadata`: PR number, branch, test run id
- manufacturing `action.metadata`: action code, material, machine, checks performed

## UI Surface A: Software Engineer

### Goal

Let the user write fast and attach proof with minimal friction.

### Characteristics

- compact layout
- keyboard-first
- free text with lightweight structure
- low interruption
- fast link-based evidence capture

### Authoring flow

**Situation**

- free text
- optional tags
- placeholder-led guidance, not rigid forms

**Action**

- free text
- optional lightweight action tags such as `fix`, `debug`, `design`, `refactor`

**Evidence**

- add GitHub PR
- add doc link
- add screenshot
- add benchmark or test artifact

The system should auto-detect known link types and render previews where cheap to do so.

**Insight**

- 2-3 sentence free text
- this is the highest-expression field in the engineer flow

**Confidence**

- quick 1-5 input

**Evaluation**

- usually deferred
- review can happen asynchronously by mentor, peer, or system workflow

### UX rule

The engineer should feel like they are logging work, not completing intake paperwork.

## UI Surface B: Manufacturing

### Goal

Reduce thinking overhead and make correct entry creation easy under time pressure.

### Characteristics

- large targets
- tap-first
- structured selection
- optional photo capture early
- minimal typing
- strong defaults

### Authoring flow

**Situation**

- product dropdown
- issue type buttons
- environment selector

**Problem Type**

- common defect/problem categories
- optional photo capture attached immediately

**Action**

- large action buttons such as `recoat`, `re-machine`, `inspect alignment`, `adjust formulation`, `reject`, `escalate`

**Checks**

- checklist-style verification inputs such as `hardness`, `dimensions`, `adhesion`, `surface`, `balance`

**Insight**

- constrained text
- optional voice input
- 1-2 lines is acceptable for MVP

**Confidence**

- large tap targets from 1-5

**Evaluation**

- usually tied to supervisor review, QA result, or downstream inspection

### UX rule

The technician should feel guided, not trapped.

## What Stays Shared Across Both UIs

- same entry skeleton
- same underlying table structure
- same API create/read/update lifecycle
- same evaluation states
- same progression system
- same evidence ownership model

This is the crucial product property:

> separate entry surfaces, shared competence ledger

## Evaluation Model

Evaluation must be a first-class backend concern, not ad hoc UI state.

### Submission state

When a user creates an entry:

- evidence exists
- confidence is captured
- evaluation may still be pending

### Review state

When an evaluator reviews an entry:

- mark verdict
- add feedback
- optionally score dimensions

### Why this matters

Without a review loop, Tome becomes a collection of unverified beliefs.

## Monorepo Architecture

Tome.gg should become a monorepo with clear package boundaries and minimal duplication.

### Proposed structure

```text
apps/
  web/
    app/
      engineer/
      manufacturing/
      review/
  api/
    src/
      routes/
      services/
      db/
packages/
  domain/
    src/
      tome-entry.ts
      evaluation.ts
  db/
    src/
      schema.ts
      migrations/
  ui/
    src/
      primitives/
      engineer/
      manufacturing/
  config/
    src/
      modes.ts
      evidence-types.ts
```

### Rationale

- `apps/web` keeps one deployable frontend while still allowing two separate UI surfaces.
- `apps/api` owns backend logic instead of burying product behavior inside Next.js route handlers.
- `packages/domain` prevents duplicate type definitions and business rules.
- `packages/db` centralizes SQLite schema and migration code.
- `packages/ui` shares primitives without forcing one identical authoring experience.

This keeps the system simple while avoiding frontend-backend drift.

## Backend Responsibilities

The backend should own:

- users
- tome entries
- evidence records
- uploaded files
- evaluations
- progression summaries
- schema validation

The backend should not rely on GitHub repositories as the primary persistence mechanism after the revamp. GitHub import can remain as a migration or ingestion path, not the core database.

## SQLite-First Data Model

SQLite is the right initial database because it is simple, local-first, and sufficient for early product scope.

### Proposed tables

- `users`
- `tome_entries`
- `tome_entry_evidence`
- `files`
- `evaluations`
- `evaluation_dimensions`

### Suggested storage pattern

- store the stable shared fields as normal relational columns
- store persona-specific metadata as JSON
- avoid creating persona-specific tables too early

This keeps the schema flexible without duplicating persistence logic.

## API Shape

Keep the API thin and boring.

### Core endpoints

- `POST /entries`
- `GET /entries`
- `GET /entries/:id`
- `PATCH /entries/:id`
- `POST /entries/:id/evidence`
- `POST /entries/:id/evaluation`
- `GET /progress/:userId`

### API rule

The API accepts one shared `Tome Entry` contract. The frontend is responsible for collecting mode-specific inputs and translating them into the shared shape.

## Frontend Strategy

### Keep separate flows

The engineer and manufacturing entry experiences should be implemented as separate page-level flows and separate component sets.

### Share only what is actually shared

Shared:

- layout primitives
- buttons
- cards
- form validation helpers
- API hooks
- domain types

Not shared:

- field ordering
- control density
- evidence capture UI
- defaults
- copy tone

This is how we stay DRY without forcing fake abstraction.

## Migration From the Current Repo

Today the repo is a Next.js frontend with API routes and GitHub-based ingestion.

The revamp should proceed in this order:

### Phase 1: Domain and backend extraction

- introduce monorepo layout
- create shared `Tome Entry` domain package
- create `apps/api` with SQLite persistence

### Phase 2: Engineer UI

- build the software engineer entry flow first
- keep it close to the current text-forward product DNA

### Phase 3: Manufacturing UI

- build the manufacturing-specific guided flow
- reuse shared domain, validation, and persistence

### Phase 4: Review and progression

- add evaluator workflows
- add progress summaries on top of shared entry data

### Phase 5: Legacy ingestion

- optionally import historical GitHub journal data into the new entry model

## KISS/DRY Rules

### KISS

- one backend
- one domain model
- one database
- one web deployment
- two UI flows

### DRY

- share contracts, not screens
- share validation, not interaction density
- share persistence, not component assumptions

## Risks

### 1. Over-sharing UI code

If we force both personas into one component tree, both experiences degrade.

### 2. Over-splitting backend logic

If we create persona-specific backend stacks too early, maintenance cost grows for no product gain.

### 3. Weak evidence rules

If evidence is soft or optional, the competence ledger loses trust.

### 4. Missing evaluator workflow

If entries cannot be reviewed cleanly, the system records belief but not correction.

## Open Questions

- What is the minimum evidence requirement per persona for MVP?
- Should manufacturing voice input be in V1 or deferred?
- What progression views are useful before full rubric scoring exists?
- Do we need offline-capable evidence capture for shop-floor environments?
- Which parts of the existing GitHub ingestion path are worth preserving as import tools?

## Final Position

The revamp should be built as:

> two separate UIs for two different cognitive environments, unified by one Tome Entry model and one backend

That gives Tome.gg the right balance of personalization, rigor, and implementation simplicity.
