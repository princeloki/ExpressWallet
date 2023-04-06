const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const axios = require('axios')
require('dotenv/config')


const router = express.Router()

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



router.post('/login', (req, res) => {
    console.log("login")
})

router.post('/register', async (req, res) => {
    const salt = 10
    const firstName = req.body.name.split(" ")[0]
    const lastName = req.body.name.split(" ")[1]
    const password = req.body.password
    const email = req.body.email
    const phone = req.body.phone
    const hash = await bcrypt.hash(password, salt)
    const balance = 0
    const length = 0
    const income = 0
    const country = ""
    const host = ""
    const currency = "USD"
    const budget = 0
    console.log(firstName, lastName, email, phone, hash, balance,length,income,password)
    let query = `INSERT INTO user(uid,first_name,last_name,email,phone_num,balance,length,income,password,country,host,currency,budget) VALUES`
    const size = "SELECT COUNT(*) as count FROM user"
    db.query(size, (err, result) => {
        if (err) throw err;
        const l = result[0].count
        query += `(${l},'${firstName}','${lastName}','${email}','${phone}',${balance},${length},${income},'${password}','${country}','${host}','${currency}',${budget})`
        db.query(query, (err) => {
            if (err) throw err;
            res.send("User added")
        })
    })
    console.log("register")
})

router.post('/secret', (req, res) => {
    console.log('sent secret')
})

router.post('/add_bank', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    axios.post('http://localhost:5000/api/get_bank', {username: username, password: password})
    .then(response => {
        res.send(response.data)
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete('/delete_bank:id', (req,res) => {
    console.log("bank deleted")
})

router.post('/get_transactions:id', (req, res)=>{
    console.log("transactions")
})

router.put('/update_user', (req, res) => {
    console.log("user updated");
})

router.post('/add_expense', (req, res) => {
    console.log("expense added")
})

router.put('/update_expense', (req, res)=>{
    console.log("expense updated")
})

router.delete('/delete_expense', (req, res)=>{
    console.log("delete expense")
})

router.post('/create_spending', (req, res) => {
    console.log("spending added")
})

router.put('/update_spending:id', (req, res) => {
    console.log("spending updated")
})

router.delete('/delete_spending:id', (req, res) => {
    console.log("delete expense")
})

router.post('/get_spendings:id', (req, res)=>{
    console.log("spendings")
})

router.post('/assign_transactions', (req, res)=>{
    console.log("transaction assigned")
})

router.get('/get_assigned', (req, res)=>{
    console.log("assigned retrieved")
})

router.delete('/delete_account', (req, res) => {
    console.log("delete_account")
})




module.exports = router;