

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const path = require('path')
const apiRoute = require('./routes/route')
const fs = require('fs');
const { parse } = require('csv-parse');

const app = express()


app.use(cors({
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
}));
  
const db = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: process.env.PASS,
    database: 'expresswallet'
})

    
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected");
})


const loadCurrency = () =>{
    let count = 1;
    fs.createReadStream(path.join(__dirname, 'codes-all.csv'))
    .pipe(parse({ delimiter: ",", from_line: 2}))
    .on("data", (row)=>{
        const nsql = `INSERT INTO currency (cid, iso, country) VALUES(${count}, '${row[2]}', '${row[0]}');`;
        db.query(nsql, (err)=>{
            if(err) throw err;
            console.log("INSERT Completed");
        })
        count++;
    })
    .on("error", (err)=>{
        console.log(err.message);
    })
    .on("end", ()=>{
        console.log("finished");
    })
    
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', apiRoute)

loadCurrency()


app.listen(3000, ()=>{
    console.log('listening on port 3000');
})