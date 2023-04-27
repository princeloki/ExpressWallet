

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

const Index = (props) => {
  const history = useHistory()
  !props.user && history.push("/auth/login")

  const [transactions, setTransactions] = useState([])
  const [topCats, setTopCats] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.put(`http://localhost:4000/api/update_user/${props.user.uid}`)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, 20000);
    return () => clearInterval(intervalId);
  }, [props.user.id]);
  

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_top_five_transactions/${props.user.uid}`)
    .then(response=>{
      setTransactions(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user, reload])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_most_common/${props.user.uid}`)
    .then(response=>{
      setTopCats(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user, reload])

  const trans = transactions.map(transaction=>{
    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return(
      <tr>
        <td>{transaction.merchant_name} ({transaction.category}) {formattedDate}</td>
        <td>{transaction.currency} {transaction.amount}.00</td>
      </tr>
    )
  })

  const tops = topCats.map(topCat=>{
    return(
      <div className="top-cats-body">
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
      <Header onDashboard={props.onDashboard} userData={props.user} setUser={props.setUserData} />
      {/* Page content */}
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
                  <div className="col">
                    <h3 className="mb-0">Last 5 Transactions</h3>
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
                </Row>
              </CardHeader>
              <div className="latest-trans">

              </div>
            </Card>
          </Col>
          <Col xl="3">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center top-cats-col">
                  <div className="col">
                    <div className="top-cats-header">
                      <h3 className="mb-0">Top Categories</h3>
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                    {tops}
                  </div>
                  <div className="col text-right">
                  </div>
                </Row>
              </CardHeader>
              <div className="top-cats">
              
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
