const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const apiRoute = require('./routes/route')

const app = express()


app.use(cors({
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
  }));
  

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', apiRoute)


app.listen(3000, ()=>{
    console.log('listening on port 3000');
})