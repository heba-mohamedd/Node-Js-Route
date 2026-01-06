const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  database: "retail-store",
  user: "root",
  password: "root",
  multipleStatements: true, // to allow to execute multiple query in the same query
});

connection.connect((err) => {
  if (err) {
    console.log({ err });
  } else {
    console.log("DB Connected Successfully .......");
  }
});

app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Wellcome on my app .." });
});

// 1- Create the required tables for the retail store database based on the tables structure and relationships.
app.post("/createtables", (req, res, next) => {
  let query = `CREATE TABLE IF NOT EXISTS suppliers(
    SupplierID int(11) PRIMARY KEY AUTO_INCREMENT,
    SupplierName varchar(200) NOT NULL,
    ContactNumber varchar(200)
);

CREATE TABLE IF NOT EXISTS products ( 
    ProductID int(11) PRIMARY KEY AUTO_INCREMENT, 
    ProductName VARCHAR(200) , 
    Price DECIMAL(10,2) NOT NULL, 
    StockQuantity INT NOT NULL, 
    SupplierID int(11), 
    FOREIGN KEY (SupplierID) REFERENCES suppliers(SupplierID) 
);
CREATE TABLE IF NOT EXISTS sales ( 
    SaleID int(11) PRIMARY KEY AUTO_INCREMENT, 
    QuantitySold int NOT NULL, 
    SaleDate DATE NOT NULL, 
    ProductID int(11), 
    FOREIGN KEY (ProductID) REFERENCES products(ProductID) 
);
`;
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }

    res.status(201).json({ message: "Tables created successfully...... 👌😉" });
  });
});
// 2- Add a column “Category” to the Products table.
app.post("/add/category", (req, res, next) => {
  let query = "ALTER TABLE products ADD COLUMN Category varchar(200);";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res
      .status(201)
      .json({ message: " Category column Added successfully...... 👌😉" });
  });
});
// 3- Remove the “Category” column from Products.
app.delete("/delete/category", (req, res, next) => {
  let query = "ALTER TABLE products DROP COLUMN Category;";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res
      .status(200)
      .json({ message: " Category column Deleted successfully...... 👌😉" });
  });
});

// 4- Change “ContactNumber” column in Suppliers to VARCHAR (15).
// ALTER TABLE suppliers MODIFY ContactNumber VARCHAR (15);
app.post("/change/contactnumber", (req, res, next) => {
  let query = "ALTER TABLE suppliers MODIFY ContactNumber VARCHAR (15);";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res.status(201).json({
      message: "ContactNumber DataType column Changed successfully...... 👌😉",
    });
  });
});

// 5- Add a NOT NULL constraint to ProductName.
// ALTER TABLE products MODIFY ProductName VARCHAR(200) NOT NULL;
app.post("/add/constraint/productname", (req, res, next) => {
  let query = "ALTER TABLE products MODIFY ProductName VARCHAR(200) NOT NULL;";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res.status(201).json({
      message:
        "NOT NULL constraint Added to ProductName successfully...... 👌😉",
    });
  });
});

// 6- Perform Basic Inserts:
// a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
// INSERT INTO suppliers (SupplierName,ContactNumber) VALUES ('FreshFoods','01001234567');
app.post("/supplier", (req, res, next) => {
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
  let { SupplierName, ContactNumber } = req.body;
  if (SupplierName) SupplierName = SupplierName.trim();
  if (ContactNumber) {
    ContactNumber = ContactNumber.trim();
    if (!egyptianPhoneRegex.test(ContactNumber)) {
      return res
        .status(401)
        .json({ message: "The phone number is not a valid Egyptian number" });
    }
  }
  let query = `INSERT INTO suppliers (SupplierName,ContactNumber) VALUES (?,?)`;
  connection.execute(query, [SupplierName, ContactNumber], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res
      .status(202)
      .json({ message: "supplier added successfully ... 😎", result });
  });
});

// b. Insert the following three products, all provided by 'FreshFoods':
// i. 'Milk' with a price of 15.00 and stock quantity of 50.
// INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Milk',15.00,50,1);
// ii. 'Bread' with a price of 10.00 and stock quantity of 30.
// INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Bread',10.00,30,1);
// iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
//INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES ('Eggs',20.00,40,1);

