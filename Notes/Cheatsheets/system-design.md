# System Design Cheatsheet (SDE-1 Quick Recall)

> **Related Files:**  
> - 🧠 **Deep Dive:** [Learning/System-Design/01-system-design-foundations.md](../../Learning/System-Design/01-system-design-foundations.md)  
> - 🎯 **Interview Q&A:** [Interview-Prep/System-Design/system-design-foundations-qa.md](../../Interview-Prep/System-Design/system-design-foundations-qa.md)  
> - 🏠 **Index:** [Notes/README.md](../README.md)

---

## 1. 4-Step SDE-1 Interview Blueprint (45 Minutes)

| Phase | Time | Candidate Goals | Common Pitfall |
| :--- | :---: | :--- | :--- |
| **1. Scope & Constraints** | 5–8 min | Clarify Functional Requirements (2–3 key features), Non-Functional Requirements (QPS, Latency SLA, Read/Write ratio). | Starting to draw boxes immediately without asking questions. |
| **2. High-Level Design (HLD)** | 10–12 min | Draw client, Load Balancer, API Gateway/Server, DB, Cache. Define core API contracts (`POST /api/v1/resource`). | Over-engineering with Kafka or microservices before establishing basics. |
| **3. Deep Dive** | 15–18 min | Choose 1–2 critical components (e.g., ID generation algorithm, data schema, caching strategy, DB read replicas). | Staying at the surface level without discussing algorithms or data formats. |
| **4. Bottlenecks & Trade-offs** | 5–7 min | Discuss Single Points of Failure (SPOF), horizontal scaling, p99 latency risks, data consistency vs availability. | Claiming the system has "zero flaws" or ignoring network failures. |

---

## 2. Requirements Matrix (FR vs NFR)

| Type | Question to Answer | Typical SDE-1 Examples |
| :--- | :--- | :--- |
| **Functional (FR)** | *What should the user be able to do?* | 1. Create short URL from long URL.<br>2. Redirect short URL to long URL.<br>3. Expire links after TTL. |
| **Non-Functional (NFR)** | *How well must the system behave under stress?* | 1. **Latency:** $< 20\text{ ms}$ for redirection (p95).<br>2. **Availability:** $99.99\%$ (high read availability).<br>3. **Scale:** $100\text{M}$ URLs/day, $10{,}000\text{ QPS}$ read. |

---

## 3. Scaling Comparison

| Dimension | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
| :--- | :--- | :--- |
| **Core Action** | Bigger CPU / More RAM on 1 box | More identical nodes behind a Load Balancer |
| **Limits** | Hard hardware maximum | High scalability (bounded by network & state) |
| **Cost Curve** | Exponential (Supercomputers are costly) | Linear (Standard cloud commodity instances) |
| **Redundancy** | Single Point of Failure (SPOF) | N-1 fault tolerant |
| **State Handling** | Natural in-memory state | Requires **stateless** app servers + external DB/Redis |

---

## 4. Latency Numbers Every Backend Engineer Must Know

Approximate hardware & network timings to memorize for back-of-the-envelope calculations:

| Operation | Approximate Time | Mental Benchmark |
| :--- | :--- | :--- |
| **L1 cache reference** | $0.5\text{ ns}$ | Fastest |
| **Branch mispredict** | $5\text{ ns}$ | Fast |
| **L2 cache reference** | $7\text{ ns}$ | $14\times$ L1 |
| **Mutex lock / unlock** | $25\text{ ns}$ | Fast concurrency primitive |
| **Main memory (RAM) reference** | $100\text{ ns}$ | $200\times$ L1 |
| **Read $1\text{ MB}$ sequentially from RAM** | $3\,\mu\text{s}$ ($3{,}000\text{ ns}$) | Ultra-fast bulk read |
| **Read $1\text{ MB}$ sequentially from NVMe SSD** | $50\,\mu\text{s}$ | Fast disk storage |
| **Round trip inside same Datacenter** | $0.5\text{ ms}$ ($500\,\mu\text{s}$) | Fast network hop |
| **Read $1\text{ MB}$ sequentially from HDD** | $1\text{ ms}$ ($1{,}000\,\mu\text{s}$) | Spinning disk penalty |
| **Network packet: US East to US West** | $30\text{ ms}$ | Cross-country speed of light |
| **Network packet: US to Europe (round-trip)** | $150\text{ ms}$ | Inter-continental latency floor |

---

## 5. Latency vs Throughput Fast Formulas

- **Latency:** Time taken per request ($t = \text{end\_time} - \text{start\_time}$).
- **Throughput:** Requests per unit time ($\text{QPS} = \frac{\text{Total Requests}}{\text{Seconds}}$).
- **Little's Law:**  
  $$\text{Concurrent Requests} = \text{Throughput} \times \text{Average Latency}$$  
  *Example:* $1{,}000\text{ QPS} \times 0.05\text{ s (50 ms)} = 50\text{ concurrent requests in flight}$.

---

## 6. Networking & Traffic Quick Reference

### Request-Response Lifecycle
1. **DNS Resolution:** Recursive lookup (Browser $\rightarrow$ OS $\rightarrow$ Resolver $\rightarrow$ Authoritative).
2. **TCP Handshake:** 3-Way (SYN $\rightarrow$ SYN-ACK $\rightarrow$ ACK).
3. **TLS Handshake:** Certificate verification + asymmetric key exchange to negotiate symmetric AES session key.
4. **LB / Reverse Proxy:** Route based on health and IP/URL.
5. **API Gateway:** SSL termination, Token validation, Rate limiting, Path routing.
6. **Stateless API:** Express controller $\rightarrow$ DB/Redis $\rightarrow$ JSON response.

### L4 vs L7 Load Balancers
| Feature | Layer 4 (Transport) | Layer 7 (Application) |
| :--- | :--- | :--- |
| **Protocol** | TCP / UDP | HTTP / HTTPS / WebSockets |
| **Inspection** | IP & Port only | URL path, headers, cookies, payload |
| **Routing** | Fast packet routing | Path routing (`/api/v1/*`), SSL termination |
| **Examples** | AWS NLB, Linux IPVS | AWS ALB, Nginx, Envoy, Traefik |

### Stateless Architecture Golden Rules
- **Rule 1:** Zero in-memory user sessions in server RAM.
- **Rule 2:** Zero persistent files stored on local server disks (use Amazon S3 or Cloudflare R2).
- **Rule 3:** Store shared session state in **Redis** or use self-contained **JWTs**.
