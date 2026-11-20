# System Design Foundations: Interview Q&A (SDE-1)

> **Related Files:**  
> - 🧠 **Deep Dive:** [Learning/System-Design/01-system-design-foundations.md](../../Learning/System-Design/01-system-design-foundations.md)  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/system-design.md](../../Notes/Cheatsheets/system-design.md)  
> - 🏠 **Index:** [Interview-Prep/README.md](../README.md)

---

## Question 1: How do you distinguish between Functional and Non-Functional requirements in a System Design interview?

### 1. 30-Second Spoken Answer
> "Functional requirements define *what* specific capabilities and business operations the system provides to the user—such as generating a short link or querying an order. Non-functional requirements define *how well* the system operates under load—specifically its latency SLAs, availability targets, scalability bounds, and data consistency models. In an interview, I always clarify functional features first to set the API contract, and non-functional requirements immediately after to size the database, caching, and network architecture."

---

### 2. Key Points to Mention (Rule of 3)
1. **Scope Boundary:** Functional requirements define the API endpoints and user stories; non-functional requirements dictate the underlying infrastructure and capacity plan.
2. **Quantitative SLAs:** Non-functional requirements must be measurable (e.g., "$p95 < 50\text{ ms}$ latency", "$99.99\%$ availability", "10,000 QPS read peak") rather than vague words like "fast" or "secure".
3. **Architectural Trade-offs:** Non-functional constraints force architectural decisions (e.g., choosing eventual consistency over strong consistency to achieve high availability across regions).

---

### 3. Concrete Example
```text
System: E-Commerce Cart Service
├── Functional Requirements (What it does):
│   ├── POST /cart/items -> Add item to user cart
│   ├── GET /cart -> Fetch active items and calculate total
│   └── POST /cart/checkout -> Reserve inventory & initiate payment
│
└── Non-Functional Requirements (How it performs):
    ├── Latency: GET /cart p99 < 30ms (cached in Redis)
    ├── Availability: 99.99% (Users must never be blocked from seeing carts)
    └── Consistency: Strong consistency required only at checkout/payment step
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Trade-off)
**Interviewer:** *"If the business demands 99.999% availability for a global social media feed, which non-functional requirement will you sacrifice, and why?"*  
**Spoken Response:**  
> "Under the CAP theorem, across a distributed global network with network partitions, I will sacrifice immediate strong consistency in favor of eventual consistency. Users viewing their feeds do not need to see a friend's post at the exact millisecond it is published; a 2 to 5 second replication lag is completely acceptable to guarantee zero downtime for read requests."

#### Follow-up 2 (Interviewer Trap / Failure Mode)
**Interviewer:** *"Can we design the functional features completely first, and leave non-functional requirements to the DevOps team after launch?"*  
**Spoken Response (Avoid the Trap):**  
> "No. That is a dangerous anti-pattern. Non-functional requirements dictate fundamental architectural choices that cannot be patched in later without rewriting the system. For instance, if the NFR requires 100,000 writes per second, a single relational database cannot support that without upfront data sharding or an append-only log architecture. Architecture is shaped by NFRs from day one."

---

## Question 2: Compare Vertical Scaling (Scale Up) vs Horizontal Scaling (Scale Out). When would you pick one over the other?

### 1. 30-Second Spoken Answer
> "Vertical scaling adds more compute resources—such as upgrading CPU, RAM, or SSD—to a single server, whereas horizontal scaling adds more commodity machines behind a load balancer. Vertical scaling is simpler with zero distributed overhead, but hits a physical hardware ceiling and introduces a single point of failure. Horizontal scaling provides virtually limitless scale and high fault tolerance, but requires stateless application architecture and distributed data management."

---

### 2. Key Points to Mention (Rule of 3)
1. **Limits & Cost:** Vertical scaling has a hard hardware ceiling and exponential cost curve; horizontal scaling offers linear cost and high elasticity.
2. **Fault Tolerance & SPOF:** A vertically scaled box is a Single Point of Failure; horizontally scaled pools tolerate individual node crashes seamlessly via health checks.
3. **Stateless Requirement:** Horizontal scaling demands that servers be stateless—sessions, cache, and files must be offloaded to external stores like Redis, S3, or PostgreSQL.

---

### 3. Visual Architecture Comparison
```text
Vertical (Scale Up):              Horizontal (Scale Out):
┌────────────────┐                ┌──────────────┐
│  Upgrade Box   │                │ LoadBalancer │
│ 4 Core -> 64 C │                └──┬────┬────┬─┘
│ 8 GB  -> 256 GB│                   │    │    │
└────────────────┘                   ▼    ▼    ▼
 [SPOF Risk!]                 ┌──────┐ ┌──────┐ ┌──────┐
                              │Node 1│ │Node 2│ │Node 3│ (Stateless)
                              └──────┘ └──────┘ └──────┘
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Trade-off)
**Interviewer:** *"Why is horizontally scaling a relational database (like PostgreSQL) significantly harder than horizontally scaling an Express.js API server?"*  
**Spoken Response:**  
> "API servers are stateless: any incoming HTTP request can be routed to any instance without caring about past requests. In contrast, relational databases maintain mutable state, ACID transactions, foreign keys, and indexes. Horizontally scaling a database requires distributed consensus, replication lag management, cross-shard joins, and handling split-brain scenarios when network partitions occur."

