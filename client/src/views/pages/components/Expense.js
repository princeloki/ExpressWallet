import { useState } from 'react'
import { BsThreeDots } from "react-icons/bs"

const Expense = ({clicked, onExpense, data}) => {
    const [pri, setPri] = useState(data.priority === "H" ? "High" : data.priority === "N" ? "Normal" : "Low")
    const [st, setSt] = useState(data.state === "F" ? "Fixed" : "Adjustable")

    const edit = ()=>{
        console.log("edit button clicked")
    }

    return(
        <tr className="expense-manager-data">
            <td>{data.expense_name}</td>
            <td>{pri}</td>
            <td>{st}</td>
            <td><BsThreeDots onClick={onExpense} /></td>
        </tr>
    )
}

export default Expense;
