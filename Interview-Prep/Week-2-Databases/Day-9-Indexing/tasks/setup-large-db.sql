-- Day 9: Setup Large Database for Performance Testing

CREATE DATABASE IF NOT EXISTS performance_test;
USE performance_test;

-- Drop tables if exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Users table (100,000 rows)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(50),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    last_login TIMESTAMP NULL
);

-- Products table (10,000 rows)
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(50),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (500,000 rows)
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10,2),
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    notes TEXT
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Stored procedure to generate test data
DELIMITER //

CREATE PROCEDURE generate_users(IN num_rows INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_country VARCHAR(50);
    DECLARE random_status ENUM('active', 'inactive', 'suspended');
    
    WHILE i <= num_rows DO
        SET random_country = ELT(FLOOR(1 + RAND() * 5), 'USA', 'UK', 'Canada', 'Australia', 'Germany');
        SET random_status = ELT(FLOOR(1 + RAND() * 3), 'active', 'inactive', 'suspended');
        
        INSERT INTO users (name, email, country, status, created_at, city)
        VALUES (
            CONCAT('User', i),
            CONCAT('user', i, '@example.com'),
            random_country,
            random_status,
            DATE_ADD('2020-01-01', INTERVAL FLOOR(RAND() * 1460) DAY),
            CONCAT('City', FLOOR(1 + RAND() * 100))
        );
        SET i = i + 1;
    END WHILE;
END//

CREATE PROCEDURE generate_products(IN num_rows INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_category VARCHAR(50);
    
    WHILE i <= num_rows DO
        SET random_category = ELT(FLOOR(1 + RAND() * 5), 'Electronics', 'Clothing', 'Books', 'Home', 'Sports');
        
        INSERT INTO products (name, price, category, stock_quantity)
        VALUES (
            CONCAT('Product ', i),
            ROUND(10 + RAND() * 990, 2),
            random_category,
            FLOOR(RAND() * 1000)
        );
        SET i = i + 1;
    END WHILE;
END//

CREATE PROCEDURE generate_orders(IN num_rows INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_user_id INT;
    DECLARE random_status ENUM('pending', 'processing', 'completed', 'cancelled');
    
    WHILE i <= num_rows DO
        SET random_user_id = FLOOR(1 + RAND() * 100000);
        SET random_status = ELT(FLOOR(1 + RAND() * 4), 'pending', 'processing', 'completed', 'cancelled');
        
        INSERT INTO orders (user_id, amount, status, created_at)
        VALUES (
            random_user_id,
            ROUND(20 + RAND() * 980, 2),
            random_status,
            DATE_ADD('2020-01-01', INTERVAL FLOOR(RAND() * 1460) DAY)
        );
        
        -- Add 1-5 order items
        INSERT INTO order_items (order_id, product_id, quantity, price)
        SELECT 
            i,
            FLOOR(1 + RAND() * 10000),
            FLOOR(1 + RAND() * 5),
            ROUND(10 + RAND() * 190, 2)
        FROM 
            (SELECT 1 UNION SELECT 2 UNION SELECT 3) t
        LIMIT FLOOR(1 + RAND() * 3);
        
        SET i = i + 1;
        
        -- Progress indicator
        IF i % 10000 = 0 THEN
            SELECT CONCAT('Generated ', i, ' orders...') AS progress;
        END IF;
    END WHILE;
END//

DELIMITER ;

-- Generate data (this will take 5-10 minutes)
SELECT 'Generating 100,000 users...' AS status;
CALL generate_users(100000);

SELECT 'Generating 10,000 products...' AS status;
CALL generate_products(10000);

SELECT 'Generating 500,000 orders (this takes 5-10 minutes)...' AS status;
CALL generate_orders(500000);

-- Verify data
SELECT 'Data generation complete!' AS status;
SELECT 'Users:' AS '', COUNT(*) AS count FROM users;
SELECT 'Products:' AS '', COUNT(*) AS count FROM products;
SELECT 'Orders:' AS '', COUNT(*) AS count FROM orders;
SELECT 'Order Items:' AS '', COUNT(*) AS count FROM order_items;

-- Drop procedures
DROP PROCEDURE generate_users;
DROP PROCEDURE generate_products;
DROP PROCEDURE generate_orders;

SELECT 'Setup complete! No indexes created yet - ready for optimization exercises.' AS status;
