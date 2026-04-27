-- ============================================================
-- Inventory Management System — Database Setup + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- ============================================================
-- Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS ADMIN (
  userid    INT PRIMARY KEY,
  username  VARCHAR(50) NOT NULL,
  password  VARCHAR(50) NOT NULL,
  fullname  VARCHAR(100) NOT NULL,
  status    VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS CUSTOMER (
  id      INT PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  mobile  VARCHAR(15) NOT NULL,
  email   VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS VENDOR (
  id       INT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  address  VARCHAR(200),
  mobile   VARCHAR(15) NOT NULL,
  email    VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ITEM (
  id           INT PRIMARY KEY,
  itemno       VARCHAR(20) NOT NULL,
  itemname     VARCHAR(100) NOT NULL,
  stock        INT NOT NULL,
  unitprice    DECIMAL(10,2) NOT NULL,
  discount     DECIMAL(10,2),
  customer_id  INT,
  vendor_id    INT UNIQUE,
  FOREIGN KEY (customer_id) REFERENCES CUSTOMER(id),
  FOREIGN KEY (vendor_id)   REFERENCES VENDOR(id)
);

CREATE TABLE IF NOT EXISTS SALE (
  id           INT PRIMARY KEY,
  saledate     TIMESTAMP NOT NULL,
  quantity     INT NOT NULL,
  unitprice    DECIMAL(10,2) NOT NULL,
  discount     DECIMAL(10,2),
  status       VARCHAR(20),
  admin_userid INT NOT NULL,
  FOREIGN KEY (admin_userid) REFERENCES ADMIN(userid)
);

CREATE TABLE IF NOT EXISTS PURCHASE (
  id            INT PRIMARY KEY,
  purchase_date TIMESTAMP NOT NULL,
  itemno        VARCHAR(20) NOT NULL,
  itemname      VARCHAR(100) NOT NULL,
  unitprice     DECIMAL(10,2) NOT NULL,
  quantity      INT NOT NULL,
  vendorname    VARCHAR(100),
  vendorID      VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS SALE_PURCHASE (
  sale_id     INT,
  purchase_id INT,
  PRIMARY KEY (sale_id, purchase_id),
  FOREIGN KEY (sale_id)     REFERENCES SALE(id),
  FOREIGN KEY (purchase_id) REFERENCES PURCHASE(id)
);

-- ============================================================
-- Seed Data
-- ============================================================

-- ADMIN
INSERT IGNORE INTO ADMIN (userid, username, password, fullname, status) VALUES
  (1, 'admin',   'admin123',   'System Administrator', 'Active'),
  (2, 'manager', 'manager123', 'Priya Menon',           'Active'),
  (3, 'staff',   'staff123',   'Rohit Sharma',          'Inactive');

-- CUSTOMER
INSERT IGNORE INTO CUSTOMER (id, name, mobile, email) VALUES
  (1, 'Alice Johnson',  '9876543210', 'alice@example.com'),
  (2, 'Bob Smith',      '8765432109', 'bob@example.com'),
  (3, 'Carol White',    '7654321098', 'carol@example.com'),
  (4, 'David Kumar',    '6543210987', NULL),
  (5, 'Eve Thomas',     '5432109876', 'eve@example.com');

-- VENDOR
INSERT IGNORE INTO VENDOR (id, name, address, mobile, email) VALUES
  (1, 'TechSupply Co.',     '123 Tech Street, Bangalore',  '9001002000', 'sales@techsupply.com'),
  (2, 'Global Parts Ltd.',  '456 Parts Ave, Mumbai',       '9002003000', 'info@globalparts.com'),
  (3, 'Metro Electronics',  '789 Electron Rd, Chennai',    '9003004000', 'metro@electronics.com'),
  (4, 'Swift Components',   '12 Swift Nagar, Hyderabad',   '9004005000', NULL),
  (5, 'Pioneer Traders',    '55 Market Lane, Pune',        '9005006000', 'pioneer@traders.com');

-- ITEM  (vendor_id is UNIQUE — one vendor per item slot)
INSERT IGNORE INTO ITEM (id, itemno, itemname, stock, unitprice, discount, customer_id, vendor_id) VALUES
  (1, 'ITM001', 'Laptop 15"',           13, 55000.00, 2000.00, 1, 1),
  (2, 'ITM002', 'Wireless Mouse',       42,   799.00,   50.00, 2, 2),
  (3, 'ITM003', 'USB-C Hub',             3,  1499.00,    NULL, NULL, 3),
  (4, 'ITM004', 'Mechanical Keyboard',   8,  3500.00,  200.00, 3, 4),
  (5, 'ITM005', 'Monitor 24"',          20, 18500.00, 1000.00, 4, 5),
  (6, 'ITM006', 'Webcam HD',             2,  2299.00,    NULL, NULL, NULL),
  (7, 'ITM007', 'Headset Pro',          18,  4500.00,  300.00, 5, NULL);

-- SALE
INSERT IGNORE INTO SALE (id, saledate, quantity, unitprice, discount, status, admin_userid) VALUES
  (1, '2026-04-10 10:00:00', 2, 55000.00, 2000.00, 'Completed', 1),
  (2, '2026-04-12 11:30:00', 5,   799.00,   50.00, 'Completed', 2),
  (3, '2026-04-15 14:00:00', 1,  3500.00,  200.00, 'Pending',   1),
  (4, '2026-04-18 09:15:00', 3, 18500.00, 1000.00, 'Completed', 2),
  (5, '2026-04-21 16:45:00', 2,  1499.00,    NULL, 'Cancelled', 3),
  (6, '2026-04-25 13:00:00', 1,  4500.00,  300.00, 'Pending',   1);

-- PURCHASE
INSERT IGNORE INTO PURCHASE (id, purchase_date, itemno, itemname, unitprice, quantity, vendorname, vendorID) VALUES
  (1, '2026-04-01 08:00:00', 'ITM001', 'Laptop 15"',        48000.00, 15, 'TechSupply Co.',    'V001'),
  (2, '2026-04-02 09:30:00', 'ITM002', 'Wireless Mouse',      600.00, 47, 'Global Parts Ltd.', 'V002'),
  (3, '2026-04-03 10:00:00', 'ITM003', 'USB-C Hub',          1100.00,  8, 'Metro Electronics', 'V003'),
  (4, '2026-04-05 11:00:00', 'ITM004', 'Mechanical Keyboard', 2800.00,  9, 'Swift Components',  'V004'),
  (5, '2026-04-08 12:00:00', 'ITM005', 'Monitor 24"',       16000.00, 23, 'Pioneer Traders',   'V005'),
  (6, '2026-04-20 14:30:00', 'ITM006', 'Webcam HD',          1800.00,  5, 'TechSupply Co.',    'V001'),
  (7, '2026-04-22 15:00:00', 'ITM007', 'Headset Pro',        3500.00, 20, 'Global Parts Ltd.', 'V002');

-- SALE_PURCHASE (links sales to their fulfilling purchases)
INSERT IGNORE INTO SALE_PURCHASE (sale_id, purchase_id) VALUES
  (1, 1),
  (2, 2),
  (3, 4),
  (4, 5),
  (6, 7);
