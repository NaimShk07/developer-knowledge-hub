# Interview Preparation Guidelines

## Scope
This rule applies when creating, updating, or organizing questions, answers, mock interviews, and revision materials inside the `Interview-Prep/` directory.

## Core Principle: Interview-Ready & Spoken Clarity
Answers must be concise, structured, and easy to speak out loud in an actual technical interview. Avoid long academic essays.

---

## 1. Cross-Referencing Rule
Whenever a question relates to a concept already documented in the `Learning/` folder:
- **Always provide a clickable link** to the relevant note (e.g., `[Learning/Docker/01-images-and-containers.md](../../Learning/Docker/01-images-and-containers.md)`).
- This keeps interview answers focused on **how to answer**, while referencing **deep dive notes** for full background.

---

## 2. Standard Question & Answer Template

Every interview question in `Interview-Prep/` should follow this format:

````markdown
### Q: [Exact Interview Question]?
`[Level: Junior | Mid | Senior]` `[Frequency: High | Medium]`

- **Related Learning Note:** [Topic Note Name](file:///path/to/learning/note.md)

#### 30-Second Spoken Answer
> "Say this out loud in 2–3 clear sentences. Start with a direct definition, then mention why it matters."

#### Key Points to Mention
- Point 1: Essential technical fact.
- Point 2: Real-world practical application.
- Point 3: Trade-off or comparison.

#### Minimal Code / Command (if asked)
```<language>
// Minimal snippet showing you know the syntax
```

#### Common Follow-Up Questions
- *"What happens if...?"* → 1-sentence quick answer.
- *"How does this differ from...?"* → 1-sentence quick answer.
````

---

## 3. Answer Guidelines

- **Lead with the Direct Answer:** Never waffle or start with "Well, it depends...". Give the concrete answer first, then explain the nuances.
- **Use the Rule of 3:** Structure explanations with 3 punchy points (e.g., "There are three key reasons: 1..., 2..., and 3...").
- **Mention Trade-offs:** Senior answers highlight pros, cons, and when NOT to use something.
- **Categorize by Topic:** Place questions in dedicated subfolders (e.g., `Interview-Prep/Docker/`, `Interview-Prep/Redis/`, `Interview-Prep/System-Design/`).
