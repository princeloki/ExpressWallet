

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

// insertBankAccountData();

app.listen(5000, ()=>{
    console.log('Listening on port 5000');
});
