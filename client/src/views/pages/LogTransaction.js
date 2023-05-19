// Importing necessary modules from react, reactstrap, react-router-dom, and axios
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
import { useHistory } from "react-router-dom";
import axios from 'axios';

// The LogTransaction component provides a form for logging a new transaction. 
const LogTransaction = (props) => {

  // States for storing fetched expenses and form data
  const [expenses, setExpenses] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    currency: "USD",
    type: "Select"
  })
  
  // useHistory hook for redirection after form submission
  const history = useHistory();

  // Effect hook for fetching expenses from the server when the component mounts.
  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${props.user.uid}`)
    .then(response=>{
      setExpenses(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  // Function for handling changes to form inputs.
  const handleChange = (e)=>{
    setFormData(prevFormData=>{
      return{
        ...prevFormData,
        [e.target.name]: e.target.value,
      }
    })
  }

  // Function for handling form submission.
  const submit = (e)=>{
    e.preventDefault()
    axios.post(`http://localhost:4000/api/cash_transaction/${props.user.uid}`,formData)
    .then(response=>{
      console.log(response.data);
      history.push('/admin/expense-report');
    })
    .catch(err=>{
      console.log(err);
    })
  }

  // Rendering the LogTransaction component
  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user} currSym={props.currSym} rates={props.rates}/>
      <Col className="cash-body" xl="9">
          <div className="cash-form curve">
            <Form onSubmit={submit}>
              <FormGroup>
                <Label className="reg-label" for="income">What Is The Name of This Transaction?</Label>
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
                <Label className="reg-label" for="income">What Type of Expense Is This?</Label>
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
                <Label className="reg-label" for="income">Currency of Transaction?</Label>
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
                <Label className="reg-label" for="income">Transaction Amount?</Label>
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
                <Label className="reg-label" for="income">When Did You Make This Transaction?</Label>
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
