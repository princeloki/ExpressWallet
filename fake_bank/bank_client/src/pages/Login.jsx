

import React,{ useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login({setUser}){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    console.log(formData)

    const handleChange = (e) => {
        setFormData(prevFormData=>{
            return{
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:5000/api/login", formData)
        .then(result=>{      
            localStorage.setItem("user", JSON.stringify({
                "first_name": result.data[0].first_name,
                "last_name": result.data[0].last_name,
                "username": result.data[0].username,
                "password": result.data[0].password,
                "balance": result.data[0].balance
              }));
              setUser({
                "first_name": result.data[0].first_name,
                "last_name": result.data[0].last_name,
                "username": result.data[0].username,
                "password": result.data[0].password,
                "balance": result.data[0].balance
              })
              
            navigate('/')
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <div className="login">
            <h1>Bank Manager Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={formData.username} onChange={(e)=>handleChange(e)} placeholder="...Enter username"/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} onChange={(e)=>handleChange(e)} placeholder="...Enter Password"/>
                <button type="submit">Submit</button>
            </form>
            <style>
                {
                    `
                    .app{
                        background: var(--primary-color);
                    }
                    `
                }
            </style>
        </div>
    )
}

export default Login