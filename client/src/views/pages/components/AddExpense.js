import {
Form,
FormGroup,
Label,
Button,
Input,
InputGroup
} from "reactstrap";

import axios from 'axios';
import { useState } from 'react';

const AddExpense = ({uid, setReloadExpenses,reloadExpenses,setAdd}) => {
    const [formData, setFormData] = useState({
      uid: uid,
      expense_name: "",
      amount: 0,
      state: "Fixed",
      priority: "High"
    })

const handleExpense = (e)=>{
    setFormData(prevFormData=>{
        return{
        ...prevFormData,
        [e.target.name]: e.target.value,
        }
    })
    }

const submitExpense = (e)=>{
    e.preventDefault();
    axios.post('http://localhost:4000/api/add_expense', formData)
    .then(response=>{
    setReloadExpenses(!reloadExpenses);
    setAdd(false);
    })
    .catch(err=>{
    console.log(err);
    })
}
  
  

return (
    <>

        <Form role="form" onSubmit={submitExpense}>
          <FormGroup>
            <Label className="reg-label" for="income">Expense name</Label>
            <InputGroup className="input-group-alternative mb-3">
              <Input 
              placeholder="What is the name of the expense"
              type="text"
              name="expense_name"
              autoComplete="new-expense"
              value={formData.expense_name}
              onChange={(e) => handleExpense(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="income">Budget for the expense</Label>
            <InputGroup className="input-group-alternative mb-3">
              <Input 
              placeholder="What is the amount of the expense?"
              type="text"
              name="amount"
              autoComplete="new-amount"
              value={formData.amount}
              onChange={(e) => handleExpense(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="income">Ajustable | Fixed</Label>
            <InputGroup className="input-group-alternative mb-3">
              <Input
                type="select"
                name="state"
                value={formData.state}
                onChange={(e) => handleExpense(e)}
              >
                <option>Fixed</option>
                <option>Adjustable</option>
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="income">Expense Priority</Label>
            <InputGroup className="input-group-alternative mb-3">
              <Input
                type="select"
                name="priority"
                value={formData.priority}
                onChange={(e) => handleExpense(e)}
              >
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </Input>
            </InputGroup>
          </FormGroup>
          <div className="text-center buttons">
            <Button className="mt-4 back-button" color="primary" type="submit">Add</Button>
          </div>
        </Form>
    </>
);
};

export default AddExpense;

