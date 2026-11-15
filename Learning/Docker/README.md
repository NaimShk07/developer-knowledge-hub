# Docker Learning Notes

A beginner-friendly guide to core Docker concepts, written in simple and short English.

---

## What is Docker?

> Docker is a tool that packages an application and everything it needs into a single box that runs on any computer.

### The Problem Docker Solves

- **Before Docker:** "It works on my machine, but not on yours or the server."
- **With Docker:** It works the same everywhere because the entire environment moves together.

---

## Core Topics

| #   | Topic                         | File                                                                                                                | What You Learn                                            |
| :-- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------- |
| 0   | **Containers vs VMs**         | [00-containers-vs-virtual-machines.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/00-containers-vs-virtual-machines.md) | How containers differ from Virtual Machines and hypervisors. |
| 1   | **Images vs Containers**      | [01-images-and-containers.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/01-images-and-containers.md) | The difference between the blueprint and the running app. |
| 2   | **Dockerfile**                | [02-dockerfile.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/02-dockerfile.md)                       | How to write instructions to build your own image.        |
| 3   | **Port Mapping & Networking** | [03-ports-and-networking.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/03-ports-and-networking.md)   | How to access container apps in your browser.             |
| 4   | **Volumes & Data Storage**    | [04-volumes.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/04-volumes.md)                             | How to keep data safe when containers stop.               |
| 5   | **Docker Compose**            | [05-docker-compose.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/05-docker-compose.md)               | How to run multiple containers together easily.           |
| 6   | **Environment & Secrets**     | [06-environment-variables-and-secrets.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/06-environment-variables-and-secrets.md) | Injecting runtime config without hardcoding credentials.  |

---

## Essential Commands Cheat Sheet

| Command                          | What It Does                                       |
| :------------------------------- | :------------------------------------------------- |
| `docker run -d -p 8080:80 nginx` | Run a container in background with port forwarding |
| `docker ps`                      | List all running containers                        |
| `docker ps -a`                   | List all containers (including stopped ones)       |
| `docker stop <id_or_name>`       | Stop a running container                           |
| `docker build -t my-app .`       | Build an image from a Dockerfile                   |
| `docker compose up -d`           | Start all services defined in `docker-compose.yml` |
| `docker compose down`            | Stop and remove all Compose containers             |
