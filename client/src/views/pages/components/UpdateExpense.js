

import {
Form,
FormGroup,
Label,
Button,
Input,
InputGroup
} from "reactstrap";

import { useState, useEffect } from "react";
import axios from "axios";

const UpdateExpense = ({expense, setClickedIndex, reloadExpenses, setReload}) => {

const [editing, setEditing] = useState(false);
const [expenseData, setExpenseData] = useState({
  eid: expense.eid,
  expense: expense.expense_name,
  amount: expense.expense_amount,
  state: expense.state,
  priority: expense.priority
});

const deleteExp = ()=>{
  axios.delete(`http://localhost:4000/api/delete_expense/${expense.eid}`)
  .then(response=>{
    setClickedIndex(null);
    setReload(!reloadExpenses);
  })
  .catch(err=>{
    console.log(err);
  })
}

const updateExp = (e) =>{
  e.preventDefault();
  axios.put(`http://localhost:4000/api/update_expense`, expenseData)
  .then(response=>{
    setClickedIndex(null);
    setReload(!reloadExpenses);
  })
  .catch(err => {
    console.log(err);
  })
}

const handleChange = (e) =>{
  setExpenseData(prevExpenseData=>{
    return{
      ...prevExpenseData,
      [e.target.name]: e.target.value,
    }
  })
}

return (
    <>
        <div className="curve expense-editor mb-xl-0">
        <div className="editor-container">
          <h2>{expense.expense_name}</h2>
          <div className="edit-buttons">
            <Button onClick={deleteExp} color="primary">Delete</Button>
            <Button onClick={()=>setEditing(!editing)} color="primary">Edit</Button>
          </div>
          {editing && 
          <div className="edit">
            <Form onSubmit={updateExp}>
              <FormGroup>
                <Label className="reg-label" for="income">Expense name</Label>
                <InputGroup>
                  <Input 
                  type="text"
                  name="expense"
                  autoComplete="new-expense"
                  onChange={(e)=>handleChange(e)}
                  value={expenseData["expense"]}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Expense amount</Label>
                <InputGroup>
                  <Input 
                  type="text"
                  name="amount"
                  autoComplete="new-amount"
                  onChange={(e)=>handleChange(e)}
                  value={expenseData["amount"]}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Expense state</Label>
                <InputGroup>
                  <Input 
                  type="select"
                  name="state"
                  autoComplete="new-state"
                  onChange={(e)=>handleChange(e)}
                  value={expenseData["state"] ==="F" ? "Fixed" : "Adjustable"}
                  >
                    <option>Fixed</option>
                    <option>Adjustable</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Expense priority</Label>
                <InputGroup>
                  <Input 
                  type="select"
                  name="priority"
                  autoComplete="new-priority"
                  onChange={(e)=>handleChange(e)}
                  value={expenseData["priority"]==="H" ? "High":expenseData["priority"]==="N" ? "Normal" : "Low" }
                  >
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              
              <Button className="save-button" color="primary" type="submit">Save</Button>
            </Form>
          </div>}
        </div>
      </div>
    </>
);
};

export default UpdateExpense;

