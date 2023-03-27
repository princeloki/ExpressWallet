const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const apiRoute = require('./routes/route')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: process.env.PASS,
    database: 'bankinformation'
})

db.connect((err)=>{
    if(err) throw err;
    console.log("Connected");
})


app.use('/api', apiRoute)


app.listen(3000, ()=>{
    console.log('listening on port 3000');
})