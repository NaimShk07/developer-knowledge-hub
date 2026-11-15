# Docker Compose

> Docker Compose is a tool to define and run multi-container applications using a single YAML configuration file.

---

## 1. Key Takeaways (TL;DR)

- Replaces long, complex `docker run` commands with one readable file (`compose.yaml`).
- Configures web apps, databases, cache, and networks together.
- Starts everything with `docker compose up`.
- Stops everything cleanly with `docker compose down`.

---

## 2. Why & When to Use

- **Why:** Typing 5 different `docker run` commands with ports, volumes, and networks is slow and error-prone.
- **When:** Use Docker Compose for any app that needs more than one service (e.g., frontend + backend + database).

---

## 3. Minimal Example

Create a file named `compose.yaml`:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

Commands to manage this multi-service app:

```bash
# Start all containers in background
docker compose up -d

# View live logs from all containers
docker compose logs -f

# Stop and remove all containers and networks
docker compose down
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Trying to connect to `localhost:5432` from the web container.
  - _Fix:_ Inside Compose, containers use the service name as their hostname (e.g., `db:5432`), not `localhost`.
- **Tip:** Use `docker compose down -v` if you also want to delete all volumes and reset database data.

---

## 5. Quick Reference

| Command                            | What It Does                                             |
| :--------------------------------- | :------------------------------------------------------- |
| `docker compose up -d`             | Builds, creates, and starts all containers in background |
| `docker compose down`              | Stops and removes containers and networks                |
| `docker compose ps`                | Lists status of containers in current compose file       |
| `docker compose logs -f`           | Follows real-time logs from all services                 |
| `docker compose restart <service>` | Restarts a single service                                |
