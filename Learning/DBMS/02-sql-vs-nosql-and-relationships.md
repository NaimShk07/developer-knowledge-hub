# SQL vs NoSQL & Relational Database Relationships

> **Related Files:**  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/dbms.md](../../Notes/Cheatsheets/dbms.md)  
> - 🎯 **Interview Q&A:** [Interview-Prep/DBMS/dbms-day3-qa.md](../../Interview-Prep/DBMS/dbms-day3-qa.md)  
> - 🗺️ **Week 1 Tracker:** [Learning/Roadmap-Week-1.md](../Roadmap-Week-1.md)

---

## 1. SQL vs NoSQL: SDE-1 Decision Framework

In system design and backend interviews, choosing between SQL and NoSQL is one of the most frequent architectural trade-offs.

```
                    ┌─────────────────────────┐
                    │ Data Storage Selection  │
                    └────────────┬────────────┘
                                 │
                 Structured Data? Strict ACID?
                                 │
                ┌────────────────┴────────────────┐
               YES                               NO
                ▼                                 ▼
       ┌────────────────┐                ┌────────────────┐
       │   SQL (RDBMS)  │                │     NoSQL      │
       │ PostgreSQL     │                │ MongoDB, Redis │
       │ MySQL          │                │ Cassandra      │
       └────────────────┘                └────────────────┘
```

### A. SQL (Relational Databases)
- **Data Model:** Structured tables with pre-defined schemas, rows (records), and columns (attributes).
- **Core Strengths:**
  - **ACID Guarantees:** Atomicity, Consistency, Isolation, Durability. Perfect for financial transactions, billing, and order processing.
  - **Relational Joins:** Powerful querying across normalized entities using SQL.
  - **Data Integrity:** Enforces schema constraints (NOT NULL, UNIQUE, FOREIGN KEY, CHECK).
- **Bottlenecks:** Hard to horizontally scale writes. Typically scaled vertically or through read replicas.

### B. NoSQL (Non-Relational Databases)
- **Types of NoSQL:**
  1. **Document Stores (MongoDB):** JSON-like BSON documents. High flexibility, nested objects.
  2. **Key-Value Stores (Redis, DynamoDB):** Ultra-fast $O(1)$ lookups by key. Ideal for caches and sessions.
  3. **Wide-Column Stores (Cassandra, ScyllaDB):** Massive horizontal write throughput, distributed across clusters.
  4. **Graph Databases (Neo4j):** Nodes and edges for social graphs and recommendation engines.
- **Core Strengths:**
  - Flexible / Dynamic schemas (fields can vary per document).
  - Built from the ground up for horizontal scale-out and data partitioning across clusters.
- **Bottlenecks:** Lack of cross-table relational joins, eventual consistency by default (BASE instead of strict ACID).

### SDE-1 Trade-off Matrix

| Dimension | SQL (PostgreSQL / MySQL) | NoSQL (MongoDB / DynamoDB / Redis) |
| :--- | :--- | :--- |
| **Schema** | Rigid, predefined upfront | Dynamic, flexible JSON/schema-less |
| **Transactions** | Strong ACID out of the box | Eventual consistency (BASE); multi-doc ACID is costly |
| **Scalability** | Vertical scale-up; complex sharding | Horizontal scale-out native |
| **Querying** | Rich SQL with complex multi-table JOINs | Query by primary key/partition key; JOINs discouraged |
| **Primary Use Cases** | Banking, E-Commerce Orders, User Auth | Caching, Real-time telemetry, Product catalogs, Chat messages |

---

## 2. Relational Database Concepts: Primary Key vs Foreign Key

### Primary Key (PK)
- Uniquely identifies each row in a table.
- **Strict rules:** Must be unique and cannot contain `NULL`.
- In InnoDB (MySQL) and PostgreSQL, the Primary Key automatically creates a **Clustered Index** (physical ordering on disk).

