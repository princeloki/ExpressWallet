// Import necessary components from Reactstrap and React-Icons
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
import { BsCurrencyDollar, BsCurrencyExchange } from "react-icons/bs"
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"  

// Define the SecondPage component. It accepts handleIndexChange, handleAddition, and userData as props
const SecondPage = ({handleIndexChange, handleAddition, userData}) => {
  // Define a state variable 'setBudget' and its corresponding setter 'setSetBudget'
  const [setBudget, setSetBudget] = useState("")

  // Function to handle the setting of budget. It takes an event as an argument.
  const handleSetBudget = (e) => {
    setSetBudget(e.target.value)
  }
  
  // Function to handle the form submission. It takes an event as an argument.
  const handleSubmit = (e) => {
    e.preventDefault()
    handleIndexChange(3)
  }

  // Render the form elements and other components
  return(
    <CardBody className="px-lg-5 py-lg-5">
      <Form role="form" onSubmit={handleSubmit}>
        {/* First FormGroup for inputting length of exchange in months */}
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

        {/* Second FormGroup for setting automatic transaction categorization */}
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

        {/* Third FormGroup for setting alert threshold for monthly balance */}
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
              value={userData.alert} // Display the percentage set as alert threshold
              onChange={(e) => handleAddition(e)}
            />
            <InputGroupText>
                {userData.alert}%
            </InputGroupText>
          </InputGroup>
        </FormGroup>

        {/* Buttons for navigating between pages */}
        <div className="text-center buttons">
          {/* Back Button - navigates to the previous page */}
          <Button className="mt-4 back-button" onClick={()=>handleIndexChange(1)}>
            <AiOutlineLeft /> Back
          </Button>
          {/* Next Button - submits the form and navigates to the next page */}
          <Button className="mt-4 next-button" type="submit">
            Next <AiOutlineRight />
          </Button>
        </div>
      </Form>
    </CardBody>
  )
}

// Export the SecondPage component as default
export default SecondPage;
