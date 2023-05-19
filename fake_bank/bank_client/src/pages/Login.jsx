import React,{ useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Define the Login component that takes a setUser function as a prop
function Login({setUser}){

    // Use the useNavigate hook from react-router-dom to allow for programmatic navigation
    const navigate = useNavigate()

    // Initialize formData state to an object with empty username and password properties
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    // Log the formData to the console for debugging
    console.log(formData)

    // Define a handler for form field changes
    const handleChange = (e) => {
        // Update the formData state with the new input value, maintaining previous state for other fields
        setFormData(prevFormData=>{
            return{
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    }

    // Define a handler for form submission
    const handleSubmit = (e) =>{
        // Prevent the form from causing a page reload
        e.preventDefault();

        // Post the formData to the server for authentication
        axios.post("http://localhost:5000/api/login", formData)
        .then(result=>{      
            // If authentication is successful, store the user data in localStorage
            localStorage.setItem("user", JSON.stringify({
                "first_name": result.data[0].first_name,
                "last_name": result.data[0].last_name,
                "username": result.data[0].username,
                "password": result.data[0].password,
                "balance": result.data[0].balance
            }));
            
            // Also set the user data in the state of the parent component using the setUser function passed as a prop
            setUser({
                "first_name": result.data[0].first_name,
                "last_name": result.data[0].last_name,
                "username": result.data[0].username,
                "password": result.data[0].password,
                "balance": result.data[0].balance
            })
            
            // Navigate to the homepage
            navigate('/')
        })
        .catch(err => {
            // Log any errors during authentication to the console
            console.log(err)
        })
    }

    // Render the login form
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