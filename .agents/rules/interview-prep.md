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

#### Mandatory Follow-Up Questions (Minimum 2 Required)
- **Follow-up 1 (The Constraint Twist):** *"What if constraints changed (e.g. data stream, memory limit, negative numbers, duplicates)?"* → Concise 1–2 sentence answer.
- **Follow-up 2 (The Interviewer Trap / Edge Case):** *"Can we optimize space further / Can we do this in O(1)?"* or a common misconception trap → Concise 1–2 sentence answer.
````

---

## 3. Standard Technical Concept Q&A Template (System / Runtime / DB)

Every conceptual question in `Interview-Prep/<Topic>/` (e.g., Node.js, Docker, Redis) must also follow this format:

````markdown
### Q: [Exact Question]?
`[Level: Junior | Mid | Senior]` `[Frequency: High | Very High]`

- **Related Learning Note:** [Topic Note](../../Learning/...)

#### 30-Second Spoken Answer
> "Say this out loud in 2–3 clear sentences. Start with a direct definition, then mention why it matters."

#### Key Points to Mention (Rule of 3)
1. Point 1: Essential technical fact.
2. Point 2: Real-world practical application.
3. Point 3: Trade-off or comparison.

#### Mandatory Follow-Up Questions (Minimum 2 Required)
- **Follow-up 1 (Under-the-Hood / Scaling):** *"What happens when scale increases / How does the kernel/runtime handle this?"* → Crisp answer.
- **Follow-up 2 (The Trap / Counter-Intuitive Twist):** *"Why not just do X instead / What are the failure modes?"* → Crisp answer.
````

---

## 4. Standard Behavioral Template (STAR Method)

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

## 5. Verbal Delivery Rules
- **Lead with the Direct Answer:** Never waffle or start with "Well, it depends...". Give the concrete answer first, then elaborate.
- **Rule of 3:** Structure technical points in 3 clear bullets.
- **Proactive Dry Run:** In DSA, always walk through one example array verbally before saying you are done.
