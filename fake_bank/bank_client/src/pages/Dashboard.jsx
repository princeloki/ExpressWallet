import React,{useState} from 'react';
import axios from 'axios'

function Dashboard({user}){
    const [balance, setBalance] = useState(user.balance);
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: 0,
        merchantName: "",
        iso: "",
        category: "",
        currency: "",
    })

    const handleBalance = (e) =>{
        setBalance(e.target.value)
    }

    const sendBalance = () =>{
        axios.post("http://localhost:5000/api/update_balance", {"username": user.username,"balance": balance})
        .then(result=>{
            console.log(result)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleTransactions = (e) =>{
        setTransactions(e.target.value)
    }

    const addTransaction = (e) =>{
        e.preventDefault()
        axios.post("http://localhost:5000/api/add_transaction", {"username": user.username, "transactions": JSON.parse(transactions)})
        .then(result => {
            console.log(result)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleChange = (e) =>{
        setFormData(prevFormData=>{
            return{
                ...prevFormData,
                [e.target.name]: e.target.value,
            }
        })
    }

    const makePayment = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:5000/api/add_payment', {"username": user.username, 
        "amount": formData.amount, "merchant": formData.merchantName, 
        "iso": formData.iso, "category": formData.category, 
        "currency": formData.currency})
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    return(
        <div className="Dashboard">
            <div className="main">
                <h1>Dashboard</h1>
                <h2>Balance: ${balance}</h2>
                <h5>Set Balance</h5>
                <input type="text" name="balance" value={balance} id="balance" onChange={(e)=>handleBalance(e)} />
                <button onClick={sendBalance}>Set</button>

                <h5>Add Transactions</h5>
                <textarea name="transactions" id="transactions" value={transactions} onChange={(e)=>handleTransactions(e)} cols="30" rows="10">

                </textarea>
                <button onClick={addTransaction}>Add</button>
            </div>
            <div className="side">
                <form onSubmit={makePayment}>
                    <label htmlFor="amount">Amount ($)</label>
                    <input type="text" name="amount" value={formData.amount} onChange={(e)=>handleChange(e)} placeholder="Enter amount"/>
                    <label htmlFor="amount">Merchant Name</label>
                    <input type="text" name="merchantName" value={formData.merchantName} onChange={(e)=>handleChange(e)} placeholder="Enter Merchant Name"/>
                    <label htmlFor="amount">ISO Code</label>
                    <input type="text" name="iso" value={formData.iso} onChange={(e)=>handleChange(e)} placeholder="Enter ISO Code "/>
                    <label htmlFor="amount">Merchant Category</label>
                    <input type="text" name="category" value={formData.category} onChange={(e)=>handleChange(e)} placeholder="Enter Item Category"/>
                    <label htmlFor="amount">Currency</label>
                    <input type="text" name="currency" value={formData.currency} onChange={(e)=>handleChange(e)} placeholder="Enter Currency"/>
                    <button>Pay</button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard;