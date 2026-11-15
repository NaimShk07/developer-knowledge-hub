# Docker Port Mapping & Networking

> Port mapping links a port on your computer to a port inside the isolated container.

---

## 1. Key Takeaways (TL;DR)

- Containers run in their own isolated network by default.
- Your computer cannot see container apps without port forwarding.
- The syntax is always `-p <Host_Port>:<Container_Port>`.
- Multiple containers can talk to each other by name on a custom Docker network.

---

## 2. Why & When to Use

- **Why:** To view a web server or API running inside a container from your computer's browser.
- **When:** Use port mapping whenever your container exposes a web server, API, or database.

---

## 3. Minimal Example

Start an Nginx web server and view it on port `8080`:

```bash
# Host Port 8080 -> Container Port 80
docker run -d -p 8080:80 --name my-web nginx
```

Now open `http://localhost:8080` in your browser. You will see the default Nginx welcome page.

Connect two containers using a custom network:

```bash
# 1. Create a network
docker network create app-net

# 2. Run database on that network
docker run -d --name db --network app-net redis

# 3. Another container can reach it using the name 'db'
docker run -it --rm --network app-net redis redis-cli -h db ping
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Mixing up the port order in `-p`.
  - _Fix:_ Remember **H:C** (Host first, Container second). Host is your machine, Container is inside.
- **Tip:** If port `8080` is already in use by another app on your computer, just change the first number: `-p 9090:80`.

---

## 5. Quick Reference

| Flag / Command                 | What It Does                                     |
| :----------------------------- | :----------------------------------------------- |
| `-p 3000:3000`                 | Exposes port 3000 to your computer               |
| `-d`                           | Runs container in the background (detached mode) |
| `--name <name>`                | Assigns a custom name to the container           |
| `docker network create <name>` | Creates an isolated virtual network              |
| `docker network ls`            | Lists existing Docker networks                   |
