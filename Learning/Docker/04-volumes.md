# Docker Volumes & Data Storage

> Volumes are dedicated storage areas outside a container that keep your data safe even if the container is destroyed.

---

## 1. Key Takeaways (TL;DR)

- By default, container storage is temporary. Deleting a container deletes its data.
- Volumes save data permanently on your host machine.
- **Named Volume:** Managed completely by Docker (best for databases).
- **Bind Mount:** Links a specific folder on your computer into the container (best for live code development).

---

## 2. Why & When to Use

- **Why:** You never want a database container crash to wipe out your users or data.
- **When:** Use volumes for databases, user uploads, logs, or hot-reloading code during local development.

---

## 3. Minimal Example

### A. Named Volume (Best for Databases)

Run a PostgreSQL database with a persistent volume:

```bash
# Create a named volume called 'pg-data' and mount it to postgres data folder
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=secret \
  -v pg-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres
```

Even if you run `docker rm -f my-postgres`, your data in `pg-data` remains intact.

### B. Bind Mount (Best for Live Coding)

Mount your current folder into the container so file changes update immediately:

```bash
# -v $(pwd):/app links your project folder into /app inside container
docker run -d -p 3000:3000 -v $(pwd):/app -w /app node:20-alpine npm run dev
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Storing database records inside the container without a volume.
  - _Fix:_ Always mount a volume to the data directory of database images.
- **Tip:** View all existing volumes on your machine with `docker volume ls`.

---

## 5. Quick Reference

| Command / Syntax                  | What It Does                        |
| :-------------------------------- | :---------------------------------- |
| `-v <vol_name>:<container_path>`  | Mounts a named volume               |
| `-v <host_path>:<container_path>` | Mounts a local folder (bind mount)  |
| `docker volume ls`                | Lists all volumes                   |
| `docker volume create <name>`     | Creates a new named volume manually |
| `docker volume inspect <name>`    | Shows detailed volume information   |
| `docker volume prune`             | Deletes all unused volumes          |
