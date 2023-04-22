

import {
Button
} from "reactstrap";

import axios from 'axios';
import { useState } from 'react';

const AssignTransactions = ({transaciton, setAssign, expenseList})=>{
    const handleClick = () => {
        setAssign(false)
    }

    const exes = expenseList.map((expense, index)=>{
            return(
                <button key={index} onClick={handleClick}>{expense.expense_name}</button>
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

    