### Foreign Key (FK)
- A column (or set of columns) that references the Primary Key of another table.
- Enforces **Referential Integrity**: You cannot insert an order for a `user_id` that does not exist in the `users` table.

```
   users Table (Parent)                     orders Table (Child)
┌────┬───────────────┐               ┌─────┬────────┬─────────┐
│ id │ name          │ <──────┐      │ id  │ amount │ user_id │
├────┼───────────────┤        │      ├─────┼────────┼─────────┤
│ 1  │ Alice         │        └───── │ 101 │  99.00 │    1    │
│ 2  │ Bob           │               │ 102 │  45.00 │    2    │
└────┴───────────────┘               └─────┴────────┴─────────┘
   PRIMARY KEY (id)                     FOREIGN KEY (user_id)
```

### Cascading Actions on Delete / Update

| Action | Behavior When Parent Row is Deleted | Production Recommendation |
| :--- | :--- | :--- |
| `ON DELETE RESTRICT` (or `NO ACTION`) | Blocks parent deletion if child records exist. | **Best practice for financial & audit data.** |
| `ON DELETE CASCADE` | Deletes parent row AND automatically deletes all associated children. | Useful for ephemeral data (e.g., deleting user deletes draft comments). Dangerous in billing! |
| `ON DELETE SET NULL` | Deletes parent row, sets child foreign key column to `NULL`. | Requires the child FK column to be nullable. |

---

## 3. Database Relationships (1:1, 1:N, N:M)

Relational modeling represents how entities connect to each other.

### 1. One-to-One (1:1)
*Example:* A User has exactly one Profile (and a Profile belongs to one User).
- **How to model:** Place the Foreign Key on either table with a **`UNIQUE` constraint**, or have both tables share the exact same Primary Key.

```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE, -- UNIQUE guarantees 1:1!
  bio TEXT,
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 2. One-to-Many (1:N)
*Example:* One User has Many Orders; each Order belongs to exactly one User.
- **How to model:** Place the Foreign Key on the **"Many"** side (the child table).

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL, -- Many orders point to 1 user
  total_amount DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- SDE-1 PERFORMANCE TIP: Always index FK columns manually in PostgreSQL!
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

### 3. Many-to-Many (N:M)
*Example:* A Student can enroll in many Courses; a Course can have many Students.
- Relational tables **cannot** store an array of IDs in a clean normalized way.
- **How to model:** Create a separate **Junction Table** (also called Join Table / Association Table) containing Foreign Keys to both entities, with a **Composite Primary Key** to prevent duplicate enrollments.

```
┌──────────┐            ┌──────────────────────┐            ┌──────────┐
│ students │ 1 ─── N    │ student_courses (J)  │    N ─── 1 │ courses  │
├──────────┤            ├──────────────────────┤            ├──────────┤
│ id (PK)  │            │ student_id (FK, PK)  │            │ id (PK)  │
│ name     │            │ course_id  (FK, PK)  │            │ title    │
└──────────┘            │ enrolled_at          │            └──────────┘
                        └──────────────────────┘
```

```sql
CREATE TABLE student_courses (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Composite Primary Key prevents the same student from enrolling twice in the same course!
  PRIMARY KEY (student_id, course_id),
  
  CONSTRAINT fk_sc_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_sc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Crucial: Composite PK (student_id, course_id) automatically indexes queries filtering by student_id.
-- But queries filtering by course_id need their own secondary index!
CREATE INDEX idx_student_courses_course_id ON student_courses(course_id);
```

---

## 4. Key Takeaways for SDE-1 Interviews
1. **Never default blindly to NoSQL or SQL:** Base your answer on data structure (relational vs document) and consistency needs (ACID vs eventual consistency).
2. **Every 1:N puts the FK on the "Many" side:** Never put arrays of IDs in columns (violates 1NF).
3. **Every N:M requires a Junction Table:** Use a Composite Primary Key `(col_a, col_b)` to guarantee uniqueness, and remember to index `col_b` for reverse lookups.
