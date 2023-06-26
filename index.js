const express = require("express")
const bodyParse = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const app = express()

app.use(cors());
// app.use(cors())
// app.use(cors({
//     origin: 'http://localhost:8000', // Replace with your client's domain
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// }));

app.use(express.json())
// connecting to mysql
app.use(bodyParse.urlencoded({ extended: true }))
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB
})
// getting data from mysql
app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM contact"
    db.query(sqlGet, (err, result) => {
        { err ? res.json(err) : res.json(result) }
        // res.json('This is CORS-enabled for all origins!');
    })
})
app.post("/api/post", (req, res) => {
    const { name, email, number } = req.body
    const sqlInsert = `INSERT INTO contact (name,email,number) VALUES (?,?,?)`
    db.query(sqlInsert, [name, email, number], (err, result) => {
        { err ? console.log(err) : console.log("query inserted"); res.json(result) }
    })
})

app.get("/api/edit/:id", (req, res) => {
    const sqlGet = `SELECT * FROM contact WHERE id= ${req.params.id}`
    db.query(sqlGet, (err, result) => {
        { err ? console.log(err) : console.log("contact Found"); res.json(result[0]) }
    })
})

app.put("/api/update/:id", (req, res) => {
    const { name, email, number } = req.body
    const sqlUpdate = `UPDATE contact SET name=? ,email=? ,number=? WHERE id= ${req.params.id}`
    db.query(sqlUpdate, [name, email, number], (err, result) => {
        { err ? console.log(err) : console.log("query Updated"); res.json(result) }
    })
})
app.delete("/api/delete/:id", (req, res) => {
    const sqlDlete = `DELETE FROM contact WHERE id=${req.params.id}`
    db.query(sqlDlete, (err, result) => {
        { err ? console.log(err) : console.log("query Deleted"); res.json(result) }
    })
})
app.get('/', (req, res) => {
    // const sqlInsert = "INSERT INTO contact (name,email,number) VALUES ('john','john@gmail.com','123456789')"
    // db.query(sqlInsert, (err, result) => {
    //     console.log("error", err)
    //     console.log("result ", result)
    // })
    res.send("hello")
})

app.listen(8000, () => {
    console.log("Server Running on port 8000")
})


