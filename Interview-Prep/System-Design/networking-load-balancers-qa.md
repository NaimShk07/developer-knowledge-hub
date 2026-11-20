# System Design Day 6: Networking, Gateways & Load Balancers (SDE-1 Q&A)

> **Related Files:**  
> - 🧠 **Deep Dive:** [Learning/System-Design/02-networking-gateways-load-balancers.md](../../Learning/System-Design/02-networking-gateways-load-balancers.md)  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/system-design.md](../../Notes/Cheatsheets/system-design.md)  
> - 🏠 **Index:** [Interview-Prep/README.md](../README.md)

---

## Question 1: Trace the lifecycle of a request from the browser to an Express.js backend server.

### 1. 30-Second Spoken Answer
> "When a client requests `https://api.example.com/checkout`, the browser first resolves the domain to an IP address via recursive DNS lookups. Next, it establishes a reliable connection using the TCP 3-way handshake (SYN, SYN-ACK, ACK), followed by TLS cryptographic negotiation to establish an encrypted HTTPS tunnel. The HTTP request reaches our perimeter Load Balancer, which checks server health and routes it to an API Gateway for SSL termination and authentication. Finally, the Gateway proxies the clean HTTP request to our stateless Express.js instance, which invokes middleware, runs business logic, queries database/cache, and returns a JSON response."

---

### 2. Key Points to Mention (Rule of 3)
1. **Perimeter Networking:** DNS resolution $\rightarrow$ TCP 3-way handshake $\rightarrow$ TLS handshake.
2. **Perimeter Ingress:** Load Balancer (traffic distribution) $\rightarrow$ API Gateway (SSL termination, rate limiting, token verification).
3. **Internal Processing:** Reverse proxy forwarding to stateless Express service $\rightarrow$ Controller/Service logic $\rightarrow$ Database/Redis query $\rightarrow$ 200 OK JSON response.

---

### 3. Pipeline Diagram
```text
Browser ──> DNS ──> TCP/TLS Handshake ──> Load Balancer ──> API Gateway ──> Express App ──> PostgreSQL/Redis
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Latency Optimization)
**Interviewer:** *"The TCP and TLS handshakes add multiple network round trips before any data is sent. How do modern systems minimize this connection setup latency?"*  
**Spoken Response:**  
> "We minimize handshake latency using:  
> 1. **HTTP/2 and HTTP/3 (QUIC):** HTTP/2 reuses a single persistent TCP connection via multiplexing. HTTP/3 runs over UDP with 0-RTT connection resumption.  
> 2. **TLS Session Resumption:** Reuses negotiated session keys on subsequent connections.  
> 3. **CDN / Edge Terminations (e.g. Cloudflare):** Terminate TCP/TLS handshakes at edge points of presence geographically close to the user, then route to backends over persistent, pre-warmed internal network backbones."

#### Follow-up 2 (Interviewer Trap / Health Checks)
**Interviewer:** *"If a Load Balancer uses a simple TCP ping health check on port 8080, what failure scenario could cause healthy traffic to be routed to a dead server?"*  
**Spoken Response (Avoid the Trap):**  
> "A TCP ping only verifies that the operating system socket is accepting connections. If the Express.js Node.js process is stuck in a 100% CPU infinite loop or has run out of database connections, the OS kernel will still respond to TCP SYN packets, tricking the Load Balancer into thinking the server is healthy. In production, we must use an **Application-Level Deep Health Check** (`GET /health`) that actively verifies database connectivity and memory headroom before returning HTTP 200."

---

## Question 2: What is the difference between an L4 Load Balancer and an L7 Load Balancer?

### 1. 30-Second Spoken Answer
> "An L4 Load Balancer operates at the transport layer (TCP/UDP), routing packets strictly based on source and destination IP addresses and ports without inspecting the payload, making it ultra-fast and low in CPU overhead. An L7 Load Balancer operates at the application layer (HTTP/HTTPS), parsing headers, cookies, and URL paths to make intelligent routing decisions—such as sending `/api/users` to the User Service and `/api/orders` to the Order Service. We use L7 for microservice path-based routing and SSL termination, and L4 when ultra-high throughput or non-HTTP protocols are required."

---

### 2. Key Points to Mention (Rule of 3)
1. **OSI Layer Difference:** L4 = TCP/UDP (Fast packet routing); L7 = HTTP/HTTPS (Intelligent content-aware routing).
2. **Payload Visibility:** L4 cannot read URLs or HTTP headers; L7 decrypts and inspects the HTTP request body and headers.
3. **Resource Trade-off:** L4 handles millions of packets with minimal memory; L7 requires more CPU/RAM because it buffers and decrypts TLS streams.

---

### 3. Architecture Comparison
```text
L4 (Transport):                        L7 (Application):
Client ──> [ L4 LB: IP 1.2.3.4:443 ]   Client ──> [ L7 LB (Nginx / ALB) ]
                 │                                        │
        Routes by IP/Port alone                  Inspects URL Path:
                 ▼                               ├── /users  ──> User Service
          [ Backend Pool ]                       └── /orders ──> Order Service
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / High Scale)
**Interviewer:** *"At massive scale (e.g., millions of concurrent connections), how do tech companies combine L4 and L7 Load Balancers?"*  
**Spoken Response:**  
> "We arrange them in a two-tier hierarchy: an ultra-high performance L4 Load Balancer (like AWS Network Load Balancer or Linux IPVS) sits at the public boundary to absorb massive raw connection volume and distribute packets across a pool of internal L7 Load Balancers (like Nginx or Envoy). The L7 balancers then handle complex URL routing, TLS decryption, and authentication before passing traffic to microservices."