#### Follow-up 2 (Interviewer Trap / Failure Mode)
**Interviewer:** *"If an API endpoint has high response latency due to a slow database query, will adding 5 more application servers reduce that endpoint's latency?"*  
**Spoken Response (Avoid the Trap):**  
> "No. Horizontal scaling increases system throughput (total requests per second handled), but it does not reduce the execution latency of an individual slow database query. In fact, adding more application servers will send more concurrent connections to the already overloaded database, causing connection contention and making individual request latency even worse. The solution is query optimization, indexing, or caching, not more application servers."

---

## Question 3: What is the difference between Latency and Throughput, and why do percentiles (p95/p99) matter more than averages?

### 1. 30-Second Spoken Answer
> "Latency is the duration taken for a single request to complete its round trip, measured in milliseconds. Throughput is the volume of requests the system can process concurrently per unit time, measured in QPS or RPS. We prioritize tail latency percentiles like p95 and p99 over the average because an arithmetic mean hides severe outlier spikes caused by garbage collection, lock contention, or slow database queries that degrade the experience of heavy power users."

---

### 2. Key Points to Mention (Rule of 3)
1. **Definitions:** Latency = Time per request ($ms$); Throughput = Requests per second ($QPS$).
2. **Little's Law Connection:** $\text{Concurrency} = \text{Throughput} \times \text{Latency}$. If latency degrades while traffic holds steady, server queues and memory fill up rapidly.
3. **The Flaw of Averages:** If 99 users experience $10\text{ ms}$ latency and 1 user experiences $5{,}000\text{ ms}$, the average is $\approx 60\text{ ms}$, creating a false sense of health while $1\%$ of users suffer severe timeout errors.

---

### 3. Percentile Distribution Diagram
```text
Request Distribution:
  10ms  ─── [=================================== 95% of users ]  <-- p95 = 20ms
  25ms  ─── [==== 4% of users ]                                  <-- p99 = 45ms
1200ms  ─── [= 1% Outliers: GC pause, DB lock contention ]        <-- Tail Latency!
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Production Scenario)
**Interviewer:** *"Your service monitors report p50 latency of 15ms, but p99 is 1800ms. What are the top 3 backend causes you would investigate?"*  
**Spoken Response:**  
> "I would investigate:  
> 1. **V8 / JVM Garbage Collection (GC) pauses:** Stop-the-world pauses freeze request processing intermittently.  
> 2. **Database Lock Contention or Cold Cache Misses:** Requests hitting unindexed queries or missing Redis cache fall through to a saturated disk read.  
> 3. **TCP Connection Pool Exhaustion:** Requests queuing up waiting for an available socket to downstream microservices."

#### Follow-up 2 (Interviewer Trap / Failure Mode)
**Interviewer:** *"Can a system experience high throughput and high latency at the same time?"*  
**Spoken Response (Avoid the Trap):**  
> "Yes, absolutely. A batch data pipeline or video transcoding system can process tens of gigabytes per second (high throughput) while each individual job takes 30 minutes to complete (high latency). In web APIs, when a system operates near maximum capacity, queue lengths grow, causing latency to spike drastically while throughput remains pinned at its peak saturation ceiling."
