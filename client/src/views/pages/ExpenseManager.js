import { useState,useEffect } from "react";
import Expense from "./components/Expense"

import {
  Card,
  Container,
  Row,
  Col,
  Table
} from "reactstrap";


import Header from "components/Headers/Header.js";
import { GrCircleInformation } from "react-icons/gr";
import axios from "axios";

const ExpenseManager = (props) => {

  const [userData, setUserData] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:4000/api/get_user/${props.user.uid}`)
    .then(response=>{
      setUserData(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[])

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
      <Header onDashboard={props.onDashboard} userData={userData}/>
      {/* Page content */}
      {clickedIndex !== null && <div className="curve expense-editor mb-xl-0">

      <button className="curve" onClick={()=>setClickedIndex(null)}>Save</button>
      </div>}
      <Container className="mt--7 expense-container" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="5">
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
          <Col xl="3">
            <Card className="curve shadow">
              <div className="rec-exp">
                    <h3 className="mb-0">NEW TRANSACTIONS <GrCircleInformation className="info"/></h3>
                    <div className="cats">
                      
                    </div>
              </div>
            </Card>
          </Col>
          <Col xl="3">
            <Card className="curve shadow">
              <div className="rec-exp">
                    <h3 className="mb-0">RECOMMENDED EXPENSES <GrCircleInformation className="info"/></h3>
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
