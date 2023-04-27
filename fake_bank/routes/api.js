

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv/config');

const router = express.Router();

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

router.post('/login', (req, res) => {
    const user = req.body.username
    const pass = req.body.password
    const sql = `SELECT username, password FROM bank WHERE username = '${user}'`
    let username, password;
    db.query(sql, (err, result)=>{
        if(err) throw err;
        username = result[0].username
        password = result[0].password
        if(password === pass){
            const query2 = `SELECT * FROM bank WHERE username = '${username}'`
            db.query(query2, (err, result)=>{
                if(err) throw err;
                res.send(result);
            })
        } else{
            console.log(password, pass)
            res.send({message: 'No match found'})
        }
    })
})

router.post('/update_balance', (req, res) => {
    const user = req.body.username;
    const newBalance = req.body.balance;
    const sql = `UPDATE bank SET balance = ${newBalance} WHERE username ='${user}'`;
    try{
        db.query(sql, (err) => {
            if(err) throw err;
            console.log("Balance updated")
            res.send("Balance updated")
        })
    }catch(err){
        res.send("Could not update balance")
    }
})

router.post('/add_transaction', (req, res) => {
    const user = req.body.username;
    const transactions = req.body.transactions;
    let uid;
    const sql = `SELECT bid FROM bank WHERE username = '${user}'`
    try{
        db.query(sql, (err, result)=>{
            if (err) throw err;
            uid = result[0].bid;
    
            for(let i=0; i<transactions.length; i++){
                const isoDate = new Date(transactions[i].date).toISOString().split('T')[0];
                let sql1 = `INSERT transaction (bid,merchant,iso,category,currency,date,amount) VALUES `;
                sql1 += `(${uid},"${transactions[i].merchant_name}",${transactions[i].iso},'${transactions[i].category}','${transactions[i].currency}','${isoDate}',${transactions[i].amount})`
                db.query(sql1, (err) => {
                    if(err) throw err;
                })
            }
            console.log("Transaction added")
            res.send("Transactions added")
            
        })
    } catch(err){
        res.send("Could not add transaction")
    }
})

router.post('/add_payment', (req, res) => {
    const user = req.body.username;
    const payment = req.body;
    let uid;
    const sql = `SELECT bid FROM bank WHERE username = '${user}'`
    try{
        db.query(sql, (err, result)=>{
            if (err) throw err;
            uid = result[0].bid;

            let newBalance;
            const bal = `SELECT balance from bank WHERE username = '${user}'`
            db.query(bal, (err, result)=>{
                if (err) throw err;
                newBalance = result[0].balance - payment.amount;
                const update = `UPDATE bank SET balance = ${newBalance} WHERE username = '${user}'`
                db.query(update, (err)=>{
                    if(err) throw err;
                    console.log(`Balance updated successfully! - Balance: ${newBalance}`);
                })
            })
            
            let sql1 = `INSERT transaction (tid,bid,merchant,iso,category,currency,date,amount) VALUES `;
            const size = "SELECT COUNT(*) as length FROM transaction";
            db.query(size, (err, result)=>{
                if (err) throw err;
                let id = result[0].length + 1
                let date = new Date();
                let formattedDate = date.toISOString().substr(0, 10);

                sql1 += `(${id},${uid},'${payment.merchant}',${payment.iso},'${payment.category}','${payment.currency}','${formattedDate}',${payment.amount})`
                db.query(sql1, (err) => {
                    if(err) throw err;
                    res.send("Transaction added")
                })
            })

            
        })    
    } catch(err) {
        console.log(err);
    }

})

router.post('/get_bank', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let query = `SELECT password FROM bank where username='${username}'`
    db.query(query, (err, result) => {
        if(err) throw err;
        const info = `SELECT bid, balance, currency FROM bank where username='${username}'`
        const pass = result[0].password
        if(pass === password){
            db.query(info, (err, result) => {
                if (err) throw err;
                res.send(result[0])
            })
        } else{
            res.send("Does not match")
        }
    })
})

router.get('/get_verified_bank/:id', (req, res) => {
    let query = `SELECT * FROM bank WHERE bid = ${req.params.id}`
    db.query(query, (err, result) => {
        if(err) throw err;
        res.send(result[0])
    })
})

router.get('/get_transactions/:id', (req, res) => {
    const bid = req.params.id
    let query = `SELECT * FROM transaction WHERE bid = ${bid}`
    db.query(query, (err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

module.exports = router;