// Day 10: Transaction-based APIs - Money Transfer Example

const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'bank_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ====================
// Example 1: Basic Money Transfer
// ====================

async function transferMoney(fromAccountId, toAccountId, amount) {
    const connection = await pool.getConnection();

    try {
        // Start transaction
        await connection.beginTransaction();

        // Check source account balance
        const [fromAccount] = await connection.query(
            'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
            [fromAccountId]
        );

        if (!fromAccount.length) {
            throw new Error('Source account not found');
        }

        if (fromAccount[0].balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Debit source account
        await connection.query(
            'UPDATE accounts SET balance = balance - ? WHERE id = ?',
            [amount, fromAccountId]
        );

        // Credit destination account
        await connection.query(
            'UPDATE accounts SET balance = balance + ? WHERE id = ?',
            [amount, toAccountId]
        );

        // Log transaction
        await connection.query(
            'INSERT INTO transactions (from_account_id, to_account_id, amount, type) VALUES (?, ?, ?, ?)',
            [fromAccountId, toAccountId, amount, 'TRANSFER']
        );

        // Commit transaction
        await connection.commit();

        console.log(`✅ Transferred $${amount} from account ${fromAccountId} to ${toAccountId}`);
        return { success: true, message: 'Transfer successful' };

    } catch (error) {
        // Rollback on error
        await connection.rollback();
        console.error('❌ Transfer failed:', error.message);
        throw error;
    } finally {
        // Always release connection
        connection.release();
    }
}

// ====================
// Example 2: Transfer with Deadlock Retry
// ====================

async function transferMoneyWithRetry(fromAccountId, toAccountId, amount, maxRetries = 3) {
    let attempt = 0;

    while (attempt < maxRetries) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Lock accounts in consistent order (prevent deadlocks)
            const accountIds = [fromAccountId, toAccountId].sort((a, b) => a - b);

            for (const id of accountIds) {
                await connection.query(
                    'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
                    [id]
                );
            }

            // Check balance
            const [fromAccount] = await connection.query(
                'SELECT balance FROM accounts WHERE id = ?',
                [fromAccountId]
            );

            if (fromAccount[0].balance < amount) {
                throw new Error('Insufficient funds');
            }

            // Perform transfer
            await connection.query(
                'UPDATE accounts SET balance = balance - ? WHERE id = ?',
                [amount, fromAccountId]
            );

            await connection.query(
                'UPDATE accounts SET balance = balance + ? WHERE id = ?',
                [amount, toAccountId]
            );

            // Log transaction
            await connection.query(
                'INSERT INTO transactions (from_account_id, to_account_id, amount, type, created_at) VALUES (?, ?, ?, ?, NOW())',
                [fromAccountId, toAccountId, amount, 'TRANSFER']
            );

            await connection.commit();
            console.log(`✅ Transferred $${amount} (attempt ${attempt + 1})`);
            return { success: true };

        } catch (error) {
            await connection.rollback();

            // Retry on deadlock
            if (error.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries - 1) {
                attempt++;
                const delay = 100 * Math.pow(2, attempt); // Exponential backoff
                console.log(`⚠️  Deadlock detected, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                connection.release();
                continue;
            }

            console.error('❌ Transfer failed:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    throw new Error(`Transfer failed after ${maxRetries} attempts`);
}

// ====================
// Example 3: E-commerce Order with Savepoints
// ====================

async function createOrder(userId, items) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, status, created_at) VALUES (?, ?, NOW())',
            [userId, 'pending']
        );
        const orderId = orderResult.insertId;

        await connection.query('SAVEPOINT order_created');

        let totalAmount = 0;

        // Add order items
        for (const item of items) {
            // Check stock
            const [product] = await connection.query(
                'SELECT stock, price FROM products WHERE id = ? FOR UPDATE',
                [item.productId]
            );

            if (!product.length) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product[0].stock < item.quantity) {
                // Rollback to savepoint (keep order, remove items)
                await connection.query('ROLLBACK TO order_created');
                throw new Error(`Insufficient stock for product ${item.productId}`);
            }

            // Add order item
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, product[0].price]
            );

            // Update stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId]
            );

            totalAmount += product[0].price * item.quantity;
        }

        // Update order total
        await connection.query(
            'UPDATE orders SET total_amount = ?, status = ? WHERE id = ?',
            [totalAmount, 'confirmed', orderId]
        );

        await connection.commit();

        console.log(`✅ Order ${orderId} created successfully. Total: $${totalAmount}`);
        return { success: true, orderId, totalAmount };

    } catch (error) {
        await connection.rollback();
        console.error('❌ Order creation failed:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

// ====================
// Example 4: Batch Operations
// ====================

async function processBatchPayments(payments) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const results = [];

        for (const payment of payments) {
            try {
                // Check balance
                const [account] = await connection.query(
                    'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
                    [payment.accountId]
                );

                if (!account.length) {
                    results.push({
                        accountId: payment.accountId,
                        success: false,
                        error: 'Account not found'
                    });
                    continue;
                }

                if (account[0].balance < payment.amount) {
                    results.push({
                        accountId: payment.accountId,
                        success: false,
                        error: 'Insufficient funds'
                    });
                    continue;
                }

                // Deduct payment
                await connection.query(
                    'UPDATE accounts SET balance = balance - ? WHERE id = ?',
                    [payment.amount, payment.accountId]
                );

                // Log payment
                await connection.query(
                    'INSERT INTO payments (account_id, amount, description, created_at) VALUES (?, ?, ?, NOW())',
                    [payment.accountId, payment.amount, payment.description]
                );

                results.push({
                    accountId: payment.accountId,
                    success: true
                });

            } catch (error) {
                results.push({
                    accountId: payment.accountId,
                    success: false,
                    error: error.message
                });
            }
        }

        // Commit all successful payments
        await connection.commit();

        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Processed ${successCount}/${payments.length} payments successfully`);

        return results;

    } catch (error) {
        await connection.rollback();
        console.error('❌ Batch processing failed:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

// ====================
// Express API Routes
// ====================

const express = require('express');
const app = express();
app.use(express.json());

// POST /api/transfer
app.post('/api/transfer', async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;

        // Validation
        if (!fromAccountId || !toAccountId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be positive' });
        }

        if (fromAccountId === toAccountId) {
            return res.status(400).json({ error: 'Cannot transfer to same account' });
        }

        // Execute transfer with retry
        const result = await transferMoneyWithRetry(fromAccountId, toAccountId, amount);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items || !items.length) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const result = await createOrder(userId, items);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// POST /api/payments/batch
app.post('/api/payments/batch', async (req, res) => {
    try {
        const { payments } = req.body;

        if (!payments || !Array.isArray(payments)) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const results = await processBatchPayments(payments);

        res.json({ results });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ====================
// Test the APIs
// ====================

async function testAPIs() {
    try {
        // Test 1: Simple transfer
        console.log('\n=== Test 1: Simple Transfer ===');
        await transferMoney(1, 2, 100);

        // Test 2: Transfer with retry
        console.log('\n=== Test 2: Transfer with Retry ===');
        await transferMoneyWithRetry(1, 2, 50);

        // Test 3: Create order
        console.log('\n=== Test 3: Create Order ===');
        await createOrder(1, [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ]);

        // Test 4: Batch payments
        console.log('\n=== Test 4: Batch Payments ===');
        await processBatchPayments([
            { accountId: 1, amount: 10, description: 'Payment 1' },
            { accountId: 2, amount: 20, description: 'Payment 2' },
            { accountId: 3, amount: 15, description: 'Payment 3' }
        ]);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await pool.end();
    }
}

// Run tests
if (require.main === module) {
    testAPIs();
}

module.exports = {
    transferMoney,
    transferMoneyWithRetry,
    createOrder,
    processBatchPayments
};
