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
