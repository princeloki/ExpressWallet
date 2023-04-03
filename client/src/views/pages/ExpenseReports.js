import { useState } from "react"
import {
  Container,
  Table,
  Col,
  Row
} from "reactstrap";

import Header from "components/Headers/Header.js";
import Spending from "./components/Spending";

const ExpenseReports = (props) => {
  const [clickedIndex, setClickedIndex] = useState(0)
  const [moreDetails, setMoreDetails] = useState(null)

  const handleSpendingClick = (index)=>{
      clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index) 
  }

  console.log(moreDetails)
  
  const dates = ["January 2023","February 2023","March 2023"]
  const spendings = dates.map((date, index) =>{
    return(<Spending  
      key={index}
      date={date}
      clicked={clickedIndex===index}
      handleClick={()=>handleSpendingClick(index)}
      details={moreDetails}
      setDetails={setMoreDetails}
      />)
  })

  return (
    <>
      <Header onDashboard={props.onDashboard}/>
      {/* Page content */}
      {moreDetails && 
      <Col className="curve spending-list" xl="9">
        <Table 
            responsive
            size="">
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
          </tbody>
        </Table>
        <button className="curve" onClick={()=>setMoreDetails(null)}>Close</button>
      </Col> 
    }
      <Container className="mt--7 spending-container" fluid>
        {spendings}
      </Container>
    </>
  );
};

export default ExpenseReports;
