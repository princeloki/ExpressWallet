

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

const Spending = ({date, spend, clicked, handleClick, details, setDetails, reload, currSym, rates})=>{
    const [clickedIndex, setClickedIndex] = useState(null)
    const openTransaction = (index) =>{
        clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index);
    }

    useEffect(()=>{
        !details && setClickedIndex(null)
    },[details])

    const trs = spend.map((sp, index) =>{   
        return(
            <SpendingTransactions key={index} openTransaction={()=>openTransaction(index)} date={date} clicked={clickedIndex===index} spending={sp} setDetails={setDetails} reload={reload}
            currSym={currSym} rates={rates}/>
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