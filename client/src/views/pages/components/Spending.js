

import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri";
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
                    <RiArrowDropDownLine className="expense-drop-down"/>
                </Row>
                <Row className="align-items-center">
                    <table>

                    </table>
                </Row>
            </Card>
            }
          </Col>
        </Row>
    )
}

export default Spending;