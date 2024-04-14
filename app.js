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

router.get("/search-result/", (req,res) => {
    console.log(req.query)
    res.status(200).sendFile(path.join(`${__dirname}/html/search-result.html`))
    
})

/* Admin */
router.get("/admin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin.html`))
})

router.get("/admin/product", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-product.html`))
})

router.get("/admin/product/add", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-product-add.html`))
})
router.get("/admin/product-edit/:id" , (req,res)=>{
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-product-edit.html`))
})
router.get("/admin-create" , (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-create.html`))
})

router.get("/admin-edit/:id", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-edit.html`))
})


router.get("/error", (req,res) =>{
    res.status(200).sendFile(path.join(`${__dirname}/html/signin.html`))
})


/* Listen */
app.listen(process.env.FRONTPORT,() =>{
    console.log(`frontend listening on port ${process.env.FRONTPORT}`)
})