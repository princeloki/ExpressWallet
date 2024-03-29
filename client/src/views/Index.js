// Imports required libraries, React components and helper functions.
import classnames from "classnames";
import Chart from "chart.js";
import { Bar } from "react-chartjs-2";
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
  Table,
  InputGroup,
  Input
} from "reactstrap";

// core components
import {
  chartExample1,
  chartOptions,
  parseOptions
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import InitialManager from "./pages/components/InitialManager.js";
import DebitCard from "./pages/components/DebitCard.js";
import { BsSearch } from "react-icons/bs";

import {
  getExpensesByMonthAndWeek,
  getLastSix,
} from "../variables/TimeFrameCalc.js";

const Index = (props) => {
  const history = useHistory()
  !props.user && history.push("/auth/login") //If there is no user logged in then navigate to the login page

  const [empty, setEmpty] = useState(false);

  const [displayedTransactions, setDisplayedTransactions] = useState(5);
  const [transactions, setTransactions] = useState([])
  const [spendings, setSpendings] = useState([])
  const [topCats, setTopCats] = useState([])
  const [monthly, setMonthly] = useState([])
  const [weekly, setWeekly] = useState([])
  const [reload, setReload] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)
  const [remBudgets, setRemBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [buttonLabel, setButtonLabel] = useState("See More");
  const [category, setCategory] = useState("General")
  const [search, setSearch] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState([]);

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
    axios.get(`http://localhost:4000/api/get_monthly_top/${props.user.uid}`)
    .then(response=>{
      setMonthly(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_weekly_top/${props.user.uid}`)
    .then(response=>{
      setWeekly(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_spendings/${props.user.uid}`)
    .then(response=>{
      response.data.length===0 ? setEmpty(true) : setEmpty(false);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_transactions/${props.user.uid}`)
    .then(response=>{
      setTransactions(response.data)      
      setFilteredTransactions(response.data);
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

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_each_spending/${props.user.uid}`)
    .then(response=>{
      setSpendings(response.data)
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  const toggle = ()=>{
    setShowExpenses(!showExpenses);
  }

  const handleChange = (e)=>{
    setCategory(e.target.value)
  }

  // Creates a table row for each remaining budget
  const rembudg = remBudgets.map((remBudget, index) => {
    const expense = expenses.find(e => e.eid === remBudget.eid);
  
    if (!expense) {
      return null;
    }
  
    return (
      <tr key={index}>
        <td>{expense.expense_name}</td>
        <td>{props.currSym()}{(expense.expense_amount*props.rates[localStorage.getItem("currency")]).toFixed(2)}</td>
        <td>{props.currSym()}{(remBudget.total*props.rates[localStorage.getItem("currency")]).toFixed(2)}</td>
      </tr>
    );
  });

  // Function for handling the search field changes and filtering the transactions based on the input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      const filtered = transactions.filter(transaction => 
        transaction.merchant_name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  };
  

  // Creates a table row for each transaction that should be displayed (up to the number specified in 'displayedTransactions')
  const trans = filteredTransactions.slice(0, displayedTransactions).map((transaction, index) => {
  
    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return(
      <tr key={index}>
        <td>{transaction.merchant_name} ({transaction.category}) {formattedDate}</td>
        <td>{localStorage.getItem("currency")} {(transaction.amount*props.rates[localStorage.getItem("currency")]).toFixed(2)}</td>
      </tr>
    )
  });

  // Handles the "See More" button click, expands or collapses the transactions list
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
  

  // Creates a 'div' for each top category
  const tops = topCats.map((topCat,index)=>{
    return(
      <div key={index} className="top-cats-body">
        <h2>{topCat.spending_name}</h2>
        <h3>{props.currSym()}{(topCat.total*props.rates[localStorage.getItem("currency")]).toFixed(2)}</h3>
      </div>
    )
  })

  // Creates a 'div' for each monthly top category
  const month = monthly.map((month,index)=>{
    return(
      <div key={index} className="top-cats-body">
        <h2>{month.spending_name}</h2>
        <h3>{props.currSym()}{(month.total*props.rates[localStorage.getItem("currency")]).toFixed(2)}</h3>
      </div>
    )
  })

  // Creates a 'div' for each weekly top category
  const week = weekly.map((week,index)=>{
    return(
      <div key={index} className="top-cats-body">
        <h2>{week.spending_name}</h2>
        <h3>{props.currSym()}{(week.total*props.rates[localStorage.getItem("currency")]).toFixed(2)}</h3>
      </div>
    )
  })

  const [activeNav, setActiveNav] = useState(1);
  const [realData, setRealData] = useState("data1");

  let [months, weeks] = getExpensesByMonthAndWeek(spendings, props.rates);
  const chartData = chartExample1(props.currSym);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setRealData("data" + index);
  };



  let dataOptions = {
    data1: (canvas) => {
      months = getLastSix(months);
      const monthLabels = months.map((month) => month.month + " " + month.year);
      const monthData = months.map((month) => month.amount);
      return {
        labels: monthLabels,
        datasets: [
          {
            label: "Performance",
            data: monthData,
          },
        ],
      };
    },

    data2: (canvas) => {
      console.log(weeks);
      weeks = getLastSix(weeks);
      console.log(weeks);
      const weekLabels = weeks.map(
        (week) => "Week " + week.week + " " + week.year
      );
      const weekData = weeks.map((week) => week.amount);
      return {
        labels: weekLabels,
        datasets: [
          {
            label: "Performance",
            data: weekData,
          },
        ],
      };
    },
  };

  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user} 
      setUser={props.setUserData} reload={reload} toggleShow={toggle} rates={props.rates} currSym={()=>props.currSym()}/>
      {/* Page content */}
      {showExpenses && 
        <div className="expense-left curve">
          <div className="expense-container">
            <h2>Expense Amount Left To Be Paid</h2>
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
                <div className="chart">
                  <Bar
                    data={dataOptions[realData]}
                    options={chartData.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="curve shadow my-bank">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">My Bank</h2>
                  </div>
                </Row>
              </CardHeader>
              <div className="bank-body">
                <DebitCard name={props.user.first_name+" "+props.user.last_name}/>
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
                    <div className="latest-header">
                      <h3 className="mb-0">Latest Transactions</h3>
                      <div id="search-bar"><BsSearch /><input type="text" id="search" name="search" value={search} onChange={handleSearch}/></div>
                    </div>
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
                      <InputGroup>
                          <Input
                          type="select"
                          name="category"
                          id="cat-drop"
                          value={category}
                          onChange={handleChange}
                          >
                          <option value="General">All Time</option>
                          <option value="Month">This Month</option>
                          <option value="Week">This Week</option>
                          </Input>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="col text-right">
                  </div>
                </Row>
              </CardHeader>
              <div className="top-cats">
                  {category==="General" ? tops : category==="Week" ? week : month}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
