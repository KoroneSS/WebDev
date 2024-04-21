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
    b.book_category,
    CONCAT(MAX(a.author_fname), " ", MAX(a.author_lname)) as author_name
    FROM
        Book b
    LEFT JOIN
        \`Write\` w ON b.book_id = w.book_id
    LEFT JOIN
        Author a ON w.author_id = a.author_id
    GROUP BY
        b.book_id
    ORDER by b.book_id ASC;`;
    connection.query(sql, (err, result) =>{
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
        res.status(200).json(result);
    })
})



app.get("/users", (req,res)=>{
    let sql = `SELECT * FROM \`Admin\``
    connection.query(sql,(err,result)=>{
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
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
            res.status(500).json({ valid:false, message: 'Internal Server Error'});
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
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
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
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
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
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
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
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
        }
        return res.send({error:false, data:result.affectedRows, message:"Successfully Updated!"})
    })

})
app.get("/product/:id", (req,res) => {
    var id = req.params.id;
    
    let sql = `SELECT
    b.book_id,
    b.book_isbn,
    b.book_title,
    b.book_publish_date,
    b.book_publisher_name,
    b.book_stock,
    b.book_detail,
    b.book_price,
    b.book_category,
    b.book_image,
    CONCAT(MAX(a.author_fname), " ", MAX(a.author_lname)) as author_name
    FROM
        Book b
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
    var book_category = req.body.book.book_category;
    var book_image = req.body.book.book_image;
    var author_id = req.body.book.author_id;
    
    
    // Insert data into the Book table
    let insertBookSql = `INSERT INTO Book (book_ISBN, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price, book_category, book_image) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(insertBookSql, [book_isbn, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price, book_category, book_image], (err, result) => {
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
    var book_category = req.body.book.book_category;
    var book_image = req.body.book.book_image;
    var author_id = req.body.book.author_id;
    
    
    
    // Check if book_id is provided for update
    if (book_id) {
        // Update data in the Book table
        let updateBookSql = `UPDATE Book 
                              SET book_ISBN=?, book_title=?, book_publish_date=?, book_publisher_name=?, book_stock=?, book_detail=?, book_price=?, book_category = ?, book_image = ?
                              WHERE book_id=?`;
        connection.query(updateBookSql, [book_isbn, book_title, book_publish_date, book_publisher_name, book_stock, book_detail, book_price,book_category, book_image, book_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: true, message: "Internal Server Error" });
            }

            // Delete data in Write
            let updateWriteSql = `UPDATE \`Write\` SET author_id = ? WHERE book_id = ?`

            connection.query(updateWriteSql, [author_id,book_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: true, message: "Internal Server Error" });
                }
                return res.status(200).json({ error: false, message: "Product updated successfully" });
            })
            
            });
        }else {
        // If book_id is not provided, return an error
        return res.status(400).json({ error: true, message: "book_id is required for updating a product" });
        }
    })


app.delete("/product", (req, res) => {
    var id = req.body.bid;
    if (!id) {
        return res.status(400).send({ error: true, message: "id is not valid" });
    }


    // Delete related records in Write table
    let deleteWriteSql = "DELETE FROM `Write` WHERE book_id = ?";
    connection.query(deleteWriteSql, id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error:false, message: 'Internal Server Error'});
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
    Book.book_category,
    Book.book_image,
    Author.author_id AS author_id
FROM
    Book
    LEFT JOIN \`Write\` ON Book.book_id = \`Write\`.book_id
    LEFT JOIN Author ON \`Write\`.author_id = Author.author_id
WHERE
    Book.book_id = ?
GROUP BY
    Book.book_id,
    Book.book_ISBN,
    Book.book_title,
    Book.book_publish_date,
    Book.book_publisher_name,
    Book.book_stock,
    Book.book_detail,
    Book.book_price,
    Book.book_category,
    Book.book_image,
    Author.author_id;`
    connection.query(sql,id,(err,result)=>{
        if(err){
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
        return res.send({error:false,data:result})
    })
})

app.get("/product-search/", (req,res)=>{
    query = req.query
    console.log(query.detailed_search)
    let sql;
    let values;
    if(query.detailed_search == 'false'){
        let conditions = []
        values = []
        var where = ""
        if(query.category || query.isbn){
            where = "WHERE"
        }
        if(query.category){
            conditions.push("b.book_category = ?")
            values.push(query.category)
        }
        if(query.isbn){
            conditions.push("b.book_isbn = ?")
            values.push(query.isbn)
        }
        sql = `
        SELECT 
            b.book_id,
            b.book_title,
            b.book_image
        FROM Book b
        ${where} ${conditions.join(" AND ")}
        ORDER BY b.book_id ASC;
      `
        values = [query.category,`%${query.isbn}%`]
    }else{
        let conditions = [];
        values = [];
        let where = false
        if(query.category){
            conditions.push("b.book_category = ?")
            values.push(query.category);
            where = true;
        }
        if(query.title){
            conditions.push("b.book_title LIKE ?")
            values.push(`%${query.title}%`);
            where = true;
        }
        if(query.publisher){
            conditions.push("b.book_publisher_name LIKE ?")
            values.push(`%${query.publisher}%`);
            where = true;
        }
        if (query.pubdate_from) {
            conditions.push("b.book_publish_date >= ?");
            values.push(query.pubdate_from);
            where = true;
        }
        if (query.pubdate_to) {
            conditions.push("b.book_publish_date <= ?");
            values.push(query.pubdate_to);
            where = true;
        }
        if (query.author) {
            conditions.push("(a.author_fname LIKE ? OR a.author_lname LIKE ?)");
            values.push(`%${query.author}%`, `%${query.author}%`);
            where = true;
        }
        if (query.availableOnly == 'true'){
            conditions.push("b.book_stock > 0")
            where = true;
        }

        sql = `
            SELECT 
                b.book_id,
                b.book_title,
                b.book_image
            FROM Book b
            LEFT JOIN \`Write\` w ON b.book_id = w.book_id
            LEFT JOIN Author a ON w.author_id = a.author_id
            ${where ? "WHERE" : ""} ${conditions.join(" AND ")}
            ORDER BY b.book_id ASC
        `;
        
    }
    

    connection.query(sql,values,(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
        return res.send({error:false,result:result})
    })
})

app.listen(process.env.ENDPORT, () =>{
    console.log(`backend listening on port ${process.env.ENDPORT}`)
})