# Node.js Streams & Buffers

> Streams process data piece by piece (in chunks) without loading the entire dataset into memory at once.

---

## 1. Key Takeaways (TL;DR)

- **Buffer:** A temporary chunk of raw binary memory allocated outside V8's heap.
- **Stream:** A continuous sequence of chunks moving from a source to a destination.
- **4 Types of Streams:** Readable (source), Writable (destination), Duplex (both), and Transform (modifies chunks).
- Using streams keeps memory usage tiny, even when processing a 10GB video or log file.

---

## 2. Why & When to Use

- **Why:** `fs.readFile()` loads the entire file into RAM. A 2GB file will crash your Node app if your server has 1GB RAM.
- **When:** Use streams for file uploads, video streaming, large database exports, and log processing.

### Simple Analogy
- **Buffer** is a bucket of water.
- **Stream** is a garden hose. Water flows continuously without needing a giant pool.

---

## 3. Minimal Example

Piping a large file from disk directly to an HTTP response:

```javascript
import http from 'node:http';
import fs from 'node:fs';

const server = http.createServer((req, res) => {
  // Good: Streams the file in small 64KB chunks
  const readStream = fs.createReadStream('./huge-dataset.csv');

  // Headers
  res.writeHead(200, { 'Content-Type': 'text/csv' });

  // Connect source stream to destination stream
  readStream.pipe(res);

  readStream.on('error', (err) => {
    res.statusCode = 500;
    res.end('File read error');
  });
});

server.listen(3000);
```

Using the modern `pipeline` utility with Promises:

```javascript
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

// Compresses a file into gzip with automatic cleanup on error
await pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('input.txt.gz')
);
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Using `.pipe()` without error handling. Unhandled stream errors can leak memory.
  - _Fix:_ Use `pipeline()` from `node:stream/promises`. It automatically destroys all streams if one fails.
- **Tip:** Default chunk size for a file stream is 64KB (`highWaterMark`).

---

## 5. Quick Reference

| Stream Type | Example Source | Method / Event |
| :--- | :--- | :--- |
| **Readable** | `fs.createReadStream()`, `req` | `.on('data')`, `.pipe()` |
| **Writable** | `fs.createWriteStream()`, `res` | `.write()`, `.end()` |
| **Transform** | `zlib.createGzip()`, crypto hash | Modifies chunk on the fly |
| **Pipeline** | `pipeline(source, transform, dest)` | Safely connects streams |
