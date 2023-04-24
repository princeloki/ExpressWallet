

import { useState,useEffect } from "react";
import Expense from "./components/Expense"

import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Button
} from "reactstrap";


import Header from "components/Headers/Header.js";
import { GrCircleInformation } from "react-icons/gr";
import axios from "axios";
import UpdateExpense from "./components/UpdateExpense";
import AddExpense from "./components/AddExpense";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai"
import AssignTransactions from "./components/AssignTransaction";

const ExpenseManager = (props) => {
  const [trans, setTrans] = useState([])
  const [expenses, setExpenses] = useState([])
  const [clickedIndex, setClickedIndex] = useState(null)
  const [add, setAdd] = useState(false)
  const [assign, setAssign] = useState(false);
  const [openAssign, setOpenAssign] = useState(null);
  const [reloadTransaction, setReloadTransaction] = useState(false);

  const [reloadExpenses, setReloadExpenses] = useState(false);

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_transactions/${props.user.uid}`)
    .then(response=>{
      setTrans(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user, reloadTransaction])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${props.user.uid}`)
    .then(response=>{
      setExpenses(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }, [props.user, reloadExpenses])

  const handleAssign = (index)=>{
    setAssign(true)
  }

  const handleOpen = (index)=>{
    openAssign === index ? setOpenAssign(null) : setOpenAssign(index)
  }

  const handleNone = (trans) => {
    axios.post('http://localhost:4000/api/assign_transactions',{
        eid: "",
        merchant_code: trans.iso,
        merchant_name: trans.merchant_name
    })
    .then(response=>{
        setAssign(false)
        setReloadTransaction(!reloadTransaction)
    })
    .catch(err =>{
        console.log(err)
    })
  }

  const transactions = trans.slice(0,5).map((tran, index)=>{
    const date = new Date(tran.date)
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return(
      <div key={index} className="trans-adds">
        <Button onClick={()=>handleOpen(index)}>{tran.merchant_name} ({tran.category})<br/>{formattedDate} </Button>
        {openAssign===index && <AiOutlineCheck onClick={()=>handleAssign(index)}/>}
        {openAssign===index && <AiOutlineClose onClick={()=>handleNone(tran)}/>}
      </div>
    )
  })

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
      <Header onDashboard={props.onDashboard} userData={props.user}/>
      {/* Page content */}
      {clickedIndex !== null && 
      <UpdateExpense expense={expenses[clickedIndex]} setClickedIndex={setClickedIndex}/>
      }
      {add &&
      <div className="curve expense-adder">
      <AddExpense uid={props.user.uid} setReloadExpenses={setReloadExpenses} reloadExpenses={reloadExpenses} setAdd={setAdd}/>
      </div>}
      {assign &&
      <div>
        <AssignTransactions transaction={trans[openAssign]} setAssign={setAssign} expenseList={expenses} setReloadTransaction={setReloadTransaction} reloadTransaction={reloadTransaction}/>
      </div>}
      <Container className="mt--7 expense-container" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="5">
            <Card className="curve shadow">
              <div className="expense-man">
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
                    {expenses && exps}
                  </tbody>
                </Table>
              </div>
              
              <Button className="add-expense" color="primary" onClick={()=>setAdd(true)}>Add</Button>
            </Card>
          </Col>
          <Col xl="3">
            <Card className="curve shadow">
              <div className="rec-exp">
                    <h3 className="mb-0">ASSIGN NEW TRANSACTIONS <GrCircleInformation className="info"/></h3>
                    <div className="cats">
                      {transactions}
                      {/* {trans.length > 5 && <Button color="primary">Open More</Button>} */}
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
