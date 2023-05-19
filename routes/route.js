// Import necessary modules
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const axios = require('axios')
const { exec,spawn  } = require('child_process');
const dJSON = require('dirty-json')
const fs = require("fs");
const csv = require('csv-parser');
const nodemailer = require('nodemailer');

// Load environment variables
require('dotenv/config')

// Define API key header
const headers = {
    apikey: process.env.KEY
};

// Create a new router object
const router = express.Router()

// Establish MySQL database connection
const db = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: process.env.PASS,
    database: 'expresswallet'
})

// Connect to the database
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected");
})

// Set up Nodemailer transport configuration
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secureConnection: false,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers:'SSLv3',
        rejectUnauthorized: false // Trust self-signed certificates
    }
});

// POST route for logging in a user
router.post('/login', (req, res) => {
    // Extract email and password from request body
    const email = req.body.email
    const password = req.body.password
    const sql = `SELECT * FROM user WHERE email = '${email}'`
    db.query(sql, (err,result) => {
        if (err) throw err;
        // Extract user details from the returned result
        const uid = result[0].uid;
        const email = result[0].email;
        const pass = result[0].password;
        const first_name = result[0].first_name
        const last_name = result[0].last_name
        const balance = result[0].balance
        const length = result[0].length
        const currency = result[0].currency
        const country = result[0].country
        const host = result[0].host
        const budget = result[0].budget
        const start = result[0].start
        const autoassign = result[0].autoassign
        // Use bcrypt to compare the hashed password with the plain text password
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
                            currency: currency,
                            country: country,
                            host: host,
                            budget: budget,
                            start: start,
                            autoassign: autoassign
                        }
                    });
                } else{
                    res.send({message: "Passwords do not match"});
                }
            }   
        })
    })
})

// POST route for registering a new user
router.post('/register', async (req, res) => {
    // Extract user information from request body
    const salt = 10
    const firstName = req.body.name.split(" ")[0]
    const lastName = req.body.name.split(" ")[1]
    const password = req.body.password
    const email = req.body.email
    const phone = req.body.phone
    const hash = await bcrypt.hash(password, salt) // Generate hashed password using bcrypt
    const balance = 0
    const length = 0
    const country = ""
    const host = ""
    const currency = "USD"
    const budget = 0
    const autoassign = 0
    const alert = 0

    let query = `INSERT INTO user(first_name,last_name,email,phone_num,balance,length,password,country,host,currency,budget, autoassign, alert) VALUES`
    query += `('${firstName}','${lastName}','${email}','${phone}',${balance},${length},'${hash}','${country}','${host}','${currency}',${budget}, ${autoassign}, ${alert})`
    db.query(query, (err) => {
        if (err) throw err;
        // SQL query for getting the number of users in the database
        const size = "SELECT COUNT(*) as count FROM user"
        db.query(size, (err, result) => {
            if (err) throw err;
            const l = result[0].count
            // Send the number of users as a response
            res.send({count: l});
        })
    })
})

// Initializes the user's currency with the base currency
router.get("/initialize_currency/:base", async (req, res) => {
    // This Promise reads a CSV file and extracts the list of currencies
    const getCurrenciesFromCsv = new Promise((resolve, reject) => {
        let currencies = [];
        fs.createReadStream('Logic/Currencies.csv')
        .pipe(csv())
        .on('data', (row) => {
            currencies.push(row.Currency);
        })
        .on('end', () => {
            resolve(currencies);
        })
        .on('error', (error) => {
            reject(error);
        });
    });

    // The list of currencies is fetched and then exchange rates are fetched for these currencies from the API
    try {
        let currencies = await getCurrenciesFromCsv;
        const symbols = currencies.join('%2C');
        axios.get(`https://api.apilayer.com/exchangerates_data/latest?symbols=${symbols}&base=${req.params.base}`, { headers })
        .then(response => {
            // The response is then saved in the database
            currencies = Object.entries(response.data.rates);
            const sql = `INSERT INTO currencies (uid, symbol, rate) VALUES ((SELECT max(uid) FROM user), ?, ?)`;
            for(let i=0;i<currencies.length;i++){
                db.query(sql, [currencies[i][0], currencies[i][1]], (err)=>{
                    if (err) throw err;
                })
            }
            console.log("Currencies Initialized")
            res.send("Currencies Initialized");
        })
        .catch(error => {
            console.log('error', error);
        });
    } catch (error) {
        console.log('error', error);
    }
}); 

// Endpoint to fetch all available currencies from the CSV file
router.get("/get_currencies", (req, res) => {
    let currencies = [];
    fs.createReadStream('Logic/Currencies.csv')
    .pipe(csv())
    .on('data', (row) => {
        currencies.push(row.Currency);
    })
    .on('end', () => {
        res.send(currencies);
    })
    .on('error', (error) => {
        console.error(error);
        res.status(500).send('Error reading CSV file');
    });
});

// Endpoint to fetch all available symbols from the CSV file
router.get("/get_symbols", (req, res) => {
    let currencies = [];
    fs.createReadStream('Logic/Currencies.csv')
    .pipe(csv())
    .on('data', (row) => {
        currencies.push({ code: row.Currency, symbol: row.Symbol });
    })
    .on('end', () => {
        res.send(currencies);
    })
    .on('error', (error) => {
        console.error(error);
        res.status(500).send('Error reading CSV file');
    });
});


