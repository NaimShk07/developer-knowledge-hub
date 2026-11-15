# Dockerfile & Building Images

> A Dockerfile is a simple text file with step-by-step instructions to create a custom Docker image.

---

## 1. Key Takeaways (TL;DR)

- Every line in a Dockerfile creates a new layer in your image.
- `FROM` picks your starting foundation (like Node, Python, or Ubuntu).
- `COPY` moves your project files from your computer into the image.
- `RUN` executes commands during the build phase.
- `CMD` specifies what command starts your app when the container runs.

---

## 2. Why & When to Use

- **Why:** It automates your environment setup into reproducible code.
- **When:** Use a Dockerfile whenever you want to containerize your own application.

---

## 3. Minimal Example

A minimal `Dockerfile` for a Node.js app:

```dockerfile
# 1. Base image
FROM node:20-alpine

# 2. Set work directory inside container
WORKDIR /app

# 3. Copy package files first for fast caching
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the source code
COPY . .

# 5. Tell Docker the port the app uses
EXPOSE 3000

# 6. Default command to start the app
CMD ["node", "index.js"]
```

Build and run this image:

```bash
# Build the image and tag it as 'my-node-app'
docker build -t my-node-app .

# Run the container
docker run -p 3000:3000 my-node-app
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Confusing `RUN` with `CMD`.
  - _Fix:_ `RUN` executes once when **building** the image. `CMD` executes every time a container **starts**.
- **Tip:** Use a `.dockerignore` file. Ignore `node_modules`, `.git`, and `.env` so images build faster and stay small.

---

## 5. Quick Reference

| Instruction | What It Does                             |
| :---------- | :--------------------------------------- |
| `FROM`      | Sets the base image                      |
| `WORKDIR`   | Sets the working folder inside container |
| `COPY`      | Copies files from host to container      |
| `RUN`       | Runs shell commands during build         |
| `ENV`       | Sets environment variables               |
| `EXPOSE`    | Documents the network port               |
| `CMD`       | Default command when container launches  |
