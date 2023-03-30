const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
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
    console.log(firstName, lastName, email, phone, hash, balance,length,income)
    // let query = `INSERT INTO user(uid,first_name,last_name,email,phone_num,balance,length,income,password) VALUES`
    // const size = "SELECT COUNT(*) as count FROM user"
    // db.query(size, (err, result) => {
    //     if (err) throw err;
    //     const l = result.count
    //     query += `(${l},${firstName},${lastName},${email},${phone},${balance},${length},${income},${password})`
    //     db.query(query, (err) => {
    //         res.send("User added")
    //     })
    // })
    console.log("register")
})

router.post('/secret', (req, res) => {
    console.log('sent secret')
})

router.get('/get_bank:username', (req, res) => {
    console.log("get_bank")
})

router.post('/add_bank', (req, res) => {
    console.log("add_bank")
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

router.post('/get_spendings:id', (req, res)=>{
    console.log("spendings")
})

router.put('/update_spendings:name', (req, res)=>{
    const spendingName = req.params.name;
    console.log(`Updated the ${spendingName} Spending`)
})

router.delete('/delete_account', (req, res) => {
    console.log("delete_account")
})




module.exports = router;