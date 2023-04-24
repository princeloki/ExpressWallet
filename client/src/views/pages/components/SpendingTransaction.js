import { useEffect } from 'react';
import axios from 'axios';

const SpendingTransactions = ({openTransaction, clicked, spending, setDetails}) =>{
  
    useEffect(()=>{
      axios.post(`http://localhost:4000/api/get_spending_trans`,
      {
      eid: spending.eid, 
      month: spending.month,
      year: spending.year
      })
      .then(response=>{
        if (clicked) {
            setDetails(response.data)
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },[clicked, setDetails, spending])
  
    return(
      <>
        <tr className="main-row" onClick={openTransaction}>
          <td>{spending.month} | {spending.year}</td>
          <td>{spending.spending_name}</td>
          <td>${spending.total.toFixed(2)}</td>
        </tr>
      </>
    )
  }
  

export default SpendingTransactions;