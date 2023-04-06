

import {
  Card,
  Col
} from "reactstrap";

import Reg from "./regcomps/Reg"
import FirstPage from "./regcomps/FirstPage"
import SecondPage from "./regcomps/SecondPage"
import ThirdPage from "./regcomps/ThirdPage"
import FourthPage from "./regcomps/FourthPage"

import { useState } from "react"
import axios from "axios"

const Register = () => {

  const [userData, setUserData] = useState({
    country: "",
    host: "",
    length: "",
    income: "",
    currency: "",
    budget: ""
  })
  const [index, setIndex] = useState(0)

  const handleIndexChange = (index) => {
    setIndex(index)
  }

  const submitUserData = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3000/api/set_user",userData)
    .then(response => {
      console.log(response.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  console.log(userData)

  const handleAddition = (e) =>{
    e.preventDefault()
    setUserData(prevUserData=>{
      return{
        ...prevUserData,
        [e.target.name]: e.target.value
      }
    })
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary curve shadow border-0 registration-box">
          {index === 0 && <Reg handleIndexChange={handleIndexChange} />}
          {index === 1 && <FirstPage userData={userData} handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 2 && <SecondPage userData={userData}  handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 3 && <ThirdPage userData={userData}  handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 4 && <FourthPage submitUserData={submitUserData} handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
        </Card>
      </Col>
    </>
  );
};

export default Register;
