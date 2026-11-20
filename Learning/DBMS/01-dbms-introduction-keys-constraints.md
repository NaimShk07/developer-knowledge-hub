# Week 1: DBMS Foundations (Day 1)

> A database management system (DBMS) manages data storage, retrieval, and updates. In relational databases (RDBMS), data integrity is strictly enforced through mathematical keys and constraints.

---

## 1. Key Takeaways (TL;DR)

- **DBMS vs RDBMS:** DBMS stores data as files (no relationships enforced); RDBMS stores data in structured tabular relations with strict schema and foreign key enforcement.
- **Primary Key:** A unique, non-null identifier for every row in a table.
- **Candidate Key:** Any column or minimal combination of columns capable of uniquely identifying a record.
- **Foreign Key:** A column that points to the Primary Key of another table, enforcing **Referential Integrity**.
- **Constraints:** Rules enforced by the database engine (`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `PRIMARY KEY`, `FOREIGN KEY`) to prevent corrupted or invalid data from ever being written.

---

## 2. DBMS vs RDBMS: The Architectural Difference

```text
[ FILE-BASED DBMS (e.g. XML, File System, flat files) ]
File 1: Users.txt ───────> No engine enforcement! If an ID is deleted,
File 2: Orders.txt ──────> orphaned records are left behind silently.

[ RELATIONAL DBMS (e.g. PostgreSQL, MySQL) ]
┌────────────────────────┐         ┌────────────────────────┐
│      users Table       │         │      orders Table      │
├────────────────────────┤         ├────────────────────────┤
│ PK  id: INT (Unique)   │◄────────┤ FK  user_id: INT       │
│     name: VARCHAR      │         │     amount: DECIMAL    │
└────────────────────────┘         └────────────────────────┘
Engine blocks writing an order if user_id does not exist in users table!
```

---

## 3. Database Keys Hierarchy

Understanding keys is the most common Day 1 interview topic:

```text
Super Keys (Any set of attributes that uniquely identifies a row)
   └── Candidate Keys (Minimal Super Keys with no redundant columns)
          ├── Primary Key (The ONE selected candidate key used by the engine)
          └── Alternate Keys (The remaining unused candidate keys)
```

- **Super Key:** Any combination of columns that guarantees uniqueness (e.g., `{id, email}`, `{id, name}`, or `{id}`).
- **Candidate Key:** A super key without unnecessary columns (e.g., `{id}` or `{email}`).
- **Primary Key (PK):** The chosen identifier. Must be unique and **CANNOT be NULL**. Most databases automatically build a clustered B-Tree index on this.
- **Composite Key:** A primary key made of 2 or more columns (e.g., `{user_id, role_id}` in a join table).
- **Foreign Key (FK):** A reference to a primary key in another table. Enforces referential integrity.

---

## 4. Database Constraints in Action

```sql
CREATE TABLE users (
  -- PRIMARY KEY: Unique + NOT NULL + Clustered B-Tree Index
  id SERIAL PRIMARY KEY,

  -- NOT NULL: Disallows missing values
  name VARCHAR(100) NOT NULL,

  -- UNIQUE: Prevents duplicate accounts, creates a unique B-Tree index
  email VARCHAR(255) NOT NULL UNIQUE,

  -- CHECK: Enforces business logic inside the database engine
  age INT CHECK (age >= 18),

  -- DEFAULT: Automatically applies value if omitted during INSERT
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  
  -- FOREIGN KEY: Rejects insertion if user_id is not in users table
  -- ON DELETE CASCADE: Deletes orders if the associated user is deleted
  user_id INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 5. Common Mistakes & Tips

- **Mistake:** Enforcing uniqueness or foreign keys only in application code (e.g. Express/NestJS), without database constraints.
  - _Fix:_ Under concurrent requests, two requests can pass application checks simultaneously and cause a race condition. Always let the database engine enforce `UNIQUE` and `FOREIGN KEY` constraints.
- **Tip:** When designing foreign keys, carefully decide between `ON DELETE CASCADE` (delete child records) vs `ON DELETE RESTRICT` (prevent parent deletion if children exist). In financial systems, use `RESTRICT` to prevent accidental loss of audit history.

---

## 6. Quick Reference

| Constraint / Key | Purpose | Allows NULL? | Auto Index Created? |
| :--- | :--- | :--- | :--- |
| **PRIMARY KEY** | Unique row identifier | ❌ No | ✅ Yes (Clustered B-Tree) |
| **UNIQUE** | Prevents duplicate values | ✅ Yes (unless combined with NOT NULL) | ✅ Yes (Unique B-Tree) |
| **FOREIGN KEY** | Links to another table's PK | ✅ Yes (nullable FK represents optional relation) | ⚠️ No (Must index manually in Postgres!) |
| **CHECK** | Evaluates a boolean condition | ✅ Yes (NULL passes CHECK condition) | ❌ No |
| **NOT NULL** | Ensures field is never empty | ❌ No | ❌ No |

---

## Related Hubs
- **Cheatsheet:** [Notes/Cheatsheets/dbms.md](../../Notes/Cheatsheets/dbms.md)
- **Interview Q&A:** [Interview-Prep/DBMS/dbms-day1-qa.md](../../Interview-Prep/DBMS/dbms-day1-qa.md)
