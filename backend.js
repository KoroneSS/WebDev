const mysql = require("mysql2")
const express = require("express")
const path = require("path")
const router = express.Router()
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()
dotenv.config()
app.use(router)
app.use(cors())
app.use(express.static('public'))
app.use(express.static('node_modules'))

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected DB: ${process.env.DATABASE}`)
})

app.get("/products", (req,res) => {
    let sql = `SELECT
    b.book_id,
    b.book_ISBN,
    b.book_title,
    b.book_publish_date,
    b.book_publisher_name,
    b.book_stock,
    b.book_detail,
    b.book_price,
    GROUP_CONCAT(c.category_name SEPARATOR ', ') AS categories,
    CONCAT(MAX(a.author_fname), " ", MAX(a.author_lname)) as author_name
    FROM
        Book b
    JOIN
        Book_Category bc ON b.book_id = bc.book_id
    JOIN
        Category c ON bc.category_id = c.category_id
    JOIN
        \`Write\` w ON b.book_id = w.book_id
    JOIN
        Author a ON w.author_id = a.author_id
    GROUP BY
        b.book_id;`;
    connection.query(sql, (err, result) =>{
        if (err) throw err;
        res.status(200).json(result);
    })
})



app.get("/users", (req,res)=>{
    let sql = `SELECT * FROM \`Admin\``
    connection.query(sql,(err,result)=>{
        if (err) throw err;
        res.status(200).json(result);
    })
})

app.post("/getperm", (req,res)=>{
    var id = req.body.uid;
    console.log(`perm id = ${id}`);
    let sql = `SELECT a.admin_permission FROM \`Admin\` a WHERE a.admin_id = ?`
    connection.query(sql,[id],(err,result)=>{
        if (err) throw err;
        console.log(`perm result = ${result}`)
        res.status(200).json(result);
        
    })
})

app.post('/auth', (req,res) => {
    var username = req.body.username
    var password = req.body.password
    let sql = `SELECT * FROM \`Admin\` WHERE admin_username = ? AND admin_password = ?`;
    connection.query(sql, [username,password], (err, result) =>{
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error'});
        }else{
            if(result.length > 0){
                res.status(200).json({valid:true, id:result[0].admin_id, perm:result[0].admin_permission})
            }else{
                res.status(200).json({valid:false})
            }
        }
    })
})

app.get("/user/:id", (req,res)=>{
    var id = req.params.id;
    console.log(id);
    let sql = `SELECT * FROM \`Admin\` a WHERE a.admin_id = ?`
    connection.query(sql,id,(err,result)=>{
        if (err) throw err;
        res.status(200).json(result);
    })
})

app.post('/user', (req,res) =>{
    var username = req.body.username
    var password = req.body.password
    console.log(`${username} ${password}`)
    if(!username || !password){
        return  res.status(400).send({error: true, message:'Please provide username and password'})
    }
    let sql = 'INSERT INTO \`Admin\` (admin_username,admin_password, admin_permission) VALUES (?,?,1)'
    connection.query(sql, [username,password], (err, result) =>{
        if (err) throw err;
        return res.send({error:false, data: result.affectedRows, message:"New user has been created successfully"});
    })

})

app.delete("/user", (req,res) =>{
    var id = req.body.id
    console.log(id)

    if(!id){
        return res.status(400).send({error:true, message:"id is not valid"})

    }
    let sql = 'DELETE FROM \`Admin\` a Where a.admin_id = ?'
    connection.query(sql,[id],(err,result) => {
        if (err) throw err;
        return res.send({error:false, data:result.affectedRows, message:"Successfully Deleted!"})
    })
})

app.put("/user", (req,res) =>{
    var id = req.body.id
    var username = req.body.username
    var password = req.body.password
    if(!id){
        return res.status(400).send({error:true, message:"id is not valid"})

    }
    let sql = 'UPDATE \`Admin\` a SET a.admin_username = ?, a.admin_password = ? WHERE a.admin_id = ?'
    connection.query(sql,[username,password,id], (err,result) => {
        if(err) throw err;
        return res.send({error:false, data:result.affectedRows, message:"Successfully Updated!"})
    })

})
app.get("/product/:id", (req,res) => {
    var id = req.params.id;
    
    let sql = `SELECT
    b.book_id,
    b.book_ISBN,
    b.book_title,
    b.book_publish_date,
    b.book_publisher_name,
    b.book_stock,
    b.book_detail,
    b.book_price,
    GROUP_CONCAT(c.category_name SEPARATOR ', ') AS categories,
    CONCAT(MAX(a.author_fname), " ", MAX(a.author_lname)) as author_name
    FROM
        Book b
    JOIN
        Book_Category bc ON b.book_id = bc.book_id
    JOIN
        Category c ON bc.category_id = c.category_id
    JOIN
        \`Write\` w ON b.book_id = w.book_id
    JOIN
        Author a ON w.author_id = a.author_id
    WHERE
		b.book_id = ?
    GROUP BY
        b.book_id;`;
    connection.query(sql, id,(err, result) =>{
        if (err) throw err;
        res.status(200).json(result);
    })
})

