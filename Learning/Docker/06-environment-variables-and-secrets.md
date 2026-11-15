# Docker Environment Variables & Secrets

> Environment variables allow you to configure containers dynamically at runtime without hardcoding sensitive credentials in images.

---

## 1. Key Takeaways (TL;DR)

- **`ENV` (Runtime):** Variables that persist inside the running container and are visible to your application.
- **`ARG` (Build-time):** Variables passed only during `docker build`; they do not exist inside running containers.
- Pass variables dynamically at runtime using `-e KEY=VALUE` or `--env-file .env`.
- **Golden Rule:** Never hardcode passwords, API keys, or database URLs inside a `Dockerfile` or push `.env` files to public registries.

---

## 2. Why & When to Use

- **Why:** The Twelve-Factor App methodology states that configuration must be strictly separated from code.
- **When:** Use environment variables for database URLs, port numbers, log levels, and third-party API keys across development, staging, and production.

---

## 3. Minimal Example

### A. Passing Variables at Runtime via CLI

```bash
# Pass a single variable
docker run -d -p 3000:3000 -e PORT=3000 -e NODE_ENV=production my-node-app

# Pass a whole file of variables using --env-file
docker run -d -p 3000:3000 --env-file .env.production my-node-app
```

### B. In Dockerfile (`ARG` vs `ENV`)

```dockerfile
FROM node:20-alpine
WORKDIR /app

# 1. ARG is only available during build time (e.g., choosing npm version)
ARG APP_VERSION=1.0.0
RUN echo "Building version: $APP_VERSION"

# 2. ENV is available to your app code when the container runs
ENV PORT=3000
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### C. In Docker Compose (`compose.yaml`)

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    # Read variables from local .env file
    env_file:
      - .env
    # Or set explicit environment variables
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres-db
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Using `COPY .env .env` in your `Dockerfile`.
  - _Fix:_ Add `.env` to your `.dockerignore` file. Anyone who downloads your image can extract `.env` and steal secrets. Inject `.env` only at runtime using `--env-file` or Docker Compose.
- **Mistake:** Using `ARG` to pass production passwords during `docker build`.
  - _Fix:_ Values passed to `ARG` are permanently recorded in the image build history (`docker history <image>`). Pass secrets at runtime only.

---

## 5. Quick Reference

| Flag / Directive | Lifecycle Phase | Example Syntax |
| :--- | :--- | :--- |
| `-e KEY=VAL` | Container Runtime | `docker run -e DB_PORT=5432 app` |
| `--env-file <file>` | Container Runtime | `docker run --env-file .env app` |
| `ENV KEY=VAL` | Image Build & Runtime | `ENV NODE_ENV=production` in Dockerfile |
| `ARG KEY=VAL` | Image Build ONLY | `ARG VERSION=1.0` in Dockerfile |
| `env_file:` | Docker Compose Runtime | `env_file: [.env]` in compose.yaml |
