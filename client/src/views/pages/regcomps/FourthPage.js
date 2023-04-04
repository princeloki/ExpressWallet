

import {
    Button,
    CardHeader,
    CardBody
  } from "reactstrap";

import { AiOutlinePlusCircle } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { AiOutlineLeft } from "react-icons/ai"  

import { useState } from "react"
import axios from "axios"


const FourthPage = ({handleIndexChange}) =>{

    const [setBudget, setSetBudget] = useState("")

    const [formData, setFormData] = useState([])

    const openBank = () =>{
        console.log("Bank opened")
    }
    
    const handleSubmit = (e) => {
        console.log(formData, setBudget)
        e.preventDefault()
        axios.post("http://localhost:3000/api/set_budget",formData)
        .then(response => {
        console.log(response.data)
        })
        .catch(err => {
        console.log(err)
        })
    }
    return(      
        <>
            <CardHeader className="bg-transparent pb-5 bank-header">
                <div className="text-muted text-center mt-2 mb-4">
                    <small>Add Bank Account(s)</small>
                </div>
                <div className="text-center accounts-added">
                    <span className="btn-inner--text">{formData.length} Accounts Added</span>
                </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
                <div className="add-box">
                    <AiOutlinePlusCircle className="add-button" onClick={openBank} /> 
                </div>
                <div className="text-center buttons">
                    <Button className="mt-4 back-button" onClick={()=>handleIndexChange(3)}>
                    <AiOutlineLeft /> Back
                    </Button>
                    <Button className="mt-4 next-button" color="primary" type="submit">
                    Save
                    </Button>
                </div>
            </CardBody>
      </>
    )
}

export default FourthPage;