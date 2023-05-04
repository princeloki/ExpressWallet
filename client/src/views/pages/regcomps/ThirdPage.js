

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
            <Label className="reg-label" for="income">Set a miscellaneous expenses budget!</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="Miscellaneous Expense"
              type="number"
              name="misc"
              autoComplete="new-misc"
              value={userData.misc}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="high">Set the percent of expenses to reduce when re-allocating</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  High
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="high"
              autoComplete="new-high"
              value={userData.high}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  Normal
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="normal"
              autoComplete="new-normal"
              value={userData.normal}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  Low
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="low"
              autoComplete="new-low"
              value={userData.low}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>
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