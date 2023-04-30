

import { 
  Card, 
  CardBody, 
  CardTitle, 
  Container, 
  Row, 
  Col, 
  Input,
  InputGroup,
  Button
} from "reactstrap";

import { FcCurrencyExchange } from "react-icons/fc";
import { BsCurrencyYen } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';

const Header = ({onDashboard, userData, setUser}) => {
  const ref = useRef();
  const [alert, setAlert] = useState({
    data: {
      message: "nothing",
      adjusted_expenses: []
    }
  })
  const [today, setToday] = useState(0)
  const [week, setWeek] = useState(0)
  const [month, setMonth] = useState(0)
  const [budget, setBudget] = useState(0)
  const [projB, setProjB] = useState(0)
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState({
    day: 0,
    tweek: 0,
    tmonth: 0
  })
  const currIcon = () =>{
    return(
      <div></div>
    )
  }

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);


  const adjust = alert.data.adjusted_expenses.map((adjusted_expense,index)=>{
    return(
      adjusted_expense.state === "A" && <p className="adj-expens" key={index}><span className="adj-exp-header">{adjusted_expense.name}</span>  <br/> Adjusted amount => ${adjusted_expense.amount.toFixed(2)}</p>
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
  
    fetchData(); // Call the function immediately to fetch data on initial render
  
    const intervalId = setInterval(fetchData, 10000); // Set an interval to fetch data every 10 seconds (10000 milliseconds)
  
    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, []);
  
  
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
  

  const setCurrency = (e) =>{
    setUser(prevUserData=>{
      return{
        ...prevUserData,
        balance: prevUserData.balance*2,
        income: prevUserData.income*2,
        currency: e.target.value,
      }
    })
  }
  

  return (
    <>
      {userData &&
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        {onDashboard && (alert.data.message==="Success" || alert.data.message === "Not adjustable")  && 
        <Card className="curve bank-alert mb-4 mb-xl-0">
          <CardBody>
            <Row>
              <div className="col">
                {/* <CardTitle
                  tag="h5"
                  className="text-uppercase text-muted mb-0"
                >
                  <span id="bank-alert">Alert</span> 
                </CardTitle>   */}
                <div className="budget-header">
                  <span className="h2 font-weight-bold mb-0">
                  {alert.data.message==="Not adjustable" && <p className="danger"><span className="upper">Warning</span>: Your budget is unadjustable, deposit money into your account!</p>}   
                  </span>
                  {alert.data.message==="Success" && 
                  <div className="readjust-alert">
                    <p className="danger font-weight-bold mb-0">Due to overspenditure you have overshot your budget, view readjustment recommendation</p>
                    <Button color="primary"  onClick={() => setOpen(!open)}>View</Button>
                  </div>}
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>}
        {open &&
        <div ref={ref}>
          <Card className="readj-body curve">
            <CardBody>
              <h2 className="h2 font-weight-bold mb-0">Recommended adjustments</h2>
              {adjust}
              <Button color="primary" onClick={assignUpdate}>Accept</Button>
            </CardBody>
          </Card>
        </div>}
        <Container fluid>
          <div className="header-body">
            <Row>
              {onDashboard &&
              <>
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
                            {/* <span className="h2 font-weight-bold mb-0">
                            Budget | ${(userData.budget/30).toFixed(2)} <br/>
                            Expenses left | ${(budget/30).toFixed(2)}                            
                            </span> */}
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend - ${stats.day}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                            <FcCurrencyExchange />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since yesterday</span>
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
                            {/* <span className="h2 font-weight-bold mb-0">
                              Budget | ${(userData.budget/4).toFixed(2)} <br/>
                              Expenses left | ${(budget/4).toFixed(2)}         
                            </span> */}
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend - ${stats.tweek}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                            <FcCurrencyExchange />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-down" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since last week</span>
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
                            This Month
                          </CardTitle>
                          <div className="budget-header">
                            <span className="h2 font-weight-bold mb-0">
                            Budget | ${(userData.budget).toFixed(2)} <br/>
                            Expenses left | ${(budget).toFixed(2)}         
                            </span>
                            <span className="h2 font-weight-bold mb-0 bal-text">
                            Free to spend - ${stats.tmonth}
                            </span>
                          </div>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                            <FcCurrencyExchange />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          <i className="fas fa-arrow-down" /> 1.10%
                        </span>{" "}
                        <span className="text-nowrap">Since last month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </>
              }
              <Col sm="4" lg="6" xl="2">
                <Card className="curve card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                        <Col className="col-auto my-auto">
                          <div className="currency-control my-auto">
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-light text-white rounded-circle shadow">
                              <BsCurrencyYen className="text-green"/>
                            </div>
                          </Col>
                            <InputGroup className="input-group-alternative mb-3">
                              <Input
                                id="cur-sel"
                                type="select"
                                name="currency"
                                value={userData.currency}
                                onChange={(e) => setCurrency(e)}
                              >
                                <option>USD</option>
                                <option>EUR</option>
                                <option>GBP</option>
                                <option>YEN</option>
                                <option>JMD</option>
                              </Input>
                            </InputGroup>
                          </div>
                          <div>
                            <h3>Proj Balance: ${projB}</h3>
                          </div>
                        </Col>
                        
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      }
    </>
  );
};

export default Header;
