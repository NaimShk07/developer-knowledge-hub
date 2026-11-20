# Networking, Gateways & Load Balancers (SDE-1 Perspective)

> **Related Files:**  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/system-design.md](../../Notes/Cheatsheets/system-design.md)  
> - 🎯 **Interview Q&A:** [Interview-Prep/System-Design/networking-load-balancers-qa.md](../../Interview-Prep/System-Design/networking-load-balancers-qa.md)  
> - 🗺️ **Week 1 Tracker:** [Learning/Roadmap-Week-1.md](../Roadmap-Week-1.md)

---

## 1. The End-to-End Request-Response Lifecycle

In almost every FAANG SDE-1 backend round, you will be asked: *"What happens when a user types `https://api.example.com/items` into their browser?"*

```text
[Browser / Client]
       │
  1. DNS Resolution (Browser cache -> OS cache -> Resolver -> Root/TLD/Authoritative) -> IP: 198.51.100.1
       │
  2. TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)
       │
  3. TLS / HTTPS Handshake (Certificate verification, Session key exchange)
       │
  4. HTTP Request Sent (GET /items HTTP/1.1 + Headers + Cookies)
       │
       ▼
[Load Balancer] ── 5. Health checks & Algorithm routes to healthy node
       │
       ▼
[API Gateway]   ── 6. SSL Termination, Rate Limiting, Authentication / JWT validation
       │
       ▼
[Stateless App] ── 7. Express.js routes to controller -> queries Cache/DB -> returns JSON
```

---

## 2. API Gateway: The Front Door of the Backend

An **API Gateway** acts as the single entry point for all client applications into your backend infrastructure.

### Core Responsibilities
1. **Reverse Proxy & Routing:** Inspects incoming URL paths (e.g., `/users/*` $\rightarrow$ User Service; `/orders/*` $\rightarrow$ Order Service).
2. **Authentication & Authorization:** Validates JWT access tokens or API keys upfront before forwarding requests to internal services.
3. **Rate Limiting & Throttling:** Protects backend services against DDoS attacks or abusive clients using algorithms like **Token Bucket** or **Leaky Bucket** (e.g. 100 requests/minute per IP).
4. **SSL / TLS Termination:** Decrypts incoming HTTPS traffic at the perimeter so internal services communicate over lightweight HTTP/gRPC.
5. **Observability & Logging:** Centralizes access logs, request metrics, distributed tracing (`X-Request-ID`), and error tracking.

---

## 3. Load Balancers: L4 vs L7 & Balancing Algorithms

A **Load Balancer (LB)** distributes incoming network traffic across a cluster of backend servers to ensure high availability, fault tolerance, and responsiveness.

```text
                         ┌───────────────────────┐
                         │   Incoming Traffic    │
                         └───────────┬───────────┘
                                     │
                             ┌───────▼───────┐
                             │ Load Balancer │
                             └───┬───┬───┬───┘
                                 │   │   │
                   ┌─────────────┘   │   └─────────────┐
                   ▼                 ▼                 ▼
             ┌───────────┐     ┌───────────┐     ┌───────────┐
             │ Node 1    │     │ Node 2    │     │ Node 3    │
             │ (Healthy) │     │ (Healthy) │     │ (Healthy) │
             └───────────┘     └───────────┘     └───────────┘
```

### Layer 4 (Transport Layer) vs Layer 7 (Application Layer)

| Feature | L4 Load Balancer (TCP / UDP) | L7 Load Balancer (HTTP / HTTPS) |
| :--- | :--- | :--- |
| **OSI Layer** | Layer 4 (Transport) | Layer 7 (Application) |
| **Inspection Depth** | Inspects IP address & Port only | Inspects HTTP headers, cookies, URL path, payload |
| **Routing Capability** | IP/Port routing only | Content-based routing (`/api/v1/checkout` vs `/static/*`) |
| **Performance** | Ultra-fast (no payload decryption/parsing) | Slightly higher CPU overhead (decrypts TLS & parses HTTP) |
| **Popular Tech** | AWS NLB (Network LB), HAProxy L4, IPVS | AWS ALB (Application LB), Nginx, Envoy, Traefik |

### Balancing Algorithms for SDE-1
1. **Round Robin:** Requests are distributed sequentially across servers ($1 \rightarrow 2 \rightarrow 3 \rightarrow 1$).
   - *Best for:* Uniform request workloads across homogeneous servers.
2. **Least Connections:** Routes traffic to the server with the fewest active open connections.
   - *Best for:* Requests with long or highly variable processing times (e.g., long-polling, file uploads).
3. **IP Hash (Source IP Hash):** Hashes the client's IP address to map them consistently to the same server.
   - *Best for:* Legacy stateful applications requiring a primitive form of session stickiness.

---

## 4. Stateless vs Stateful Architecture

This is the single most important architectural pattern enabling horizontal scale.

```text
Stateful Architecture (Anti-Pattern for Scaling):
[Client] ──> [Node 1 (Session in RAM)]  <-- If Node 1 crashes, user is logged out!
[Client] ──> [Node 2 (No session!)]    <-- 401 Unauthorized!

Stateless Architecture (The Modern Cloud Standard):
[Client] ──> [Node 1] ──┐
                        ├──> [Shared Redis Cache] (Session / Token Blacklist)
[Client] ──> [Node 2] ──┘    [PostgreSQL DB]     (Persistent Records)
```

### What makes an application "Stateless"?
1. **No In-Memory User State:** The server does not store user authentication sessions, cart items, or uploaded files in local memory or on local disks.
2. **Any Server Can Handle Any Request:** A client can hit Node 1 on request 1, Node 2 on request 2, and Node 3 on request 3 without noticing any difference.
3. **Session Management in Stateless Systems:**
   - **Option A (JWT - JSON Web Tokens):** Self-contained, cryptographically signed tokens stored on the client. The server verifies the signature without querying a database.
   - **Option B (Centralized Session Store):** Session IDs stored in a high-speed in-memory cluster like **Redis**. Any API server queries Redis in $< 1\text{ ms}$.
   - **Why NOT Sticky Sessions?** Sticky sessions tie a user to a specific server instance via cookies. If that instance crashes or becomes overloaded, traffic fails to rebalance.
