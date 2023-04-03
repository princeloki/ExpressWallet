

import { useState, useEffect } from "react"
import { Table } from "reactstrap"
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import {
  Card,
  Row,
  Col
} from "reactstrap";
import SpendingTransactions from "./trans"

const Spending = ({date, clicked, handleClick, details, setDetails})=>{
    const [spendings, setSpendings] = useState([["12/01/2023","RENT","12.00","0.00","12.00"],["27/01/2023","UTILITIES","560.00","0.00","560.00"],["28/01/2023","ENTERTAINMENT","205.00","0.00","205.00"]])
    const [clickedIndex, setClickedIndex] = useState(null)

    const openTransaction = (index) =>{
        clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index);
    }

    useEffect(()=>{
        console.log(details)    
        !details && setClickedIndex(null)
        console.log("Spendings retrieved")
    },[details])

    const trs = spendings.map((spending, index) =>{
        return(
            <SpendingTransactions key={index} openTransaction={()=>openTransaction(index)} clicked={clickedIndex===index} spends={spending} setDetails={setDetails}/>
        )
    })

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
                                Sub Total
                            </th>
                            <th>
                                Tax
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