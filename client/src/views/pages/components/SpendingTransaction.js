// Importing necessary modules from react and axios
import { useEffect } from 'react';
import axios from 'axios';

// The SpendingTransactions component represents a row in the spending table for a specific transaction.
// It receives several props: openTransaction (function for toggling the viewing of the transaction's details), 
// clicked (boolean indicating whether the transaction's details should be shown), spending (the transaction object), 
// setDetails (function for setting the transaction's details), reload (trigger for re-rendering the component), 
// currSym (function returning the current currency symbol), and rates (exchange rates).
const SpendingTransactions = ({openTransaction, clicked, spending, setDetails, reload, currSym, rates}) =>{
  
    // Effect hook for fetching the transaction's details from the server when clicked is true.
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
    },[clicked, setDetails, spending, reload])
  
    // Rendering the component. When the row is clicked, openTransaction is called.
    return(
      <>
        <tr className="main-row" onClick={openTransaction}>
          <td>{spending.month} | {spending.year}</td>
          <td>{spending.spending_name}</td>
          <td>{currSym()}{(spending.total*rates[localStorage.getItem("currency")]).toFixed(2)}</td>
        </tr>
      </>
    )
  }

// Exporting the SpendingTransactions component for use in other files.
export default SpendingTransactions;
