# Week 1 Comprehensive Revision, Weak Area Diagnostic & ServiceHub Review

> **Related Files:**  
> - 🎯 **Personal Diagnostic Log:** [Interview-Prep/Assessments/week-1-checkpoints.md](../Interview-Prep/Assessments/week-1-checkpoints.md)  
> - 🗺️ **Roadmap Tracker:** [Learning/Roadmap-Week-1.md](Roadmap-Week-1.md)  
> - 📑 **Cheatsheets:** [Notes/Cheatsheets/dbms.md](../Notes/Cheatsheets/dbms.md) | [Notes/Cheatsheets/system-design.md](../Notes/Cheatsheets/system-design.md) | [Notes/Cheatsheets/nodejs.md](../Notes/Cheatsheets/nodejs.md)

---

## 1. Weak Areas Identified During Week 1

Based on our interactive checkpoints throughout the week, here are the **4 key conceptual traps** that require laser focus before real interviews:

### Weak Area 1: The Leftmost Prefix Rule on Composite Indexes (Day 3 Checkpoint)
* **The Trap:** Thinking that creating `PRIMARY KEY (student_id, course_id)` indexes both columns individually.
* **The Reality:** A B-Tree composite index sorts data left-to-right (`student_id` first, then `course_id`).
  * `WHERE student_id = 10` $\rightarrow$ Fast $O(\log N)$ index scan.
  * `WHERE course_id = 42` $\rightarrow$ **Full Table Scan (Slow!)** because the index is not sorted by `course_id`.
* **The Production Fix:** Always create an explicit secondary index on the second column:
  ```sql
  CREATE INDEX idx_sc_course_id ON student_courses(course_id);
  ```

---

### Weak Area 2: L4 vs L7 Load Balancer Visibility (Day 6 Checkpoint)
* **The Trap:** Attempting path-based routing (`/api/users` vs `/api/orders`) using an L4 balancer.
* **The Reality:**
  * **L4 (Transport):** Only reads **IP address and Port** (e.g. `10.0.0.1:443`). It cannot read HTTP URLs, paths, or headers because the packet is not decrypted into HTTP.
  * **L7 (Application):** Decrypts TLS, parses HTTP headers/paths, and can route based on `/api/users` or cookies.

---

### Weak Area 3: SQL Execution Order vs Syntactic Order (Day 5 Checkpoint)
* **The Pipeline:**
  $$\text{FROM / JOIN (1)} \rightarrow \mathbf{WHERE (2)} \rightarrow \text{GROUP BY (3)} \rightarrow \mathbf{HAVING (4)} \rightarrow \mathbf{SELECT (5)} \rightarrow \text{ORDER BY (7)}$$
* **Key Takeaway:** You cannot use a `SELECT` alias in `WHERE` because `WHERE` runs at Step 2 while `SELECT` computes aliases at Step 5. You **can** use the alias in `ORDER BY` because it runs at Step 7.

---

### Weak Area 4: Silent Conversion of LEFT JOIN to INNER JOIN (Day 5 Checkpoint)
* **The Trap:** Writing `LEFT JOIN orders o ON u.id = o.user_id WHERE o.amount > 100;`
* **The Reality:** Because `NULL > 100` evaluates to `UNKNOWN`, users with zero orders (where `o.amount` is `NULL`) are dropped, converting the `LEFT JOIN` into an `INNER JOIN`.
* **The Fix:** Move the condition into the `ON` clause: `ON u.id = o.user_id AND o.amount > 100`.

---

## 2. ServiceHub Architecture Review

**ServiceHub** is a production-grade multi-service backend. Below is the reference architecture incorporating all Week 1 principles:

```text
                                 [ Web / Mobile Clients ]
                                             │
                        1. DNS Resolution: api.servicehub.com
                        2. TCP Handshake -> 3. TLS Encryption
                                             ▼
                             ┌───────────────────────────────┐
                             │ L4 Load Balancer (AWS NLB)    │ (Fast TCP IP:Port Ingress)
                             └───────────────┬───────────────┘
                                             │
                             ┌───────────────▼───────────────┐
                             │ L7 Reverse Proxy (Nginx / ALB)│ (Path Routing + SSL Termination)
                             └───────┬───────────────┬───────┘
                                     │               │
                 /api/v1/auth, /users│               │ /api/v1/services, /bookings
                                     ▼               ▼
                        ┌──────────────────┐   ┌──────────────────┐
                        │ User & Auth Svc  │   │ Booking Service  │ (Stateless Node.js Instances)
                        └────────┬─────────┘   └────────┬─────────┘
                                 │                      │
           ┌─────────────────────┴──────────────────────┴─────────────────────┐
           │                                                                  │
           ▼                                                                  ▼
  ┌──────────────────┐                                               ┌──────────────────┐
  │  Redis Cluster   │ (Centralized Sessions, Rate Limiting, Cache)  │ Amazon S3 / R2   │ (Uploaded Avatars & Attachments)
  └──────────────────┘                                               └──────────────────┘
           │
           ▼
  ┌──────────────────┐
  │ PostgreSQL (RDBMS│ (Users, Bookings, Services with Foreign Keys & ON DELETE RESTRICT)
  └──────────────────┘
```

### SDE-1 ServiceHub Architecture Checklist:
1. **Stateless API Tier:** Express.js instances hold zero user sessions in RAM; user authentication uses signed JWTs with blacklists stored in Redis.
2. **File Decoupling:** Uploaded documents or avatars are never stored on local disks; they are uploaded directly to S3, storing only the URL in PostgreSQL.
3. **Relational Integrity:** Foreign keys on `bookings(user_id)` enforce referential integrity using `ON DELETE RESTRICT` to protect audit trails.
4. **Indexed Foreign Keys:** Secondary indexes exist on all `user_id` foreign keys and junction table second columns to eliminate full table scans.

---

## 3. Week 1 Final Assessment (5 Questions)

Answer these 5 quick questions to complete Week 1:

1. **Question 1 (DBMS Indexing):** In a table `user_roles(user_id, role_id)` with `PRIMARY KEY (user_id, role_id)`, why does `SELECT * FROM user_roles WHERE role_id = 3;` perform a Full Table Scan, and what single SQL command fixes it?
2. **Question 2 (System Design Scaling):** What is the fundamental difference between an application server and a database that makes the server easy to scale horizontally, while the database is hard to scale horizontally?
3. **Question 3 (Networking):** Which component in the request lifecycle is responsible for translating `api.servicehub.com` into an IP address, and why does this happen before the TCP handshake?
4. **Question 4 (SQL Logic):** If you want to list every user from the `users` table along with their total order count, including users who have placed 0 orders, which JOIN type must you use, and which count syntax: `COUNT(*)` or `COUNT(orders.id)`?
5. **Question 5 (Stateless Architecture):** If an L7 Load Balancer uses "Sticky Sessions" to pin a user to Server 2, what happens when Server 2 crashes or has to be restarted for a deployment?
