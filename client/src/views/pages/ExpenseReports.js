

import {
  Container,
  Table,
  Col
} from "reactstrap";

import { useState, useEffect } from "react";
import Header from "components/Headers/Header.js";
import Spending from "./components/Spending";
import axios from 'axios';

const ExpenseReports = (props) => {
  const [clickedIndex, setClickedIndex] = useState(0)
  const [moreDetails, setMoreDetails] = useState([])
  const [spends, setSpends] = useState([])

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_spendings/${props.user.uid}`)
    .then(response=>{
      setSpends(response.data);
    })
    .catch(err=>{
      console.log(err)
    })
  },[props.user.uid])

  const setUpDetails = moreDetails.map((detail, index) =>{
    const formattedDate = new Date(detail.date).toISOString().slice(0, 10);
    return(
      <tr key={index}>
        <td>{formattedDate}</td>
        <td>{detail.merchant_name} - {detail.category}</td>
        <td>({detail.currency}) {detail.amount.toFixed(2)}</td>
      </tr>
    )
  })

  const handleSpendingClick = (index)=>{
      clickedIndex === index ? setClickedIndex(null) : setClickedIndex(index) 
  }

  // Group spendings by month and year
  const spendingsByMonthYear = spends.reduce((acc, spend) => {
    const monthYear = `${spend.month} ${spend.year}`
    if (acc[monthYear]) {
      acc[monthYear].push(spend)
    } else {
      acc[monthYear] = [spend]
    }
    return acc
  }, {})
  
  // Generate Spending components for each month and year group
  const spendingGroups = Object.keys(spendingsByMonthYear).map((monthYear, index) => {
    const spendsForMonthYear = spendingsByMonthYear[monthYear]
    return (
      <div key={index}>
        <Spending
          key={index}
          date={monthYear}
          spend={spendsForMonthYear}
          clicked={clickedIndex === index}
          handleClick={() => handleSpendingClick(index)}
          details={moreDetails}
          setDetails={setMoreDetails}
        />
      </div>
    )
  })
  

  return (
    <>
      <Header onDashboard={props.onDashboard} userData={props.user}/>
      {/* Page content */}
      {moreDetails.length>0 && 
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
              Amount
            </th>
            </tr>
          </thead>
          <tbody>
            {setUpDetails}
          </tbody>
        </Table>
        <button className="curve" onClick={()=>setMoreDetails([])}>Close</button>
      </Col> 
    }
      <Container className="mt--7 spending-container" fluid>
        {spendingGroups}
      </Container>
    </>
  );
};

export default ExpenseReports;
