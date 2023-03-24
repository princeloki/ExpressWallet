

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

const db = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: 'shredder000',
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
                let sql1 = `INSERT transaction (tid,bid,merchant,iso,category,currency,date,amount) VALUES `;
                sql1 += `(${transactions[i].tid},${uid},'${transactions[i].merchant}',${transactions[i].iso},'${transactions[i].category}','${transactions[i].currency}','${transactions[i].date}',${transactions[i].amount})`
                db.query(sql1, (err) => {
                    if(err) throw err;
                    res.send("Transaction added")
                })
            }
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

module.exports = router;