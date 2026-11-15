# Learning Notes Guidelines

## Scope
This rule applies when creating, editing, or summarizing notes, concepts, and documentation inside the `Learning/` directory.

## Core Principle: Simple & Short English
Write all notes in simple, plain, and concise English. Notes should be fast to read, effortless to understand, and easy to recall.

---

## 1. Writing Style & Tone

- **Simple Words**: Use everyday English. Avoid academic jargon, unnecessarily complex terms, or overly formal phrases.
- **Short Sentences**: Keep sentences direct and concise (ideally under 15–20 words). One clear thought per sentence.
- **Short Paragraphs**: Maximum 2 to 3 sentences per paragraph. Never write large blocks of text.
- **Active Voice**: Be direct and instructional:
  - *Good:* "Use `map()` to transform each element in the list."
  - *Avoid:* "The transformation of elements within the list structure may be accomplished by utilizing the `map()` higher-order function."
- **Easy Analogies**: Use simple, real-world analogies to explain abstract concepts.

---

## 2. Standard Note Template

When writing a note file in `Learning/` (e.g., `Learning/<topic>/<concept>.md`), follow this structure:

````markdown
# [Concept / Topic Name]

> One simple sentence explaining what this is.

## 1. Key Takeaways (TL;DR)
- Main point 1 in simple words
- Main point 2 in simple words
- Main point 3 in simple words

## 2. Why & When to Use
- **Why:** Benefit or problem it solves.
- **When:** Typical scenario where you should use it.

## 3. Minimal Example
```<language>
// Short, clean, working example
// Only include the essential code
```

## 4. Common Mistakes & Tips
- **Watch out:** Common beginner mistake and how to fix it.
- **Tip:** Quick best practice.

## 5. Quick Reference
| Feature / Syntax | What It Does |
| :--- | :--- |
| `example()` | Short explanation |
````

---

## 3. Formatting & Organization

- **Scannable Layout**: Use bullet points, bold keywords, and tables instead of long narrative paragraphs.
- **Clean Code Blocks**: Keep code snippets minimal, free of boilerplate, and clearly commented on crucial lines.
- **File Naming**: Use lowercase hyphenated file names (e.g., `async-await.md`, `binary-search.md`, `git-basics.md`).
- **Focus on Practical Use**: Prioritize "how it works" and "how to use it" over deep theoretical background unless requested.
