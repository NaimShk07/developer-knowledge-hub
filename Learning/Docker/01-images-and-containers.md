# Docker Images vs Containers

> An image is the frozen recipe, and a container is the active running cake.

---

## 1. Key Takeaways (TL;DR)

- **Image:** A read-only template with code, libraries, and tools.
- **Container:** A running instance created from an image.
- You can start many containers from one single image.
- When you delete a container, its image is still safe.

---

## 2. Why & When to Use

- **Why:** You build an image once. Anyone can run it anywhere without installing dependencies.
- **When:** Use an image whenever you want to package code. Run a container whenever you want to test or execute that code.

### Simple Analogy

- **Image** = Class in code (or a cookie cutter).
- **Container** = Object in memory (or a real cookie).

---

## 3. Minimal Example

Run a test container from the official `hello-world` image:

```bash
# Pull the image and run it as a container
docker run hello-world
```

Run a lightweight Linux container interactively:

```bash
# -i = interactive, -t = pseudo-terminal, --rm = delete container on exit
docker run -it --rm alpine sh
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Editing files inside a running container and expecting them to stay in the image.
  - _Fix:_ Containers do not change their base image. Change your Dockerfile to update the image.
- **Tip:** Use `docker ps` to see active containers and `docker images` to see saved images.

---

## 5. Quick Reference

| Command                    | What It Does                              |
| :------------------------- | :---------------------------------------- |
| `docker images`            | List all local images                     |
| `docker pull <image>`      | Download an image from Docker Hub         |
| `docker run <image>`       | Create and start a container              |
| `docker ps`                | List running containers                   |
| `docker ps -a`             | List all containers (running and stopped) |
| `docker rm <container_id>` | Remove a stopped container                |
| `docker rmi <image_id>`    | Remove a local image                      |
