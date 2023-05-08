

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

const ThirdPage = ({handleIndexChange, handleAddition, userData}) =>{
    const [enabled,setEnabled] = useState(true);
    const [initialStep,setInitialStep] = useState(0);
    const [setBudget, setSetBudget] = useState("")

    const handleSetBudget = (e) => {
        setSetBudget(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(4)
    }

  
    const onExit = () => {
        setEnabled(false)
    }

    const steps = [
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
            <Label className="reg-label" for="high" id="perc-label">Set the percent of expenses to reduce when re-allocating</Label>
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