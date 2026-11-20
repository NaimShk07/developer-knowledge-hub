# DBMS Day 5: SQL Queries, Aggregations & JOINs (SDE-1 Q&A)

> **Related Files:**  
> - 🧠 **Deep Dive:** [Learning/DBMS/03-sql-queries-aggregations-joins.md](../../Learning/DBMS/03-sql-queries-aggregations-joins.md)  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/dbms.md](../../Notes/Cheatsheets/dbms.md)  
> - 🏠 **Index:** [Interview-Prep/README.md](../README.md)

---

## Question 1: What is the logical execution order of an SQL query, and why can't you use a SELECT alias in a WHERE clause?

### 1. 30-Second Spoken Answer
> "An SQL query is not executed in the syntactic order it is written. The database engine executes `FROM` and `JOIN`s first, followed by `WHERE`, `GROUP BY`, `HAVING`, and only then evaluates `SELECT`, followed by `DISTINCT`, `ORDER BY`, and `LIMIT`. Because `WHERE` runs at step 2 to filter source rows before column projection, column aliases defined in `SELECT` at step 5 do not exist yet in memory. In contrast, `ORDER BY` runs at step 7, which is why column aliases are valid in `ORDER BY`."

---

### 2. Key Points to Mention (Rule of 3)
1. **Pipeline Order:** `FROM/JOIN` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `DISTINCT` $\rightarrow$ `ORDER BY` $\rightarrow$ `LIMIT`.
2. **Memory Scope:** The `WHERE` clause filters disk pages and indexes before columns are projected into the output buffer by `SELECT`.
3. **Common Interview Fix:** To filter by a computed alias, repeat the expression in `WHERE`, or wrap the projection inside a Subquery or Common Table Expression (CTE).

---

### 3. Code Example & Fix
```sql
-- INCORRECT: Fails with "column total does not exist"
SELECT price * quantity AS total
FROM order_items
WHERE total > 1000;

-- CORRECT: Repeat expression OR use CTE
WITH calculated_orders AS (
  SELECT id, price * quantity AS total
  FROM order_items
)
SELECT * FROM calculated_orders WHERE total > 1000;
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / Grouping)
**Interviewer:** *"Can you use an aggregate function like `WHERE SUM(amount) > 500`?"*  
**Spoken Response:**  
> "No. Aggregate functions compute summaries across groups of rows. Because `WHERE` filters individual rows *before* rows are grouped by `GROUP BY`, the aggregate summary does not exist yet. Filtering based on aggregate values must always be placed in the `HAVING` clause, which executes *after* grouping."

#### Follow-up 2 (Interviewer Trap / ORDER BY vs WHERE)
**Interviewer:** *"Why does `ORDER BY total DESC` work with the alias, but `WHERE total > 1000` does not?"*  
**Spoken Response (Avoid the Trap):**  
> "Because `ORDER BY` executes *after* `SELECT`. By the time the database engine sorts the resulting rows, the projection in `SELECT` has already calculated the expressions and bound the alias name to the result set column."

---

## Question 2: Compare WHERE vs HAVING. Can both be used in the same query?

### 1. 30-Second Spoken Answer
> "`WHERE` filters individual records before grouping and aggregation, whereas `HAVING` filters aggregated groups after the `GROUP BY` phase. Yes, both can and should be used together in the same query: we use `WHERE` to filter out irrelevant rows as early as possible—leveraging B-Tree indexes—and then use `HAVING` strictly for conditions that depend on aggregate functions like `SUM()` or `COUNT()`."

---

### 2. Key Points to Mention (Rule of 3)
1. **Execution Timing:** `WHERE` operates on raw rows pre-aggregation; `HAVING` operates on grouped buckets post-aggregation.
2. **Index Utilization:** `WHERE` uses table indexes to reduce the number of rows scanned; `HAVING` cannot use indexes for aggregate conditions.
3. **Performance Best Practice:** Never put non-aggregate conditions in `HAVING`. Filtering rows in `WHERE` minimizes memory usage and grouping overhead.

---

### 3. Dual Usage Query Example
```sql
SELECT 
  department_id, 
  COUNT(id) AS employee_count,
  AVG(salary) AS avg_salary
