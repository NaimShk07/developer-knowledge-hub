# Docker & Compose Cheatsheet

> Quick reference for everyday Docker commands, options, and Compose syntax.  
> **Deep Dive:** [Learning/Docker/](../../Learning/Docker/README.md) | **Interview Q&A:** [Docker Interview Q&A](../../Interview-Prep/Docker/docker-interview-qa.md)

---

## 1. Top 10 Most Used Commands

| Command                                       | What It Does                                         |
| :-------------------------------------------- | :--------------------------------------------------- |
| `docker run -d -p <host>:<container> <image>` | Run container in background with port mapping        |
| `docker ps`                                   | List running containers                              |
| `docker ps -a`                                | List all containers (including stopped)              |
| `docker stop <id/name>`                       | Stop a running container gracefully                  |
| `docker rm <id/name>`                         | Remove a stopped container                           |
| `docker logs -f <id/name>`                    | Follow real-time container output                    |
| `docker exec -it <id/name> sh`                | Open an interactive shell inside a running container |
| `docker build -t <name>:<tag> .`              | Build image from Dockerfile in current folder        |
| `docker images`                               | List all local images                                |
| `docker system prune -a`                      | Clean up all unused containers, images, and networks |

---

## 2. Managing Volumes & Storage

| Command                        | What It Does                                  |
| :----------------------------- | :-------------------------------------------- |
| `docker volume ls`             | List all named volumes                        |
| `docker volume create <name>`  | Create a new named volume                     |
| `docker volume inspect <name>` | Show physical storage path on disk            |
| `docker volume prune`          | Delete all unused volumes                     |
| `-v <name>:<container_path>`   | Mount named volume into container             |
| `-v $(pwd):<container_path>`   | Bind mount current host folder into container |

---

## 3. Docker Compose Essentials

| Command                            | What It Does                                      |
| :--------------------------------- | :------------------------------------------------ |
| `docker compose up -d`             | Build and start all services in the background    |
| `docker compose down`              | Stop and remove containers and networks           |
| `docker compose down -v`           | Stop containers AND delete all associated volumes |
| `docker compose ps`                | Check status of services                          |
| `docker compose logs -f <service>` | Stream logs for a specific service                |
| `docker compose restart <service>` | Restart a single container                        |

---

## 4. Environment Variables & Configuration

| Flag / Instruction      | Phase          | What It Does                                      |
| :---------------------- | :------------- | :------------------------------------------------ |
| `-e KEY="val"`          | `docker run`   | Pass environment variable at container startup    |
| `--env-file <path>`     | `docker run`   | Load file of variables (`.env`) into container    |
| `ENV KEY="val"`         | `Dockerfile`   | Set persistent default variable in image          |
| `ARG KEY="val"`         | `Dockerfile`   | Define variable available only during image build |
| `--build-arg KEY="val"` | `docker build` | Supply build-time value for an `ARG`              |

---

## 5. Copy-Paste Compose Template

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```
