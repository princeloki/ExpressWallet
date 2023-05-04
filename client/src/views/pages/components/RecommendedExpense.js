

import {
    Button,
    Form,
    InputGroup,
    Input,
    FormGroup,
    Label
} from "reactstrap";

import { useState, useEffect } from "react";
import axios from "axios";

const RecommendedExpense = ({user, expense, setReloadExpenses, reloadExpenses, setRecindex}) => {
    const [trans, setTrans] = useState([])
    const [add, setAdd] = useState(false)
    const [recExp, setRecExp] = useState("")
    const [formData, setFormData] = useState({
        expense: "",
        amount: expense.average_amount,
        state: "F",
        priority: "L",
        spending_name: expense.merchant_name,
        category: expense.category
    })


    const ignoreExpense = () => {
        axios
            .post(`http://localhost:4000/api/ignore_recommendation/${user.uid}`, {
                expense: expense.merchant_name,
                category: expense.category,
                amount: expense.amount,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };    

    const analyze=(data) =>{
        axios.post(`http://localhost:4000/api/analyze_expense`, data[0])
        .then(response=>{
            setRecExp(response.data[0].predicted_category);
            setFormData(prevFormData=>{
                return{
                    ...prevFormData,
                    expense: response.data[0].predicted_category,
                }
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        axios.post(`http://localhost:4000/api/find_transactions`, {
            uid: user.uid,
            merchant_name: expense.merchant_name,
            category: expense.category,
            amount: expense.amount
        })
        .then(response => {
            setTrans(response.data)
            analyze(response.data)
        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    const transactions = trans.map((tran, index) => {
        return(
            tran && <h4 key={index}>{tran.merchant_name} ({tran.category}) | ({tran.currency}) {tran.amount.toFixed(2)}<br/> {tran.date}</h4>
        )
    })

    const addRecommend = (e)=>{
        e.preventDefault();
        axios.post(`http://localhost:4000/api/add_recommended/${user.uid}`,formData)
        .then(response=>{
            setAdd(!add)
            setReloadExpenses(!reloadExpenses)
            setRecindex(null)
        })
        .catch(err=>{
        console.log(err);
        })
    }

    const handleExpense = (e) =>{
        console.log(formData)
        setFormData(prevFormData=>{
            return{
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    } 

    const handleIgnore = ()=>{
        ignoreExpense()
        setAdd(!add)
        setReloadExpenses(!reloadExpenses)
        setRecindex(null)
    }

    return (
        <>
            <div className="curve recommended-screen mb-xl-0">
                {!recExp &&
                <div className="lds-ring">
                    <div></div><div></div><div></div><div></div>
                </div>
                }
                {recExp && <div className="rec-container">
                    <h1>{expense.merchant_name} ({expense.category})</h1>
                    <h2>Average Monthly expense | ${parseInt(expense.average_amount).toFixed(2)}</h2>
                    <h2>Recommended Category | {recExp}</h2>
                    <h2>Transactions</h2>
                    {transactions}
                    <div className="button-group">
                        <Button color="primary" onClick={handleIgnore}>Ignore</Button>
                        <Button color="primary" onClick={()=>setAdd(!add)}>Add</Button>
                    </div>
                    {add && 
                        <Form className="rec-form" role="form" onSubmit={addRecommend}>
                            <FormGroup>
                                <Label className="reg-label" for="income">Expense name</Label>
                                <InputGroup className="input-group-alternative mb-3">
                                    <Input 
                                    type="text"
                                    name="expense"
                                    autoComplete="new-expense"
                                    value={formData.expense}
                                    onChange={(e) => handleExpense(e)}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label className="reg-label" for="income">Ajustable | Fixed</Label>
                                <InputGroup>
                                    <Input 
                                    type="select"
                                    name="state"
                                    autoComplete="new-state"
                                    onChange={(e)=>handleExpense(e)}
                                    value={formData["state"]}
                                    >
                                        <option value="F">Fixed</option>
                                        <option value="A">Adjustable</option>
                                    </Input>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label className="reg-label" for="income">Expense priority</Label>
                                <InputGroup>
                                <Input 
                                    type="select"
                                    name="priority"
                                    autoComplete="new-priority"
                                    onChange={(e) => handleExpense(e)}
                                    value={formData["priority"]}
                                >
                                    <option value="H">High</option>
                                    <option value="N">Normal</option>
                                    <option value="L">Low</option>
                                </Input>
                                </InputGroup>
                            </FormGroup>
                        <div className="text-center buttons">
                            <Button className="mt-4 save-button" color="primary" type="submit">Save</Button>
                        </div>
                    </Form>
                    }
                </div>}
            </div>
        </>
    );
};

export default RecommendedExpense;
    
    