# Interview Preparation Guidelines (FAANG SDE-1 Standard)

## Scope
This rule applies when creating, updating, or organizing questions, answers, mock interviews, and revision materials inside the `Interview-Prep/` directory.

## Core Principle: The FAANG SDE-1 Bar
All interview material must be optimized for Tier-1 Tech (Meta, Google, Amazon, Apple, Microsoft, Uber, Stripe) SDE-1 evaluation:
1. **Communication Clarity:** The ability to explain complex ideas or algorithms in 30 seconds out loud.
2. **Trade-off Analysis:** Always compare brute force vs optimized solutions with exact Big-O derivation.
3. **Edge Case Awareness:** Proactively identify boundary traps before writing code.
4. **Behavioral Impact:** Use the STAR method with quantifiable results.

---

## 1. Cross-Referencing Rule
Whenever a question relates to a concept already documented in `Learning/` or tested in `Sandbox/`:
- **Always provide a relative Markdown link** (e.g., `[01-two-pointers.md](../../Learning/DSA/01-two-pointers.md)`).
- Never use absolute `file:///` URLs so Obsidian Graph View and GitHub navigation remain intact.

---

## 2. Standard DSA Verbal Coding Template

Every DSA coding problem in `Interview-Prep/DSA/` must follow the **4-Step Verbal Framework**:

````markdown
### Q: [Problem Name / Category]
`[Level: Junior-Mid]` `[Frequency: High (Company Names)]`

- **Related Learning Note:** [Pattern Note](../../Learning/DSA/...)
- **Hands-on Experiment:** [Sandbox Demo](../../Sandbox/...)

#### 1. Clarifying Questions to Ask
- 2–3 sharp questions clarifying constraints (empty input, negatives, duplicates, data types).

#### 2. Brute Force (30-Second Explanation)
> "Explain the naive approach in 2 sentences with its Big-O time and space to establish baseline thinking."

#### 3. Optimized Strategy & Spoken Explanation
> "Explain the pattern, why it works, and how it eliminates redundant work in 3 clear sentences."

#### 4. Minimal Code Solution (JavaScript / TypeScript)
```typescript
// Clean, readable, production-quality solution
```

#### Common Follow-Up Questions
- *"How to optimize space further?"* → 1-sentence answer.
- *"What if constraints changed to X?"* → 1-sentence answer.
````

---

## 3. Standard Behavioral Template (STAR Method)

Every behavioral question in `Interview-Prep/Behavioral/` must follow the **STAR Framework**:

````markdown
### Q: [Behavioral Question / Leadership Principle]
`[Category: Amazon LP / Googleyness / Conflict / Ownership]`

#### Situation & Task (20%)
- Brief context of the project, deadline, or challenge. What was your specific responsibility?

#### Action (60%)
- What specific engineering or communication steps did YOU take? (Use "I", not "we").
- What trade-offs did you evaluate?

#### Result & Learning (20%)
- Quantifiable business or technical outcome (e.g. "Reduced latency by 35%", "Saved 4 hours of weekly manual work").
- Key takeaway you apply today.
````

---

## 4. Verbal Delivery Rules
- **Lead with the Direct Answer:** Never waffle or start with "Well, it depends...". Give the concrete answer first, then elaborate.
- **Rule of 3:** Structure technical points in 3 clear bullets.
- **Proactive Dry Run:** In DSA, always walk through one example array verbally before saying you are done.
