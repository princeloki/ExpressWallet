// Import axios to make HTTP requests
import axios from 'axios';

const AssignTransactions = ({transaction, setAssign, expenseList, setReloadTransaction, reloadTransaction, reports})=>{

    
    const handleClick = (index) => {
        if(!reports){
            // HTTP POST request to assign transactions
            axios.post('http://localhost:4000/api/assign_transactions',{
                eid: expenseList[index].eid,
                tid: transaction.tid,
                mcc: transaction.mcc,
                merchant_name: transaction.merchant_name,
                category: transaction.category,
                amount: transaction.amount,
                date: transaction.date
            })
            .then(response=>{
                setAssign(false) // Set assign state to false after assigning
                setReloadTransaction(!reloadTransaction) // Toggle reloadTransaction state to trigger a reload
            })
            .catch(err =>{
                console.log(err) // Log any errors
            })
        } else{
            // HTTP POST request to reassign transactions
            axios.post('http://localhost:4000/api/reassign_transaction',{
                eid: expenseList[index].eid,
                expense_name: expenseList[index].expense_name,
                tid: transaction.tid,
                mcc: transaction.mcc,
                merchant_name: transaction.merchant_name,
                category: transaction.category,
                amount: transaction.amount,
                date: transaction.date
            })
            .then(response=>{
                setAssign(false) // Set assign state to false after reassigning
                setReloadTransaction(!reloadTransaction) // Toggle reloadTransaction state to trigger a reload
            })
            .catch(err=>{
                console.log(err) // Log any errors
            })
        }
    }

    // Map through the expenseList and create a button for each expense
    const exes = expenseList.map((expense, index)=>{
            return(
                <button key={index} onClick={()=>handleClick(index)}>{expense.expense_name}</button>
            )
    })

    // Render the UI for the component
    return (
        <div className="curve assign-exp">
            <h2>SELECT EXPENSE</h2>
            <div className="expense-list">
                {exes}
                <button color="primary" onClick={()=>setAssign(false)}>Close</button>
            </div>
        </div>
    );
};

// Export the AssignTransactions component as the default export
export default AssignTransactions;
