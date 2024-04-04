const mysql = require("mysql2")
const express = require("express")
const path = require("path")
const router = express.Router()
const app = express()
const dotenv = require("dotenv")
dotenv.config()
app.use(router)
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.get("/products", (req,res) => {
    console.log("hi")
})

app.listen(process.env.ENDPORT, () =>{
    console.log(`backend listening on port ${process.env.ENDPORT}`)
})