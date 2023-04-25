

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
import { BsCurrencyExchange } from "react-icons/bs"
import { AiOutlineLeft } from "react-icons/ai"  


const SecondPage = ({handleIndexChange,handleAddition,userData}) =>{
    const [setBudget, setSetBudget] = useState("")


    const handleSetBudget = (e) => {
        setSetBudget(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(3)
    }
    return(
      <CardBody className="px-lg-5 py-lg-5">
        <Form role="form" onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="What your length of exchange in months"
              type="text"
              name="length"
              autoComplete="new-length"
              value={userData.length}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>
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
            <Label className="reg-label" for="income">Will you receive income/remmittance?</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyDollar />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="sel"
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
              placeholder="How much will you receive each month?"
              type="text"
              name="income"
              autoComplete="new-income"
              value={userData.income}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>}
          <div className="text-center buttons">
              <Button className="mt-4 back-button" onClick={()=>handleIndexChange(1)}>
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

export default SecondPage;