import { useState } from 'react'
import { BsThreeDots } from "react-icons/bs"

const Expense = ({clicked, onExpense, data}) => {
    console.log(clicked)
    const edit = ()=>{
        console.log("edit button clicked")
    }

    return(
        <tr className="expense-manager-data">
            <td>{data.name}</td>
            <td>{data.priority}</td>
            <td>{data.type}</td>
            <td><BsThreeDots onClick={onExpense} /></td>
        </tr>
    )
}

export default Expense;