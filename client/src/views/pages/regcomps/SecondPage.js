

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
import { BsCurrencyDollar } from "react-icons/bs"


const SecondPage = () =>{

    const [formData, setFormData] = useState({
      length: "",
      income: ""
    })
  

    const handleChange = (e) => {
        setFormData(prevFormData=>{
        return {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }
        })
    }
    
    const handleSubmit = (e) => {
        console.log(formData)
        e.preventDefault()
        axios.post("http://localhost:3000/api/set_remittance",formData)
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
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="What your length of exchange"
              type="text"
              name="length"
              autoComplete="new-length"
              value={formData.length}
              onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label class="reg-label" for="income">Will you receive income/remmittance?</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <BsCurrencyDollar />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="income"
                value={formData.income}
                onChange={(e) => handleChange(e)}
              >
                <option>---Select---</option>
                <option>Yes</option>
                <option>No</option>
              </Input>
            </InputGroup>
          </FormGroup>
          <div className="text-center">
            <Button className="mt-4 next-button" color="primary" type="submit">
              Next
            </Button>
          </div>
        </Form>
      </CardBody>
    )
}

export default SecondPage;