app.post("/product", (req, res, next) => {
  let { ProductName, Price, StockQuantity, SupplierID } = req.body;
  if (!ProductName || !Price || !StockQuantity || !SupplierID) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (Price < 0) {
    return res.status(400).json({ message: "Enter Correct Price " });
  }
  StockQuantity = Number(StockQuantity);
  if (StockQuantity < 0) {
    return res
      .status(400)
      .json({ message: "StockQuantity must be a positive number " });
  }
  ProductName = ProductName.trim();
  let query = `SELECT * FROM suppliers WHERE SupplierID = ?`;
  connection.execute(query, [SupplierID], (err, supplierResult) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    if (supplierResult.length == 0) {
      return res
        .status(400)
        .json({ message: "Supplier Not Found", supplierResult });
    }
    let query = `INSERT INTO products(ProductName,Price,StockQuantity,SupplierID) VALUES (?,?,?,?)`;
    connection.execute(
      query,
      [ProductName, Price, StockQuantity, SupplierID],
      (err, productResult) => {
        if (err) {
          return res.status(400).json({ message: "error in query" });
        }
        return res.status(202).json({
          message: "product added successfully ... 😎",
          productResult,
        });
      }
    );
  });
});

// -- c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
// INSERT INTO sales(ProductID,QuantitySold,SaleDate) VALUES (1,2,'2025-05-20');
app.post("/sales", (req, res, next) => {
  let { ProductID, QuantitySold, SaleDate } = req.body;
  if (!ProductID || !QuantitySold || !SaleDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  QuantitySold = Number(QuantitySold);
  if (QuantitySold < 0) {
    return res
      .status(400)
      .json({ message: "QuantitySold must be a positive number " });
  }

  let query = `SELECT * FROM products WHERE ProductID = ?`;
  connection.execute(query, [ProductID], (err, productResult) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    if (productResult.length == 0) {
      return res
        .status(400)
        .json({ message: "Product Not Found", productResult });
    }
    let query = `INSERT INTO sales(ProductID,QuantitySold,SaleDate) VALUES (?,?,?)`;
    connection.execute(
      query,
      [ProductID, QuantitySold, SaleDate],
      (err, saleResult) => {
        if (err) {
          return res.status(400).json({ message: "error in query" });
        }
        return res.status(202).json({
          message: "sale added successfully ... 😎",
          saleResult,
        });
      }
    );
  });
});

// -- 7- Update the price of 'Bread' to 25.00. (0.5 Grade)
// UPDATE products SET Price = 25.00 WHERE ProductName = "Bread";
app.patch("/product/price", (req, res, next) => {
  let { ProductName, Price } = req.body;
  if (!ProductName || !Price) {
    return res.status(400).json({ message: "All fields are required" });
  }
  Price = Number(Price);
  if (Price < 0) {
    return res
      .status(400)
      .json({ message: "Price must be a positive number " });
  }
  let query = `SELECT ProductName FROM products WHERE ProductName=?`;
  connection.execute(query, [ProductName], (err, productResult) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    if (productResult.length == 0) {
      return res
        .status(400)
        .json({ message: "Product Not Found", productResult });
    }
    let query = `UPDATE products SET Price = ? WHERE ProductName = ?`;
    connection.execute(query, [Price, ProductName], (err, result) => {
      if (err) {
        return res.status(400).json({ message: "error in query" });
      }
      return res.status(202).json({
        message: "Product Price Updated successfully ... 😎",
        result,
      });
    });
  });
});

// -- 8- Delete the product 'Eggs'. (0.5 Grade)
// DELETE FROM products WHERE ProductName = "Eggs";
app.delete("/product", (req, res, next) => {
  const { product } = req.query;
  if (!product) {
    return res.status(400).json({ message: "Product Name required" });
  }
  let query = `SELECT ProductName FROM products WHERE ProductName=?`;
  connection.execute(query, [product], (err, productResult) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    if (productResult.length == 0) {
      return res
        .status(400)
        .json({ message: "Product Not Found", productResult });
    }

    let query = `DELETE FROM products WHERE ProductName = ?`;
    connection.execute(query, [product], (err, result) => {
      if (err) {
        return res.status(400).json({ message: "error in query" });
      }
      return res.status(202).json({
        message: "Product Deleted successfully ... 😎",
        result,
      });
    });
  });
});

