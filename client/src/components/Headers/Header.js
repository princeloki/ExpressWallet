

import { 
  Card, 
  CardBody, 
  CardTitle, 
  Container, 
  Row, 
  Col, 
  Input,
  InputGroup,
  Button,
  Table,
  Form,
  FormGroup,
  Label,
} from "reactstrap";

import { FcCurrencyExchange } from "react-icons/fc";
import { BsCurrencyYen } from "react-icons/bs";
import { IoLogoUsd } from "react-icons/io";
import { FaEuroSign } from "react-icons/fa";
import { FaPoundSign } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs"
import axios from 'axios';

const Header = ({onDashboard, userData, toggleShow, rates, currSym}) => {
  const ref = useRef();
  const [currency, setCurrency] = useState(localStorage.getItem('currency'));
  const [difference, setDifference] = useState(0)
  const [alert, setAlert] = useState({
    data: {
      message: "nothing",
      adjusted_expenses: []
    }
  })


  const [remBudgets, setRemBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [today, setToday] = useState(0)
  const [week, setWeek] = useState(0)
  const [month, setMonth] = useState(0)
  const [budget, setBudget] = useState(0)
  const [projB, setProjB] = useState(0)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editAmount, setEditAmount] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [stats, setStats] = useState({
    day: 0,
    tweek: 0,
    tmonth: 0
  })

  const handleCurrency =(currency)=>{
    setCurrency(currency);
    localStorage.setItem("currency", currency);
  }

  const currIcon = () => {
    switch (localStorage.getItem('currency')) {
      case "JMD":
        return <IoLogoUsd className="text-green" />;
      case "USD":
        return <IoLogoUsd className="text-green" />;
      case "EUR":
        return <FaEuroSign className="text-green" />;
      case "GBP":
        return <FaPoundSign className="text-green" />;
      case "JPY":
      default:
        return <BsCurrencyYen className="text-green" />;
    }
  };

  

  const assignUpdate = () =>{
    const newAdjusted = []

    let expenses = alert.data.adjusted_expenses
    for(let i=0; i<expenses.length;i++){
      expenses[i].state === "A" && newAdjusted.push(expenses[i])
    }

    axios.put(`http://localhost:4000/api/update_adjusted/${userData.uid}`, {expenses: newAdjusted})
    .then(response=>{
      setOpen(false);
      window.location.reload();
    })
    .catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_monthly_difference/${userData.uid}`)
    .then(response=>{
      setDifference(response.data.difference ?? 0);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_rem_budgets/${userData.uid}`)
    .then(response=>{
      setRemBudgets(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])
  
  const handleChange = (e) => {
    setEditAmount(e.target.value);
  }
  
  const updateAmount = (e) => {
    console.log(alert.data.adjusted_expenses)
    e.preventDefault();
    
    const updatedExpenses = alert.data.adjusted_expenses.map(expense => {
      if (expense.name === expenseToEdit) {
        return { ...expense, amount: editAmount };
      }
      return expense;
    });
  
    setAlert(prevAlert => ({ ...prevAlert, data: { ...prevAlert.data, adjusted_expenses: updatedExpenses } }));
    setEdit(false);
  }

  const adjust = alert.data.adjusted_expenses.map((adjusted_expense,index)=>{
    const expense = expenses.find(e => e.expense_name === adjusted_expense.name);
    const rem = remBudgets.find(e=>e.expense_name === adjusted_expense.name);
    
    if (!expense) {
      return null;
    }
  
    return(
      <tr key={index}>
        <td>{adjusted_expense.name}</td>
        <td>{currSym()}{(expense.expense_amount*rates[localStorage.getItem("currency")]).toFixed(2)}</td>
        <td>{currSym()}{(rem.total*rates[localStorage.getItem("currency")]).toFixed(2)}</td>
        <td>{currSym()}{(adjusted_expense.amount*rates[localStorage.getItem("currency")]).toFixed(2)}</td>
        <td className="clickable"  onClick={() => { setEdit(true); setEditAmount(adjusted_expense.amount); setExpenseToEdit(adjusted_expense.name); }}><BsThreeDots /></td>
      </tr>
    )
  })

  useEffect(() => {
    const fetchData = () => {
      axios.get(`http://localhost:4000/api/adjust_expenses/${userData.uid}`)
        .then(response => {
          setAlert(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    fetchData(); 
  }, [projB]);
  
  
  useEffect(() => {
    axios.get(`http://localhost:4000/api/get_rem_budget/${userData.uid}`)
      .then(response => {
        setBudget(response.data.grand_total);
        const newProjB = (userData.balance - response.data.grand_total).toFixed(2);
        setProjB(newProjB);
  
        setStats(prevStats => ({
          ...prevStats,
          day: (newProjB / 30 - today).toFixed(2) < 0 ? 0 : (newProjB / 30 - today).toFixed(2),
        }));
        setStats(prevStats => ({
          ...prevStats,
          tweek: (newProjB / 4 - week).toFixed(2) < 0 ? 0 : (newProjB / 4 - week).toFixed(2),
        }));
        setStats(prevStats => ({
          ...prevStats,
          tmonth: (newProjB - month).toFixed(2) < 0 ? 0 : (newProjB - month).toFixed(2),
        }));
      })
      .catch(err => {
        console.log(err);
      });
  }, [userData.balance]);
  
  
  useEffect(() => {
    axios.get(`http://localhost:4000/api/get_spending_amount/${userData.uid}`)
      .then(response => {
        setToday(response.data["today"]);
        setWeek(response.data["week"]);
        setMonth(response.data["month"]);
      })
      .catch(err => {
        console.log(err);
      });
  }, [userData.balance]);
  
  


  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${userData.uid}`)
    .then(response=>{
      setExpenses(response.data);
    })
    .catch(err=>{
      console.log(err);
    },[])
  })

  return (
    <>
      {userData &&
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        {onDashboard && (alert.data.message==="Success" || alert.data.message === "Not adjustable")  && 
        <Card className="curve bank-alert mb-4 mb-xl-0">
          <CardBody>
            <Row>
              <div className="col">
                <div className="budget-header">
                  <span className="h2 font-weight-bold mb-0">
                  {alert.data.message==="Not adjustable" && 
                  <p className="danger">
                    ALERT: Your budget has reached a critical point and can no longer be adjusted. To continue using the budget manager effectively,
                  please consider depositing additional funds into your account or exploring job opportunities in {userData.country} to supplement your income. 
                  </p>  
                  }
                  </span>
                  {alert.data.message==="Success" && 
                  <div className="readjust-alert">
                    <p className="danger font-weight-bold mb-0">You have overspent your budget by {currSym()}{(projB*rates[localStorage.getItem("currency")]).toFixed(2)}. To get back on track, consider reducing your expenses in these categories</p>
                    <Button color="primary" onClick={() => setOpen(!open)}>View</Button>
                  </div>}
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>}
        {edit &&
        <Card className="edit-amount">
          <Form onSubmit={updateAmount}>
            <FormGroup>
              <Label>Edit the amount for this expense</Label>
              <InputGroup>
                <Input
                  type="number"
                  name=""
                  autoComplete="new-"
                  onChange={handleChange}
                  value={editAmount}>
                </Input>
              </InputGroup>
            </FormGroup>
            <Button color="primary" type="submit">Finish</Button>
          </Form>
        </Card>
        }
        {open &&
        <div ref={ref}>
          <Card className="readj-body curve">
            <CardBody>
              <h2 className="h2 font-weight-bold mb-0">Recommended Amount to Spend This Month</h2>
              <Table className="rec-table">
                <thead>
                  <tr>
                    <th>Expense Name</th>
                    <th>Original Budget</th>
                    <th>Amount Remanining</th>
                    <th>Recommended</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {adjust}
                </tbody>
              </Table>
              <Button color="primary" onClick={assignUpdate}>Accept</Button>
              <Button color="primary" onClick={()=>setOpen(false)}>Ignore</Button>
            </CardBody>
          </Card>
        </div>}
        <Container fluid>
          <div className="header-body">
            <Row>
              {onDashboard &&
              <>
                <Col sm="4" lg="7" xl="3">
                  <Card className="curve card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                          <Col className="col-auto my-auto">
                            <div className="currency-control my-auto">
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-light text-white rounded-circle shadow">
                                {currIcon()}
                              </div>
                            </Col>
                              <InputGroup className="input-group-alternative mb-3">
                                <Input
                                  id="cur-sel"
                                  type="select"
                                  name="currency"
                                  value={currency}
                                  onChange={(e) => handleCurrency(e.target.value)}
                                >
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="GBP">GBP</option>
                                  <option value="JPY">JPY</option>
                                  <option value="JMD">JMD</option>
                                </Input>
                              </InputGroup>
                            </div>
                            <div className="balance">
                              <h3>Current Balance <br/> {currSym()}{(userData.balance*rates[currency]).toFixed(2)}</h3>
                              <h3>Net Balance <br/> {currSym()}{(projB*rates[currency]).toFixed(2)}</h3>
                            </div>
                          </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="curve card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            This Month
                          </CardTitle>
                          <div className="budget-header">
                            <span className="h2 font-weight-bold mb-0">
                            Budget <br/> <span className="small">{currSym()}{(userData.budget*rates[currency]).toFixed(2)}</span> <br/>
                            Expenses left <br/> <span className="small">{currSym()}{(budget*rates[currency]).toFixed(2)} </span>   
                            </span>
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend | {currSym()}{(stats.tmonth*rates[currency]).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                            <Button onClick={toggleShow} color="primary" size="sm">
                              Show Expenses
                            </Button>    
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        {difference < 0 && 
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> %{Math.abs(difference.toFixed(2))}
                        </span>}
                        {difference >= 0 && 
                        <span className="text-danger mr-2">
                          <i className="fa fa-arrow-down" /> %{Math.abs(difference.toFixed(2))}
                        </span>}
                        <span className="text-nowrap">Since last month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="curve card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            This Week
                          </CardTitle>
                          <div className="budget-header">
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend | {currSym()}{(stats.tweek*rates[currency]).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                            <FcCurrencyExchange />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="curve card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Today
                          </CardTitle>
                          <div className="budget-header">
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend | {currSym()}{(stats.day*rates[currency]).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                            <FcCurrencyExchange />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </>
              }
            </Row>
          </div>
        </Container>
      </div>
      }
    </>
  );
};

export default Header;
