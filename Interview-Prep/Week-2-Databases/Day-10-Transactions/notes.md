# Day 10: MySQL Transactions & ACID

## 📚 Table of Contents
1. What are Transactions?
2. ACID Principles
3. Transaction Commands
4. Isolation Levels
5. Deadlocks
6. Savepoints
7. Transaction Best Practices
8. Building Transaction-based APIs

---

## 1. What are Transactions?

A **transaction** is a sequence of one or more SQL operations executed as a single unit of work. Either **all operations succeed** (COMMIT) or **all fail** (ROLLBACK).

### Why Transactions?

**Problem without transactions:**
```sql
-- Transfer $100 from Account A to Account B
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Success
-- 💥 System crashes here!
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Never executes

-- Result: $100 disappeared! Data inconsistent.
```

**Solution with transactions:**
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- Both succeed or both fail

-- If crash happens: Transaction rolls back automatically
```

### Transaction Syntax

```sql
-- Start transaction
START TRANSACTION;  -- or BEGIN;

-- Execute SQL operations
UPDATE ...;
INSERT ...;
DELETE ...;

-- End transaction
COMMIT;     -- Make changes permanent
-- OR
ROLLBACK;   -- Undo all changes
```

---

## 2. ACID Principles

ACID ensures transaction reliability.

### A - Atomicity

**"All or nothing"** - Either all operations succeed or none do.

```sql
START TRANSACTION;

-- Transfer money
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Debit
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Credit

COMMIT;  -- Both or neither

-- If any statement fails → Automatic ROLLBACK → No partial updates
```

**Example: E-commerce Order**
```sql
START TRANSACTION;

-- Create order
INSERT INTO orders (user_id, total) VALUES (123, 99.99);
SET @order_id = LAST_INSERT_ID();

-- Add order items
INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (@order_id, 10, 2);

-- Reduce stock
UPDATE products SET stock = stock - 2 WHERE id = 10;

-- If stock update fails (negative stock), entire order rolls back
COMMIT;
```

### C - Consistency

**Data remains valid** before and after the transaction. All constraints, triggers, and rules are enforced.

```sql
-- Constraint: balance >= 0
ALTER TABLE accounts ADD CONSTRAINT chk_balance CHECK (balance >= 0);

START TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE id = 1;  -- balance = -50
-- ❌ Violates constraint → Transaction fails → ROLLBACK
COMMIT;
```

**Consistency Examples:**
- Foreign key constraints
- Unique constraints
- Check constraints
- Triggers

### I - Isolation

**Concurrent transactions don't interfere** with each other. Each transaction operates as if it's the only one.

```sql
-- Transaction 1
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- Other transactions don't see this change yet
COMMIT;  -- Now visible to others
```

**Isolation Levels** (covered later):
- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ (default)
- SERIALIZABLE

### D - Durability

**Committed changes are permanent**, even if system crashes. Data is written to persistent storage.

```sql
START TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE id = 1;
COMMIT;  -- ✅ Saved to disk

-- 💥 Power outage immediately after
-- ✅ On restart: balance is still 1000
```

**How MySQL Ensures Durability:**
- **Write-Ahead Logging (WAL)**: Changes written to log before data files
- **Redo logs**: Can replay transactions after crash
- **Doublewrite buffer**: Prevents partial page writes

---

## 3. Transaction Commands

### START TRANSACTION
```sql
START TRANSACTION;
-- or
BEGIN;
```

### COMMIT
```sql
-- Make all changes permanent
COMMIT;
```

### ROLLBACK
```sql
-- Undo all changes since START TRANSACTION
ROLLBACK;
```

### SAVEPOINT
```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT sp1;  -- Create checkpoint

UPDATE accounts SET balance = balance + 100 WHERE id = 2;
SAVEPOINT sp2;

UPDATE products SET stock = stock - 1 WHERE id = 10;
-- Oops, stock became negative

ROLLBACK TO sp2;  -- Undo only product update
-- First two updates still active

COMMIT;  -- Commit account updates only
```

### Autocommit

```sql
-- Check autocommit status
SELECT @@autocommit;  -- 1 = ON, 0 = OFF

-- By default: Every statement is a transaction
INSERT INTO users (name) VALUES ('John');  -- Auto-committed

-- Disable autocommit
SET autocommit = 0;

