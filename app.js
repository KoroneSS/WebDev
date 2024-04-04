const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
const dotenv = require("dotenv")
dotenv.config()
app.use(router)
app.use(express.static('public'))
app.use(express.static('node_modules'))

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
    res.status(200).sendFile(path.join(`${__dirname}/html/search-ver.zenny-fixing-rn.html`))
})

/* Admin */
router.get("/admin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin.html`))
})

router.get("/admin/product", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/admin-product.html`))
})


/* Listen */
app.listen(process.env.FRONTPORT,() =>{
    console.log(`frontend listening on port ${process.env.FRONTPORT}`)
})