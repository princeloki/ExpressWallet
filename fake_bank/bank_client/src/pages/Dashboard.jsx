

import React,{useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard({user}){
    const navigate = useNavigate();
    const [balance, setBalance] = useState(user.balance);
    const [transactions, setTransactions] = useState([]);
    const [info, setInfo] = useState("No payment made yet");
    const [formData, setFormData] = useState({
        amount: 0,
        merchantName: "",
        mcc: "",
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
        console.log(formData)
        e.preventDefault()
        axios.post('http://localhost:5000/api/add_payment', {"username": user.username, 
        "amount": formData.amount, "merchant": formData.merchantName, 
        "mcc": formData.mcc, "category": formData.category, 
        "currency": formData.currency})
        .then(result => {
            setInfo("PAYMENT MADE SUCCESSFULLY")
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const logout = () =>{
        localStorage.removeItem("user");
        navigate('/login');
    }
    
    return(
        <div className="Dashboard">
            <div>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
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
                <div className="info">{info}</div>
                <form onSubmit={makePayment}>
                    <label htmlFor="amount">Amount ($)</label>
                    <input type="text" name="amount" value={formData.amount} onChange={(e)=>handleChange(e)} placeholder="Enter amount"/>
                    <label htmlFor="amount">Merchant Name</label>
                    <input type="text" name="merchantName" value={formData.merchantName} onChange={(e)=>handleChange(e)} placeholder="Enter Merchant Name"/>
                    <label htmlFor="amount">MCC</label>
                    <input type="text" name="mcc" value={formData.mcc} onChange={(e)=>handleChange(e)} placeholder="Enter mcc Code "/>
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