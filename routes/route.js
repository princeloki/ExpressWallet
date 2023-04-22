

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
    const email = req.body.email
    const password = req.body.password
    const sql = `SELECT uid, email, password FROM user WHERE email = '${email}'`
    db.query(sql, (err,result) => {
        if (err) throw err;
        const uid = result[0].uid;
        const email = result[0].email;
        const pass = result[0].password;
        bcrypt.compare(password, pass, function(err, result){
            if (err){
                console.log(err)
            } else{
                if (result){
                    res.send({
                        message:"Passwords match",
                        body: {
                            uid: uid,
                            email: email
                        }
                    });
                } else{
                    res.send({message: "Passwords do not match"});
                }
            }
        })
    })
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
    const total = 0
    let query = `INSERT INTO user(uid,first_name,last_name,email,phone_num,balance,length,income,password,country,host,currency,budget,total) VALUES`
    const size = "SELECT COUNT(*) as count FROM user"
    db.query(size, (err, result) => {
        if (err) throw err;
        const l = result[0].count
        query += `(${l},'${firstName}','${lastName}','${email}','${phone}',${balance},${length},${income},'${hash}','${country}','${host}','${currency}',${budget},${total})`
        db.query(query, (err) => {
            if (err) throw err;
            res.send({count: l});
        })
    })
})

router.put('/set_user', (req, res)=>{
    const email = req.body.email;
    const country = req.body.country;
    const host =  req.body.host;
    const length = req.body.length;
    const income = req.body.income;
    const currency = req.body.currency;
    const budget = req.body.budget;
    let query = `UPDATE user SET country = '${country}', host = '${host}', length = ${length}, income = ${income}, 
    currency = '${currency}', budget = ${budget} WHERE email='${email}'`
    db.query(query, (err)=>{
        if (err) throw err;
        const user = `SELECT uid, email FROM user WHERE email = '${email}'`
        db.query(user, (err, result)=>{
            if (err) throw err;
            res.send({message: "Success", body:result[0]})
        })
    })
})

router.get('/get_user/:id', (req, res)=>{
    const uid = req.params.uid;
    const sq = `SELECT first_name, last_name, email, balance, length, income, currency, budget, total FROM user WHERE uid='${uid}'`
    db.query(sq, (err, result)=>{
        if (err) throw err;
        const user = result[0];
        res.send(user);
    })
})

router.post('/secret', (req, res) => {
    console.log('sent secret')
})

router.post('/add_bank', (req, res) => {
    const uid = req.body.uid;
    const username = req.body.username;
    const password = req.body.password;
    axios.post('http://localhost:5000/api/get_bank', {username: username, password: password})
    .then(response => {
        const bankData = response.data 
        const balance = `UPDATE user SET balance = balance + ${bankData.balance} WHERE uid = ${uid}`
        db.query(balance, (err)=>{
            if (err) throw err;
            const bank = `INSERT INTO bank (bid, uid, balance, currency) VALUES (${bankData.bid}, ${uid}, ${bankData.balance}, '${bankData.currency}')`
            db.query(bank, (err)=>{
                if (err) throw err;
                axios.get(`http://localhost:5000/api/get_transactions/${bankData.bid}`)
                .then(response=>{
                    const trans = response.data
                    for(let i=0;i<trans.length;i++){
                        let isoDate = new Date(trans[i].date).toISOString().replace('T', ' ').replace('Z', '');
                        const sq = `INSERT INTO transaction (bid, merchant_name, iso, category, currency, date, amount) VALUES
                         (${trans[i].bid},'${trans[i].merchant}',${trans[i].iso},'${trans[i].category}','${trans[i].currency}','${isoDate}',${trans[i].amount})`
                        db.query(sq, (err)=>{
                            if (err) throw err;
                        })
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
                const amount = `SELECT COUNT(*) as number FROM bank WHERE uid = ${uid}`
                db.query(amount, (err,result)=>{
                    if (err) throw err;
                    res.send({count: result[0].number})
                })
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete('/delete_bank:id', (req,res) => {
    console.log("bank deleted")
})

router.get('/update_transactions/:id', (req, res) => {
    const uid = req.params.id;
    const query = `SELECT * FROM bank WHERE uid = ${uid}`;
    db.query(query, (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].bid);
        axios
          .get(`http://localhost:5000/api/get_transactions/${result[i].bid}`)
          .then((response) => {
            const trans = response.data;
            for (let i = 0; i < trans.length; i++) {
              let isoDate = new Date(trans[i].date)
                .toISOString()
                .replace('T', ' ')
                .replace('Z', '');
  
              const sq = `INSERT IGNORE INTO transaction (bid, merchant_name, iso, category, currency, date, amount) VALUES (${trans[i].bid},'${trans[i].merchant}',${trans[i].iso},'${trans[i].category}','${trans[i].currency}','${isoDate}',${trans[i].amount})`;
  
              db.query(sq, (err) => {
                if (err) throw err;
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
  
      res.send('Transactions updated successfully');
    });
  });
  
router.get('/get_transactions/:id', (req, res) => {
    const uid = req.params.id;
    const sql = `SELECT * FROM Transaction WHERE bid in (SELECT bid FROM bank WHERE uid = ${uid}) ORDER BY date DESC`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/get_top_five_transactions/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT * FROM Transaction WHERE bid in (SELECT bid FROM bank WHERE uid = '${uid}') ORDER BY date DESC LIMIT 5`
    db.query(sql, (err, result) =>{
        if (err) throw err;
        res.send(result)
    })
})

router.get('/get_most_common/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT merchant_name, SUM(amount) as total, COUNT(*) AS transaction_count FROM transaction
                WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid})
                GROUP BY merchant_name
                ORDER BY transaction_count DESC
                LIMIT 5;`
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

router.put('/update_user', (req, res) => {
    console.log("user updated");
})

router.post('/add_expense', (req, res) => {
    const uid = req.body.uid
    const expense_name = req.body.expense_name
    const amount = req.body.amount
    const state = req.body.state === 'Fixed' ? 'F' : 'A'
    const priority = req.body.priority === 'High' ? 'H' : req.body.priority === 'Normal' ? 'N' : 'L'
    sql1 = `INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES (${uid}, '${expense_name}', ${amount}, '${state}', '${priority}')`
    sql2 = `UPDATE user SET total = total + ${amount} WHERE uid = ${uid}`
    db.query(sql1, (err)=>{
        if (err) throw err;
        db.query(sql2, (err)=>{
            if (err) throw err;
            res.send({message: "Expense added successfully"});
        })
    })
})

router.get('/get_expenses/:id', (req, res) => {
    const uid = req.params.id;
    sql = `SELECT * FROM expense WHERE uid = ${uid}`
    db.query(sql, (err, results)=>{
        if (err) throw err;
        res.send(results);
    })
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