# Sandbox Directory Guidelines

## Scope
This rule applies when creating, running, testing, or cleaning up experiments, prototypes, and code snippets inside the `Sandbox/` directory.

## Core Principle: Self-Contained & Disposable
Every experiment in `Sandbox/` must be minimal, self-contained, and runnable with a single command.

---

## 1. Cross-Referencing Rule
- Every sandbox experiment folder must contain a `README.md`.
- The `README.md` must link back to the concept being tested in `Learning/` (e.g., `[Learning/Docker/04-volumes.md](../../Learning/Docker/04-volumes.md)`).
- Document any real gotchas or edge cases discovered during the experiment so they can be referenced in `Interview-Prep/`.

---

## 2. Standard Sandbox Experiment Structure

Each experiment gets its own folder: `Sandbox/<topic>-<purpose>/` (e.g., `Sandbox/docker-volumes/`, `Sandbox/redis-cache/`).

```text
Sandbox/<topic>-<purpose>/
├── README.md             # How to run + what this tests + link to Learning/
├── [run script/compose]  # docker-compose.yaml, index.js, script.sh, etc.
└── .gitignore            # Ignore node_modules, logs, temp data
```

### Standard Experiment `README.md` Template
````markdown
# [Experiment Name]

> **Testing Concept:** [Learning/Topic/Concept.md](file:///path/to/learning/note.md)

## Objective
One or two sentences explaining what hypothesis or feature this experiment proves.

## How to Run
```bash
# Exact 1 or 2 commands to execute
```

## What to Observe
- Output 1
- Output 2

## Gotchas & Findings
- Any unexpected behavior discovered during testing.
````

---

## 3. Hygiene & Lifecycle Rules
- **No Secrets**: Never commit `.env` or API credentials.
- **Cleanup**: Experiments should be easy to tear down (e.g., `docker compose down -v` or `rm -rf`).
- **Promotion**: If an experiment grows into a full, maintainable application, move it to `Projects/`.