// -- 9- Retrieve the total quantity sold for each product. (0.5 Grade)
// SELECT ProductID , SUM(QuantitySold) AS total_quantity_sold FROM sales GROUP BY ProductID;
app.get("/totalquantity", (req, res, next) => {
  const query = `SELECT ProductID , SUM(QuantitySold) AS total_quantity_sold FROM sales GROUP BY ProductID`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res.status(202).json({
      result,
    });
  });
});
// -- 10-Get the product with the highest stock. (0.5 Grade)
// SELECT * FROM products ORDER BY StockQuantity DESC LIMIT 1;  -- return only the first product depending on the limit number
// SELECT * FROM products WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM products );   -- will return multiple products that match the highest stock
app.get("/higheststock", (req, res, next) => {
  const query = `SELECT * FROM products ORDER BY StockQuantity DESC LIMIT 1`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res.status(202).json({
      result,
    });
  });
});
// -- 11-Find suppliers with names starting with 'F'. (0.5 Grade)
// SELECT * FROM suppliers WHERE SupplierName LIKE "F%";

app.get("/supplier/start/f", (req, res, next) => {
  const query = `SELECT * FROM suppliers WHERE SupplierName LIKE "F%"`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res.status(202).json({
      result,
    });
  });
});
// -- 12-Show all products that have never been sold. (0.5 Grade)
// SELECT products.ProductName,sales.QuantitySold FROM products LEFT JOIN sales ON products.ProductID = sales.ProductID WHERE sales.ProductID IS NULL;
app.get("/products/not/sold", (req, res, next) => {
  const query = `SELECT products.ProductName,sales.QuantitySold FROM products LEFT JOIN sales ON products.ProductID = sales.ProductID WHERE sales.ProductID IS NULL`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res.status(202).json({
      result,
    });
  });
});
// -- 13-Get all sales along with product name and sale date. (0.5 Grade)
// SELECT products.ProductName,sales.SaleDate FROM products RIGHT JOIN sales ON products.ProductID = sales.ProductID;
app.get("/sales/productname/saledate", (req, res, next) => {
  const query = `SELECT products.ProductName,sales.SaleDate FROM products RIGHT JOIN sales ON products.ProductID = sales.ProductID`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error in query" });
    }
    return res.status(202).json({
      result,
    });
  });
});

// -- 14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. (0.5 Grade)
// CREATE USER 'store_manager'@'localhost' IDENTIFIED BY "123456";
// GRANT SELECT,INSERT,UPDATE ON retail_store.* TO 'store_manager'@'localhost';
app.post("/store/manager", (req, res, next) => {
  let query = `
CREATE USER IF NOT EXISTS'store_manager'@'localhost' IDENTIFIED BY '123456';
GRANT SELECT,INSERT,UPDATE ON retail_store.* TO 'store_manager'@'localhost';
`;
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res.status(201).json({
      message:
        "store_manager user created and permissions granted successfully ",
    });
  });
});

// -- 15-Revoke UPDATE permission from “store_manager”. (0.5 Grade)
// REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';
app.post("/store/manager/revoke-update", (req, res, next) => {
  let query = `REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost'`;
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res.status(201).json({
      message: "UPDATE permission revoked successfully",
    });
  });
});

// -- 16-Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
// GRANT DELETE ON retail_store.sales TO 'store_manager'@'localhost'
app.post("/store/manager/grant-delete-sales", (req, res, next) => {
  let query = `GRANT DELETE ON retail_store.sales TO 'store_manager'@'localhost'`;
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "error on query" });
    }
    res.status(201).json({
      message: "DELETE permission on Sales table granted successfully",
    });
  });
});

app.use("{/*demo}", (req, res, next) => {
  return res
    .status(404)
    .json({ message: `404 Url ${req.originalUrl} Not Found .....` });
});

app.listen(port, () => {
  console.log(`Server is running in port ${port}....`);
});