// Endpoint to fetch the current exchange rates for the user
router.get("/get_rates/:uid", (req, res)=>{
    const sql = `SELECT symbol, rate FROM currencies WHERE uid=${req.params.uid}`
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// Define a route to update user data
router.put('/set_user', (req, res)=>{
    
    // Extract request parameters
    const email = req.body.email;
    const country = req.body.country;
    const host =  req.body.host;
    const length = req.body.length;
    const budget = req.body.budget;
    const misc = req.body.misc;
    const start = req.body.start;
    const high = req.body.high;
    const normal = req.body.normal;
    const low = req.body.low;
    const autoassign = req.body.autoassign;
    const alert = req.body.alert;
    
    // SQL query to get the currency for the user identified by the provided email
    const bank = `SELECT currency FROM bank WHERE uid IN (SELECT uid FROM user WHERE email = '${email}')`;
    let currency;
    
    // Execute the SQL query
    db.query(bank, (err, result)=>{
        if (err) throw err; // Throw error if one occurs

        // Get the currency from the result
        currency = result[0].currency;

        // SQL query to update user data
        let query = `UPDATE user SET country = '${country}', host = '${host}', length = ${length}, 
        currency = '${currency}', budget = ${budget}, start='${start}',autoassign=${autoassign}, alert=${alert} WHERE email='${email}' `
        
        // Execute the SQL query
        db.query(query, (err)=>{
            if (err) throw err; // Throw error if one occurs
            
            // SQL query to get user ID and email for the updated user
            const user = `SELECT uid, email FROM user WHERE email = '${email}'`
            db.query(user, (err, result)=>{
                if (err) throw err; // Throw error if one occurs
                
                // Get user ID from the result
                const uid = result[0].uid;
                
                // SQL query to set the priority and initial expense for the user
                const priority = `INSERT INTO priority (uid, priority_name, percentage) VALUES (${uid}, 'H', ${high}),
                                                                                                (${uid}, 'N', ${normal}),
                                                                                                (${uid}, 'L', ${low});
                                INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES (${uid}, 'MISC', ${misc}, 'A', 'N');
                                UPDATE user SET budget = ${misc} WHERE uid = ${uid};`
                
                // Execute the SQL query
                db.query(priority, (err)=>{
                    if (err) throw err; // Throw error if one occurs
                })
            })
        })
        
        // Send the user's currency as the response
        res.send(currency);
    })
})

// API endpoint to update a user
router.put('/update_user/:id', (req, res) => {
    // Get the user ID from the request parameters
    const uid = req.params.id;

    // SQL statement to get bank ids associated with the user
    const banks = `SELECT bid FROM bank WHERE uid = ${uid}`;

    // Query the database for the banks associated with the user
    db.query(banks, (err, result) => {
        // If there's an error with the database query, throw the error
        if (err) throw err;

        // Iterate through each bank id returned in the result
        for (let i = 0; i < result.length; i++) {

            // Get verified bank details via a separate API
            axios.get(`http://localhost:5000/api/get_verified_bank/${result[i].bid}`)
                .then(response => {
                    // Update the bank balance with the returned data from the API
                    let upBank = `UPDATE bank SET balance = ${response.data.balance} WHERE bid = ${result[i].bid}`;
                    db.query(upBank, (err) => {
                        // If there's an error with the database query, throw the error
                        if (err) throw err;
                    });
                })
                .catch(err => {
                    // Log any error encountered when getting the bank details
                    console.log(err);
                });

            // Get transactions via a separate API
            axios.get(`http://localhost:5000/api/get_transactions/${result[i].bid}`)
                .then(response => {
                    // Insert each transaction into the database
                    const trans = response.data;
                    for (let i = 0; i < trans.length; i++) {
                        let isoDate = new Date(trans[i].date).toISOString().replace('T', ' ').replace('Z', '');
                        const sq = `INSERT IGNORE INTO transaction (tid, bid, merchant_name, mcc, category, currency, date, amount) VALUES
                     (?,?,?,?,?,?,?,?)`;
                        db.query(sq, [trans[i].tid, trans[i].bid, trans[i].merchant, trans[i].mcc, trans[i].category, trans[i].currency, isoDate, trans[i].amount],(err) => {
                            // If there's an error with the database query, throw the error
                            if (err) throw err;
                        });
                    }   
                })
                .catch(err => {
                    // Log any error encountered when getting the transactions
                    console.log(err);
                });
        }
    });

    // Function to process transactions
    function processTransactions(sql) {
        db.query(sql, (err, result) => {
            // If there's an error with the database query, throw the error
            if (err) throw err;

            // Process each transaction returned in the result
            const trans = result;
            for (let i = 0; i < trans.length; i++) {
                let isoDate = new Date(trans[i].date);
                let mysqlFriendlyDate = isoDate.toISOString().slice(0, 19).replace('T', ' ');

                // SQL statement to insert the spending
                let sql1 = `INSERT INTO spending (eid, tid, spending_name, spending_amount, date, accounted) VALUES 
            (${trans[i].eid}, (SELECT MAX(tid) FROM transaction WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid})),'${trans[i].expense}', ${trans[i].amount}, '${mysqlFriendlyDate}', ${trans[i].expense === 'MISC' ? 0 : 1})`;

                // Query the database to
                // insert the spending
                db.query(sql1, (err) => {
                    // If there's an error with the database query, throw the error
                    if (err) throw err;
                });
            }
        });
    }    


    // SQL statement to get the count of spending records
    const spendingCountSql = `SELECT COUNT(*) as count FROM spending`;
    let spendingCount;
    db.query(spendingCountSql, (err, countResult) => {
        // If there's an error with the database query, throw the error
        if (err) throw err;
        // Set spendingCount to the count returned in the result
        spendingCount = countResult[0].count;
    });

    // SQL statement to get the autoassign value for the user
    const autoAssignSql = `SELECT autoassign FROM user WHERE uid = ${uid}`;
    db.query(autoAssignSql, (err, result) => {
        // If there's an error with the database query, throw the error
        if (err) throw err;
        // Get autoassign value from the result
        const autoassign = result[0].autoassign;

        // If autoassign is 0 and there are spending records
        if (autoassign === 0 && spendingCount !==0) {
            const sql = `
            SELECT t.*, a.eid, expense_name AS expense
            FROM transaction t
            JOIN assign a ON t.merchant_name = a.merchant_name AND (t.mcc = a.merchant_code OR (t.mcc IS NULL AND a.merchant_code IS NULL))
            JOIN expense e ON a.eid = e.eid
            WHERE t.bid IN (SELECT bid FROM bank WHERE uid = ${uid})
            AND tid NOT IN (SELECT tid FROM spending)  
            AND date >= (SELECT date(start) FROM user WHERE uid = ${uid})            
                `;
            // Call processTransactions function with the SQL statement as an argument
            processTransactions(sql);
        } else if(autoassign === 1 && spendingCount !== 0) {
            const classificationSql = `
            (
                SELECT * FROM transaction 
                WHERE bid IN (SELECT bid FROM bank WHERE uid=${uid}) 
                AND date(transaction.date) >= (SELECT date(start) FROM user WHERE uid = ${uid}) 
                AND transaction.merchant_name NOT IN (SELECT merchant_name FROM assign WHERE merchant_code IS NULL)
                AND merchant_name NOT IN (SELECT merchant_name FROM assign WHERE merchant_code IS NOT NULL)
            )
            UNION
            (
                SELECT * FROM transaction 
                WHERE bid IN (SELECT bid FROM bank WHERE uid=${uid}) 
                AND date(transaction.date) >= (SELECT date(start) FROM user WHERE uid = ${uid})
                AND (merchant_name,mcc) NOT IN (SELECT merchant_name,merchant_code FROM assign)
            );
            `;
            db.query(classificationSql, (err, result) => {
                if (err) throw err;
                
                if(result.length > 0){
                    const base64Data = Buffer.from(JSON.stringify(result)).toString("base64");
                    const pythonProcess = spawn("python", [
                        "Logic/Decisiontree/decision_predictor.py",
                        base64Data,
                    ]);
    
                    pythonProcess.stdout.on("data", (data) => {
                        const predicted_categories = JSON.parse(data.toString());
                        for (let i = 0; i < result.length; i++) {
                            result[i].predicted_category = predicted_categories[i];
                        }
                        
                        // Process predicted transactions
                        const trans = result;
                        for (let i = 0; i < trans.length; i++) {
                            let isoDate = new Date(trans[i].date).toISOString();
                    
                            const findEidSql = `
                            SELECT e.eid, e.expense_name
                            FROM expense e
                            WHERE e.expense_name = '${trans[i].predicted_category}'
                            AND e.uid = ${uid}
                            `;
                            db.query(findEidSql, (err, expenseResult) => {
                                if (err) throw err;
                                let eid = null;
                                let expenseName = null;
                                if (expenseResult.length > 0) {
                                    eid = expenseResult[0].eid;
                                    expenseName = expenseResult[0].expense_name;
                                } else {
                                    const insertMiscSql = `
                                    SELECT eid FROM expense WHERE expense_name="MISC" AND uid=${uid}
                                    `;
                                    db.query(insertMiscSql, (err, insertResult) => {
                                        if (err) throw err;
                                        eid = insertResult[0].eid;
                                        expenseName = "MISC";
                                    });
                                }
                    
                                const findAssignSql = `
                                SELECT a.eid
                                FROM assign a
                                WHERE a.merchant_name = "${trans[i].merchant_name}"
                                AND a.merchant_code = ${trans[i].mcc}
                                `;
                                db.query(findAssignSql, (err, assignResult) => {
                                    if (err) throw err;
                                    if (assignResult.length === 0) {
                                        const insertAssignSql = `
                                        INSERT IGNORE INTO assign (eid, merchant_code, merchant_name, category)
                                        VALUES (?, ?, ?, ?)`;
                                
                                        // Check if trans[i].mcc is null and handle accordingly
                                        let mccValue = trans[i].mcc != null ? trans[i].mcc : null;
                                
                                        db.query(insertAssignSql, [eid, mccValue, trans[i].merchant_name, trans[i].category], (err) => {
                                            if (err) throw err;
                                        });
                                    }
                                });
                                
                    
                                const insertSpendingSql = `
                                INSERT IGNORE INTO spending (eid, tid, spending_name, spending_amount, date, accounted)
                                VALUES (${eid}, (SELECT MAX(tid) FROM transaction WHERE bid IN (SELECT bid FROM bank WHERE uid=${uid})), '${expenseName}', ${trans[i].amount}, '${isoDate}', ${expenseName === 'MISC' ? 0 : 1})
                                `;
                                db.query(insertSpendingSql, (err) => {
                                    if (err) throw err;
                                });
                            });
                        }
                    });
                } else{
                    // Process predicted transactions
                    const tr = 
                            `
                            SELECT t.*, a.eid, expense_name AS expense
                            FROM transaction t
                            JOIN assign a ON t.merchant_name = a.merchant_name AND (t.mcc = a.merchant_code OR (t.mcc IS NULL AND a.merchant_code IS NULL))
                            JOIN expense e ON a.eid = e.eid
                            WHERE tid NOT IN (SELECT tid FROM spending)  
                            AND t.bid IN (SELECT bid FROM bank WHERE uid = ${uid})
                            AND date >= (SELECT date(start) FROM user WHERE uid = ${uid})                            
                            `
                    processTransactions(tr)
                }
            });
        }
    });

    // SQL statement to update the user's balance
    const upUser = `
    UPDATE user
    SET balance = (SELECT SUM(balance) FROM bank WHERE bid in (SELECT bid FROM bank WHERE uid = ${uid}))
    WHERE uid = ${uid}`
    db.query(upUser, (err) => {
        // If there's an error with the database query, throw the error
        if (err) throw err;
        // Send a response indicating that the user has been updated
        res.send({message: 'user updated'})
        // Log a message indicating that the user has been updated
        console.log("User has been updated")
    })
})

// Endpoint to update a user's information
router.post('/update_user_info/:id', (req, res) => {
    // Extract user id from request parameters
    const uid = req.params.id;
    
    // Extract user info from request body
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const autoassign = req.body.autoassign
    const H = req.body.H
    const N = req.body.N
    const L = req.body.L
    
    // Construct the SQL query
    const sql = `UPDATE user SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}',autoassign=${autoassign} WHERE uid = ${uid};
                UPDATE priority SET percentage = ${H} WHERE uid = '${uid}' AND priority_name = 'H';
                UPDATE priority SET percentage = ${N} WHERE priority_name = 'N' AND uid = '${uid}';
                UPDATE priority SET percentage = ${L} WHERE priority_name = 'L' AND uid = '${uid}';`

    // Execute the SQL query
    db.query(sql, (err) =>{
        if (err) throw err;
        res.send("User Updated");
    })
})


// Endpoint to get user information based on user id
router.get('/get_user/:id', (req, res)=>{
    // Extract user id from request parameters
    const uid = req.params.id;
    
    const sq = `SELECT uid, first_name, last_name, email, phone_num, balance, length, 
    country, host, currency, budget, autoassign, start, alert FROM user WHERE uid=${uid}`
    
    db.query(sq, (err, result)=>{
        if (err) throw err;
        const user = result[0];
        res.send(user);
    })
})

// Endpoint to get remaining budgets based on user id
router.get('/get_rem_budgets/:id', (req, res)=>{
    // Construct the SQL query
    const sql = 
    `
    SELECT e.eid, e.expense_name, e.expense_amount - COALESCE(SUM(s.spending_amount), 0) as total
    FROM expense e
    LEFT JOIN spending s ON e.eid = s.eid AND MONTH(s.date) = MONTH(NOW())
    WHERE e.uid = ${req.params.id}
    GROUP BY e.eid, e.expense_name, e.expense_amount
    HAVING total > 0
    ORDER BY e.eid;
    `
    
    // Execute the SQL query
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// Route for getting the remaining budget of a user.
router.get('/get_rem_budget/:id', (req, res)=>{
    // SQL query to calculate the remaining budget.
    // It fetches the expenses of the user and calculates the difference between the total expense amount and the total spending for the current month.
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
    // Execute the SQL query.
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result[0]) // Send the result to the client.
    })
})


// Route for adding a bank to the user account.
router.post('/add_bank', (req, res) => {
    // Extract the user id, username, and password from the request body.
    const uid = req.body.uid;
    const username = req.body.username;
    const password = req.body.password;

    // Make an API call to get the bank data.
    axios.post('http://localhost:5000/api/get_bank', {username: username, password: password})
    .then(response => {
        const bankData = response.data 

        // Update the user balance by adding the bank balance to the current balance.
        const balance = `UPDATE user SET balance = balance + ${bankData.balance} WHERE uid = ${uid}`
        db.query(balance, (err)=>{
            if (err) throw err;

            // Insert the bank data into the 'bank' table.
            const bank = `INSERT IGNORE INTO bank (bid, uid, balance, currency) VALUES (${bankData.bid}, ${uid}, ${bankData.balance}, '${bankData.currency}')`
            db.query(bank, (err)=>{
                if (err) throw err;

                // Make an API call to get the bank transactions.
                axios.get(`http://localhost:5000/api/get_transactions/${bankData.bid}`)
                .then(response=>{
                    const trans = response.data

                    // Insert each transaction into the 'transaction' table.
                    for(let i=0;i<trans.length;i++){
                        let isoDate = new Date(trans[i].date).toISOString().replace('T', ' ').replace('Z', '');
                        const sq = `INSERT IGNORE INTO transaction (tid, bid, merchant_name, mcc, category, currency, date, amount) VALUES
                         (?,?,?,?,?,?,?,?)`
                        db.query(sq,[trans[i].tid, trans[i].bid, trans[i].merchant, trans[i].mcc, trans[i].category, trans[i].currency, isoDate, trans[i].amount], (err)=>{
                            if (err) throw err;
                        })
                    }
                })
                .catch(err=>{
                    console.log(err);
                })

                // Count the number of banks associated with the user.
                const amount = `SELECT COUNT(*) as number FROM bank WHERE uid = ${uid}`
                db.query(amount, (err,result)=>{
                    if (err) throw err;
                    res.send({count: result[0].number}) // Send the number of banks associated with the user to the client.
                })
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})



// Route for getting all countries from a CSV file.
router.get('/get_countries/', (req, res)=>{
    const countries = []; // Array to hold the countries.

    // Read the CSV file.
    fs.createReadStream('Logic/all_countries.csv')
        .pipe(csv())
        .on('data', (row) => {
            countries.push(row.Countries); // Push each country to the array.
        })
        .on('end', () => {
            res.send(countries); // Send the list of countries to the client.
        });
})


// Route for getting all universities from a CSV file.
router.get('/get_universities/', (req, res) => {
    const universities = []; // Array to hold the universities.

    try{
        // Read the CSV file.
        fs.createReadStream('Logic/world-universities.csv')
            .pipe(csv({ headers: ['Code', 'University', 'email'] }))
            .on('data', (row) => {
                universities.push(row.University); // Push each university to the array.
            })
            .on('end', () => {
                res.send(universities); // Send the list of universities to the client.
            });
    } catch(err){
        console.log(err);
    }
});
// Define route to update transactions for a given user ID
router.get('/update_transactions/:id', (req, res) => {
    // Retrieve user ID from the request parameters
    const uid = req.params.id;

    // Prepare SQL query to select all bank details for this user ID
    const query = `SELECT * FROM bank WHERE uid = ${uid}`;

    // Execute SQL query
    db.query(query, (err, result) => {
      if (err) throw err; // Throw error if any during the query execution

      // Loop through the result
      for (let i = 0; i < result.length; i++) {
        // Log the bank ID
        console.log(result[i].bid);

        // Make a request to get transactions for the current bank ID
        axios
          .get(`http://localhost:5000/api/get_transactions/${result[i].bid}`)
          .then((response) => {
            // Save transactions
            const trans = response.data;

            // Loop through transactions
            for (let i = 0; i < trans.length; i++) {
              // Format date to ISO string
              let isoDate = new Date(trans[i].date)
                .toISOString()
                .replace('T', ' ')
                .replace('Z', '');

              // Prepare SQL query to insert transactions into the database
              const sq = `INSERT IGNORE INTO transaction (tid, bid, merchant_name, mcc, category, currency, date, amount)
               VALUES (?,?,?,?,?,?,?,?)`;

              // Execute SQL query to insert transaction
              db.query(sq,[trans[i].tid, trans[i].bid, trans[i].merhcant, trans[i].mcc, trans[i].category, trans[i].currency, isoDate, trans[i].amount], (err) => {
                if (err) throw err; // Throw error if any during the query execution
              });
            }
          })
          .catch((err) => {
            // Log error if any during the request
            console.log(err);
          });
      }

      // Send response back to the client
      res.send('Transactions updated successfully');
    });
});
  
// Route to get all transactions for a specific user that have not been assigned yet
router.get('/get_noassign_transactions/:id', (req, res) => {
    const uid = req.params.id;
    const sql = `SELECT * 
    FROM Transaction 
    WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid}) 
      AND NOT EXISTS (SELECT * FROM assign WHERE assign.merchant_name = Transaction.merchant_name AND assign.merchant_code = Transaction.mcc) 
      AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid})
    ORDER BY date DESC;
    `;
    // Execute the SQL query and send the result back to the client
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})


// Route to get all transactions for a specific user
router.get('/get_transactions/:id', (req, res) => {
    const uid = req.params.id
    const sql = `SELECT * 
    FROM Transaction 
    WHERE bid IN (SELECT bid FROM bank WHERE uid = ${uid}) 
    AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid})
    ORDER BY date DESC;`
    // Execute the SQL query and send the result back to the client
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})


// Route to get the latest five transactions for a specific user
router.get('/get_top_five_transactions/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT * FROM Transaction WHERE bid in (SELECT bid FROM bank WHERE uid = '${uid}')
    AND transaction.date >= (SELECT date(start) FROM user WHERE uid = ${uid}) 
    ORDER BY date DESC LIMIT 5`
    // Execute the SQL query and send the result back to the client
    db.query(sql, (err, result) =>{
        if (err) throw err;
        res.send(result)
    })
})


// Route to get the five most common spending categories for a specific user
router.get('/get_most_common/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `
    SELECT spending_name, SUM(spending_amount) as total
    FROM expense
    JOIN spending ON expense.eid = spending.eid
    WHERE expense.uid = ?
    GROUP BY spending.spending_name
    ORDER BY total DESC
    LIMIT 5;`
    // Execute the SQL query and send the result back to the client
    db.query(sql, [uid], (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})


// Route to get the top spending categories for a specific user in the current month
router.get('/get_monthly_top/:id',(req, res)=>{
    const uid = req.params.id;
    const sql = `
    SELECT spending_name, SUM(spending_amount) as total
    FROM expense
    JOIN spending ON expense.eid = spending.eid
    WHERE MONTH(spending.date) = MONTH(CURDATE())
    AND expense.uid = ?
    GROUP BY spending.spending_name
    ORDER BY total DESC
    `
    // Execute the SQL query and send the result back to the client
    db.query(sql, [uid], (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// Route to get the top spending categories for a specific user in the current week
router.get('/get_weekly_top/:id',(req, res)=>{
    const uid = req.params.id;
    const sql = `
    SELECT spending_name, SUM(spending_amount) as total
    FROM expense
    JOIN spending ON expense.eid = spending.eid
    WHERE WEEK(spending.date) = WEEK(CURDATE())
    AND expense.uid = ?
    GROUP BY spending.spending_name
    ORDER BY total DESC
    `
    // Execute the SQL query and send the result back to the client
    db.query(sql, [uid], (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

router.get('/get_priorities/:id', (req, res)=>{
    const uid = req.params.id;
    const sql = `SELECT * FROM priority WHERE uid = ${uid}`;
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

router.get('/get_each_spending/:id', (req, res)=>{
    const uid = req.params.id
    const sql = `SELECT * FROM spending WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid})`
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
    JOIN assign a ON t.merchant_name = a.merchant_name AND t.mcc = a.merchant_code
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
    const merchant_code = req.body.mcc
    const merchant_name = req.body.merchant_name
    const category = req.body.category
    const date = new Date(req.body.date).toISOString().slice(0, 10);
    const amount = req.body.amount
    const sql1 = `INSERT IGNORE INTO assign (eid, merchant_code, merchant_name, category)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE eid = ?`;


    let mccValue = merchant_code != null ? merchant_code : null;

    const sql2 = `INSERT INTO spending (eid, tid, spending_name, spending_amount, date, accounted)
    VALUES (${eid},${tid}, (SELECT expense_name FROM expense WHERE eid = ${eid}), ${amount}, '${date}', (SELECT CASE WHEN expense_name <> 'MISC' THEN 1 ELSE 0 END FROM expense WHERE eid = ${eid}))
    ON DUPLICATE KEY UPDATE eid = ${eid}`;

    db.query(sql1, [eid, mccValue, merchant_name, category, eid], (err) => {
        if (err) throw err;
        db.query(sql2, (err)=>{
            if (err) throw err;
            res.send({message: "Transaction & Spending added successfully"});
        })
    })
})

router.post('/reassign_transaction', (req, res)=>{
    const eid = req.body.eid ? req.body.eid : null
    const tid = req.body.tid
    const expense_name = req.body.expense_name
    const merchant_code = req.body.mcc
    const merchant_name = req.body.merchant_name
    const category = req.body.category
    console.log(eid, tid, merchant_code, merchant_name, expense_name, category)
    let sql;
    if (merchant_code === null) {
        sql = `UPDATE assign SET eid = ? WHERE merchant_name = ? AND category = ?;
                UPDATE spending SET eid = ?, spending_name = ? WHERE tid = ?`;
        db.query(sql, [eid, merchant_name, category, eid, expense_name, tid], (err) => {
            if (err) throw err;
            res.send("Changes made")
        });
    } else {
        sql = `UPDATE assign SET eid = ? WHERE merchant_code = ? AND merchant_name = ? AND category = ?;
                UPDATE spending SET eid = ?, spending_name = ? WHERE tid = ?`;
        db.query(sql, [eid, merchant_code, merchant_name, category, eid, expense_name, tid], (err, result) => {
            if (err) throw err;
            res.send("Changes made");
        });
    }
})


router.post('/get_spending_trans', (req, res)=>{
    const eid = req.body.eid;
    const month = req.body.month;
    const year = req.body.year;
    const query = 
    `
    SELECT DISTINCT transaction.tid, bid, transaction.merchant_name, mcc, category, currency, transaction.date, amount, eid
    FROM transaction
    JOIN spending ON transaction.tid = spending.tid
    WHERE spending.eid = ${eid}
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
    WHERE e.uid = 1
    AND e.state = "A"
    GROUP BY e.eid, e.expense_name, e.expense_amount
    HAVING e.expense_amount - COALESCE(SUM(s.spending_amount), 0) >= 0
    ORDER BY e.eid;
    `;
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
                const sql4 = `
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
                WHERE e.uid = ?
                GROUP BY e.eid, e.expense_name, e.expense_amount
                ) subquery;
                `
                db.query(sql4, [uid], (err, result)=>{
                    if (err) throw err;
                    const remBudget = result[0].grand_total
                    const sql5 = `SELECT balance FROM user WHERE uid = ?`
                    db.query(sql5, [uid], (err, result)=>{
                        if (err) throw err;
                        const originalbalance = result[0].balance;

                        const sql6 = `SELECT email, alert FROM user WHERE uid = ?`
                        db.query(sql6, [uid], (err, result)=>{
                            if (err) throw err;
                            const alert = result[0].alert;
                            const email = result[0].email;

                            const sentMessages = new Set();

                            // Function to reset the file
                            function resetFile() {
                                fs.writeFileSync('lastEmailSent.txt', '');
                                console.log("File reset.");
                                sentMessages.clear();
                            }
                            
                            // Call resetFile every 30 minutes
                            setInterval(resetFile, 30 * 60 * 1000);

                            function sendEmail(stdout) {
                                // Check if file exists, if not, create it
                                if (!fs.existsSync('lastEmailSent.txt')) {
                                    fs.writeFileSync('lastEmailSent.txt', '');
                                }
                                // Read the date of the last email sent from a file
                                const lastEmailSent = fs.readFileSync('lastEmailSent.txt', 'utf8');

                                const currentDate = new Date().toDateString();

                                if (lastEmailSent === currentDate) {
                                    console.log("Email already sent today");
                                    return;
                                }

                                const messageObj = JSON.parse(stdout);

                                if (messageObj.message === "Nothing to adjust" || sentMessages.has(messageObj.message)) {
                                    console.log("Nothing to adjust or message already sent");
                                    return;
                                }
                            
                                const message = messageObj.message === "At risk" ? 
                                `Hey there! Just a heads-up, you're now less than ${alert}% away from your spending limit for the month. It might be a good time to take a closer look at your remaining expenses. Let's keep your budget on track together!`
                                : messageObj.message === "Success" ? 
                                `You have overspent your budget by $${Math.abs(balance)}. To get back on track, consider reducing your expenses using the recommendations in your dashboard.` : ``;
                            
                                const mailOptions = {
                                    from: process.env.MAIL_EMAIL,
                                    to: email,
                                    subject: `<<Exchange Wallet Alert>>`,
                                    text: message
                                }
                            
                                transporter.sendMail(mailOptions, function (err, res) {
                                    if(err){
                                        console.log(err);
                                        console.log("Error: Could not send mail")
                                    } else {
                                        console.log('Email sent successfully')
                                        fs.writeFileSync('lastEmailSent.txt', currentDate);
                                        sentMessages.add(messageObj.message);
                                    }
                                });
                            }
                            const args = [
                                scriptPath,
                                Buffer.from(JSON.stringify(expense_dict)).toString("base64"),
                                String(balance),
                                Buffer.from(JSON.stringify(exp)).toString("base64"),
                                String(remBudget),
                                String(originalbalance),
                                String(alert)
                            ];
                            const command = `python ${args.map((arg) => `"${arg}"`).join(" ")}`;
                            exec(command, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return res.status(500).send("An error occurred");
                            }

                            // In your function where you're receiving the stdout
                            res.send({ data: JSON.parse(stdout) });
                            stderr && console.error(`exec error: ${stderr}`);
                            stdout && console.log("Json sent successfully");
                            stdout && sendEmail(stdout);
                            });

                        })
                    })

                })
                
                  

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
    AND date(t.date) >= (SELECT date(start) FROM user WHERE uid=${uid})`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.post('/add_recommended/:id', (req, res) => {
    const uid = req.params.id;
    const expense_name = req.body.expense;
    const spending_name = req.body.spending_name;
    const category = req.body.category;
    const amount = req.body.amount;
    const priority = req.body.priority;
    const state = req.body.state;
    const trans = req.body.trans;
    console.log(trans);

    const checkExpenseSql = `SELECT * FROM expense WHERE uid = ? AND expense_name = ?`;

    db.query(checkExpenseSql, [uid, expense_name], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const eid = result[0].eid;
            for(let i=0;i<trans.length;i++){
                const updateAssign = `
                UPDATE assign JOIN spending ON assign.eid = spending.eid JOIN transaction ON 
                spending.tid = transaction.tid SET assign.eid = ? WHERE 
                merchant_code = ? AND assign.merchant_name = ? AND 
                category = ?`;

    
                const updateSpending = `
                UPDATE spending JOIN transaction ON spending.tid = transaction.tid SET eid = ?, 
                spending_name = ?, accounted = 1 WHERE spending.tid = ? AND 
                merchant_name = ? AND category = ?`;
    
                db.query(updateAssign, [eid, trans[i].mcc, trans[i].merchant_name, category], (err) => {
                    if (err) throw err;
                    db.query(updateSpending, [eid, expense_name, trans[i].tid, trans[i].merchant_name, trans[i].category], (err) => {
                        if (err) throw err;
                    });
                });
            }
            
            res.send("Updated spending for existing expense");
        } else {
            const insertExpense = `INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES (?, ?, ?, ?, ?)`;

            const updateUser = `UPDATE user SET budget = budget + ? WHERE uid = ?`;

            db.query(insertExpense, [uid, expense_name, amount, state, priority], (err) => {
                if (err) throw err;
                db.query(updateUser, [amount, uid], (err) => {
                    if (err) throw err;
                    for(let i=0;i<trans.length;i++){
                        let updateAssign = `
                        UPDATE assign AS a
                        JOIN spending AS s ON a.eid = s.eid 
                        JOIN transaction AS t ON s.tid = t.tid
                        SET a.eid = (SELECT MAX(eid) FROM expense WHERE uid = ${uid}) 
                        WHERE s.tid = ${trans[i].tid} AND a.merchant_name = "${trans[i].merchant_name}" AND a.merchant_code = ${trans[i].mcc}`;

                        let addSpend = `UPDATE spending SET eid = (SELECT MAX(eid) FROM expense WHERE uid = ?), spending_name = ?,
                        accounted = 1 WHERE tid = ?`;
                        
                        db.query(updateAssign, (err) => {
                            if (err) throw err;
                          });
                        
                        db.query(addSpend, [uid, expense_name, trans[i].tid], (err) => {
                          if (err) throw err;
                        });
                    }
                });
            });
            
            res.send("Updated spending for existing expense");
        }
    });
});


router.post('/ignore_recommendation/:uid', (req, res) => {
    const uid = req.params.uid;
    const trans = req.body.trans

    for(let i=0;i<trans.length;i++) {
        let ignore = `UPDATE spending SET accounted = 1 WHERE tid = ${trans[i].tid}`
        db.query(ignore, (err)=>{
            if (err) throw err;
        })
    }
    
    res.send("Recommendation ignored");
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
  
  router.post("/initialize_expenses/:id", async (req, res) => {
    const uid = req.params.id;
    const body = req.body;
  
    try {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          let transactions = body[key].transactions;
  
          if (key !== "MISC") {
            let sql = `INSERT INTO expense (uid, expense_name, expense_amount, state, priority) VALUES 
            (?, ?, ?, ?, ?);
            UPDATE user SET budget = budget + ? WHERE uid = ?`;
            await query(sql, [uid, key, body[key].amount, body[key].state, body[key].priority, body[key].amount, uid]);
          }
  
          for (let i = 0; i < transactions.length; i++) {
            let accountedValue = key === "MISC" ? 0 : 1;
            let mccValue = transactions[i].mcc != null ? transactions[i].mcc : null;
            let sql2 = `
            INSERT IGNORE INTO assign (eid, merchant_code, merchant_name, category) 
            VALUES ((SELECT eid FROM expense WHERE expense_name = ? AND uid = ?), ?, ?, ?);
            INSERT IGNORE INTO spending (eid, tid, spending_name, spending_amount, date, accounted) VALUES 
            ((SELECT eid FROM expense WHERE expense_name = ? AND uid = ?), ?, ?, ?, ?, ?);`;
            await query(sql2, [key, uid, mccValue, transactions[i].merchant_name, transactions[i].category, key, uid, transactions[i].tid, key, transactions[i].amount, transactions[i].date, accountedValue]);
            console.log(key);
          }
        }
      }
      res.send("Expenses and Spendings Initialized");
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while initializing expenses and spendings.");
    }
  });
  
  

router.post('/analyze_expense', (req, res)=>{
    const merchant_name = req.body.merchant_name;
    const category = req.body.category;
    const mcc = req.body.mcc;


    const base64Data = Buffer.from(JSON.stringify([{merchant_name: merchant_name, category: category,mcc: mcc}])).toString("base64");

    const pythonProcess = spawn("python", [
        "Logic/Decisiontree/decision_predictor.py",
        base64Data,
    ]);


    pythonProcess.stdout.on("data", (data) => {
        const predicted_categories = JSON.parse(data.toString());
    
        let result = [];
    
        result.push({
          merchant_name: merchant_name,
          mcc: mcc,
          predicted_category: predicted_categories[0],
        });
    
        res.send(result);
    });
    
    pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    });
});
  

router.get("/get_classifications/:id", (req, res) => {
    const uid = req.params.id;
    const sql = `SELECT * FROM transaction WHERE bid IN (SELECT bid FROM bank WHERE uid=${uid}) 
      AND date(transaction.date) >= (SELECT date(start) FROM user WHERE uid = ${uid})`;
  
    db.query(sql, (err, result) => {
      if (err) throw err;
  
      const base64Data = Buffer.from(JSON.stringify(result)).toString("base64");
  
      const pythonProcess = spawn("python", [
        "Logic/Decisiontree/decision_predictor.py",
        base64Data,
      ]);

  
      pythonProcess.stdout.on("data", (data) => {
        const predicted_categories = JSON.parse(data.toString());
  
        for (let i = 0; i < result.length; i++) {
          result[i].predicted_category = predicted_categories[i];
        }
        res.send(result);
      });
  
      pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
    });
});

router.post('/cash_transaction/:id', (req, res) => {
    const uid = req.params.id;
    const trans_name = req.body.name;
    const type = req.body.type;
    const amount = req.body.amount;
    const currency = req.body.currency;
    const date = req.body.date;
    console.log(type);
    
    const sql = `INSERT INTO transaction (tid, bid, merchant_name, mcc, category, currency, date, amount) 
    SELECT MAX(tid) + 1, (SELECT bid FROM bank WHERE uid = ? LIMIT 1), ?, 0000, ?, ?, ?, ?
    FROM transaction;`;
  
    db.query(sql, [uid, trans_name, type, currency, date, amount], (err) => {
      if (err) throw err;
    });
  
    const sql2 = `INSERT IGNORE INTO assign (eid, merchant_code, merchant_name, category) VALUES ((SELECT eid FROM expense WHERE expense_name 
        = "${type}"), 0000,"${trans_name}", "${type}");`;
    
    db.query(sql2, (err) => {
      if (err) throw err;
    });
    const sql3 = `
    INSERT INTO spending (eid, tid, spending_name, spending_amount, date, accounted) 
    VALUES (
        (SELECT eid FROM expense WHERE expense_name = ?), 
        (SELECT MAX(tid) FROM transaction WHERE bid in (SELECT bid FROM bank WHERE uid = ?)), 
        ?, 
        ?, 
        ?, 
        IF(? = 'MISC', 0, 1)
    );
    `;
    
    db.query(sql3, [type, uid, type, amount, date, type], (err) => {
        if (err) throw err;
    });
    
  
    res.send("Transaction Logged");
  });

router.get('/get_monthly_difference/:id', (req, res)=>{
    const uid = req.params.id
    const sql = `
    SELECT
    (COALESCE(this_month.total, 0) - COALESCE(last_month.total, 0)) / COALESCE(last_month.total, 1) * 100 as difference
    FROM
    (SELECT COALESCE(SUM(spending_amount), 0) as total
     FROM spending
     WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid}) AND YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE())) as this_month
     
    JOIN
    (SELECT COALESCE(SUM(spending_amount), 0) as total
     FROM spending
     WHERE eid IN (SELECT eid FROM expense WHERE uid = ${uid}) AND YEAR(date) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(date) = MONTH(CURDATE() - INTERVAL 1 MONTH)) as last_month;
    `
    db.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result[0])
    })
})


