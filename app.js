const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
app.use(router)
app.use(cors())
app.use(express.static('public'))
app.use(express.static('node_modules'))
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
/* Homepage */
router.get("/",(req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/homepage.html`))
})


/* Sign in*/
router.get("/signin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/signin.html`))
})
/*
router.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    fetch("http://localhost:3001/auth",
    {
        method: "POST",
        body: JSON.stringify({user: username, pw: password}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data =>{
        if(data.valid){
            
            res.cookie("id", data.id,{maxAge:900000})
            res.redirect("/admin")
        }
        else{
            console.log("invalid")
            res.redirect("/signin")
        }
    })

    
})
*/

router.post("/setcookie",(req,res) =>{
    let id = req.body.id
    
    res.cookie("id", id, {maxAge:900000})
    
})

/* About Us */
router.get("/aboutus", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/aboutus.html`))
})

/* Cart */

router.get("/cart", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/cart.html`))
})

/* Search */
router.get("/search", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/search.html`))
})

/* Admin */
router.get("/admin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin.html`))
})

router.get("/admin/product", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-product.html`))
})

router.get("/admin-create" , (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-create.html`))
})

router.get("/admin-edit", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-edit.html`))
})

router.get("/error", (req,res) =>{
    res.status(200).sendFile(path.join(`${__dirname}/html/signin.html`))
})


/* Listen */
app.listen(process.env.FRONTPORT,() =>{
    console.log(`frontend listening on port ${process.env.FRONTPORT}`)
})