-- Now need explicit COMMIT
INSERT INTO users (name) VALUES ('Jane');  -- Not committed yet
COMMIT;  -- Now committed
```

---

## 4. Isolation Levels

Isolation levels control what data transactions can see from other concurrent transactions.

### Isolation Phenomena

**1. Dirty Read:** Reading uncommitted changes from another transaction

```sql
-- Transaction 1
START TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE id = 1;
-- Not committed yet

-- Transaction 2 (with READ UNCOMMITTED)
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Sees 1000 (dirty read!)

-- Transaction 1
ROLLBACK;  -- Oops, change undone

-- Transaction 2 saw invalid data!
```

**2. Non-Repeatable Read:** Reading same row twice gives different results

```sql
-- Transaction 1
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- balance = 500

-- Transaction 2
START TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE id = 1;
COMMIT;

-- Transaction 1
SELECT balance FROM accounts WHERE id = 1;  -- balance = 1000 (different!)
```

**3. Phantom Read:** Query returns different rows on re-execution

```sql
-- Transaction 1
START TRANSACTION;
SELECT * FROM accounts WHERE balance > 500;  -- Returns 10 rows

-- Transaction 2
START TRANSACTION;
INSERT INTO accounts (balance) VALUES (1000);
COMMIT;

-- Transaction 1
SELECT * FROM accounts WHERE balance > 500;  -- Returns 11 rows (phantom!)
```

### MySQL Isolation Levels

| Level            | Dirty Read  | Non-Repeatable | Phantom             | Speed   |
| ---------------- | ----------- | -------------- | ------------------- | ------- |
| READ UNCOMMITTED | ❌ Possible  | ❌ Possible     | ❌ Possible          | Fastest |
| READ COMMITTED   | ✅ Prevented | ❌ Possible     | ❌ Possible          | Fast    |
| REPEATABLE READ  | ✅ Prevented | ✅ Prevented    | ✅ Mostly Prevented* | Medium  |
| SERIALIZABLE     | ✅ Prevented | ✅ Prevented    | ✅ Prevented         | Slowest |

\* InnoDB prevents phantoms using next-key locks

**Default:** REPEATABLE READ

### Setting Isolation Level

```sql
-- Session level
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Global level
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Per transaction
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
...
COMMIT;

-- Check current level
SELECT @@transaction_isolation;
```

### Examples

**READ UNCOMMITTED:**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Can see uncommitted changes
COMMIT;
```

**READ COMMITTED:**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Only committed data
SELECT balance FROM accounts WHERE id = 1;  -- May differ if updated
COMMIT;
```

**REPEATABLE READ (default):**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- balance = 500
-- Another transaction updates to 1000
SELECT balance FROM accounts WHERE id = 1;  -- Still 500 (repeatable)
COMMIT;
```

**SERIALIZABLE:**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
SELECT * FROM accounts WHERE balance > 500;
-- Any concurrent INSERT/UPDATE on accounts waits
COMMIT;
```

---

## 5. Deadlocks

**Deadlock:** Two or more transactions waiting for each other to release locks, creating a circular dependency.

### Example Deadlock

```sql
-- Transaction 1
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Locks row 1
-- Waiting...
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Needs lock on row 2

-- Transaction 2 (concurrent)
START TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- Locks row 2
-- Waiting...
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- Needs lock on row 1

-- 💀 DEADLOCK!
-- MySQL detects and kills one transaction:
-- ERROR 1213: Deadlock found when trying to get lock; try restarting transaction
```

### Deadlock Detection

MySQL automatically detects deadlocks and rolls back one transaction.

```sql
-- Check deadlock information
SHOW ENGINE INNODB STATUS;
-- Look for "LATEST DETECTED DEADLOCK" section
```

### Preventing Deadlocks

**1. Access tables/rows in same order:**
```sql
-- ✅ Good: Both transactions access in same order
-- Transaction 1
UPDATE accounts WHERE id = 1;  -- First
UPDATE accounts WHERE id = 2;  -- Second

-- Transaction 2
UPDATE accounts WHERE id = 1;  -- First (waits for Transaction 1)
UPDATE accounts WHERE id = 2;  -- Second
```

**2. Keep transactions short:**
```sql
-- ❌ Bad: Long transaction
START TRANSACTION;
SELECT * FROM accounts WHERE id = 1;
-- User input for 30 seconds...
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- ✅ Good: Short transaction
-- Get user input first
-- Then quick transaction:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**3. Use lower isolation level:**
```sql
-- SERIALIZABLE → more locks → more deadlocks
-- READ COMMITTED → fewer locks → fewer deadlocks
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

**4. Use indexes:**
```sql
-- Without index: Locks many rows
UPDATE accounts SET balance = balance + 10 WHERE status = 'active';

