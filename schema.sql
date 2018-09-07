DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR (50) NOT NULL,
	department_name VARCHAR (50) NOT NULL,
	price DECIMAL (5, 2),
	stock_quantity INT,
	PRIMARY KEY (item_id)
);

INSERT INTO products
	(product_name, department_name, price, stock_quantity)
VALUES
	("Pumpkin Spice Latte", "Food and Drink", 5.99, 100),
	("Fake Pumpkin Small", "Home Decor", 10.99, 100),
	("Fake Pumpkin Large", "Home Decor", 18.99, 100),
	("Vanilla Candle", "Home Decor", 8.99, 100),
	("Pumpkin Pie", "Food and Drink", 12.99, 100),
	("Witches Hat", "Clothing", 15.00, 100),
	("Ghost Costume", "Clothing", 25.99, 100),
	("Candy Corn", "Food and Drink", 2.99, 100),
	("Haunted House Experience", "Memberships", 125.99, 100),
	("Haunted Cron Maze Experience", "Memberships", 125.99, 2);
	
	SELECT * FROM products;