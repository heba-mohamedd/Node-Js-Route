-- 1- Create the required tables for the retail store database based on the tables structure and relationships. (0.5 Grade)
CREATE DATABASE retail_store;

CREATE TABLE suppliers(
    SupplierID int(11) PRIMARY KEY AUTO_INCREMENT,
    SupplierName varchar(200) NOT NULL,
    ContactNumber varchar(200)
);

CREATE TABLE products ( 
    ProductID int(11) PRIMARY KEY AUTO_INCREMENT, 
    ProductName VARCHAR(200) , 
    Price DECIMAL(10,2) NOT NULL, 
    StockQuantity INT NOT NULL, 
    SupplierID int(11), 
    FOREIGN KEY (SupplierID) REFERENCES suppliers(SupplierID) 
);
CREATE TABLE sales ( 
    SaleID int(11) PRIMARY KEY AUTO_INCREMENT, 
    QuantitySold int NOT NULL, 
    SaleDate DATE NOT NULL, 
    ProductID int(11), 
    FOREIGN KEY (ProductID) REFERENCES products(ProductID) 
);

-- 2- Add a column “Category” to the Products table. (0.5 Grade)
ALTER TABLE products ADD COLUMN Category varchar(200) ;

-- 3- Remove the “Category” column from Products. (0.5 Grade)
ALTER TABLE products DROP COLUMN Category;

-- 4- Change “ContactNumber” column in Suppliers to VARCHAR (15). (0.5 Grade)
ALTER TABLE suppliers MODIFY ContactNumber VARCHAR (15);

-- 5- Add a NOT NULL constraint to ProductName. (0.5 Grade)
ALTER TABLE products MODIFY ProductName VARCHAR(200) NOT NULL;

-- 6- Perform Basic Inserts: (0.5 Grade)
-- a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
INSERT INTO suppliers (SupplierName,ContactNumber) VALUES ('FreshFoods','01001234567'); 

-- b. Insert the following three products, all provided by 'FreshFoods':
-- i. 'Milk' with a price of 15.00 and stock quantity of 50.
INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Milk',15.00,50,1);

-- ii. 'Bread' with a price of 10.00 and stock quantity of 30.
INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Bread',10.00,30,1);

-- iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Eggs',20.00,40,1);

-- c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
INSERT INTO sales(ProductID,QuantitySold,SaleDate) VALUES (1,2,'2025-05-20');

-- 7- Update the price of 'Bread' to 25.00. (0.5 Grade)
UPDATE products SET Price = 25.00 WHERE ProductName = "Bread";

-- 8- Delete the product 'Eggs'. (0.5 Grade)
DELETE FROM products WHERE ProductName = "Eggs";

-- 9- Retrieve the total quantity sold for each product. (0.5 Grade)
SELECT ProductID , SUM(QuantitySold) AS total_quantity_sold FROM sales GROUP BY ProductID;

-- 10-Get the product with the highest stock. (0.5 Grade)
SELECT * FROM products ORDER BY StockQuantity DESC LIMIT 1;  -- return only the first product depending on the limit number
SELECT * FROM products WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM products );   -- will return multiple products that match the highest stock

-- 11-Find suppliers with names starting with 'F'. (0.5 Grade)
SELECT * FROM suppliers WHERE SupplierName LIKE "F%";

-- 12-Show all products that have never been sold. (0.5 Grade)
SELECT products.ProductName,sales.QuantitySold FROM products LEFT JOIN sales ON products.ProductID = sales.ProductID WHERE sales.ProductID IS NULL;

-- 13-Get all sales along with product name and sale date. (0.5 Grade)
SELECT products.ProductName,sales.SaleDate FROM products RIGHT JOIN sales ON products.ProductID = sales.ProductID;

-- 14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. (0.5 Grade)
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY "123456";
GRANT SELECT,INSERT,UPDATE ON retail_store.* TO 'store_manager'@'localhost';

-- 15-Revoke UPDATE permission from “store_manager”. (0.5 Grade)
REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';

-- 16-Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
GRANT DELETE ON retail_store.sales TO 'store_manager'@'localhost'