import {
Form,
FormGroup,
Label,
Button,
Input,
InputGroup
} from "reactstrap";

import { useState, useEffect } from "react";


const UpdateExpense = ({expense, setClickedIndex}) => {


return (
    <>
        <div className="curve expense-editor mb-xl-0">
        <div className="editor-container">
          <h2>{expense.expense_name}</h2>
          <div className="edit-buttons">
            <Button color="primary">Delete</Button>
            <Button color="primary">Edit</Button>
          </div>
          <div className="edit">
            <Form>
              <FormGroup>
                <Label className="reg-label" for="income">Expense name</Label>
                <InputGroup>
                  <Input 
                  type="text"
                  name="exp-name"
                  autoComplete="new-expense"
                  value={expense.expense_name}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Expense amount</Label>
                <InputGroup>
                  <Input 
                  type="text"
                  name="exp-amount"
                  autoComplete="new-amount"
                  value={expense.expense_amount}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label className="reg-label" for="income">Expense state</Label>
                <InputGroup>
                  <Input 
                  type="select"
                  name="exp-state"
                  autoComplete="new-state"
                  value={expense.state}
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
                  name="exp-priority"
                  autoComplete="new-priority"
                  value={expense.priority}
                  >
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </Input>
                </InputGroup>
              </FormGroup>
            </Form>
          </div>
        </div>
        <button className="curve save-button" onClick={()=>setClickedIndex(null)}>Save</button>
      </div>
    </>
);
};

export default UpdateExpense;

