

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
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200
}));


app.use('/api', apiRouter)
const connection = mysql.createConnection({
    multipleStatements: true,
    user: 'root',
    host: 'localhost',
    password: process.env.PASS,
    database: 'bankinformation' //enter your own db name
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
        balance: faker.finance.amount(),
        currency: faker.finance.currencyCode()
      };
      bankAccounts.push(bankAccount);
    }
    
    // insert the bank accounts into the MySQL table
    let sql = `CREATE TABLE IF NOT EXISTS bank(
      bid INT NOT NULL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      balance INT NOT NULL,
      currency VARCHAR(40) NOT NULL
      ); ` 
    sql += 'INSERT INTO bank (bid, first_name, last_name, username, password, balance, currency) VALUES ?';
    
    connection.query(sql, [bankAccounts.map(bankAccount => [bankAccount.bid, bankAccount.first_name, bankAccount.last_name, bankAccount.username, bankAccount.password, bankAccount.balance, bankAccount.currency])], (error, results, fields) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Inserted ' + results.affectedRows + ' rows');
      }
    });
}

// insertBankAccountData();

app.listen(5000, ()=>{
    console.log('Listening on port 5000');
});
