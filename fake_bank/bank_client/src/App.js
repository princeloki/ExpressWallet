

import './App.css';
import React,{useState} from 'react'
import { BrowserRouter } from 'react-router-dom';
import Pages from './routes'

function App() {
  const storedUser = localStorage.getItem("user");
  console.log(JSON.parse(storedUser))
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : {
    "first_name": "",
    "last_name": "",
    "username": "",
    "password": "",
    "balance": 0
  })

  return (
    <div className="app">
      <BrowserRouter >
        <Pages setUser={setUser} user={user}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
