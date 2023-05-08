

import { useState, useEffect } from 'react';
import Header from "components/Headers/Header.js";
import {
  Form, 
  FormGroup,
  Label,
  InputGroup,
  Input,
  Button,
  Col
} from 'reactstrap';
import axios from 'axios';

const LogTransaction = (props) => {
  const [expenses, setExpenses] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    currency: "USD",
    type: "Select"
  })

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${props.user.uid}`)
    .then(response=>{
      setExpenses(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  const handleChange = (e)=>{
    setFormData(prevFormData=>{
      return{
        ...prevFormData,
        [e.target.name]: e.target.value,
      }
    })
  }

  const submit = (e)=>{
    e.preventDefault()
    axios.post(`http://localhost:4000/api/cash_transaction/${props.user.uid}`,formData)
    .then(response=>{
      console.log(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  console.log(formData);

  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user} currSym={props.currSym} rates={props.rates}/>
      <Col className="cash-body" xl="9">
          <div className="cash-form curve">
            <Form onSubmit={submit}>
              <FormGroup>
                <Label className="reg-label" for="income">Budget for the expense</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    placeholder="Transaction name"
                    type="text"
                    name="name"
                    autoComplete="new-name"
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">What type of Expense is this?</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    type="select"
                    name="type"
                    value={formData.type}
                    onChange={(e) =>handleChange(e)}
                  >
                    <option>--Select--</option>
                    {expenses.map((expense, index) => (
                      <option key={index} value={expense.expense_name}>
                        {expense.expense_name}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Currency of transaction?</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    type="select"
                    name="currency"
                    value={formData.currency}
                    onChange={(e) =>handleChange(e)}
                  >
                    <option value="USD">USD</option>
                    <option value="YEN">YEN</option>
                    <option value="EURO">EURO</option>
                    <option value="GBP">GBP</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">How much did you spend?</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    type="number"
                    name="amount"
                    autoComplete="new-amount"
                    value={formData.amount}
                    onChange={(e) => handleChange(e)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">When did you make this transaction?</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    type="date"
                    name="date"
                    autoComplete="new-date"
                    value={formData.date}
                    onChange={(e) => handleChange(e)}
                  />
                </InputGroup>
              </FormGroup>
              <Button color="primary" type="submit">
                  Submit
              </Button>
            </Form>
          </div>
      </Col>

    </>
  );
};

export default LogTransaction;
