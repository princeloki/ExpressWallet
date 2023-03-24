

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const { faker } = require('@faker-js/faker')
const apiRouter = require('./routes/api')
require('dotenv/config')

const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));


app.use('/api', apiRouter)


const connection = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: 'shredder000',
    database: 'bankinformation'
})

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connected");
})


const insertBankAccountData = ()=>{
    const bankAccounts = [];

    for (let i = 0; i < 10; i++) {
      const bankAccount = {
        bid: i,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password(6),
        balance: faker.finance.amount()
      };
      bankAccounts.push(bankAccount);
    }
    
    // insert the bank accounts into the MySQL table
    const sql = 'INSERT INTO bank (bid, first_name, last_name, username, password, balance) VALUES ?';
    
    connection.query(sql, [bankAccounts.map(bankAccount => [bankAccount.bid, bankAccount.first_name, bankAccount.last_name, bankAccount.username, bankAccount.password, bankAccount.balance])], (error, results, fields) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Inserted ' + results.affectedRows + ' rows');
      }
    });
}

// const insertTransactionData = ()=>{
//     const transactions = [];
//     const isoCodes = [];
//     const bidArr = [];

//     for (let i = 0; i < 1000; i++) {
//       const transaction = {
//         tid: i,
//         bid: faker.random.numeric({min: 1, max: 10}),
//         merchant: faker.company.name(),
//         iso: faker.random.numeric({min: 1000, max: 9999}),
//         category: faker.finance.transactionType(),
//         currency: faker.finance.currencyCode(),
//         date: faker.date.between('2022-01-01', '2022-12-31').strftime("%Y-%m-%d"),
//         amount: faker.random.numeric({min: 1, max: 1000})
//       };
//       transactions.push(transaction);
//     }

//     // Select 4 random bid values to have duplicates
//     const uniqueBids = Array.from(new Set(bidArr));
//     const duplicateBids = [];
//     for(let i = 0; i < 4; i++){
//         const randomBid = faker.helpers.arrayElement(uniqueBids);
//         const index = uniqueBids.indexOf(randomBid);
//         if (index > -1) {
//           uniqueBids.splice(index, 1);
//         }
//         duplicateBids.push(randomBid);
//     }

//     // Add 2 duplicate transactions for each of the selected bids
//     for (let i = 0; i < duplicateBids.length; i++) {
//       const selectedBid = duplicateBids[i];
//       const bidTransactions = transactions.filter(t => t.bid === selectedBid);
//       const duplicateTransactions = faker.helpers.shuffle(bidTransactions).slice(0,2);
//       for (let j = 0; j < duplicateTransactions.length; j++) {
//         const duplicate = {
//           ...duplicateTransactions[j],
//           tid: faker.random.numeric({min: 1, max: 1000})
//         };
//         transactions.push(duplicate);
//       }
//     }
    
//     // insert the transactions into the MySQL table
//     const sql = 'INSERT INTO transaction (tid, bid, merchant, iso, category, currency, date, amount) VALUES ?';
    
//     connection.query(sql, [transactions.map(transaction => [transaction.tid, transaction.bid, transaction.merchant, transaction.iso, transaction.category, transaction.currency, transaction.date.toISOString(), transaction.amount])], (error, results, fields) => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log('Inserted ' + results.affectedRows + ' rows');
//       }
//     });
// }


// call the functions to insert the data
// insertBankAccountData();

app.listen(5000, ()=>{
    console.log('Listening on port 5000');
});