router.delete('/delete_account/:id', (req, res) => {
    const uid = req.params.id;

    // List of queries to be executed.
    const queries = [
        "DELETE FROM assign WHERE eid in (SELECT eid FROM expense WHERE uid = ?)",
        "DELETE FROM priority WHERE uid = ?",
        "DELETE FROM spending WHERE eid in (SELECT eid FROM expense WHERE uid = ?)",
        "DELETE FROM transaction WHERE bid in (SELECT bid FROM bank WHERE uid = ?)",
        "DELETE FROM expense WHERE uid = ?",
        "DELETE FROM bank WHERE uid = ?",
        "DELETE FROM currencies WHERE uid = ?",
        "DELETE FROM user WHERE uid = ?",
        "ALTER TABLE priority AUTO_INCREMENT = 0",
        "ALTER TABLE spending AUTO_INCREMENT = 0",
        "ALTER TABLE expense AUTO_INCREMENT = 0",
        "ALTER TABLE currencies AUTO_INCREMENT = 0",
        "ALTER TABLE user AUTO_INCREMENT = 0",
    ];

    // Execute each query individually.
    for (let i = 0; i < queries.length; i++) {
        // If query has a parameter, substitute it with 'uid'.
        if (queries[i].includes("?")) {
            db.query(queries[i], [uid], (err) => {
                if (err) throw err;
            });
        } else {
            // If query does not have a parameter, just execute it.
            db.query(queries[i], (err) => {
                if (err) throw err;
            });
        }
    }

    // Send response after all queries have been executed.
    res.send("delete_account");
});





module.exports = router;