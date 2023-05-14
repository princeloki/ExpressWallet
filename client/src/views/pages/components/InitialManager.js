

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup
} from "reactstrap";

import { FcCheckmark } from "react-icons/fc"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InitialManager = ({ userData }) => {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [formData, setFormData] = useState({});
  const [current, setCurrent] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/get_classifications/${userData.uid}`)
      .then((response) => {
        groupTransactions(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleAdjust = (category) => {
    current === "category" ? setCurrent(null) : setCurrent(category);
  }

  const handleDelete = (category) => {
    setFormData(prevState => {
      const newState = { ...prevState };
      delete newState[category];
      return newState;
    });
  }
  

  const addMiscTransactions = () => {
    const updatedFormData = { ...formData };

    if (!updatedFormData["MISC"]) {
      updatedFormData["MISC"] = {
        transactions: [],
      };
    }

    Object.values(groupedTransactions).forEach((categoryData) => {
      categoryData.transactions.forEach((transaction) => {
        const isInFormData = Object.values(formData).some((formDataCategory) =>
          formDataCategory.transactions.some((t) => t.tid === transaction.tid)
        );

        if (!isInFormData) {
          updatedFormData["MISC"].transactions.push(transaction);
        }
      });
    });

    return updatedFormData;
  };

  const save = (e) => {
    e.preventDefault();

    const updatedFormData = addMiscTransactions();
    axios.post(`http://localhost:4000/api/initialize_expenses/${userData.uid}`, updatedFormData)
      .then(response => {
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const groupTransactions = (transactions) => {
    const groups = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.predicted_category]) {
        acc[transaction.predicted_category] = { transactions: [], transactionIds: [] };
      }
      acc[transaction.predicted_category].transactions.push(transaction);
      acc[transaction.predicted_category].transactionIds.push(transaction.tid);
      return acc;
    }, {});

    setGroupedTransactions(groups);
  };

  const onInputChange = (category, event) => {
    console.log(groupedTransactions[category].transactions)
    setEdit(true);
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        transactions: groupedTransactions[category].transactions,
        [name]: value,
      },
    }));
  };

  return (
    <div className="initial curve">
      {Object.keys(groupedTransactions).length === 0 && (
        <div>
          <div className="infront">
            <h1>Analyzing Bank Transactions</h1>
            <p>Welcome! Our app uses Artificial Intelligence to automatically categorize your transactions into expense<br/> 
            categories, making it easier for you to manage and track your spending.
            </p>
          </div>
          <div className="loading">Loading&#8230;</div>
        </div>
      )}
      {Object.keys(groupedTransactions).length !== 0 && (
        <div className="Initial-Container">
          <h1>Recommended Expense Categories</h1>
          <p>Welcome! Our AI has analyzed your transaction history and automatically categorized your expenses<br/> to help you 
            manage your budget with ease. Review the suggested categories below and click the <strong id="add-txt">(Add)</strong> button next<br/> to any 
            expense category you'd like to include in your budget. <br/>
            <span className="note">Note: Feel free to customize the categories to best suit your needs!</span></p>
          <div className="rec-rows">
            {Object.entries(groupedTransactions).map(([category, categoryData]) => {

              return (
                <div className="rec-category" key={category}>
                  
                  <Button onClick={() => handleAdjust(category)}> {formData.hasOwnProperty(category) ? "Edit" : "Add"}</Button>
                  {current === category &&
                    <div className="rec-adjust-form curve">
              <div className="rec-adj-head">
                        <h2>{category}</h2>
                        <Button color="primary" onClick={()=>handleDelete(category)}>Delete</Button>
                      </div>
                      <Form>
                        <FormGroup>
                          <Label className="reg-label" for="income">Budget for the expense</Label>
                          <InputGroup className="input-group-alternative mb-3">
                            <Input
                              placeholder="What is the amount of the expense?"
                              type="text"
                              name="amount"
                              autoComplete="new-amount"
                              value={formData[category]?.amount || ""}
                              onChange={(e) => onInputChange(category, e)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label className="reg-label" for="income">Is This Expense (Ajustable | Fixed)?</Label>
                          <InputGroup className="input-group-alternative mb-3">
                            <Input
                              type="select"
                              name="state"
                              value={formData[category]?.state || ""}
                              onChange={(e) => onInputChange(category, e)}
                            >
                              <option>--Select--</option>
                              <option value="F">Fixed</option>
                              <option value="A">Adjustable</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label className="reg-label" for="income">Expense Priority</Label>
                          <InputGroup className="input-group-alternative mb-3">
                            <Input
                              type="select"
                              name="priority"
                              value={formData[category]?.priority || ""}
                              onChange={(e) => onInputChange(category, e)}
                            >
                              <option>--Select--</option>
                              <option value="H">High</option>
                              <option value="N">Normal</option>
                              <option value="L">Low</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                        <Button color="primary" onClick={() => handleAdjust(null)}>Close</Button>
                      </Form>
                    </div>}
                    
                  <span className="category-name"><strong>{category}</strong> {formData.hasOwnProperty(category) && <FcCheckmark />}</span>
                </div>
              )
            })}
          </div>
          <Button color="primary">Ignore</Button>
          {edit && <Button color="primary" onClick={save}>Save</Button>}
        </div>
      )}
    </div>
  );
  };
export default InitialManager;
