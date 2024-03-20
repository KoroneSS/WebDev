const express = require("express")
const port = 3000
const path = require("path")
const router = express.Router()
const app = express()

app.use(router)
app.use(express.static('public'))
app.use(express.static('node_modules'))

router.get("/",(req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/homepage.html`))
})

router.get("/signin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/signin.html`))
})

router.get("/aboutus", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/aboutus.html`))
})

router.get("/cart", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/cart.html`))
})

router.get("/search", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/html/search.html`))
})

app.listen(port,() =>{
    console.log(`listening on port ${port}`)
})