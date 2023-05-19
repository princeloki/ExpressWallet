// Import necessary components, icons, and libraries
import Expense from "./components/Expense"
import { Card, Container, Row, Col, Table, Button } from "reactstrap";
import React, { useRef, useState, useEffect } from 'react'; 
import Header from "components/Headers/Header.js";
import { GrCircleInformation } from "react-icons/gr";
import axios from "axios";
import UpdateExpense from "./components/UpdateExpense";
import AddExpense from "./components/AddExpense";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import AssignTransactions from "./components/AssignTransaction";
import RecommendedExpense from "./components/RecommendedExpense";

// Define ExpenseManager component
const ExpenseManager = (props) => {
  // Define state variables
  const [trans, setTrans] = useState([]) // transactions
  const [expenses, setExpenses] = useState([]) // expenses
  const [clickedIndex, setClickedIndex] = useState(null) // clicked index
  const [add, setAdd] = useState(false) // add new transaction state
  const [assign, setAssign] = useState(false); // assign transaction state
  const [openAssign, setOpenAssign] = useState(null); // open assign state
  const [reloadTransaction, setReloadTransaction] = useState(false); // trigger to reload transaction
  const [recommended, setRecommended] = useState([]) // recommended transactions
  const [recindex, setRecindex] = useState(null); // index of recommended transaction

  // reload expenses state
  const [reloadExpenses, setReloadExpenses] = useState(false);

  // Define refs for update, add, assign transactions and recommended expenses
  const updateExpenseRef = useRef();
  const addExpenseRef = useRef();
  const assignTransactionsRef = useRef();
  const recommendedExpenseRef = useRef(); 

  // Handle click event for recommended transactions
  const handleRecClick = (index)=>{
    openAssign === index ? setRecindex(null) : setRecindex(index)
  }

  // Create new expense with recommendation
  const newExpense = recommended.map((recommend, index)=>{
    return(
      recommend.length !== 0 && <div key={index} className="trans-adds">
        <Button onClick={()=>handleRecClick(index)}>{recommend.merchant_name} ({recommend.category})</Button>
      </div>
    )
  })

  // Function to handle click outside for closing open components
  const handleClickOutside = (event) => {
    if (clickedIndex !== null && updateExpenseRef.current && !updateExpenseRef.current.contains(event.target)) {
      setClickedIndex(null);
    }
    if (add && addExpenseRef.current && !addExpenseRef.current.contains(event.target)) {
      setAdd(false);
    }
    if (assign && assignTransactionsRef.current && !assignTransactionsRef.current.contains(event.target)) {
      setAssign(false);
    }
  };

  // Function to handle click outside for closing open recommended expenses
  const handleClickOutside2 = (event) => {
    if (recindex !== null && recommendedExpenseRef.current && !recommendedExpenseRef.current.contains(event.target)) {
      setRecindex(null);
    }
  };

  // Fetch recommended expenses data when component is loaded
  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_recommended/${props.user.uid}`)
    .then(response =>{
      setRecommended(response.data.data);
    })
    // Log any error that occurs
    .catch(err=>{
      console.log(err)
    })
  },[props.user, reloadTransaction, reloadExpenses]) // re-run effect if these values change

  // Add event listeners for mousedown event on load
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside2);
    // Cleanup: remove listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside2);
    };
  }, [recindex, clickedIndex, add, assign]); // re-run effect if these values change

  // Fetch transactions not assigned to any category on load
  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_noassign_transactions/${props.user.uid}`)
    .then(response=>{
      setTrans(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user, reloadTransaction]) // re-run effect if these values change

  // Fetch all expenses on load
  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_expenses/${props.user.uid}`)
    .then(response=>{
      setExpenses(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }, [props.user, reloadExpenses]) // re-run effect if these values change

  // Handle click to open assignment
  const handleAssign = (index)=>{
    setAssign(true)
  }

  // Handle click to open or close assignment
  const handleOpen = (index)=>{
    openAssign === index ? setOpenAssign(null) : setOpenAssign(index)
  }

  // Handle assignment of 'None' to a transaction
  const handleNone = (trans) => {
    axios.post('http://localhost:4000/api/assign_transactions',{
        eid: "",
        mcc: trans.mcc,
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

  // Create a transaction display for the five most recent transactions
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

  // Handle click on an expense item
  const setClick = (index) =>{
    clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index)
  }

  // Render expenses
  const exps = expenses.map((expense, index) => {
    return(
      <Expense key={index} clicked={clickedIndex===index} onExpense={()=>setClick(index)} data={expense} />
    )
  })

  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user} currSym={props.currSym} rates={props.rates}/>
      {/* Page content */}
      {clickedIndex !== null && 
      <div ref={updateExpenseRef}> {/* Add ref to UpdateExpense */}
        <UpdateExpense expense={expenses[clickedIndex]} setClickedIndex={setClickedIndex} reloadExpenses={reloadExpenses} setReload={setReloadExpenses}/>
      </div>}
      {add &&
      <div className="curve expense-adder" ref={addExpenseRef}> {/* Add ref to AddExpense */}
        <AddExpense uid={props.user.uid} setReloadExpenses={setReloadExpenses} reloadExpenses={reloadExpenses} setAdd={setAdd}/>
      </div>}
      <div ></div>
      {assign &&
      <div ref={assignTransactionsRef}> {/* Add ref to AssignTransactions */}
        <AssignTransactions transaction={trans[openAssign]} setAssign={setAssign} expenseList={expenses} setReloadTransaction={setReloadTransaction} reloadTransaction={reloadTransaction}/>
      </div>}
      {recindex!==null && 
      <div ref={recommendedExpenseRef}>
        <RecommendedExpense user={props.user} expense={recommended[recindex]} setReloadExpenses={setReloadExpenses}
        reloadExpenses={reloadExpenses} setRecindex={setRecindex}/>
      </div>
      }
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
              
              <Button className="add-expense" color="primary" onClick={()=>setAdd(true)}>Add New Category</Button>
            </Card>
          </Col>
          {props.user.autoassign===1&&<Col xl="5">
            <h2 className="repeat-header">
              The list below displays recurring spendings identified in your bank account. 
            We recommend considering these as new expense categories. To add or ignore a transaction, 
            simply click on it, and the options [Add] and [Ignore] will appear for you to choose from.
            </h2>
            <Card className="curve shadow">
              <div className="rec-exp">
                    <h3 className="mb-0">REPEAT TRANSACTIONS <span className="small">Click [Add] or [Ignore]</span></h3>
                    {recommended.length===0 &&
                      <div className="lds-ring">
                        <div></div><div></div><div></div><div></div>
                      </div>
                    }
                    {newExpense &&
                    <div className="cats">
                      {newExpense}
                    </div>}
              </div>
            </Card>
          </Col>}
          {props.user.autoassign===0&&<Col xl="6">
            <h2 className="repeat-header">
              The list below displays all new transactions that have not been assigned to an expense category. To categorize a transaction, follow these steps:<br/><br/>

              Click on the transaction you want to categorize.
              Click the check mark icon beside the transaction.
              Choose the appropriate expense category from the available options.

              If you prefer not to categorize a transaction, simply click the "X" icon to ignore it.
            </h2>
            <Card className="curve shadow trans-cont">
              <div className="cat-trans">
                    <h3 className="mb-0">CATEGORIZE TRANSACTIONS <GrCircleInformation className="info"/></h3>
                    <div className="cats">
                      {transactions}
                    </div>
              </div>
            </Card>
          </Col>}
        </Row>
      </Container>
    </>
  );
};

export default ExpenseManager;
