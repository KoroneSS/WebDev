drop database webdev;
create database if not exists webdev;

use webdev;

CREATE TABLE IF NOT EXISTS Book(
	book_id int,
    book_ISBN int,
    book_title varchar(100),
    book_publish_date date,
    book_publisher_name varchar(100),
    book_stock int,
    book_detail varchar(1000),
    book_price float,
    book_discount_percentage float,
    primary key (book_id)
);

CREATE TABLE IF NOT EXISTS Author (
	author_id int AUTO_INCREMENT,
    author_fname varchar(50),
    author_lname varchar(50),
    author_nationality varchar(50),
    author_type varchar(50),
    primary key (author_id)
);

CREATE TABLE IF NOT EXISTS Publisher (
	publisher_id int AUTO_INCREMENT,
    publisher_name varchar(50),
    publisher_location varchar(100),
    primary key (publisher_id)
);

CREATE TABLE IF NOT EXISTS `Admin`(
	admin_id int AUTO_INCREMENT,
    admin_username varchar(50),
    admin_password varchar(50),
    admin_permission int,
    primary key (admin_id)
);

CREATE TABLE IF NOT EXISTS Category(
	category_id int AUTO_INCREMENT,
    category_name varchar(50),
    primary key (category_id)
);

CREATE TABLE IF NOT EXISTS Book_Category(
	book_id int AUTO_INCREMENT,
    category_id int,
    primary key (book_id,category_id),
    foreign key (book_id) references Book(book_id),
    foreign key (category_id) references Category(category_id)
);

CREATE TABLE IF NOT EXISTS `Write`(
	author_id int,
    book_id int,
    primary key (author_id, book_id),
    foreign key (book_id) references Book(book_id),
    foreign key (author_id) references Author(author_id)
);
ALTER TABLE Book AUTO_INCREMENT=1;
INSERT IGNORE INTO Book
VALUES (1,1000,"Mahiru","2024-09-10","Animag",100,"Best LN ever",300,0);

INSERT IGNORE INTO Category (category_name)
VALUES 	("Romance"),
		("Comedy");

INSERT IGNORE INTO Book_Category
VALUES 	(1,1),
		(1,2);
        
INSERT IGNORE INTO Author
VALUES (1,"Saekisan", "","JP","");

INSERT IGNORE INTO `Write`
VALUES (1,1);

INSERT IGNORE INTO `Admin` (admin_username,admin_password,admin_permission)
VALUES ("muthitha", "cat", "2"),
		("pavit", "dawg", "1");
