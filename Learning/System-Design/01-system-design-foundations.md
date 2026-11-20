# System Design Foundations (SDE-1 Perspective)

> **Related Files:**  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/system-design.md](../../Notes/Cheatsheets/system-design.md)  
> - 🎯 **Interview Q&A:** [Interview-Prep/System-Design/system-design-foundations-qa.md](../../Interview-Prep/System-Design/system-design-foundations-qa.md)  
> - 🗺️ **Week 1 Tracker:** [Learning/Roadmap-Week-1.md](../Roadmap-Week-1.md)

---

## 1. What is System Design for SDE-1?

System Design is the process of defining the architecture, components, modules, interfaces, and data for a software system to satisfy specified requirements.

In an **SDE-1 interview**, interviewers do **not** expect you to design Netflix from scratch in 45 minutes. Instead, they evaluate:
1. **Scope Clarification**: Can you ask clarifying questions to convert vague problems into concrete engineering constraints?
2. **Component Separation**: Can you separate a monolithic server into client, API gateway, stateless application server, cache, and database?
3. **Trade-off Awareness**: Do you understand that every architectural choice has a cost (e.g., speed vs consistency, cost vs reliability)?
4. **Data Flow**: Can you trace a single request end-to-end from mobile client to database and back?

```
┌──────────┐      HTTP / JSON      ┌──────────────────┐      SQL / TCP      ┌───────────┐
│  Client  │ ────────────────────> │  Backend Server  │ ──────────────────> │ Database  │
│ (Browser)│ <──────────────────── │ (Node.js Express)│ <────────────────── │(PostgreSQL│
└──────────┘       200 OK          └──────────────────┘     Result Rows     └───────────┘
```

---

## 2. Functional vs Non-Functional Requirements

Every system design problem starts by dividing requirements into two distinct buckets.

### A. Functional Requirements (FR)
**Definition:** What the system *must do* (features and business capabilities).
- Think of FR as the API endpoints or user actions.
- *Examples for a URL Shortener (TinyURL):*
  - Given a long URL, generate a shorter unique alias.
  - Given a short alias, redirect the user to the original long URL with minimum delay.
  - Users can optionally provide a custom alias.

### B. Non-Functional Requirements (NFR)
**Definition:** How well the system performs its functions (system quality attributes, constraints, and operational characteristics).
- Think of NFR as the "-ilities": Scalability, Availability, Reliability, Latency, Consistency.
- *Examples for a URL Shortener:*
  - **Latency:** Redirection must take $< 20$ ms (p95).
  - **Availability:** 99.99% uptime (highly available for reads).
  - **Read/Write Ratio:** Heavily read-heavy (e.g., 100 reads for every 1 write).
  - **Durability:** Short URLs should not expire or get lost for at least 5 years.

| Aspect | Functional Requirements (FR) | Non-Functional Requirements (NFR) |
| :--- | :--- | :--- |
| **Focus** | Feature capabilities & business logic | System qualities, constraints & SLAs |
| **Driven By** | Product Managers & End Users | Backend Engineers & DevOps/SRE |
| **Question** | "What does the user click or get?" | "How fast, reliable, and secure is it?" |
| **Interview Trap** | Writing code before defining NFRs | Ignoring scale (e.g., 100 QPS vs 100,000 QPS) |

---

## 3. Vertical Scalability vs Horizontal Scalability

When traffic increases, a single standard server will run out of CPU, RAM, disk I/O, or network sockets. How do we handle growth?

### Vertical Scaling (Scale Up)
Adding more power (CPU cores, RAM, faster NVMe SSD) to an existing single machine.

```
       Scale Up (Bigger Box)
┌─────────────┐       ┌──────────────────────┐
│  4 Cores    │  ==>  │  64 Cores            │
│  8 GB RAM   │       │  256 GB RAM          │
└─────────────┘       └──────────────────────┘
```

- **Pros:**
  - Simple: No architectural changes needed.
  - No distributed system complexity (no data partitioning, network partitions, or consensus protocols).
  - Zero inter-node network latency.
- **Cons:**
  - Hard physical hardware ceiling (maximum RAM and CPUs a motherboard can take).
  - Single Point of Failure (SPOF): If the machine dies, the whole service goes down.
  - Exponential cost curve: Doubling machine power can cost $5\times$ to $10\times$ more.

