import { 
  Card, 
  CardBody, 
  CardTitle, 
  Container, 
  Row, 
  Col, 
  Input,
  InputGroup
} from "reactstrap";

import { FcCurrencyExchange } from "react-icons/fc";
import { BsCurrencyYen } from "react-icons/bs";
const Header = ({onDashboard, userData, setUser}) => {
  const currIcon = () =>{
    return(
      <div></div>
    )
  }


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
                            <span className="h2 font-weight-bold mb-0">
                              ${(userData.budget/30).toFixed(2)} | Budget
                            </span>
                            <span className="h2 font-weight-bold mb-0 bal-text">
                              ${((userData.balance)/30-(userData.budget/30)).toFixed(2)} | Balance
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
                            <span className="h2 font-weight-bold mb-0">
                              ${(userData.budget/4).toFixed(2)} | Budget
                            </span>
                            <span className="h2 font-weight-bold mb-0 bal-text">
                              ${((userData.balance)/4-(userData.budget/4)).toFixed(2)} | Balance
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
                              ${(userData.budget).toFixed(2)} | Budget
                            </span>
                            <span className="h2 font-weight-bold mb-0 bal-text">
                              ${((userData.balance)-(userData.budget)).toFixed(2)} | Balance
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
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-light text-white rounded-circle shadow">
                            <BsCurrencyYen className="text-green"/>
                          </div>
                        </Col>
                        <Col className="col-auto my-auto">
                          <div className="currency-control my-auto">
                            <InputGroup className="input-group-alternative mb-3">
                              <Input
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
