

import './App.css';
import React,{useState} from 'react'
import { BrowserRouter } from 'react-router-dom';
import Pages from './routes'

function App() {
  const [userInfo, setUserInfo] = useState({
    "fist_name": "",
    "last_name": "",
    "username": "",
    "password": "",
    "balance": 0
  })

  return (
    <div className="app">
      <BrowserRouter >
        <Pages user={userInfo} setUser={setUserInfo} />
      </BrowserRouter>
    </div>
  );
}

export default App;
