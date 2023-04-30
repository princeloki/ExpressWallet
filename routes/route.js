

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const axios = require('axios')
const { exec,spawn  } = require('child_process');
const dJSON = require('dirty-json')
const fs = require("fs");
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
        const country = result[0].country
        const host = result[0].host
        const budget = result[0].budget
        const start = result[0].start
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
                            country: country,
                            host: host,
                            budget: budget,
                            start: start
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

    let query = `INSERT INTO user(first_name,last_name,email,phone_num,balance,length,income,password,country,host,currency,budget) VALUES`
    query += `('${firstName}','${lastName}','${email}','${phone}',${balance},${length},${income},'${hash}','${country}','${host}','${currency}',${budget})`
    db.query(query, (err) => {
        if (err) throw err;
        const size = "SELECT COUNT(*) as count FROM user"
        db.query(size, (err, result) => {
            if (err) throw err;
            const l = result[0].count
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
    const misc = req.body.misc;
    const start = req.body.start;
    const high = req.body.high;
    const normal = req.body.normal;
    const low = req.body.low;
    let query = `UPDATE user SET country = '${country}', host = '${host}', length = ${length}, income = ${income}, 
    currency = '${currency}', budget = ${budget}, start='${start}'  WHERE email='${email}'`
    db.query(query, (err)=>{
        if (err) throw err;
        const user = `SELECT uid, email FROM user WHERE email = '${email}'`
        db.query(user, (err, result)=>{
            if (err) throw err;
            const bod = result[0];
            const uid = result[0].uid;
            const priority = `INSERT INTO priority (uid, priority_name, percentage) VALUES (${uid}, 'H', ${high}),
                                                                                            (${uid}, 'N', ${normal}),
                                                                                             (${uid}, 'L', ${low});
                            INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES (${uid}, 'MISC', ${misc}, 'A', 'N');
                            UPDATE user SET budget = ${misc} WHERE uid = ${uid};`
            db.query(priority, (err)=>{
                if (err) throw err;
                res.send({message: "Success", body:bod});
            })
        })
    })
})

router.put(`/update_user/:id`,(req,res)=>{
    const uid = req.params.id
    const banks = `SELECT bid FROM bank WHERE uid = ${uid}`
    db.query(banks, (err,result)=>{
        if (err) throw err;
        for(let i=0;i<result.length;i++){
            axios.get(`http://localhost:5000/api/get_verified_bank/${result[i].bid}`)
            .then(response=>{
                let upBank = `UPDATE bank SET balance = ${response.data.balance} WHERE bid = ${result[i].bid}`
                db.query(upBank, (err)=>{
                    if (err) throw err;
                })
            })
            .catch(err=>{
                console.log(err)
            })

            axios.get(`http://localhost:5000/api/get_transactions/${result[i].bid}`)
            .then(response=>{
                const trans = response.data
                for(let i=0;i<trans.length;i++){
                    let isoDate = new Date(trans[i].date).toISOString().replace('T', ' ').replace('Z', '');
                    const sq = `INSERT IGNORE INTO transaction (tid, bid, merchant_name, iso, category, currency, date, amount) VALUES
                     (${trans[i].tid}, ${trans[i].bid},"${trans[i].merchant}",${trans[i].iso},'${trans[i].category}','${trans[i].currency}','${isoDate}',${trans[i].amount})`
                    db.query(sq, (err)=>{
                        if (err) throw err;
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
    
    const sql = `
    SELECT t.*, a.eid, expense_name AS expense
    FROM transaction t
    JOIN assign a ON t.merchant_name = a.merchant_name AND t.iso = a.merchant_code
    JOIN expense e ON a.eid = e.eid
    WHERE t.bid IN (SELECT bid FROM bank WHERE uid = ${uid})
    AND tid NOT IN (SELECT tid FROM spending)  
    AND date >= (SELECT date(start) FROM user WHERE uid = ${uid})
    `
    db.query(sql, (err, result)=>{
        if (err) throw err;
        const trans = result;
        for(let i=0;i<trans.length;i++){
            let isoDate = new Date(trans[i].date).toISOString();
            let sql1 = `INSERT IGNORE INTO spending (eid, tid, spending_name, spending_amount, date, accounted) VALUES 
            (${trans[i].eid}, ${trans[i].tid},'${trans[i].expense}', ${trans[i].amount}, '${isoDate}', ${trans[i].expense === 'MISC' ? 0 : 1})`
            db.query(sql1, (err)=>{
                if (err) throw err;
            })
        }
    })
    
    const upUser = `
    UPDATE user
    SET balance = (SELECT SUM(balance) FROM bank WHERE bid in (SELECT bid FROM bank WHERE uid = ${uid}))
    WHERE uid = ${uid}`
    db.query(upUser, (err) => {
        if (err) throw err;
        res.send({message: 'user updated'})
        console.log("User has been updated")
    })
})

router.get('/get_user/:id', (req, res)=>{
    const uid = req.params.id;
    const sq = `SELECT uid, first_name, last_name, email, phone_num, balance, length, income, 
    country, host, currency, budget, start FROM user WHERE uid=${uid}`
    db.query(sq, (err, result)=>{
        if (err) throw err;
        const user = result[0];
        res.send(user);
    })
})

router.get('/get_rem_budgets/:id', (req, res)=>{
    const sql = `
    SELECT e.eid, e.expense_name, e.expense_amount - COALESCE(SUM(s.spending_amount), 0) as total
    FROM expense e
    LEFT JOIN spending s ON e.eid = s.eid AND MONTH(s.date) = MONTH(NOW())
    WHERE e.uid = ${req.params.id}
    GROUP BY e.eid, e.expense_name, e.expense_amount
    ORDER BY e.eid;
    `
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

router.get('/get_rem_budget/:id', (req, res)=>{
    const sql = `
    SELECT SUM(adjusted_total) as grand_total
    FROM (
    SELECT e.eid,
           e.expense_name,
           e.expense_amount,
           CASE
               WHEN e.expense_amount - COALESCE(SUM(s.spending_amount), 0) < 0 THEN 0
               ELSE e.expense_amount - COALESCE(SUM(s.spending_amount), 0)
           END as adjusted_total
    FROM expense e
    LEFT JOIN spending s ON e.eid = s.eid AND MONTH(s.date) = MONTH(NOW())
    WHERE e.uid = ${req.params.id}
    GROUP BY e.eid, e.expense_name, e.expense_amount
    ) subquery;
    `
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result[0])
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
            const bank = `INSERT IGNORE INTO bank (bid, uid, balance, currency) VALUES (${bankData.bid}, ${uid}, ${bankData.balance}, '${bankData.currency}')`
            db.query(bank, (err)=>{
                if (err) throw err;
                axios.get(`http://localhost:5000/api/get_transactions/${bankData.bid}`)
                .then(response=>{
                    const trans = response.data
                    for(let i=0;i<trans.length;i++){
                        let isoDate = new Date(trans[i].date).toISOString().replace('T', ' ').replace('Z', '');
                        const sq = `INSERT IGNORE INTO transaction (tid, bid, merchant_name, iso, category, currency, date, amount) VALUES
                         (${trans[i].tid}, ${trans[i].bid},"${trans[i].merchant}",${trans[i].iso},'${trans[i].category}','${trans[i].currency}','${isoDate}',${trans[i].amount})`
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
  
              const sq = `INSERT IGNORE INTO transaction (bid, merchant_name, iso, category, currency, date, amount) VALUES (${trans[i].bid},"${trans[i].merchant}",${trans[i].iso},'${trans[i].category}','${trans[i].currency}','${isoDate}',${trans[i].amount})`;
  
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
    const sql = `SELECT * 
    FROM Transaction 
    WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid}) 
      AND NOT EXISTS (SELECT * FROM assign WHERE assign.merchant_name = Transaction.merchant_name AND assign.merchant_code = Transaction.iso) 
      AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid})
    ORDER BY date DESC;
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/get_top_five_transactions/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT * FROM Transaction WHERE bid in (SELECT bid FROM bank WHERE uid = '${uid}')
    AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid}) 
    ORDER BY date DESC LIMIT 5`
    db.query(sql, (err, result) =>{
        if (err) throw err;
        res.send(result)
    })
})

router.get('/get_most_common/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT merchant_name, SUM(amount) as total, COUNT(*) AS transaction_count FROM transaction
                WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid})
                AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid})
                GROUP BY merchant_name
                ORDER BY transaction_count DESC
                LIMIT 5;`
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
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
    const eid = req.body.eid;
    const expense = req.body.expense;
    const amount  = req.body.amount;
    const state = req.body.state;
    const priority = req.body.priority;
    const sql = `
    UPDATE expense
    SET expense_name = '${expense}', expense_amount = ${amount}, state = '${state}', priority = '${priority}'
    WHERE eid = ${eid}
    `
    db.query(sql, (err)=>{
        if (err) throw err;
        res.send("Updated");
    })
})

router.put('/update_adjusted/:id', (req, res)=>{
    const uid = req.params.id
    const expenses = req.body.expenses
    for(let i=0;i<expenses.length;i++){
        let sql = `UPDATE expense SET expense_name = '${expenses[i].name}', expense_amount = ${expenses[i].amount}
        WHERE uid = ${uid} AND expense_name = '${expenses[i].name}'`
        db.query(sql, (err)=>{
            if (err) throw err;
        })
    }
        
    res.send({message: "Successfully updated expenses"})
})

router.delete('/delete_expense/:eid', (req, res)=>{
    const sql = `
    DELETE FROM expense WHERE eid = ${req.params.eid};
    DELETE FROM spending WHERE eid = ${req.params.eid};
    DELETE FROM assign WHERE eid = ${req.params.eid};
    ALTER TABLE spending AUTO_INCREMENT = 0;
    ALTER TABLE expense AUTO_INCREMENT = 0;
    `
    db.query(sql, (err)=>{
        if (err) throw err;
        res.send("Expense has been deleted");
    })
    console.log("delete expense")
})

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


router.get('/get_spending_amount/:id', (req, res) => {
    const uid = req.params.id;
    const sql = `
    SELECT 
    IFNULL((SELECT SUM(spending_amount) FROM spending
            WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid})
            AND DATE(spending.date) = CURDATE()), 0) AS today,
            
    (SELECT SUM(spending_amount) FROM spending
     WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid})
     AND WEEK(spending.date) = WEEK(CURDATE())
     AND YEAR(spending.date) = YEAR(CURDATE())) AS week,
     
    (SELECT SUM(spending_amount) FROM spending
     WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid})
     AND MONTH(spending.date) = MONTH(CURDATE())
     AND YEAR(spending.date) = YEAR(CURDATE())) AS month

    `;
    db.query(sql, (err, result) => {
      if (err) throw err;
      const spending = result[0];
      res.status(200).send(spending);
    });
});
  
router.get('/fix_expense/:id', (req, res) =>{
    const sql = `
    SELECT t.*, a.eid, expense_name AS expense
    FROM transaction t
    JOIN assign a ON t.merchant_name = a.merchant_name AND t.iso = a.merchant_code
    JOIN expense e ON a.eid = e.eid
    WHERE t.bid IN (SELECT bid FROM bank WHERE uid = 1)    
    `
    db.query(sql, (err, result)=>{
        const trans = result;
        for(let i=0;i<trans.length;i++){
            let sql1 = `INSERT INTO spending (eid, spending_name, spending_amount, date) VALUES 
            (${trans[i].eid}, '${trans[i].expense}', ${trans[i].amount}, '${trans[i].date}');`
            db.query(sql1, (err)=>{
                if (err) throw err;
            })
        }
        res.send(trans)
    })
    
})

router.post('/assign_transactions', (req, res)=>{
    const eid = req.body.eid ? req.body.eid : null
    const tid = req.body.tid
    const merchant_code = req.body.merchant_code
    const merchant_name = req.body.merchant_name
    const date = new Date(req.body.date).toISOString().slice(0, 10);
    const amount = req.body.amount
    const sql1 = `INSERT IGNORE INTO assign (eid, merchant_code, merchant_name) VALUES (${eid}, ${merchant_code}, "${merchant_name}")`;
    const sql2 = `INSERT IGNORE INTO spending (eid, tid, spending_name, spending_amount, date, accounted) VALUES (${eid},${tid}, (SELECT expense_name FROM expense WHERE eid = ${eid}), ${amount}, '${date}', (SELECT CASE WHEN expense_name <> 'MISC' THEN 1 ELSE 0 END FROM expense WHERE eid = ${eid}))`;
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
    `
    SELECT DISTINCT tid, bid, transaction.merchant_name, iso, category, currency, date, amount, eid
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
    SELECT e.expense_name as expense, e.expense_amount - COALESCE(SUM(s.spending_amount), 0) as amount, e.state, e.priority 
    FROM expense e
    LEFT JOIN spending s ON e.eid = s.eid AND MONTH(s.date) = MONTH(NOW())
    WHERE e.uid = ${uid}
    GROUP BY e.eid, e.expense_name, e.expense_amount
    HAVING e.expense_amount - COALESCE(SUM(s.spending_amount), 0) >= 0
    ORDER BY e.eid;
    `;
    const sql2 = `SELECT `
    db.query(sql, (err, result)=>{
        const scriptPath = path.join(__dirname,'..','Logic','script.py');
        if (err) throw err;
        const sql2 = 
        `
        SELECT COALESCE(user.balance - SUM(adjusted_total), 0) as grand_total
        FROM (
            SELECT e.eid,
                   e.expense_name,
                   e.expense_amount,
                   CASE
                       WHEN e.expense_amount - COALESCE(SUM(s.spending_amount), 0) < 0 THEN 0
                       ELSE e.expense_amount - COALESCE(SUM(s.spending_amount), 0)
                   END as adjusted_total
            FROM expense e
            LEFT JOIN spending s ON e.eid = s.eid AND MONTH(s.date) = MONTH(NOW())
            JOIN user ON user.uid = e.uid
            WHERE e.uid = ${uid}
            GROUP BY e.eid, e.expense_name, e.expense_amount
        ) subquery
        JOIN user ON user.uid = ${uid};
        `
        const expenses = result;
        db.query(sql2, (err, result) => {
            if (err) throw err;
            const balance = result[0].grand_total;
            const expense_dict = expenses.reduce((acc, item) => {
                const priority = item.priority;
            
                if (!acc[priority]) {
                    acc[priority] = [];
                }
                acc[priority].push(item);
                return acc;
            }, {});
            const sql3 = `
            SELECT priority_name, percentage 
            FROM priority 
            WHERE uid = ${uid}`
            db.query(sql3, (err, result) =>{
                if (err) throw err;
                const exp = result;

                const args = [
                    scriptPath,
                    Buffer.from(JSON.stringify(expense_dict)).toString("base64"),
                    String(balance),
                    Buffer.from(JSON.stringify(exp)).toString("base64"),
                  ];
                const command = `python ${args.map((arg) => `"${arg}"`).join(" ")}`;
                
                exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).send("An error occurred");
                }
                res.send({ data: JSON.parse(stdout) });
                stderr && console.error(`exec error: ${stderr}`);
                stdout && console.log("Json sent successfully");
                });
                  

            })
        })
    })
})

router.get(`/get_recommended/:id`, (req, res) => {
    const uid = req.params.id;
    const sql = `
    SELECT * 
    FROM transaction 
    JOIN spending ON transaction.tid = spending.tid
    WHERE spending_name = 'MISC' AND accounted = 0
    AND eid in (SELECT eid FROM expense WHERE uid = ${uid})
    AND date(transaction.date) >= (SELECT date(start) FROM user WHERE uid=${uid})
    ORDER BY transaction.date`
    db.query(sql, (err, result) => {
        if (err) throw err;
    
        // Spawn the Python process
        const pythonProcess = spawn("python", ["Logic/automatic_expenses.py"]);
    
        // Send the JSON object to the Python script through stdin
        pythonProcess.stdin.write(JSON.stringify({ transactions: result }));
        pythonProcess.stdin.end();
    
        let stdoutData = "";
        pythonProcess.stdout.on("data", (data) => {
          stdoutData += data;
        });
    
        pythonProcess.stderr.on("data", (data) => {
          console.error(`exec error: ${data}`);
        });
    
        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            return res.status(500).send("An error occurred");
          }
    
          res.send({ data: JSON.parse(stdoutData) });
          console.log("Json sent successfully");
        });
      });
    });

router.post('/find_transactions', (req, res) => {
    const uid = req.body.uid
    const merchant = req.body.merchant_name
    const cat = req.body.category
    const amount = req.body.amount
    
    const sql = `SELECT * FROM transaction t WHERE t.bid IN (SELECT bid FROM bank WHERE uid = ${uid}) AND merchant_name = '${merchant}' AND category = '${cat}'
    AND amount = ${amount}
    AND date(t.date) >= (SELECT date(start) FROM user WHERE uid=${uid})`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.post('/add_recommended/:id', (req, res) => {
    const uid = req.params.id
    const expense_name = req.body.expense
    const spending_name = req.body.spending_name
    const category = req.body.category
    const amount = req.body.amount
    const priority = req.body.priority
    const state = req.body.state
    const sql = `INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES (${uid}, '${expense_name}', ${amount}, '${state}', '${priority}')`;
    const addSpend = `UPDATE spending SET eid = LAST_INSERT_ID(), spending_name = '${expense_name}', accounted = 1
    WHERE tid IN (SELECT tid FROM transaction WHERE merchant_name = '${spending_name}' AND category = '${category}' AND amount = '${amount}')
    `
    db.query(sql, (err) => {
        if (err) throw err;
        db.query(addSpend, (err) => {
            if (err) throw err;
            res.send("Recommended expense added")
        })
    })
})

router.post('/ignore_recommendation/:uid', (req, res) => {
    const uid = req.params.uid;
    const expense_name = req.body.expense;
    const category = req.body.category;
    const amount = req.body.amount;

    const addSpend = `
        UPDATE spending
        SET accounted = 1
        WHERE tid IN (
            SELECT tid
            FROM transaction
            WHERE bid IN (SELECT bid FROM bank WHERE uid  = ?) AND merchant_name = ? AND category = ? AND amount = ?
        );
    `;

    // Use parameterized query to prevent SQL injection
    db.query(addSpend, [uid, expense_name, category, amount], (error, results, fields) => {
        if (error) {
            console.error("Error in query execution:", error);
            res.status(500).send("Error updating spending");
        } else {
            res.status(200).send("Spending updated successfully");
        }
    });
});



router.delete('/delete_account/:id', (req, res) => {
    const uid = req.params.id
    const sql = `
    DELETE FROM assign WHERE eid in (SELECT eid FROM expense WHERE uid = ${uid});
    DELETE FROM priority WHERE uid = ${uid};
    DELETE FROM spending WHERE eid in (SELECT eid FROM expense WHERE uid = ${uid});
    DELETE FROM transaction WHERE bid in (SELECT bid FROM bank WHERE uid = ${uid});
    DELETE FROM expense WHERE uid = ${uid};
    DELETE FROM bank WHERE uid = ${uid};
    DELETE FROM user WHERE uid = ${uid};
    ALTER TABLE priority AUTO_INCREMENT = 0;
    ALTER TABLE spending AUTO_INCREMENT = 0;
    ALTER TABLE expense AUTO_INCREMENT = 0;
    ALTER TABLE user AUTO_INCREMENT = 0;
    `
    db.query(sql, (err)=>{
        if (err) throw err;
        res.send("delete_account")
    })
})




module.exports = router;