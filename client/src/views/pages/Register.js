

import {
  Card,
  Col,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Button
} from "reactstrap";

import Reg from "./regcomps/Reg"
import FirstPage from "./regcomps/FirstPage"
import SecondPage from "./regcomps/SecondPage"
import ThirdPage from "./regcomps/ThirdPage"
import FourthPage from "./regcomps/FourthPage"
import { BsGlobe } from "react-icons/bs";
import { FaSchool } from "react-icons/fa";
import { useHistory } from "react-router-dom"

import { useState } from "react"
import axios from "axios"

const Register = () => {
  const history = useHistory()

  const [bankAmount, setBankAmount] = useState(0)

  const [bankActive, setBankActive] = useState(false)

  const [bankData, setBankData] = useState({
    bank_username: "",
    bank_password: ""
  })

  const [userData, setUserData] = useState({
    uid: 0,
    email: "",
    country: "",
    host: "",
    length: "",
    income: "",
    currency: "USD",
    budget: ""
  })
  const [index, setIndex] = useState(0)

  const handleIndexChange = (index) => {
    setIndex(index)
  }

  const handleBankChange = (e) => {
    setBankData(prevBankData=>{
      return{
        ...prevBankData,
        [e.target.name]: e.target.value,
      }
    })
  }

  const addBank = (e) =>{
    e.preventDefault()
    axios.post("http://localhost:4000/api/add_bank", {
      uid: userData.uid,
      username: bankData.bank_username,
      password: bankData.bank_password
    })
    .then(response=>{
      setBankAmount(response.data.count)
      setBankActive(false);
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const submitUserData = (e) => {
    e.preventDefault()
    console.log("clicked")
    axios.put("http://localhost:4000/api/set_user",userData)
    .then(response => {
      console.log(response.data)
      history.push('/admin/index')
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
      {bankActive&& <Card className="bg-secondary curve bank-card">
        <Form role="form" onSubmit={addBank}>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsGlobe />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="Bank Username"
              type="text"
              name="bank_username"
              autoComplete="new-bank_username"
              value={bankData.bank_username}
              onChange={(e) => handleBankChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FaSchool />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Bank password"
                type="text"
                autoComplete="new-host"
                name="bank_password"
                value={bankData.bank_password}
                onChange={(e) => handleBankChange(e)}
              />
            </InputGroup>
          </FormGroup>
            <div className="text-center buttons">
                <Button className="mt-4 next-button" color="primary" type="submit">Add</Button>
            </div>
        </Form>
      </Card>
      }
      <Col lg="6" md="8" className="reg-cont">
        <Card className="bg-secondary curve shadow border-0 registration-box">
          {index === 0 && <Reg handleIndexChange={handleIndexChange} addData={setUserData} />}
          {index === 1 && <FirstPage userData={userData} handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 2 && <SecondPage userData={userData}  handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 3 && <ThirdPage userData={userData}  handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
          {index === 4 && <FourthPage bankAmount={bankAmount} setActive={setBankActive} submitUserData={submitUserData} handleAddition={handleAddition} handleIndexChange={handleIndexChange} />}
        </Card>
      </Col>
    </>
  );
};

export default Register;
