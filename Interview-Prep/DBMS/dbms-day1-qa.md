# DBMS Day 1 Interview Questions & Answers

High-frequency SDE-1 interview questions on DBMS vs RDBMS, Keys, and Constraints with 30-second spoken answers and mandatory FAANG follow-ups.

---

### Q1: What is the fundamental difference between a DBMS and an RDBMS?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-dbms-introduction-keys-constraints.md](../../Learning/DBMS/01-dbms-introduction-keys-constraints.md)

#### 30-Second Spoken Answer
> "A DBMS is any software that stores and retrieves data, often treating files as independent records without enforcing relational rules. An RDBMS stores data in structured tabular relations based on relational algebra, strictly enforcing tabular relationships, data schemas, and referential integrity using Foreign Keys and ACID properties."

#### Key Points to Mention (Rule of 3)
1. **Relational Integrity:** An RDBMS automatically prevents orphaned child records via Foreign Keys; a plain file DBMS does not.
2. **ACID Enforcement:** RDBMS engines (like PostgreSQL and MySQL) guarantee Atomicity and Durability during multi-row updates.
3. **Normalization:** RDBMS architectures structure data into normalized tables to eliminate redundancy.

#### Mandatory Follow-Up Questions (Minimum 2 Required)
- **Follow-up 1 (Under-the-Hood / Scaling):** *"Why do high-throughput systems sometimes choose NoSQL over RDBMS?"* → Because enforcing relational constraints and ACID transactions across distributed multi-node clusters incurs high network synchronization overhead.
- **Follow-up 2 (The Trap / Counter-Intuitive Twist):** *"Can an SQLite file database be considered an RDBMS?"* → Yes, because despite storing data in a single local file, SQLite fully supports relational algebra, SQL syntax, foreign key constraints, and ACID transactions.

---

### Q2: What is the difference between a Primary Key, a Candidate Key, and a Super Key?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-dbms-introduction-keys-constraints.md](../../Learning/DBMS/01-dbms-introduction-keys-constraints.md)

#### 30-Second Spoken Answer
> "A Super Key is any attribute or combination of attributes that uniquely identifies a row. A Candidate Key is a minimal Super Key containing no redundant columns. The Primary Key is the single Candidate Key chosen by the database architect to uniquely identify records and build the clustered index, and it can never be NULL."

#### Key Points to Mention (Rule of 3)
1. **Hierarchy:** All Primary Keys are Candidate Keys; all Candidate Keys are Super Keys.
2. **Nullability:** Candidate keys can have NULL values (unless constrained), but a Primary Key **strictly forbids NULL**.
3. **Physical Storage:** In most engines (like MySQL InnoDB), the table rows are physically ordered on disk by the Primary Key (Clustered Index).

#### Mandatory Follow-Up Questions (Minimum 2 Required)
- **Follow-up 1 (Performance / Indexing):** *"Why should you prefer an integer auto-increment or UUIDv7 as a Primary Key over a random UUIDv4?"* → Random UUIDv4 causes index fragmentation and page splits in B-Trees because insertions happen at random physical disk locations rather than appending sequentially.
- **Follow-up 2 (The Constraint Twist):** *"Can a table have multiple Candidate Keys but only one Primary Key?"* → Yes. For example, a user's table can have `id` as the Primary Key and `email` as a unique Candidate Key.

---

### Q3: What are Database Constraints, and why shouldn't we rely solely on application-level validation?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-dbms-introduction-keys-constraints.md](../../Learning/DBMS/01-dbms-introduction-keys-constraints.md)

#### 30-Second Spoken Answer
> "Database constraints are declarative rules enforced by the database engine—such as `NOT NULL`, `UNIQUE`, `CHECK`, and `FOREIGN KEY`—that prevent invalid data from ever being committed. Relying solely on application-level checks in Express or NestJS leads to data corruption due to race conditions when concurrent requests execute simultaneously."

#### Key Points to Mention (Rule of 3)
1. **Race Conditions:** Two concurrent requests checking `if (userExists)` at the exact same millisecond will both pass application checks and attempt duplicate inserts unless a database `UNIQUE` constraint blocks the second write.
2. **Multi-Client Consistency:** If multiple backend microservices or admin scripts access the database, application validation is easily bypassed; engine-level constraints apply universally.
3. **Engine Optimization:** The database optimizer uses constraints (like `CHECK` and `FOREIGN KEY`) to optimize query execution plans.

#### Mandatory Follow-Up Questions (Minimum 2 Required)
- **Follow-up 1 (Indexing):** *"Does defining a FOREIGN KEY in PostgreSQL automatically create an index on that column?"* → **No!** While Primary and Unique keys automatically generate B-Tree indexes, PostgreSQL does NOT index Foreign Key columns by default; you must manually create an index on the foreign key column to prevent sequential table scans during joins and deletes.
- **Follow-up 2 (The Failure Mode Trap):** *"What is the danger of `ON DELETE CASCADE` in production?"* → An accidental single-row deletion on a parent table can cascade and delete millions of historical child records (orders, payments, audit logs) without warning.
