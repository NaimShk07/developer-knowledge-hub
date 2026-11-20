# Week 1 Diagnostic Checkpoints & Personal Answers

> **Purpose:** A permanent log of interactive checkpoint questions asked during daily study sessions, including your spoken answers, interviewer evaluation, gaps identified, and model answers.  
> **Related Files:**  
> - 🗺️ **Roadmap Tracker:** [Learning/Roadmap-Week-1.md](../../Learning/Roadmap-Week-1.md)  
> - 📑 **Interview Hub:** [Interview-Prep/README.md](../README.md)

---

## Day 2: System Design Foundations (Completed Nov 17)

### Question 1: In an e-commerce checkout interview, give 2 Functional Requirements (FR) and 2 Non-Functional Requirements (NFR).
* **Your Answer:** *"user should have added product before checkout , checkout item should be in stock, payment service should be up(availablity) and it should be secure(security)"*
* **Evaluation:** ✅ **Passed (Good Intuition)**
* **Feedback & Gaps:** Good identification of features vs system qualities. In interviews, quantify your NFRs with concrete metrics (SLAs) instead of vague words:
  * **FR:** `POST /orders` (checkout cart items), `GET /inventory/{id}` (stock check).
  * **NFR:** **Strong Consistency** (prevent double spending or overselling stock), **Latency SLA** ($p99 < 500\text{ ms}$ for checkout), **Availability** ($99.99\%$).

---

### Question 2: Why is an API server easy to scale horizontally, but a PostgreSQL relational database hard to scale horizontally?
* **Your Answer:** *"becuase it is easy to distribute request across multiple server via load balancer algorithm but in postgress it become hard as there too many option for write and read? maybe i am not sure about this"*
* **Evaluation:** 🟡 **Partially Correct (Missing the Architectural Keyword)**
* **Feedback & Gaps:** The core distinction is **Stateless vs Stateful**:
  * **API Servers are Stateless:** They hold no persistent data in local RAM or disk; any HTTP request can hit any instance via a Load Balancer.
  * **Databases are Stateful:** PostgreSQL holds persistent data on disk. Adding instances creates distributed data problems: replication lag, split-brain scenarios, and the extreme complexity of distributed multi-table ACID transactions across shards.

---

### Question 3: An API endpoint has a slow database query causing 2,000ms latency. Will adding 5 more application servers reduce that latency? Explain why or why not.
* **Your Answer:** *"nope issue is in the database query not the server so adding mulitpel server wont fix the issue we have to fix the slow query"*
* **Evaluation:** ✅ **Passed (100% Correct)**
* **Bonus Point:** Adding 5 app servers actually makes latency worse because more servers open more concurrent database connections, increasing lock contention on the already overloaded database. The solution is query optimization, indexing, or Redis caching.

---

## Day 3: DBMS – SQL vs NoSQL & Database Relationships (Completed Nov 18)

### Question 1: If MongoDB allows you to store flexible JSON documents without running schema migrations, why don't all production systems use MongoDB instead of PostgreSQL?
* **Your Answer:** *"becuase not everytime the requirement is flexible data storage, it depends on how the application is if its requires structured format on db we should using db depending upon the requirement"*
* **Evaluation:** ✅ **Passed (Good Core Logic)**
* **Feedback & Gaps:** The interviewer follow-up depth to mention:
  1. **Burden shifts to application code:** Without database-enforced schemas, your backend code becomes cluttered with defensive null checks and backward-compatibility parsers.
  2. **Multi-table Relational JOINs:** Relational queries across normalized entities are optimized in PostgreSQL via B-Trees, whereas MongoDB `$lookup` aggregations are memory-intensive and slow.
  3. **ACID Transaction Latency:** Multi-document ACID transactions across distributed replica sets incur high latency.

---

### Question 2: Why should you avoid `ON DELETE CASCADE` on a `user_id` foreign key in an `orders` or `invoices` table? What should you use instead?
* **Your Answer:** *"becuase it will delete the parent row as well instad we should use on delete restrict"*
* **Evaluation:** ✅ **Passed (Correct Mechanism Identified)**
* **Clarification:** Deleting the **parent** (user) is what triggers the cascade. If an admin deletes a user, `CASCADE` silently deletes all their **child** records (invoices, receipts, orders), wiping out audit history. You correctly identified `ON DELETE RESTRICT` (or soft deletes with `deleted_at`) as the production standard.

---

### Question 3: In a Many-to-Many junction table with `PRIMARY KEY (student_id, course_id)`, which query runs fast, and which query is slow if you don't add an extra index?
- Query A: `SELECT * FROM student_courses WHERE student_id = 10;`
- Query B: `SELECT * FROM student_courses WHERE course_id = 42;`
* **Your Answer:** *"both will be slow as primary key is on both column not one and in the query we are doing filter only in one column"*
* **Evaluation:** ❌ **Identified Trap (Classic FAANG Interview Trap)**
* **The Reality & Learning:**
  * **Query A is ULTRA-FAST ($O(\log N)$)!**
  * **Query B is SLOW (Full Table Scan)!**
  * **The Leftmost Prefix Rule:** A B-Tree on `(col_a, col_b)` is sorted by `col_a` first, then `col_b`.
    * Analogy: A telephone directory sorted by `(LastName, FirstName)`. Finding someone by `LastName = 'Smith'` is instant. Finding someone by `FirstName = 'John'` requires reading every single page in the phonebook!
  * **The Fix:** You must create an explicit secondary index on the second column:  
    `CREATE INDEX idx_sc_course_id ON student_courses(course_id);`

---

## Day 5: DBMS – SQL Queries, Aggregations & JOINs (In Progress Nov 20)

*(Pending your answers to today's 3 checkpoint questions:)*
1. **Question 1:** Why does `SELECT age * 2 AS double_age FROM users WHERE double_age > 40;` throw an error in SQL, and how would you fix it?
2. **Question 2:** If an interviewer asks: *"Can we just filter `WHERE status = 'ACTIVE'` inside the `HAVING` clause instead of `WHERE`?"*, what is the performance risk?
3. **Question 3:** Does `SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.amount > 100;` behave like a true `LEFT JOIN` or an `INNER JOIN`? What happens to users with zero orders?
