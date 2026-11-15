# Notes Directory Guidelines

## Scope
This rule applies when creating, updating, or organizing reference notes, cheatsheets, commands, and debugging recipes inside the `Notes/` directory.

## Core Principle: Fast Lookup & Zero Fluff
Notes are for instant recall. When a developer opens a file in `Notes/`, they should find the exact command, syntax, or query within 3 seconds.

---

## 1. Cross-Referencing Rule
- Every cheatsheet or note file in `Notes/` should link back to the deep-dive concept note in `Learning/` (e.g., `[Learning/Docker/](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/README.md)`).
- If relevant, link to the interview questions in `Interview-Prep/`.

---

## 2. Standard Cheatsheet Template

Every cheatsheet file (e.g. `Notes/Cheatsheets/<topic>.md`) should follow this structure:

````markdown
# [Technology] Cheatsheet

> Quick reference for everyday commands, syntax, and configurations.
> **Deep Dive:** [Learning Notes](file:///path/to/learning) | **Interview Q&A:** [Interview Prep](file:///path/to/interview)

---

## 1. Most Used Commands (Top 10)
| Command | What It Does | Example |
| :--- | :--- | :--- |
| `cmd ...` | Short description | `cmd --flag` |

---

## 2. [Category 1: e.g. Setup & Management]
- Bullet points or concise tables of commands.

---

## 3. [Category 2: e.g. Inspection & Debugging]
- Diagnostic commands and troubleshooting flags.

---

## 4. Copy-Paste Snippets / Configs
```<language>
// Minimal ready-to-copy configuration or snippet
```
````

---

## 3. Formatting Rules
- **Prefer Tables & Code Blocks**: Use tables for commands and flags.
- **No Long Theory**: Put detailed conceptual explanations in `Learning/`, not here.
- **Categorize Logically**: Place cheatsheets in `Notes/Cheatsheets/`, debugging in `Notes/Debugging/`, etc.
