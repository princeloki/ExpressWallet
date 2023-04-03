import { useState,useEffect } from 'react'

const SpendingTransactions = ({openTransaction, clicked, spends, setDetails}) =>{

    useEffect(()=>{
        console.log("Transactions received")
    },[])

    const [transactions, setTransactions] = useState([{
        date: "12/01/2023",
        merchant: "Matsumoto Kiyoshi",
        sub: 5,
        tax: 0,
        total: 5
    },
    {
       date: "12/02/2023",
       merchant: "Matsubara Hayashi",
       sub: 7,
       tax: 0,
       total: 7
    }
    ])

    transactions&&clicked && setDetails(transactions)

    // const tds = transactions.map((transaction,index) =>{
    //     return(
    //         <tr className="trans-info" key={index}>
    //             <td>{transaction.date}</td>
    //             <td>{transaction.merchant}</td>
    //             <td>${transaction.sub}.00</td>
    //             <td>${transaction.tax}.00</td>
    //             <td>${transaction.total}.00</td>
    //         </tr>
    //     )
    // })
    return(
        <>
            <tr className="main-row" onClick={openTransaction}>
                <td>{spends[0]}</td>
                <td>{spends[1]}</td>
                <td>${spends[2]}</td>
                <td>${spends[3]}</td>
                <td>${spends[4]}</td>
            </tr>
        </>
    )
}

export default SpendingTransactions;