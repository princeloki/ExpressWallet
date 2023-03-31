import { useState } from "react";
import Expense from "./components/Expense"

import {
  Card,
  Container,
  Row,
  Col,
  Table
} from "reactstrap";


import Header from "components/Headers/Header.js";

const ExpenseManager = (props) => {
  const [expenses, setExpenses] = useState([
    {
      name: "GROCERIES",
      priority: "Medium",
      type: "Adjustable"
    },{
      name: "ACCOMODATION",
      priority: "High",
      type: "Fixed"
    },{
      name: "TRANSPORTATION",
      priority: "Medium",
      type: "Adjustable"
    }
  ])
  const [clickedIndex, setClickedIndex] = useState(null)

  const setClick = (index) =>{
    clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index)
  }

  const exps = expenses.map((expense, index) => {
    return(
      <Expense key={index} clicked={clickedIndex===index} onExpense={()=>setClick(index)} data={expense} />
    )
  })

  return (
    <>
      <Header onDashboard={props.onDashboard}/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="curve shadow">
              <div className="latest-trans">
                <Table
                    responsive
                    size=""
                    className="expense-manager-table">
                  <thead>
                    <tr>
                      <th>EXPENSES</th>
                      <th>Priority</th>
                      <th>Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {exps}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="curve shadow">
              <div className="top-cats">
                    <h3 className="mb-0">RECOMMENDED EXPENSES</h3>
                    <div className="cats">

                    </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExpenseManager;