FROM employees
WHERE is_active = TRUE         -- WHERE filters active rows first (uses index!)
GROUP BY department_id
HAVING AVG(salary) > 80000;    -- HAVING filters aggregated groups
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Performance Edge Case)
**Interviewer:** *"What is the performance difference between `WHERE department_id = 10` and `HAVING department_id = 10`?"*  
**Spoken Response:**  
> "Placing `department_id = 10` in `WHERE` allows the optimizer to use an index on `department_id`, scanning only rows for department 10. Placing it in `HAVING` forces the database to scan the *entire table*, group all departments across all employees into memory, and only then discard every group except department 10. The `HAVING` approach consumes significantly more CPU and memory."

#### Follow-up 2 (Interviewer Trap / NULLs in Aggregation)
**Interviewer:** *"What is the difference between `COUNT(*)` and `COUNT(commission)` when grouping in HAVING?"*  
**Spoken Response (Avoid the Trap):**  
> "`COUNT(*)` counts total rows in the group regardless of whether columns are null. `COUNT(commission)` counts only rows where the `commission` column is NOT NULL. If an employee has a row but `commission` is NULL, `COUNT(*)` increments, but `COUNT(commission)` does not."

---

## Question 3: How do you find records in Table A that do not exist in Table B using SQL?

### 1. 30-Second Spoken Answer
> "We can identify records in Table A that do not exist in Table B using either a `LEFT JOIN` with a `NULL` filter on the child key, or a `NOT EXISTS` subquery. In a `LEFT JOIN`, unmatched right-side records return `NULL`. By filtering `WHERE b.id IS NULL`, we extract only the parent records lacking child relationships. In PostgreSQL, `NOT EXISTS` is generally preferred because the query planner can stop scanning the child table as soon as the first matching record is found."

---

### 2. Key Points to Mention (Rule of 3)
1. **LEFT JOIN Anti-Pattern Filter:** `LEFT JOIN table_b ON a.id = b.a_id WHERE b.id IS NULL`.
2. **Short-Circuiting with `NOT EXISTS`:** `WHERE NOT EXISTS (SELECT 1 FROM table_b b WHERE b.a_id = a.id)` short-circuits on the first match.
3. **The `NOT IN` Danger with NULLs:** Never use `NOT IN (SELECT a_id FROM table_b)` because if the subquery returns even a single `NULL`, the entire `NOT IN` expression evaluates to `UNKNOWN` and returns zero rows!

---

### 3. Production Query Comparison
```sql
-- Approach 1: LEFT JOIN with IS NULL
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- Approach 2: NOT EXISTS (Recommended for large datasets)
SELECT u.id, u.name
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

---

### 4. Mandatory Follow-up Questions

#### Follow-up 1 (Constraint Twist / ON vs WHERE in LEFT JOIN)
**Interviewer:** *"What happens if you move a condition on the right table from `WHERE` to `ON` in a `LEFT JOIN`?"*  
**Spoken Response:**  
> "If you place `o.amount > 100` in the `ON` clause of a `LEFT JOIN`, all parent user rows are still preserved; users without an order exceeding $100 simply appear with `NULL` order columns. However, if you place `o.amount > 100` in the `WHERE` clause, any `NULL` row fails the comparison, silently converting your `LEFT JOIN` into an `INNER JOIN` and dropping users without matching orders."

#### Follow-up 2 (Interviewer Trap / NOT IN vs NOT EXISTS)
**Interviewer:** *"Why is `NOT IN` considered a critical trap for junior backend engineers?"*  
**Spoken Response (Avoid the Trap):**  
> "In SQL three-valued logic (`TRUE`, `FALSE`, `UNKNOWN`), `x NOT IN (1, 2, NULL)` expands to `x != 1 AND x != 2 AND x != NULL`. Since any comparison with `NULL` yields `UNKNOWN`, the entire condition evaluates to `UNKNOWN`, causing the query to return zero records. `NOT EXISTS` avoids this trap completely and handles nulls safely."
