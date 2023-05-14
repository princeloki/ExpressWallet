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
            <Label className="reg-label" for="income">What your length of exchange in months</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
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
            <Label className="reg-label" for="income">Would you like the system to automatically categorize your new transactions?</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyExchange />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="autoassign"
                value={userData.autoassign}
                onChange={(e) => handleAddition(e)}
              >
                <option value="1">YES</option>
                <option value="2">NO</option>
              </Input>
            </InputGroup>
          </FormGroup>

          <FormGroup>
              <Label className="reg-label" for="income">What percentage of your monthly balance should trigger a spending alert?</Label>
              <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                          <BsCurrencyExchange />
                      </InputGroupText>
                  </InputGroupAddon>
                  <Input
                      style={{appearance: "none", width: "100%", height: "15px", borderRadius: "5px", background: "#d3d3d3", outline: "none", opacity: "0.7", transition: ".2s", hover: {opacity: "1"}}}
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      name="alert"
                      value={userData.alert}
                      onChange={(e) => handleAddition(e)}
                  />
                  <InputGroupText>
                      {userData.alert}%
                  </InputGroupText>
              </InputGroup>
          </FormGroup>


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