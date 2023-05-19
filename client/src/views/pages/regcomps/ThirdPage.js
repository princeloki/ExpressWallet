// import necessary components, hooks, icons, and css from their respective libraries
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
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';

// Define ThirdPage component, receiving handleIndexChange, handleAddition, userData as props
const ThirdPage = ({handleIndexChange, handleAddition, userData}) =>{
  // Set initial states for enabled, initialStep and setBudget
    const [enabled,setEnabled] = useState(true);
    const [initialStep,setInitialStep] = useState(0);
    const [setBudget, setSetBudget] = useState("")

    // Handle input changes for budget
    const handleSetBudget = (e) => {
        setSetBudget(e.target.value)
    }
    
    // Handle form submission and navigate to the next index  
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(4)
    }


    // Handle exit from the steps/intro
    const onExit = () => {
      setEnabled(false)
    }

    
    // Define the steps/intro for the page
    const steps = [
      // detailed steps with element targets and intro descriptions omitted for brevity
        {
            element: '#perc-label',
            intro: 'Your expenses are organized into two types of categories and three priority levels.',
        },
        {
            element: '#perc-label',
            intro: 'The two types of categories are Fixed and Adjustable, while the priorities are High, Normal, and Low.',
        },
        {
            element: '#high',
            intro: 'For example, Rent could be considered a High priority Fixed expense.',
        },
        {
            element: '#normal',
            intro: 'Transportation might be classified as a Normal priority Adjustable expense.',
        },
        {
            element: '#low',
            intro: 'Clothes can be categorized as a Low priority Adjustable expense.',
        },
        {
            element: '#perc-label',
            intro: 'These examples are just suggestions, and you are free to categorize your expenses based on your personal preferences later on.',
        },
        {
            element: '#perc-label',
            intro: "If your net balance (the difference between your budget and current balance) falls below zero, our system will automatically adjust your budget for you.",
            position: 'right',
        },
        {
            element: '#high',
            intro: 'To do this, the system will use the percentage you enter in the input field to reduce all expenses of that priority level, provided they are classified as Adjustable expenses.',
        },
        {
            element: '#perc-label',
            intro: 'Note: Later, when you categorize your expenses, keep in mind that only Adjustable expenses can be readjusted. Fixed expenses cannot be changed unless done manually.',
        },
        {
            element: '#budget',
            intro: 'Lastly, non-categorized expenses automatically become miscellaneous expenses, as such, please set your budget for Miscellaneous expenses.',
        },
    ];

    return(
      <CardBody className="px-lg-5 py-lg-5">
        <Steps
              enabled={enabled}
              steps={steps}
              initialStep={initialStep}
              onExit={onExit}
            />
        <Form role="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Label className="reg-label" for="income" id="budget">Set a miscellaneous expenses budget!</Label>
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
            <Label className="reg-label" for="high" id="perc-label">Set the percent of expenses to reduce when readjusting your budget</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText id="high-text">
                  High (%)
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="high"
              id="high"
              autoComplete="new-high"
              value={userData.high}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  Normal (%)
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="normal"
              id="normal"
              autoComplete="new-normal"
              value={userData.normal}
              onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  Low (%)
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              type="number"
              name="low"
              id="low"
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