app.post("/product", (req, res) => {
    var book_isbn = req.body.book.book_isbn;
    var book_title = req.body.book.book_title;
    var book_publish_date = req.body.book.book_publish_date;
    var book_publisher_name = req.body.book.book_publisher_name;
    var book_stock = req.body.book.book_stock;
    var book_detail = req.body.book.book_detail;
    var book_price = req.body.book.book_price;
    var author_id = req.body.book.author_id;
    var categories = req.body.book.category;
    
    // Insert data into the Book table
    let insertBookSql = `INSERT INTO Book (book_ISBN, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(insertBookSql, [book_isbn, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }

        // Get the auto-generated book_id
        var book_id = result.insertId;

        // Insert data into the Write table
        let insertWriteSql = `INSERT INTO \`Write\` (author_id, book_id) VALUES (?, ?)`;
        connection.query(insertWriteSql, [author_id, book_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: true, message: "Internal Server Error" });
            }

            // Insert data into the Book_Category table
            categories.forEach(category => {
                let insertBookCategorySql = `INSERT INTO Book_Category (book_id, category_id) VALUES (?, (SELECT category_id FROM Category WHERE category_name = ?))`;
                connection.query(insertBookCategorySql, [book_id, category], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: true, message: "Internal Server Error" });
                    }
                });
            });

            return res.status(200).json({ error: false, message: "Product inserted successfully" });
        });
    });
});

app.put("/product", (req, res) => {
    var book_id = req.body.book.book_id;
    var book_isbn = req.body.book.book_isbn;
    var book_title = req.body.book.book_title;
    var book_publish_date = req.body.book.book_publish_date;
    var book_publisher_name = req.body.book.book_publisher_name;
    var book_stock = req.body.book.book_stock;
    var book_detail = req.body.book.book_detail;
    var book_price = req.body.book.book_price;
    var author_id = req.body.book.author_id;
    var categories = req.body.book.category;
    
    
    // Check if book_id is provided for update
    if (book_id) {
        // Update data in the Book table
        let updateBookSql = `UPDATE Book 
                              SET book_ISBN=?, book_title=?, book_publish_date=?, book_publisher_name=?, book_stock=?, book_detail=?, book_price=?
                              WHERE book_id=?`;
        connection.query(updateBookSql, [book_isbn, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price, book_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: true, message: "Internal Server Error" });
            }

            // Delete existing categories for the book
            let deleteCategoriesSql = `DELETE FROM Book_Category WHERE book_id=?`;
            connection.query(deleteCategoriesSql, [book_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: true, message: "Internal Server Error" });
                }

                // Insert new categories for the book
                categories.forEach(category => {
                    let insertBookCategorySql = `INSERT INTO Book_Category (book_id, category_id) VALUES (?, (SELECT category_id FROM Category WHERE category_name = ?))`;
                    connection.query(insertBookCategorySql, [book_id, category], (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: true, message: "Internal Server Error" });
                        }
                    });
                });

                return res.status(200).json({ error: false, message: "Product updated successfully" });
            });
        });
    } else {
        // If book_id is not provided, return an error
        return res.status(400).json({ error: true, message: "book_id is required for updating a product" });
    }
});

app.delete("/product", (req, res) => {
    var id = req.body.bid;
    if (!id) {
        return res.status(400).send({ error: true, message: "id is not valid" });
    }

    // Delete related records in Book_Category table
    let deleteBookCategorySql = "DELETE FROM Book_Category WHERE book_id = ?";
    connection.query(deleteBookCategorySql, id, (err, result) => {
        if (err) {
            return res.status(500).send({ error: true, message: "Internal server error" });
        }

        // Delete related records in Write table
        let deleteWriteSql = "DELETE FROM `Write` WHERE book_id = ?";
        connection.query(deleteWriteSql, id, (err, result) => {
            if (err) {
                return res.status(500).send({ error: true, message: "Internal server error" });
            }

            // Finally, delete the record from the Book table
            let deleteBookSql = "DELETE FROM Book WHERE book_id = ?";
            connection.query(deleteBookSql, id, (err, result) => {
                if (err) {
                    return res.status(500).send({ error: true, message: "Internal server error" });
                }
                return res.send({ error: false, data: result.affectedRows, message: "Successfully Deleted!" });
            });
        });
    });
});

app.get("/author/:id", (req,res)=>{
    var id = req.params.id
    let sql = `SELECT * From Author WHERE Author.author_id = ?`
    connection.query(sql,id,(err,result)=>{
        if(err){
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
        return res.send({error:false,author:result})
    })
})

app.get("/book/:id", (req,res) => {
    var id = req.params.id
    let sql = `SELECT
    Book.book_id,
    Book.book_ISBN,
    Book.book_title,
    Book.book_publish_date,
    Book.book_publisher_name,
    Book.book_stock,
    Book.book_detail,
    Book.book_price,
    Author.author_id AS author_id,
    GROUP_CONCAT(Category.category_name) AS category_ids
FROM
    Book
    LEFT JOIN \`Write\` ON Book.book_id = \`Write\`.book_id
    LEFT JOIN Author ON \`Write\`.author_id = Author.author_id
    LEFT JOIN Book_Category ON Book.book_id = Book_Category.book_id
    LEFT JOIN Category ON Book_Category.category_id = Category.category_id
WHERE
    Book.book_id = 1
GROUP BY
    Book.book_id,
    Book.book_ISBN,
    Book.book_title,
    Book.book_publish_date,
    Book.book_publisher_name,
    Book.book_stock,
    Book.book_detail,
    Book.book_price,
    Author.author_id;`
    connection.query(sql,id,(err,result)=>{
        if(err){
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
        return res.send({error:false,data:result})
    })
})

app.listen(process.env.ENDPORT, () =>{
    console.log(`backend listening on port ${process.env.ENDPORT}`)
})