#### Follow-up 2 (Interviewer Trap / Sticky Sessions)
**Interviewer:** *"Can't we just use 'Sticky Sessions' on an L7 Load Balancer to keep user session data in server RAM?"*  
**Spoken Response (Avoid the Trap):**  
> "Sticky sessions are considered an architectural anti-pattern for scalable distributed systems. If an instance holding sticky sessions crashes, all connected users lose their active state and are logged out. Furthermore, sticky sessions break uniform traffic distribution: if a few heavy power users are pinned to one instance, that server experiences high CPU load while others sit idle. The industry standard is stateless servers with centralized state in Redis or JWTs."

---

## Question 3: What does it mean for an API service to be "Stateless", and how do we scale user sessions?

### 1. 30-Second Spoken Answer
> "A service is stateless when individual application instances store zero client session data, in-memory state, or uploaded files on local disks between requests. Any incoming request can be served by any instance in the cluster with identical results. We manage user authentication in stateless architectures by using either cryptographically signed JSON Web Tokens (JWT) verified locally on each server, or by storing session data in a centralized, low-latency in-memory data store like Redis."

---

### 2. Key Points to Mention (Rule of 3)
1. **Interchangeable Instances:** Any server in the pool can satisfy any user request without needing past request history.
2. **Horizontal Elasticity:** Stateless instances can be auto-scaled up or down dynamically in response to traffic spikes with zero data loss.
3. **State Externalization:** All persistent state is pushed downward into external systems: relational databases (PostgreSQL), in-memory caches (Redis), or object storage (Amazon S3).

---

### 3. Concrete Architecture
```text
                  ┌────────────────┐
                  │ Load Balancer  │
                  └───┬────────┬───┘
                      │        │
           ┌──────────▼─┐    ┌─▼──────────┐
           │ Express #1 │    │ Express #2 │ (Stateless - Zero RAM Sessions)
           └──────┬─────┘    └────┬───────┘
                  │               │
                  └───────┬───────┘
                          │
                  ┌───────▼────────┐
                  │  Redis Cluster │ (Centralized Sessions & Token Blacklist)
                  └────────────────┘
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / JWT Invalidation)
**Interviewer:** *"If JWTs are stateless and verified without calling a database, how do you instantly log a user out or invalidate a compromised token?"*  
**Spoken Response:**  
> "Because JWTs are self-contained, they cannot be invalidated before expiration without state. The production solution is a hybrid approach:  
> 1. Keep JWT access tokens short-lived (e.g., 10 to 15 minutes).  
> 2. For immediate revocations (password reset, account compromise), maintain a lightweight **Token Blocklist / Revocation List** in Redis. When an API receives a token, it checks Redis via a fast $O(1)$ lookup to verify the token ID has not been blacklisted."

#### Follow-up 2 (Interviewer Trap / Uploaded Files)
**Interviewer:** *"A junior engineer stores uploaded user profile images in the local `uploads/` folder of their Express server. What breaks when we deploy to a horizontally scaled cluster?"*  
**Spoken Response (Avoid the Trap):**  
> "The next time that user (or another user) makes an HTTP request to view the profile picture, the Load Balancer may route the request to a different server instance where the file does not exist in local disk storage, resulting in an HTTP 404 error. In a stateless architecture, servers must never treat local disk as persistent storage; all files must be streamed directly to a centralized object store like Amazon S3 or Cloudflare R2."
