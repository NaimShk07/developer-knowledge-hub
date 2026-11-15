# Experiment: Docker Nginx Bind Mount & Live Editing

> **Concept Tested:** [Learning/Docker/04-volumes.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/04-volumes.md) & [Learning/Docker/03-ports-and-networking.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/03-ports-and-networking.md)

## Objective
Verify that modifying an HTML file on the host computer instantly updates inside a running container without rebuilding the image or restarting the container.

## How to Run

```bash
# 1. Start the container in background
docker compose up -d

# 2. Open in browser
open http://localhost:8080

# 3. Edit html/index.html and refresh your browser!
```

## How to Tear Down
```bash
docker compose down
```

## Key Finding
Bind mount syntax `./html:/usr/share/nginx/html:ro` mounts the local folder as read-only inside the container, keeping your local host files in sync in real time.
