    
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price INTEGER (50),
    stock_quantity  INTEGER(50),
    primary key (item_id)
);

show tables from bamazon;

select * from products;
    