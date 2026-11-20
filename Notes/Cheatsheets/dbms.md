# DBMS & SQL Cheatsheet

> Quick reference for SQL syntax, key hierarchy, constraints, and relational definitions.
> **Deep Dive:** [Learning/DBMS/](01-dbms-introduction-keys-constraints.md) | **Interview Q&A:** [Interview-Prep/DBMS/](dbms-day1-qa.md)

---

## 1. Database Keys Hierarchy

```text
Super Key: Any unique column combination ({id}, {email}, {id, name})
   └── Candidate Key: Minimal unique column ({id}, {email})
          ├── Primary Key: The chosen identifier (Unique + NOT NULL + Clustered Index)
          └── Alternate Key: Remaining candidate keys (Unique constraints)
```

---

## 2. Table Creation with Full Constraints (PostgreSQL / MySQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT CHECK (age >= 18),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  user_id INT NOT NULL,
  
  -- Referential Integrity Constraint
  CONSTRAINT fk_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE RESTRICT -- Safer than CASCADE for financial audit data
);

-- BEST PRACTICE: Always manually index Foreign Keys in PostgreSQL!
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## 3. Constraint Rules Matrix

| Constraint | Syntax | Allows NULL? | Auto-Indexes? |
| :--- | :--- | :--- | :--- |
| **PRIMARY KEY** | `id SERIAL PRIMARY KEY` | ❌ Never | ✅ Yes (Clustered B-Tree) |
| **UNIQUE** | `email VARCHAR(255) UNIQUE` | ✅ Yes (1 NULL) | ✅ Yes (Unique B-Tree) |
| **FOREIGN KEY** | `REFERENCES table(col)` | ✅ Yes | ❌ No (Must manually index!) |
| **NOT NULL** | `name VARCHAR(50) NOT NULL` | ❌ Never | ❌ No |
| **CHECK** | `CHECK (age >= 18)` | ✅ Yes | ❌ No |
| **DEFAULT** | `DEFAULT CURRENT_TIMESTAMP` | — | ❌ No |

---

## 4. SQL vs NoSQL Decision Matrix

| Criteria | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, Redis, DynamoDB) |
| :--- | :--- | :--- |
| **Schema** | Pre-defined, rigid relational tables | Flexible, schemaless JSON / Key-Value |
| **Integrity** | ACID transactions, referential foreign keys | BASE (Eventual consistency), loose integrity |
| **Scaling** | Vertical scaling; Read replicas | Native horizontal partitioning / sharding |
| **Best For** | Financial transactions, orders, multi-table joins | Caching, event streams, catalogs, high write RPS |

---

## 5. Relationship Modeling Quick Reference

```sql
-- 1:1 Relationship (Unique FK)
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- 1:N Relationship (FK on 'Many' side + explicit index)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- N:M Relationship (Junction Table + Composite PK + Reverse Index)
CREATE TABLE student_courses (
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, course_id)
);
CREATE INDEX idx_sc_course_id ON student_courses(course_id);
```

---

## 6. SQL Query Execution Order & JOIN Reference

```text
Logical Execution Pipeline:
1. FROM & JOIN  ──> Candidate rows
2. WHERE        ──> Row-level index filter
3. GROUP BY     ──> Grouping into buckets
4. HAVING       ──> Aggregate group filter
5. SELECT       ──> Projection & aliases
6. DISTINCT     ──> Deduplication
7. ORDER BY     ──> Sorting
8. LIMIT/OFFSET ──> Pagination
```

### JOIN Quick Lookup
| JOIN Type | Result Set | Use Case |
| :--- | :--- | :--- |
| **INNER JOIN** | Matches in BOTH tables | Active relationships (`users` with `orders`) |
| **LEFT JOIN** | ALL left rows + matched right rows (or NULL) | Inclusive reports (`users` with or without orders) |
| **LEFT JOIN ... WHERE right.id IS NULL** | Only left rows with NO match | Anti-join: find inactive users / orphan records |
