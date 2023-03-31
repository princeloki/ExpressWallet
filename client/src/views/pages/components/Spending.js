

import { useState } from "react"
import { Table } from "reactstrap"
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import {
  Card,
  Row,
  Col
} from "reactstrap";

const Spending = ({date, clicked, handleClick})=>{

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
                            <tr>
                            <td>
                                12/01/2023
                            </td>
                            <td>
                                RENT
                            </td>
                            <td>
                                $12.00
                            </td>
                            <td>
                                $0.00
                            </td>
                            <td>
                                $12
                            </td>
                            </tr>
                            <tr>
                            <td>
                                27/01/2023
                            </td>
                            <td>
                                UTILITIES
                            </td>
                            <td>
                                $560
                            </td>
                            <td>
                                $0.00
                            </td>
                            <td>
                                $560
                            </td>
                            </tr>
                            <tr>
                            <td>
                                28/01/2023
                            </td>
                            <td>
                                ENTERTAINMENT
                            </td>
                            <td>
                                $205.00
                            </td>
                            <td>
                                $0.00
                            </td>
                            <td>
                                $205.00
                            </td>
                            </tr>
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