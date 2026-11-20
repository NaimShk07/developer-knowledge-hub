# SQL Queries, Aggregations & JOINs (SDE-1 Perspective)

> **Related Files:**  
> - 📑 **Cheatsheet:** [Notes/Cheatsheets/dbms.md](../../Notes/Cheatsheets/dbms.md)  
> - 🎯 **Interview Q&A:** [Interview-Prep/DBMS/dbms-day5-qa.md](../../Interview-Prep/DBMS/dbms-day5-qa.md)  
> - 🗺️ **Week 1 Tracker:** [Learning/Roadmap-Week-1.md](../Roadmap-Week-1.md)

---

## 1. The True SQL Execution Order (The #1 Interview Secret)

When writing SQL, you write `SELECT` first. But the database engine executes it near the **very end**!

### Written Order vs Execution Order

```text
Written Order:                 Logical Execution Order:
1. SELECT                      1. FROM & JOINs (Determine candidate rows)
2. FROM & JOINs                2. WHERE (Filter individual rows)
3. WHERE                       3. GROUP BY (Aggregate rows into groups)
4. GROUP BY                    4. HAVING (Filter aggregated groups)
5. HAVING                      5. SELECT (Evaluate column expressions & aliases)
6. ORDER BY                    6. DISTINCT (Deduplicate rows)
7. LIMIT / OFFSET              7. ORDER BY (Sort final rows)
                               8. LIMIT / OFFSET (Slice final row count)
```

> **Why this matters in interviews:**  
> You **cannot** use a `SELECT` column alias inside `WHERE` because `WHERE` runs at step 2, while `SELECT` hasn't created the alias until step 5!  
> However, you **can** use the alias in `ORDER BY` because `ORDER BY` runs at step 7.

---

## 2. WHERE vs HAVING

Both filter data, but at fundamentally different phases in the query lifecycle.

| Dimension | `WHERE` Clause | `HAVING` Clause |
| :--- | :--- | :--- |
| **When it runs** | **Before** grouping (Step 2) | **After** grouping (Step 4) |
| **Operates on** | Individual table rows | Aggregated groups of rows |
| **Aggregates?** | ❌ Cannot use `SUM()`, `COUNT()`, `AVG()` | ✅ Specifically designed for aggregates |
| **Performance** | High (eliminates rows early via indexes) | Slower (evaluates entire groups in memory) |

```sql
-- Practical Example: Find users who spent more than $500 in total, 
-- but only count completed orders in 2026.
SELECT 
  user_id, 
  SUM(amount) AS total_spent
FROM orders
WHERE status = 'COMPLETED' AND order_date >= '2026-01-01'  -- Row-level filter (WHERE)
GROUP BY user_id
HAVING SUM(amount) > 500                                    -- Group-level filter (HAVING)
ORDER BY total_spent DESC;
```

---

## 3. Aggregate Functions & The NULL Gotcha

* `COUNT(*)`: Counts every candidate row returned, including rows where columns are `NULL`.
* `COUNT(column)`: Counts only rows where `column IS NOT NULL`.
* `SUM(col)`, `AVG(col)`: Silently ignore `NULL` values.
* `MIN(col)`, `MAX(col)`: Silently ignore `NULL` values.

```sql
-- If column 'bonus' has values: [100, 200, NULL]
-- COUNT(*)       --> 3
-- COUNT(bonus)   --> 2
-- AVG(bonus)     --> (100 + 200) / 2 = 150 (NOT 100!)
```

---

## 4. SQL JOINs Visualized

```text
Table A (Users)               Table B (Orders)
┌────┬────────┐               ┌─────┬─────────┬────────┐
│ id │ name   │               │ id  │ user_id │ amount │
├────┼────────┤               ├─────┼─────────┼────────┤
│ 1  │ Alice  │               │ 101 │    1    │  50.00 │
│ 2  │ Bob    │               │ 102 │    1    │  80.00 │
│ 3  │ Charlie│               │ 103 │    2    │  30.00 │
└────┴────────┘               └─────┴─────────┴────────┘
```

### 1. INNER JOIN
Returns only the rows that have a matching key in **both** tables.
```sql
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
-- Returns Alice (2 orders) and Bob (1 order). Charlie is excluded!
```

### 2. LEFT JOIN (LEFT OUTER JOIN)
Returns **all** rows from the left table (`users`). If there is no match in the right table (`orders`), right-side columns are filled with `NULL`.
```sql
SELECT u.name, o.id AS order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
-- Returns Alice (101, 102), Bob (103), AND Charlie (order_id = NULL)!
```

### The SDE-1 Pattern: "Anti-Join" (Finding Inactive / Orphan Records)
*Interviewer: "Find all users who have never placed an order."*

```sql
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL; -- Charlie!
```

*Alternative using `NOT EXISTS` (Often faster on large datasets because it terminates on first match):*
```sql
SELECT u.id, u.name
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

### 3. RIGHT JOIN & FULL OUTER JOIN
- `RIGHT JOIN`: Keeps all rows from the right table, filling missing left-side columns with `NULL`. (In practice, engineers write `LEFT JOIN` by flipping the table order for readability).
- `FULL OUTER JOIN`: Keeps all rows from both tables. Matches where possible; fills with `NULL` where unmatched.

---

## 5. Critical Interview Trap: ON vs WHERE in a LEFT JOIN

```sql
-- Query 1: Filter in the ON clause
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.amount > 60;
-- Result: Keeps ALL users! Alice gets order 102 ($80). Bob's order ($30) doesn't match ON, 
-- but Bob is STILL returned with amount = NULL!

-- Query 2: Filter in the WHERE clause
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.amount > 60;
-- Result: Turns the LEFT JOIN into an INNER JOIN! 
-- Bob and Charlie are filtered out because their amount is not > 60!
```
