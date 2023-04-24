

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const axios = require('axios')
const { exec } = require('child_process');
const dJSON = require('dirty-json')
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
    const sql = `SELECT * FROM user WHERE email = '${email}'`
    db.query(sql, (err,result) => {
        if (err) throw err;
        const uid = result[0].uid;
        const email = result[0].email;
        const pass = result[0].password;
        const first_name = result[0].first_name
        const last_name = result[0].last_name
        const balance = result[0].balance
        const length = result[0].length
        const income = result[0].income
        const currency = result[0].currency
        const budget = result[0].budget
        const total = result[0].total
        bcrypt.compare(password, pass, function(err, result){
            if (err){
                console.log(err)
            } else{
                if (result){
                    res.send({
                        message:"Passwords match",
                        body: {
                            uid: uid,
                            email: email,
                            first_name: first_name,
                            last_name: last_name,
                            balance: balance,
                            length: length,
                            income: income,
                            currency: currency,
                            budget: budget,
                            total: total
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
    const sq = `SELECT uid, first_name, last_name, email, balance, length, income, currency, budget, total FROM user WHERE uid='${uid}'`
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
    const sql = `SELECT * FROM Transaction WHERE bid in (SELECT bid FROM bank WHERE uid = ${uid}) 
    AND NOT EXISTS (SELECT * FROM assign WHERE assign.merchant_name = Transaction.merchant_name
    AND assign.merchant_code = Transaction.iso) ORDER BY date DESC`;
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
    sql2 = `UPDATE user SET budget = budget + ${amount} WHERE uid = ${uid}`
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

// router.post('/create_spending', (req, res) => {
//     console.log("spending added")
// })

// router.put('/update_spending:id', (req, res) => {
//     console.log("spending updated")
// })

// router.delete('/delete_spending/:id', (req, res) => {
//     console.log("delete expense")
// })

router.get('/get_spendings/:id', (req, res)=>{
    const uid = req.params.id
    const sql = 
    `SELECT eid, spending_name, MONTHNAME(date) as month, YEAR(date) as year, SUM(spending_amount) as total
    FROM spending
    WHERE eid in (SELECT eid FROM expense WHERE uid = ${uid})
    GROUP BY eid, spending_name, YEAR(date), MONTHNAME(date)
    ORDER BY YEAR(date) DESC, MONTHNAME(date) DESC      
    `
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

router.post('/assign_transactions', (req, res)=>{
    const eid = req.body.eid ? req.body.eid : null
    const merchant_code = req.body.merchant_code
    const merchant_name = req.body.merchant_name
    const date = new Date(req.body.date).toISOString().slice(0, 10);
    const amount = req.body.amount
    const sql1 = `INSERT INTO assign (eid, merchant_code, merchant_name) VALUES (${eid}, ${merchant_code}, '${merchant_name}')`;
    const sql2 = `INSERT INTO spending (eid, spending_name, spending_amount, date) VALUES (${eid}, (SELECT expense_name FROM expense WHERE eid = ${eid}), ${amount}, '${date}')`;
    db.query(sql1, (err)=>{
        if (err) throw err;
        db.query(sql2, (err)=>{
            if (err) throw err;
            res.send({message: "Transaction & Spending added successfully"});
        })
    })
})

router.post('/get_spending_trans', (req, res)=>{
    const eid = req.body.eid;
    const month = req.body.month;
    const year = req.body.year;
    const query = 
    `SELECT * 
    FROM transaction
    JOIN assign ON transaction.iso = assign.merchant_code
    WHERE assign.eid = ${eid}
    AND MONTHNAME(transaction.date) = '${month}'
    AND YEAR(transaction.date) = ${year}
    ORDER BY date DESC
    `
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/adjust_expenses/:id', (req, res) => {
    const uid = req.params.id;
    const sql = `
    SELECT expense_name as expense, expense_amount as amount,  priority, state
    FROM expense
    ORDER BY expense DESC`
    db.query(sql, (err, result)=>{
        const scriptPath = path.join(__dirname,'..','Logic','script.py');
        if (err) throw err;
        const sql2 = `SELECT balance FROM user WHERE uid=${uid}`
        const expenses = result;
        db.query(sql2, (err, result) => {
            if (err) throw err;
            const balance = result[0].balance;
            const expense_dict = expenses.reduce((acc, item) => {
                const priority = item.priority;
            
                if (!acc[priority]) {
                    acc[priority] = [];
                }
                acc[priority].push(item);
                return acc;
            }, {});
    
            exec(`python ${scriptPath} "${Buffer.from(JSON.stringify(expense_dict)).toString('base64')}" "${balance}"`, (error, stdout, stderr) => {
                if(error){
                    console.error(`exec error: ${error}`);
                    return res.status(500).send('An error occurred')
                }
                res.send({message:"Success",data: dJSON.parse(stdout)})
                stderr && console.error(`exec error: ${stderr}`);
                stdout && console.log("Json sent successfully")
            })
        })
    })
})

router.get('/get_assigned', (req, res)=>{
    console.log("assigned retrieved")
})

router.delete('/delete_account', (req, res) => {
    console.log("delete_account")
})




module.exports = router;