---

### Horizontal Scaling (Scale Out)
Adding more commodity machines to the pool and distributing the traffic across them via a **Load Balancer**.

```
                           Scale Out (More Boxes)
                                ┌───────────────┐
                          ┌───> │ Server 1 (8G) │
                          │     └───────────────┘
┌─────────┐    ┌───────┐  │     ┌───────────────┐
│ Traffic │───>│  LB   │──┼───> │ Server 2 (8G) │
└─────────┘    └───────┘  │     └───────────────┘
                          │     ┌───────────────┐
                          └───> │ Server 3 (8G) │
                                └───────────────┘
```

- **Pros:**
  - Virtually unlimited scale: Add 10, 100, or 1000 nodes as traffic spikes.
  - High Availability & Fault Tolerance: If Server 2 crashes, the Load Balancer routes traffic to Servers 1 and 3.
  - Cost-efficient: Built on standard commodity hardware or dynamic cloud instances.
- **Cons:**
  - Requires **stateless** servers: User session data cannot live inside local server memory.
  - Distributed complexity: Needs service discovery, load balancing, health checks, and centralized logging.

### Summary Comparison Table

| Feature | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
| :--- | :--- | :--- |
| **Primary Method** | Upgrade CPU / RAM on 1 box | Add more identical machines + Load Balancer |
| **Downtime / Upgrades** | Often requires reboot | Zero downtime rolling deployments |
| **Limit** | Hard hardware ceiling | Theoretically infinite |
| **Fault Tolerance** | Zero (Single Point of Failure) | High (N-1 redundancy) |
| **Architecture** | Simple (Monolith friendly) | Requires stateless API tier |
| **Best Used For** | Small startups, internal tools, primary SQL DBs | Modern backend web APIs, microservices |

---

## 4. Latency vs Throughput

These two metrics measure system performance, but they describe fundamentally different dimensions.

### A. Latency (Response Time)
**Definition:** The time it takes for a single request to travel from client to server, get processed, and return to the client.
- **Unit:** Milliseconds (ms) or microseconds ($\mu$s).
- **Analogy:** How many minutes a single car takes to drive from City A to City B.

#### Tail Latency & Percentiles (Why Average is Misleading)
Never report just "Average Latency" in an interview. A few slow database queries can hide behind a good average.
- **p50 (Median):** 50% of requests are faster than this value.
- **p95:** 95% of requests are faster than this.
- **p99:** 99% of requests are faster than this. Only 1 in 100 requests is slower.
- In FAANG, **p99 and p99.9 latency SLAs** matter because the most active users (e.g., users with 10,000 friends or huge shopping carts) suffer the most from tail latency.

---

### B. Throughput (Volume / Capacity)
**Definition:** The number of requests or data volume a system can successfully process within a given time interval.
- **Unit:** Requests Per Second (RPS), Queries Per Second (QPS), or Bits Per Second (Mbps/Gbps).
- **Analogy:** How many cars cross the toll booth per minute (width of the highway).

```
High Latency, High Throughput:
A cargo freight train takes 24 hours to arrive (High Latency: 24h),
but carries 10,000 tons of goods at once (High Throughput).

Low Latency, Low Throughput:
A bullet train reaches in 30 minutes (Low Latency: 30m),
but only carries 200 passengers (Lower Throughput).
```

### Relationship: Little's Law
In queueing theory:
$$L = \lambda \times W$$
- $L$ = Number of concurrent requests in the system
- $\lambda$ = Throughput (requests arriving per second)
- $W$ = Average Latency (average time spent per request)

> **Core Insight:** If your database latency doubles from $50\text{ ms}$ to $100\text{ ms}$ while incoming traffic stays at $1000\text{ RPS}$, the number of concurrent open connections doubles from $50$ to $100$. If your connection pool is capped at 60, the system collapses!

---

## 5. Quick Review Checklist for SDE-1
1. [ ] Can you define both Functional and Non-Functional requirements for a feature without mixing them up?
2. [ ] Can you state 2 major disadvantages of Vertical Scaling?
3. [ ] What is the prerequisite for an API service to scale horizontally? *(Answer: It must be stateless)*.
4. [ ] Why is p99 latency more important than average latency in production?
