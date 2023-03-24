import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

const Pages = ({user, setUser}) => (
    <Routes>
      <Route exact path="/login" element={<Login setUser={setUser} />} />
      <Route exact path="/"  element={<Dashboard user={user}/>} />
      {/* <Route component={NotFoundPage} /> */}
    </Routes>
  );
  
  export default Pages