const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql')


const router = express.Router()


router.post('/login', (req, res) => {
    console.log("login")
})

router.post('/register', (req, res) => {
    console.log("register")
})

router.post('/secret', (req, res) => {
    console.log('sent secret')
})

router.get('/get_bank:username', (req, res) => {
    console.log("get_bank")
})

router.post('/add_bank:id', (req, res) => {
    console.log("add_bank")
})

router.post('/get_transactions:id', (req, res)=>{
    console.log("transactions")
})




module.exports = router;