# System Design Learning Hub (SDE-1 Track)

A structured collection of system design concepts, architectural trade-offs, and communication frameworks tailored for SDE-1 backend interviews.

---

## SDE-1 System Design Syllabus

| Module | Core Topics | Key Architectural Decisions | Documentation |
| :--- | :--- | :--- | :--- |
| **01. Foundations** | System Design definition, FR vs NFR, Scaling, Latency vs Throughput | Scale-up vs Scale-out, SLOs, P99 vs Mean | [01-system-design-foundations.md](01-system-design-foundations.md) |
| **02. Networking & Traffic** | Client-Server, Request-Response lifecycle, API Gateway, Load Balancer | L4 vs L7 balancing, Reverse Proxy, Statelessness | [02-networking-gateways-load-balancers.md](02-networking-gateways-load-balancers.md) |
| **03. Storage & Caching** | Relational vs NoSQL, Read-through/Write-through cache, Eviction | Cache invalidation, Data consistency, Sharding | *Week 2 Scheduled* |
| **04. Asynchronous Systems** | Message Queues, Pub/Sub, Worker pools, Event-driven architecture | At-least-once delivery, Idempotency, Dead letter queue | *Week 3 Scheduled* |

---

## Connected Resources
- **Cheatsheet:** [Notes/Cheatsheets/system-design.md](../../Notes/Cheatsheets/system-design.md)
- **Interview Q&A:** [Interview-Prep/System-Design/system-design-foundations-qa.md](../../Interview-Prep/System-Design/system-design-foundations-qa.md)
- **Week 1 Tracker:** [Learning/Roadmap-Week-1.md](../Roadmap-Week-1.md)
