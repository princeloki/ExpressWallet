

import {
    Button,
    CardBody,
    FormGroup,
    Form,
    Label,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup
  } from "reactstrap";
  
import { useState } from "react"
import axios from "axios"
import { BsCurrencyExchange } from "react-icons/bs"
import { BsCurrencyDollar } from "react-icons/bs"
import { AiOutlineRight } from "react-icons/ai"
import { AiOutlineLeft } from "react-icons/ai"  


const ThirdPage = ({handleIndexChange}) =>{

    const [setBudget, setSetBudget] = useState("")

    const [formData, setFormData] = useState({
      currency: "USD",
      budget: 0
    })
  

    const handleChange = (e) => {
        setFormData(prevFormData=>{
        return {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }
        })
    }

    const handleSetBudget = (e) => {
        setSetBudget(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(4)
        axios.post("http://localhost:3000/api/set_budget",formData)
        .then(response => {
        console.log(response.data)
        })
        .catch(err => {
        console.log(err)
        })
    }
    return(
      <CardBody className="px-lg-5 py-lg-5">
        <Form role="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Label class="reg-label" for="income">Preferred Currency</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyExchange />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="income"
                value={formData.currency}
                onChange={(e) => handleChange(e)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>CAD</option>
                <option>JPY</option>
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label class="reg-label" for="income">Would you like us to set your budget for you?</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyDollar />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="setBudget"
                value={setBudget}
                onChange={(e) => handleSetBudget(e)}
              >
                <option>---Select---</option>
                <option>Yes</option>
                <option>No</option>
              </Input>
            </InputGroup>
          </FormGroup>
          {setBudget==="Yes" && <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="What is your monthly budget?"
              type="text"
              name="budget"
              autoComplete="new-budget"
              value={formData.budget}
              onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>}
            <div className="text-center buttons">
                <Button className="mt-4 back-button" onClick={()=>handleIndexChange(2)}>
                <AiOutlineLeft /> Back
                </Button>
                <Button className="mt-4 next-button" type="submit">
                Next <AiOutlineRight />
                </Button>
            </div>
        </Form>
      </CardBody>
    )
}

export default ThirdPage;