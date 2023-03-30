

import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  Card,
  Row,
  Col
} from "reactstrap";

const Spending = (props)=>{
    const [clicked, setClicked] = useState(false)
  
    const handleClick = ()=>{
        setClicked(!clicked)
    }

    console.log(clicked)
    return(
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            {clicked === false ?
            <Card className="shadow item-closed" onClick={handleClick}>
              <Row className="align-items-center">
                <div className="col">
                  <h2 className="mb-0">{props.date}</h2>
                </div>
                <RiArrowDropDownLine className="expense-drop-down"/>
              </Row>
            </Card>
            :
            <Card className="shadow item-opened">
                <Row className="align-items-center open-control"  onClick={handleClick}>
                    <div className="col">
                        <h2 className="mb-0">{props.date}</h2>
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