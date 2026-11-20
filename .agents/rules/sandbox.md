# Sandbox Directory Guidelines (FAANG SDE-1 Standard)

## Scope
This rule applies when creating, running, testing, or cleaning up experiments, prototypes, and code snippets inside the `Sandbox/` directory.

## Core Principle: Self-Contained, Runnable & Edge-Case Heavy
FAANG interviewers fail solutions not on average inputs, but on edge cases. Every sandbox experiment must be minimal, runnable with a single terminal command, and aggressively probe boundary traps.

---

## 1. Cross-Referencing Rule
- Every sandbox experiment folder must contain a `README.md`.
- The `README.md` must link back to the concept being tested in `Learning/` using relative Markdown links (e.g. `[02-sliding-window.md](../../Learning/DSA/02-sliding-window.md)`).
- Document all non-obvious runtime findings and gotchas so they can be referenced in `Interview-Prep/`.

---

## 2. Standard Experiment Structure

Each experiment gets its own folder: `Sandbox/<topic>-<purpose>/` (e.g., `Sandbox/dsa-sliding-window/`, `Sandbox/nodejs-event-loop-demo/`).

```text
Sandbox/<topic>-<purpose>/
├── README.md             # Objective + How to run + Key findings
└── [test script/compose] # test.js, compose.yaml, etc.
```

### Required Test Suite Coverage for DSA Probes
When creating test probes for DSA patterns (`dsa-<pattern>.test.js`), use `node:assert/strict` and always test:
1. **Happy Path:** Standard positive inputs.
2. **Empty / Null Input:** Empty array `[]`, empty string `""`, single element.
3. **Boundary Edge Cases:** Window larger than array, target not found, all duplicates (e.g. `[0, 0, 0, 0]`).
4. **Sign & Numeric Extremes:** Negative numbers, zero, extreme values.

---

## 3. Hygiene & Lifecycle Rules
- **No Secrets**: Never commit `.env` or credentials.
- **Easy Teardown**: Code must be runnable with standard `node <file>.js` or `docker compose up -d` with zero complex global dependencies.
