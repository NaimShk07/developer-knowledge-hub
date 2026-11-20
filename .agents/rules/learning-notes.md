# Learning Notes Guidelines (FAANG SDE-1 Standard)

## Scope
This rule applies when creating, editing, or summarizing notes, concepts, and documentation inside the `Learning/` directory.

## Core Principle: Plain English + Architectural Depth
Write all notes in simple, short, and concise English. Maintain the high standard expected of an SDE-1 candidate at Tier-1 tech companies:
- Explain the underlying mechanics (how it works in memory, on threads, or in CPU cycles).
- Never just show syntax; explain **why** this pattern/technology was designed and what problems it solves.

---

## 1. Writing Style & Tone

- **Simple Words**: Everyday English over academic jargon.
- **Short Sentences**: Direct and punchy (under 15–20 words where possible). One clear thought per sentence.
- **Short Paragraphs**: Maximum 2 to 3 sentences per paragraph (no walls of text).
- **Active Voice**: Be direct and instructional.
- **Mental Models & Analogies**: Ground abstract concepts in concrete real-world metaphors (e.g. Bank Teller vs Buzzer, Juggler for concurrency).

---

## 2. Standard Note Templates

### A. DSA Pattern Notes Template (`Learning/DSA/<pattern>.md`)
````markdown
# Pattern XX: [Pattern Name]

> One-sentence definition explaining how this pattern reduces time/space complexity.

## 1. Key Takeaways (TL;DR)
- 3–4 bullet points of core facts.

## 2. Recognition Triggers (When to Use)
- High-frequency problem keywords that signal this pattern.
- Brute force vs pattern comparison.

## 3. Visual Mechanisms
- ASCII diagram showing pointer movements, state expansion/shrinking, or tree traversal.

## 4. Reusable TypeScript / JavaScript Template
```typescript
// 10-15 line generic boilerplate template
```

## 5. Canonical Problem Walkthrough
- Complete optimized solution for 1 representative LeetCode Medium.

## 6. JavaScript / TypeScript Specific Gotchas
- V8 engine quirks, sorting behaviors, integer division, or memory traps.

## 7. Complexity Analysis
| Metric | Complexity | Why |
| :--- | :--- | :--- |
````

### B. System & Technology Concept Template (`Learning/<topic>/<concept>.md`)
````markdown
# [Concept Name]

> One simple sentence explaining what this is.

## 1. Key Takeaways (TL;DR)
- Main point 1, 2, 3 in plain words.

## 2. Why & When to Use
- **Why:** Benefit and problem it solves at scale.
- **When:** Typical production scenario.

## 3. Minimal Example
```<language>
// Clean, working example with zero boilerplate
```

## 4. Common Mistakes & Pitfalls
- Production traps, memory leaks, and anti-patterns.

## 5. Quick Reference Table
````

---

## 3. Formatting & Linking Rules
- **Relative Markdown Links Only:** Always use relative paths (`[Title](../Path/file.md)`) for native Obsidian and GitHub compatibility. Never use `file:///`.
- **Roadmap Integration:** Every new topic must be registered in the master tracker at [`Learning/FAANG-Roadmap.md`](../Learning/FAANG-Roadmap.md).
