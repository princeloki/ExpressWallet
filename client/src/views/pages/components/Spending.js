// Importing necessary modules from react, reactstrap and react-icons
import { useState, useEffect } from "react"
import { Table } from "reactstrap"
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import {
  Card,
  Row,
  Col
} from "reactstrap";
import SpendingTransactions from "./SpendingTransaction"

// The Spending component represents a detailed spending view for a given date.
// It receives several props: date, spend (list of spending transactions for the date), 
// clicked (boolean indicating whether the detailed view should be shown), 
// handleClick (function for toggling the detailed view), details (boolean indicating 
// whether a transaction's details are being viewed), setDetails (function for 
// toggling the transaction details view), reload (trigger for re-rendering the component), 
// currSym (current currency symbol), and rates (exchange rates).
const Spending = ({date, spend, clicked, handleClick, details, setDetails, reload, currSym, rates})=>{
    // State for tracking which transaction's details are being viewed.
    const [clickedIndex, setClickedIndex] = useState(null)

    // Function for toggling the viewing of a transaction's details.
    const openTransaction = (index) =>{
        clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index);
    }

    // Effect hook for closing the transaction details view when details is false.
    useEffect(()=>{
        !details && setClickedIndex(null)
    },[details])

    // Mapping the spend array to SpendingTransactions components.
    const trs = spend.map((sp, index) =>{
        return(
            <SpendingTransactions key={index} openTransaction={()=>openTransaction(index)} date={date} clicked={clickedIndex===index} spending={sp} setDetails={setDetails} reload={reload}
            currSym={currSym} rates={rates}/>
        )
    })

    // Rendering the component. A Card is used to represent the date. When clicked is false, 
    // the Card only shows the date and a drop-down arrow. When clicked is true, the Card 
    // expands to show a table of transactions for the date.
    return(
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            {!clicked?
            <Card className="shadow item-closed" onClick={handleClick}>
              <Row className="align-items-center">
                <div className="col">
                  <h2 className="mb-0">{date}</h2>
                </div>
                <RiArrowDropDownLine className="expense-drop-down"/>
              </Row>
            </Card>
            :
            <Card className="shadow item-opened">
                <Row className="align-items-center open-control"  onClick={handleClick}>
                    <div className="col">
                        <h2 className="mb-0">{date}</h2>
                    </div>
                    <RiArrowUpSLine className="expense-up-arrow"/>
                </Row>
                <Row className="align-items-center table-container">
                    <Table
                        responsive
                        size=""
                        className="expense-table"
                        >
                        <thead>
                            <tr>
                            <th>
                                Date
                            </th>
                            <th>
                                Description
                            </th>
                            <th>
                                Total
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trs}
                        </tbody>
                    </Table>
                </Row>
            </Card>
            }
          </Col>
        </Row>
    )
}

export default Spending;
