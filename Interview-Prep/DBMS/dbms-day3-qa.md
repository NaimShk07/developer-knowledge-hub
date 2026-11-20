# DBMS Day 3: Interview Q&A (SDE-1)

> **Related Files:**  
> - 🧠 **Deep Dive:** [Learning/DBMS/02-sql-vs-nosql-and-relationships.md](../../Learning/DBMS/02-sql-vs-nosql-and-relationships.md)  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/dbms.md](../../Notes/Cheatsheets/dbms.md)  
> - 🏠 **Index:** [Interview-Prep/README.md](../README.md)

---

## Question 1: How do you decide whether to use a Relational SQL database or a NoSQL database for a backend service?

### 1. 30-Second Spoken Answer
> "I choose SQL when the data is highly structured, requires complex relational joins across entities, and demands strict ACID transactional integrity—such as payments, orders, or user accounts. I choose NoSQL when the data schema is unstructured or rapidly evolving, when we need massive horizontal write throughput across partitioned clusters, or when the access pattern is simple key-value lookups—such as caching in Redis, clickstream event logging, or high-volume chat messages."

---

### 2. Key Points to Mention (Rule of 3)
1. **Schema Rigidity vs Flexibility:** SQL enforces strict compile-time-like schema constraints; NoSQL allows dynamic, document-level nested attributes.
2. **ACID vs BASE (Consistency Model):** SQL guarantees strong transactional consistency; distributed NoSQL databases typically prioritize availability and partition tolerance (CAP theorem) with eventual consistency.
3. **Access Patterns:** SQL excels at relational joins (`JOIN` across 4 tables); NoSQL excels at single-key denormalized reads ($O(1)$ document or key retrieval).

---