-- With index: Locks only matching rows
CREATE INDEX idx_status ON accounts(status);
```

**5. Handle deadlock in application:**
```javascript
async function transferMoney(fromId, toId, amount) {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            await db.query('START TRANSACTION');
            await db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromId]);
            await db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toId]);
            await db.query('COMMIT');
            return { success: true };
        } catch (error) {
            await db.query('ROLLBACK');
            
            if (error.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries - 1) {
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
                continue;
            }
            throw error;
        }
    }
}
```

---

## 6. Savepoints

**Savepoints** allow partial rollback within a transaction.

```sql
START TRANSACTION;

-- Step 1: Create order
INSERT INTO orders (user_id, total) VALUES (123, 99.99);
SAVEPOINT order_created;

-- Step 2: Add items
INSERT INTO order_items (order_id, product_id) VALUES (LAST_INSERT_ID(), 10);
SAVEPOINT items_added;

-- Step 3: Update stock
UPDATE products SET stock = stock - 1 WHERE id = 10;

-- Oops, stock became negative
IF (SELECT stock FROM products WHERE id = 10) < 0 THEN
    ROLLBACK TO items_added;  -- Undo stock update only
    -- Order and items still active
END IF;

-- Or rollback everything
-- ROLLBACK TO order_created;

COMMIT;
```

**Savepoint Commands:**
```sql
SAVEPOINT savepoint_name;              -- Create savepoint
ROLLBACK TO savepoint_name;            -- Rollback to savepoint
RELEASE SAVEPOINT savepoint_name;      -- Remove savepoint
```

---

## 7. Transaction Best Practices

### ✅ 1. Keep Transactions Short
```javascript
// ❌ Bad: Long transaction
await db.query('START TRANSACTION');
const users = await db.query('SELECT * FROM users');
// Process for 10 seconds...
await db.query('UPDATE accounts SET balance = balance + 10');
await db.query('COMMIT');

// ✅ Good: Short transaction
const users = await db.query('SELECT * FROM users');
// Process data...
await db.query('START TRANSACTION');
await db.query('UPDATE accounts SET balance = balance + 10');
await db.query('COMMIT');
```

### ✅ 2. Handle Errors Properly
```javascript
try {
    await db.query('START TRANSACTION');
    await db.query('UPDATE ...');
    await db.query('INSERT ...');
    await db.query('COMMIT');
} catch (error) {
    await db.query('ROLLBACK');  // Always rollback on error
    throw error;
}
```

### ✅ 3. Use Appropriate Isolation Level
```javascript
// Default (REPEATABLE READ) is good for most cases
// Use READ COMMITTED for better concurrency
await db.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
```

### ✅ 4. Avoid User Input During Transaction
```javascript
// ❌ Bad
await db.query('START TRANSACTION');
await getUserInput();  // Transaction held open!
await db.query('UPDATE ...');
await db.query('COMMIT');

// ✅ Good
await getUserInput();
await db.query('START TRANSACTION');
await db.query('UPDATE ...');
await db.query('COMMIT');
```

### ✅ 5. Use Connection Pooling
```javascript
// Don't hold connections during long operations
const connection = await pool.getConnection();
try {
    await connection.beginTransaction();
    await connection.query('UPDATE ...');
    await connection.commit();
} catch (error) {
    await connection.rollback();
    throw error;
} finally {
    connection.release();  // Return to pool
}
```

---

## 8. Building Transaction-based APIs

See `/examples` folder for:
- Money transfer API with transactions
- E-commerce order creation
- Inventory management
- Multi-step booking system

---

## Quick Reference

### Commands
```sql
START TRANSACTION;        -- Begin
COMMIT;                   -- Save changes
ROLLBACK;                 -- Undo changes
SAVEPOINT name;           -- Checkpoint
ROLLBACK TO name;         -- Partial undo
```

### Isolation Levels
```sql
READ UNCOMMITTED    -- Fastest, least safe
READ COMMITTED      -- Good balance
REPEATABLE READ     -- Default, safe
SERIALIZABLE        -- Safest, slowest
```

### Deadlock Prevention
- Access resources in same order
- Keep transactions short
- Use indexes
- Handle deadlock with retry logic
