drop database webdev;
create database if not exists webdev;

use webdev;

CREATE TABLE IF NOT EXISTS Book(
	book_id int AUTO_INCREMENT,
    book_isbn varchar(20),
    book_title varchar(100),
    book_publish_date date,
    book_publisher_name varchar(100),
    book_stock int,
    book_detail varchar(1000),
    book_price float,
    book_category varchar(100),
    book_image varchar(200),
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


CREATE TABLE IF NOT EXISTS `Admin`(
	admin_id int AUTO_INCREMENT,
    admin_username varchar(50),
    admin_password varchar(50),
    admin_permission int,
    primary key (admin_id)
);


CREATE TABLE IF NOT EXISTS `Write`(
	author_id int,
    book_id int,
    primary key (author_id, book_id),
    foreign key (book_id) references Book(book_id),
    foreign key (author_id) references Author(author_id)
);
ALTER TABLE Book AUTO_INCREMENT=1;
INSERT IGNORE INTO Book (book_ISBN, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price, book_category, book_image)
VALUES ("1000", "The Angel Next Door Spoils Me Rotten, Vol. 1", "2024-09-10", "Animag", 100, "Best LN ever", 300, "Comics/Manga", "https://i.ibb.co/y88BZc0/Otonari1.jpg"),
	   ("1001", "Alya Sometimes Hides Her Feelings in Russian, Vol. 1", "2024-10-10", "Phoenix Next", 100, "Best LN ever", 300, "Japanese Book", "https://i.ibb.co/1ndmP8W/image-2024-04-16-204031751.png"),
       ("1002", "The Eminence in Shadow, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Comics/Manga", "https://i.ibb.co/N6tGBCz/image-2024-04-16-195721292.png"),
       ("1003", "Gimai Seikatsu, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/dgRzjYG/image-2024-04-16-204809263.png"),
       ("1004", "Megami no Café Terrace, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Comics/Manga", "https://i.ibb.co/B6t4C14/image-2024-04-21-181137491.png"),
       ("1005", "I'm Gonna Live with you not because my Parents Left Me Their Debt But Because I Like You, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/JjSS8kN/image-2024-04-21-181454341.png"),
       ("1006", "Record of Ragnarok, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/vd5vPGr/image-2024-04-21-182822694.png"),
       ("1007", "Hell Mode, Vol. 1", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/yVBt289/image-2024-04-21-184008252.png"),
       ("1008", "Suzume no Tojimari", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/7QywRjv/image-2024-04-21-192850389.png"),
       ("1009", "Yuusha Shoukan ni Makikomareta kedo, Isekai wa Heiwa deshita", "2024-10-10", "Phoenix Next", 100, "One of the most popular series out there.", 300, "Japanese Book", "https://i.ibb.co/82gnr67/image-2024-04-21-193227824.png");

        
INSERT IGNORE INTO Author
VALUES (1,"Saekisan", "","JP",""),
	   (2,"SunSunSun","","JP",""),
       (3,"Daisuke","Aizawa","JP",""),
       (4,"Ghost","Mikawa","JP",""),
       (5,"Kōji","Seo","JP",""),
       (6,"Amane","Megumi","JP",""),
       (7,"Shinya","Umemura","JP",""),
       (8,"Hamuo","","JP",""),
       (9,"Makoto","Shinkai","JP",""),
       (10,"Heian","Jirou","JP","");
	

INSERT IGNORE INTO `Write`
VALUES	(1, 1),
		(2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
		(9, 9),
        (10, 10);

INSERT IGNORE INTO `Admin` (admin_username,admin_password,admin_permission)
VALUES 	("muthitha", "cat", "2"),
		("pavit", "dawg", "1");