### 3. Comparison Decision Table
```text
Requirements:                          Database Choice:
├── Financial transactions / Orders    ──> PostgreSQL / MySQL (Strict ACID)
├── High-speed session / Caching       ──> Redis (In-Memory Key-Value)
├── High-throughput IoT telemetry      ──> Cassandra / ScyllaDB (Wide-Column)
└── Product catalog with varied specs  ──> MongoDB (Document Store)
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Trade-off)
**Interviewer:** *"If MongoDB supports flexible schemas without schema migrations, why don't we use MongoDB for every backend service?"*  
**Spoken Response:**  
> "Flexible schemas merely shift the burden of validation from the database engine to the application code. If different documents contain varying field names, the backend code becomes cluttered with defensive null checks and backward-compatibility parsers. Furthermore, MongoDB multi-document ACID transactions have higher latency overhead than native RDBMS transactions, and performing cross-collection lookups (`$lookup`) is slow compared to optimized B-Tree joins in PostgreSQL."

#### Follow-up 2 (Interviewer Trap / Failure Mode)
**Interviewer:** *"Can a NoSQL database ever support ACID transactions, or are transactions strictly limited to SQL?"*  
**Spoken Response (Avoid the Trap):**  
> "Modern NoSQL databases do support ACID transactions. For example, MongoDB introduced multi-document ACID transactions in version 4.0, and AWS DynamoDB supports transactional read/write operations. However, NoSQL transactions introduce significant performance latency and distributed lock overhead across partitioned replica sets, which defeats the original purpose of horizontal scale. If your system requires frequent multi-table ACID guarantees, a relational database remains the right tool."

---

## Question 2: Explain Primary Key vs Foreign Key, and explain why `ON DELETE CASCADE` can be dangerous in production.

### 1. 30-Second Spoken Answer
> "A Primary Key uniquely identifies a row in a table and cannot contain nulls, creating a clustered index on disk. A Foreign Key is a constraint referencing the Primary Key of another table, guaranteeing referential integrity so orphaned records cannot exist. `ON DELETE CASCADE` automatically deletes all child rows when a parent row is deleted. It is dangerous in production because accidentally deleting a single user can silently wipe out all their historical financial transactions, invoices, and audit logs without warning."

---

### 2. Key Points to Mention (Rule of 3)
1. **Referential Integrity:** A foreign key prevents invalid child foreign references from ever being written.
2. **Index Difference:** In databases like PostgreSQL, primary keys are automatically indexed, but foreign key columns are **not** automatically indexed and must be indexed manually.
3. **Cascade Danger vs Soft Deletes:** In enterprise backends, hard deletes with `ON DELETE CASCADE` are avoided. Instead, we use `ON DELETE RESTRICT` or soft deletes (`deleted_at TIMESTAMP`) to preserve historical audit trails.

---

### 3. Safe Schema Example
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- RESTRICT prevents accidental parent deletion while child records exist!
  CONSTRAINT fk_user FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE RESTRICT
);

-- Crucial: Index the foreign key to avoid full-table scans on JOINs!
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Performance)
**Interviewer:** *"Why doesn't PostgreSQL automatically create an index on Foreign Key columns like it does for Primary Keys?"*  
**Spoken Response:**  
> "PostgreSQL automatically indexes Primary Keys because it must enforce uniqueness on every insert and update in $O(\log N)$ time. Foreign Keys, however, do not need to be unique in the child table. While an index on the FK is essential for performance when joining child to parent or when deleting from the parent, the database engine leaves the indexing decision to the engineer to avoid unnecessary write latency on high-write child tables."

#### Follow-up 2 (Interviewer Trap / Concurrency & Locks)
**Interviewer:** *"When inserting a new record into a child table with a foreign key, does the database acquire a lock on the parent table?"*  
**Spoken Response (Avoid the Trap):**  
> "Yes. To verify that the parent row exists and prevent another transaction from deleting it concurrently, the database acquires a shared lock (`FOR SHARE`) on the referenced parent row. If thousands of concurrent transactions insert child records referencing the exact same parent row simultaneously, they can create lock contention on that parent row."

---

## Question 3: How do you model a Many-to-Many (N:M) relationship in SQL, and how do you ensure query performance?

### 1. 30-Second Spoken Answer
> "A Many-to-Many relationship cannot be represented cleanly in a single table, so we use a Junction Table containing Foreign Keys referencing both entities. We define a Composite Primary Key across both foreign key columns to guarantee that duplicate pairings cannot be inserted. For query performance, while the composite primary key automatically indexes queries filtering by the first column, we must explicitly create a secondary index on the second column to accelerate reverse lookups."

---

### 2. Key Points to Mention (Rule of 3)
1. **Junction Table Architecture:** Two 1:N relationships connected via an intermediate table (`student_courses`).
2. **Composite Primary Key:** `PRIMARY KEY (student_id, course_id)` guarantees uniqueness at the storage engine level with zero application-level deduplication code.
3. **The Index Prefix Trap:** B-Trees on `(A, B)` only support searches on `WHERE A = ?` or `WHERE A = ? AND B = ?`. To query `WHERE B = ?`, a separate index on column `B` is mandatory.

---

### 3. Junction Table Schema with Proper Indexing
```sql
CREATE TABLE student_courses (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Composite PK: Prevents student from enrolling twice in the same course
  PRIMARY KEY (student_id, course_id),
  
  CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- MANDATORY FOR SDE-1: Index second column for reverse lookup
-- Allows: SELECT * FROM student_courses WHERE course_id = 42;
CREATE INDEX idx_student_courses_course_id ON student_courses(course_id);
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / NoSQL Alternative)
**Interviewer:** *"How would you model this Many-to-Many relationship in MongoDB instead of SQL?"*  
**Spoken Response:**  
> "In MongoDB, it depends on cardinality. If a student only enrolls in 5 to 10 courses, we can embed an array of course IDs inside the `Student` document: `{ name: 'Alice', course_ids: [101, 102] }`. However, if the relationship can grow unboundedly (like Twitter followers), embedding arrays causes documents to exceed the 16MB document limit and creates massive document re-allocation. In unbounded cases, we use a separate two-way reference collection similar to a relational junction collection."

#### Follow-up 2 (Interviewer Trap / Composite Key Ordering)
**Interviewer:** *"Does the order of columns in `PRIMARY KEY (student_id, course_id)` matter?"*  
**Spoken Response (Avoid the Trap):**  
> "Yes, absolutely. The order defines the B-Tree left-to-right sorting. A composite index on `(student_id, course_id)` can satisfy queries filtering by `student_id` alone, or both `student_id` and `course_id`. But it **cannot** be used by the query optimizer for a query filtering only on `course_id`. That is why the leftmost prefix rule requires a separate index on `course_id`."
