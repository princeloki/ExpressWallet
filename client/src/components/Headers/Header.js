import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { FcCurrencyExchange } from "react-icons/fc"
import { BsCurrencyYen } from "react-icons/bs"
import { RiArrowDropDownLine } from "react-icons/ri"

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Today's Balance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          ￥897/<span>1897</span>
                        </span>
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
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Week's Balance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">￥2356/<span>4237</span></span>
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
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Month's Balance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">￥4924/<span>8888</span></span>
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
              <Col sm="4" lg="6" xl="2">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-light text-white rounded-circle shadow">
                            <BsCurrencyYen className="text-green"/>
                          </div>
                        </Col>
                        <Col className="col-auto my-auto">
                          <div className="currency-control my-auto">
                            <h2>YEN</h2>
                            <RiArrowDropDownLine />
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
    </>
  );
};

export default Header;
