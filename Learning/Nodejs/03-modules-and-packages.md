# Node.js Modules & Package System

> Modules break complex programs into small, reusable, and maintainable files.

---

## 1. Key Takeaways (TL;DR)

- Node.js supports two module systems: **CommonJS (CJS)** and **ECMAScript Modules (ESM)**.
- **CommonJS:** The legacy standard using `require()` and `module.exports`.
- **ES Modules:** The modern JavaScript standard using `import` and `export`.
- Add `"type": "module"` in `package.json` to enable ESM across your project.
- Prefix built-in modules with `node:` (e.g., `node:fs`, `node:path`) for safety and speed.

---

## 2. Why & When to Use

- **Why:** Keeps code organized, testable, and prevents global scope pollution.
- **When:** Use ES Modules for all new projects. Use CommonJS when maintaining older codebases or specific tools.

---

## 3. Minimal Example

### Modern ES Modules (`"type": "module"` in `package.json`)

```javascript
// math.js - Named export
export function add(a, b) {
  return a + b;
}

// Default export
export default function multiply(a, b) {
  return a * b;
}
```

```javascript
// index.js - Importing
import multiply, { add } from './math.js';
import path from 'node:path';

console.log(add(2, 3));      // 5
console.log(multiply(4, 5)); // 20
```

### Legacy CommonJS (`.cjs` or default without `"type": "module"`)

```javascript
// math.cjs
function add(a, b) { return a + b; }
module.exports = { add };

// index.cjs
const { add } = require('./math.cjs');
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Trying to use `require()` inside an ES Module file.
  - _Fix:_ Use `import` instead, or use `createRequire` if you must load a CJS file dynamically.
- **Tip:** In ES Modules, always specify the file extension in local imports: `import './utils.js'`.

---

## 5. Quick Reference

| Feature | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Import Syntax** | `const x = require('x')` | `import x from 'x'` |
| **Export Syntax** | `module.exports = ...` | `export default ...` |
| **Loading** | Synchronous | Asynchronous |
| **Top-Level Await** | No (requires async wrapper) | Yes (supported natively) |
| **Enable in project** | Default | `"type": "module"` in `package.json` |
