const express = require("express")
const port = 3000
const path = require("path")
const router = express.Router()
const app = express()

app.use(router)
app.use(express.static('public'))
app.use(express.static('node_modules'))

router.get("/",(req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/main/homepage.html`))
})

router.get("/signin", (req,res) => {
    res.status(200).sendFile(path.join(`${__dirname}/signin/signin.html`))
})
app.listen(port,() =>{
    console.log(`listening on port ${port}`)
})