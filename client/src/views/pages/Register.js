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

// Import components and hooks from different libraries
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
  // Declare a useHistory hook
  const history = useHistory()

  // State for the bank account amount
  const [bankAmount, setBankAmount] = useState(0)

  // State to check if bank account is active
  const [bankActive, setBankActive] = useState(true)

  // State for bank account username and password
  const [bankData, setBankData] = useState({
    bank_username: "",
    bank_password: ""
  })

  // State for user data
  const [userData, setUserData] = useState({
    uid: 0,
    email: "",
    country: "",
    host: "",
    length: 0,
    currency: "USD",
    budget: 0,
    misc: 0,
    start: "",
    autoassign: 1,
    alert: 0,
    high: 0,
    normal: 0,
    low: 0
  })

  // State for the index to switch between registration steps
  const [index, setIndex] = useState(0)

  // Handle change of index state
  const handleIndexChange = (index) => {
    setIndex(index)
  }

  // Handle changes in bank form fields
  const handleBankChange = (e) => {
    setBankData(prevBankData=>{
      return{
        ...prevBankData,
        [e.target.name]: e.target.value,
      }
    })
  }

  // Set currency using API
  const setCurrency = (currency)=>{
    axios.get(`http://localhost:4000/api/initialize_currency/${currency}`)
    .then(response=>{
      console.log("Initialized currencies");
    })
    .catch(err=>{
      console.log(err);
    })
  }

  // Add bank to database using API
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

  // Submit user data using API
  const submitUserData = (e) => {
    e.preventDefault()
    console.log("clicked")
    axios.put("http://localhost:4000/api/set_user",userData)
    .then(response => {
      setCurrency(response.data);
      history.push('/auth/login')
    })
    .catch(err => {
      console.log(err)
    })
  }

  // Handle addition of new user data
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
      {bankActive&&index===4&& <Card className="bg-secondary curve bank-card">
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
