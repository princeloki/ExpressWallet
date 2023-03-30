import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
// reactstrap components
import {
  Card,
  Container,
  Row,
  Col
} from "reactstrap";

import Header from "components/Headers/Header.js";

const ExpenseReports = (props) => {

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0 align-items-center" xl="12">
            <Card className="shadow item-closed">
              <Row className="align-items-center">
                <div className="col">
                  <h2 className="mb-0">January 2023</h2>
                </div>
                <RiArrowDropDownLine className="expense-drop-down"/>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExpenseReports;
