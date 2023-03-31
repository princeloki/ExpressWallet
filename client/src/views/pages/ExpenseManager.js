import { useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  Container,
  Row,
  Col
} from "reactstrap";


import Header from "components/Headers/Header.js";

const ExpenseManager = (props) => {

  return (
    <>
      <Header onDashboard={props.onDashboard}/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Last 5 Transactions</h3>
                  </div>
                </Row>
              </CardHeader>
              <div className="latest-trans">

              </div>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">RECOMMENDED EXPENSES</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
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

export default ExpenseManager;
