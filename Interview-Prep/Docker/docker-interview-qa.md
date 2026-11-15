# Docker Interview Questions & Answers

High-frequency Docker interview questions with crisp 30-second spoken answers and direct links to deep-dive notes in the `Learning/` folder.

---

### Q1: What is the difference between a Docker Image and a Container?
`[Level: Junior]` `[Frequency: Very High]`

- **Related Learning Note:** [01-images-and-containers.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/01-images-and-containers.md)

#### 30-Second Spoken Answer
> "A Docker Image is an immutable, read-only template containing the application code, runtime, and system dependencies. A Docker Container is a running, isolated instance created from that image, with a thin writable layer on top."

#### Key Points to Mention
1. **Blueprint vs Instance:** An image is like a class in OOP; a container is the instantiated object.
2. **Immutability:** Modifying files inside a container does not change the parent image.
3. **One-to-Many:** A single image can spawn dozens of identical containers.

#### Minimal Command Demonstration
```bash
# Image to Container
docker run -d --name web-1 nginx
docker run -d --name web-2 nginx
```

#### Common Follow-Up Questions
- *"Where is the container's writable state stored?"* → In the thin container storage layer (managed by the storage driver, like overlay2).
- *"How do you persist container state permanently?"* → Using Docker Volumes or Bind Mounts.

---

### Q2: How does `RUN` differ from `CMD` and `ENTRYPOINT` in a Dockerfile?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [02-dockerfile.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/02-dockerfile.md)

#### 30-Second Spoken Answer
> "`RUN` executes during the image build stage to install packages and build layers. `CMD` provides the default command executed when the container starts up and can be overridden from the CLI. `ENTRYPOINT` configures the primary executable that is always run and cannot easily be overridden."

#### Key Points to Mention
1. **Lifecycle difference:** `RUN` runs at build time; `CMD` and `ENTRYPOINT` run at container runtime.
2. **Best Practice combination:** Use `ENTRYPOINT` for the fixed binary (e.g., `["npm"]`) and `CMD` for default arguments (e.g., `["start"]`), allowing users to easily override args.

#### Minimal Code Example
```dockerfile
# Build time: installs dependencies
RUN npm install

# Run time: default executable and arguments
ENTRYPOINT ["node"]
CMD ["server.js"]
```

#### Common Follow-Up Questions
- *"What happens if you supply arguments at `docker run`?"* → They replace `CMD`, but get passed as arguments to `ENTRYPOINT`.

---

### Q3: What is the difference between a Volume and a Bind Mount?
`[Level: Mid]` `[Frequency: High]`

- **Related Learning Note:** [04-volumes.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/04-volumes.md)

#### 30-Second Spoken Answer
> "A Volume is completely managed by Docker inside Docker's dedicated storage directory, making it portable and secure for databases. A Bind Mount mounts any arbitrary file or folder from the host file system directly into the container, which is ideal for hot-reloading code during local development."

#### Key Points to Mention
1. **Host Dependency:** Bind mounts depend on host directory structures and permissions; Volumes are host-independent.
2. **Performance:** Volumes have better I/O performance on Docker Desktop (macOS/Windows) because they avoid OS file-sharing overhead.
3. **Lifecycle:** Neither is deleted when a container is removed.

#### Minimal Command Demonstration
```bash
# Named Volume (production databases)
docker run -v db-data:/var/lib/postgresql/data postgres

# Bind Mount (local development)
docker run -v $(pwd):/app -w /app node:20-alpine npm run dev
```

---

### Q4: How do containers communicate with each other on the same host?
`[Level: Mid-Senior]` `[Frequency: High]`

- **Related Learning Note:** [03-ports-and-networking.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/03-ports-and-networking.md)

#### 30-Second Spoken Answer
> "By default, containers can talk to each other if attached to the same custom user-defined bridge network. Docker provides automatic internal DNS, so containers can resolve and reach each other directly using their container or service names without exposing ports to the host."

#### Key Points to Mention
1. **Internal DNS:** On a custom network, `ping db` resolves to the `db` container's internal IP.
2. **Security:** You do not need to use `-p` (port mapping) for internal database traffic—only expose ports that outside users need to access.
3. **Default Bridge Limitation:** The default bridge network (`bridge`) does NOT support automatic DNS resolution by container name; you must create a custom bridge network.

---

### Q5: What is Docker Compose and when should you use it?
`[Level: Junior-Mid]` `[Frequency: High]`

- **Related Learning Note:** [05-docker-compose.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/05-docker-compose.md)

#### 30-Second Spoken Answer
> "Docker Compose is an orchestration tool for defining and running multi-container applications using a declarative YAML file. It allows you to configure services, networks, and volumes in one place and spin up the entire application stack with a single `docker compose up` command."

#### Key Points to Mention
1. **Single Command Management:** Starts, stops, and rebuilds multi-tier applications (frontend, backend, database).
2. **Automatic Networking:** Compose automatically creates a shared default network so all services reach each other by service name.
3. **Environment Parity:** Ensures every developer on the team runs the exact same local services.

---

### Q6: How does a Docker Container differ from a Virtual Machine?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [00-containers-vs-virtual-machines.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/00-containers-vs-virtual-machines.md)

#### 30-Second Spoken Answer
> "Virtual Machines virtualize physical hardware through a hypervisor, requiring each VM to boot a complete, separate guest operating system. Containers virtualize at the operating system level, sharing the host Linux kernel while isolating processes via namespaces and cgroups, making them start in milliseconds and consume drastically less memory."

#### Key Points to Mention
1. **Kernel Sharing:** All containers on a host share the same Linux kernel, meaning there is zero guest OS overhead.
2. **Resource Footprint:** A container image can be as small as 5MB (Alpine) and use only the RAM needed by the app; a VM requires several gigabytes of storage and pre-allocated RAM.
3. **Startup Time:** Containers launch in milliseconds because they are simply isolated host processes; VMs take minutes to boot a full OS.

#### Common Follow-Up Questions
- *"What Linux primitives power containers?"* → **Namespaces** (for process, network, and mount isolation) and **cgroups** (control groups for CPU, memory, and I/O resource limiting).

---

### Q7: What is the difference between `ARG` and `ENV`, and how should you pass production secrets?
`[Level: Mid-Senior]` `[Frequency: Very High]`

- **Related Learning Note:** [06-environment-variables-and-secrets.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/06-environment-variables-and-secrets.md)

#### 30-Second Spoken Answer
> "`ARG` defines a build-time variable that only exists while the image is being built and is not accessible inside running containers. `ENV` defines a runtime variable that persists inside the container. Production secrets should never be placed in `ARG` or baked into a `Dockerfile`, but should instead be injected at runtime using `-e`, `--env-file`, or a secret manager."

#### Key Points to Mention
1. **Security Risk with `ARG`:** Arguments passed to `ARG` are permanently recorded in the image metadata and can be viewed by anyone using `docker history <image>`.
2. **Dockerignore:** Always add `.env` files to `.dockerignore` so local development credentials are never copied into the image layers.
3. **Runtime Injection:** Pass secrets dynamically at startup via environment variables (`--env-file`) or Docker Compose secrets.

