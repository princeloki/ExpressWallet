import { useState } from "react"
import {
  Container
} from "reactstrap";

import Header from "components/Headers/Header.js";
import Spending from "./components/Spending";

const ExpenseReports = (props) => {
  const [clickedIndex, setClickedIndex] = useState(null)

  const handleSpendingClick = (index)=>{
      clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index) 
  }
  
  const dates = ["January 2023","February 2023","March 2023"]
  const spendings = dates.map((date, index) =>{
    return(<Spending  
      key={index}
      date={date}
      clicked={clickedIndex===index}
      handleClick={()=>handleSpendingClick(index)}
      />)
  })

  return (
    <>
      <Header onDashboard={props.onDashboard}/>
      {/* Page content */}
      <Container className="mt--7 spending-container" fluid>
        {spendings}
      </Container>
    </>
  );
};

export default ExpenseReports;
