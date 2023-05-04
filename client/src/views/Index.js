

import classnames from "classnames";
import Chart from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Table
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import InitialManager from "./pages/components/InitialManager.js";

const Index = (props) => {
  const history = useHistory()
  !props.user && history.push("/auth/login")

  const [empty, setEmpty] = useState(false);

  const [displayedTransactions, setDisplayedTransactions] = useState(5);
  const [transactions, setTransactions] = useState([])
  const [topCats, setTopCats] = useState([])
  const [reload, setReload] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)
  const [remBudgets, setRemBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [buttonLabel, setButtonLabel] = useState("See More");

  const toggle = ()=>{
    setShowExpenses(!showExpenses);
  }

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_rem_budgets/${props.user.uid}`)
    .then(response=>{
      setRemBudgets(response.data)
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${props.user.uid}`)
    .then(response=>{
      setExpenses(response.data);
    })
    .catch(err=>{
      console.log(err);
    },[])
  })

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_spendings/${props.user.uid}`)
    .then(response=>{
      response.data.length===0 ? setEmpty(true) : setEmpty(false);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.put(`http://localhost:4000/api/update_user/${props.user.uid}`)
        .then(response => {
          props.updateUser();
        })
        .catch(error => {
          console.log(error);
        });
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_transactions/${props.user.uid}`)
    .then(response=>{
      setTransactions(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_most_common/${props.user.uid}`)
    .then(response=>{
      setTopCats(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user])

  const rembudg = remBudgets.map((remBudget, index) => {
    const expense = expenses.find(e => e.eid === remBudget.eid);
  
    if (!expense) {
      return null;
    }
  
    return (
      <tr key={index}>
        <td>{expense.expense_name}</td>
        <td>${expense.expense_amount.toFixed(2)}</td>
        <td>${remBudget.total.toFixed(2)}</td>
      </tr>
    );
  });
  
  

  const trans = transactions.slice(0, displayedTransactions).map((transaction, index) => {
  
    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return(
      <tr key={index}>
        <td>{transaction.merchant_name} ({transaction.category}) {formattedDate}</td>
        <td>{transaction.currency} {transaction.amount}.00</td>
      </tr>
    )
  });

  const handleSeeMore = () => {
    if (buttonLabel === "Collapse") {
      setDisplayedTransactions(5);
      setButtonLabel("See More");
    } else {
      setDisplayedTransactions(prevDisplayedTransactions => {
        if (prevDisplayedTransactions + 10 >= transactions.length) {
          setButtonLabel("Collapse");
        }
        return prevDisplayedTransactions + 10;
      });
    }
  };
  

  const tops = topCats.map((topCat,index)=>{
    return(
      <div key={index} className="top-cats-body">
        <h2>{topCat.merchant_name}</h2>
        <h3>${topCat.total}.00</h3>
      </div>
    )
  })

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user} setUser={props.setUserData} reload={reload} toggleShow={toggle}/>
      {/* Page content */}
      {showExpenses && 
        <div className="expense-left curve">
          <div className="expense-container">
            <h2>Expenseses Left To Be Paid</h2>
            <Table
              responsive
              size="">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Amount Left</th>
                </tr>
              </thead>
              <tbody>
                {rembudg}
              </tbody>
            </Table>
            <Button color="primary" onClick={toggle}>Close</Button>
          </div> 
        </div>
      }
      {empty && <InitialManager userData={props.user}/>}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="curve bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Expenses</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="curve shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">My Banks</h2>
                  </div>
                </Row>
              </CardHeader>
              <div className="bank-body">

              </div>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="curve shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col latest-tran-head">
                    <h3 className="mb-0">Latest Transactions</h3>
                    <Button
                        color="primary"
                        onClick={handleSeeMore}
                        size="sm"
                      >
                        {buttonLabel}
                      </Button>
                  </div>
                </Row>
              </CardHeader>
              <div className="latest-trans">
                <Table
                    responsive
                    size=""
                    className="last-5-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trans}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
          <Col xl="3">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center top-cats-col">
                  <div className="col">
                    <div className="top-cats-header latest-tran-head">
                      <h3 className="mb-0">Top Categories</h3>
                      <Button
                        color="primary"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        General
                      </Button>
                    </div>
                  </div>
                  <div className="col text-right">
                  </div>
                </Row>
              </CardHeader>
              <div className="top-cats">
                  {tops}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
