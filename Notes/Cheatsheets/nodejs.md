# Node.js Cheatsheet

> Quick reference for everyday Node.js CLI commands, flags, built-in modules, and snippets.  
> **Deep Dive:** [Learning/Nodejs/](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/README.md) | **Interview Q&A:** [Node.js Interview Q&A](file:///Users/nayemuddinshaikh/Developer/Interview-Prep/Nodejs/nodejs-interview-qa.md)

---

## 1. Top 10 CLI Commands & Modern Flags

| Command / Flag                  | What It Does                                              |
| :------------------------------ | :-------------------------------------------------------- |
| `node index.js`                 | Run a JavaScript file                                     |
| `node --watch index.js`         | Auto-restart process when files change (built-in nodemon) |
| `node --env-file=.env index.js` | Load environment variables without `dotenv` package       |
| `node --check index.js`         | Syntax check without executing code                       |
| `node -e "<code>"`              | Evaluate and run inline JavaScript string                 |
| `node --test`                   | Run native Node.js test runner files (`*.test.js`)        |
| `node -v`                       | Print installed Node.js version                           |
| `npm init -y`                   | Initialize a new `package.json` with defaults             |
| `npm install <pkg>`             | Install dependency into `node_modules`                    |
| `npm run <script>`              | Execute custom script from `package.json`                 |

---

## 2. Essential Built-in Modules

### `node:fs/promises` (File System)

```javascript
import fs from "node:fs/promises";

// Read text file
const content = await fs.readFile("data.json", "utf-8");

// Write / overwrite file
await fs.writeFile("output.txt", "Hello World", "utf-8");

// Append to file
await fs.appendFile("log.txt", "New entry\n");

// Check if file exists
import { access, constants } from "node:fs/promises";
const exists = await access("file.txt", constants.F_OK)
  .then(() => true)
  .catch(() => false);
```

### `node:path` (Cross-Platform Paths)

```javascript
import path from "node:path";

// Join paths safely (handles Windows \ and Mac/Linux /)
const fullPath = path.join("folder", "subfolder", "file.txt");

// Get absolute path
const absPath = path.resolve("file.txt");

// Extract extension
const ext = path.extname("photo.png"); // '.png'
```

### `node:crypto` (Fast Hashes & UUIDs)

```javascript
import crypto from "node:crypto";

// Generate random UUID v4
const id = crypto.randomUUID();

// Fast SHA-256 hash
const hash = crypto.createHash("sha256").update("password123").digest("hex");
```

---

## 3. Minimal HTTP Server Snippet

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
```

---

## 4. Modern `package.json` Baseline

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env src/index.js",
    "start": "node src/index.js",
    "test": "node --test"
  }
}
```
