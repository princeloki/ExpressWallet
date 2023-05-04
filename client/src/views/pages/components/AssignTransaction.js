import axios from 'axios';

const AssignTransactions = ({transaction, setAssign, expenseList, setReloadTransaction, reloadTransaction, reports})=>{
    console.log(transaction)
    const handleClick = (index) => {
        if(!reports){
            axios.post('http://localhost:4000/api/assign_transactions',{
                eid: expenseList[index].eid,
                tid: transaction.tid,
                mcc: transaction.mcc,
                merchant_name: transaction.merchant_name,
                amount: transaction.amount,
                date: transaction.date
            })
            .then(response=>{
                setAssign(false)
                setReloadTransaction(!reloadTransaction)
            })
            .catch(err =>{
                console.log(err)
            })
        } else{
            axios.post('http://localhost:4000/api/reassign_transaction',{
                eid: expenseList[index].eid,
                tid: transaction.tid,
                mcc: transaction.mcc,
                merchant_name: transaction.merchant_name,
                amount: transaction.amount,
                date: transaction.date
            })
            .then(response=>{
                setAssign(false)
                setReloadTransaction(!reloadTransaction)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    const exes = expenseList.map((expense, index)=>{
            return(
                <button key={index} onClick={()=>handleClick(index)}>{expense.expense_name}</button>
            )
    })

    

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

export default AssignTransactions;

    