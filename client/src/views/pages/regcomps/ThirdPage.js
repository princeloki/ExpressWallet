

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
import { BsCurrencyExchange } from "react-icons/bs"
import { BsCurrencyDollar } from "react-icons/bs"
import { AiOutlineRight } from "react-icons/ai"
import { AiOutlineLeft } from "react-icons/ai"  


const ThirdPage = ({handleIndexChange, handleAddition, userData}) =>{

    const [setBudget, setSetBudget] = useState("")

    const handleSetBudget = (e) => {
        setSetBudget(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(4)
    }
    return(
      <CardBody className="px-lg-5 py-lg-5">
        <Form role="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Label className="reg-label" for="income">Preferred Currency</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyExchange />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="currency"
                value={userData.currency}
                onChange={(e) => handleAddition(e)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>CAD</option>
                <option>JPY</option>
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="income">Would you like us to set your budget for you?</Label>
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
          {setBudget==="No" && <FormGroup>
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
              value={userData.budget}
              onChange={(e) => handleAddition(e)}
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