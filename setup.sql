-- ============================================================
-- Inventory Management System — Database Setup
-- Run this in your MySQL client before starting the backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

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
-- Seed data: Insert at least one admin to use for login
-- ============================================================
INSERT IGNORE INTO ADMIN (userid, username, password, fullname, status)
VALUES (1, 'admin', 'admin123', 'System Administrator', 'Active');
