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

app.get("/get-products", (req,res) => {
    let sql = `SELECT
    b.book_id,
    b.book_ISBN,
    b.book_title,
    b.book_publish_date,
    b.book_publisher_name,
    b.book_stock,
    b.book_detail,
    b.book_price,
    b.book_discount_percentage,
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

app.post("/current-user", (req,res)=>{
    var id = req.body.uid;
    console.log(id);
    let sql = `SELECT * FROM \`Admin\` a WHERE a.admin_id = ?`
    connection.query(sql,[id],(err,result)=>{
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

app.post('/auth', (req,res) => {
    var username = req.body.user
    var password = req.body.pw
    let sql = `SELECT * FROM \`Admin\` WHERE admin_username = ? AND admin_password = ?`;
    connection.query(sql, [username,password], (err, result) =>{
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error'});
        }else{
            if(result.length > 0){
                res.status(200).json({valid:true, id:result[0].admin_id})
            }else{
                res.status(200).json({valid:false})
            }
        }
    })
})


app.listen(process.env.ENDPORT, () =>{
    console.log(`backend listening on port ${process.env.ENDPORT}`)
})