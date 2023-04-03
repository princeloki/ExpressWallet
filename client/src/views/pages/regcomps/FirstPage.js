import {
    Button,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup
  } from "reactstrap";
  
import { useState } from "react";
import axios from "axios";
import { BsGlobe } from "react-icons/bs";
import { FaSchool } from "react-icons/fa";



const FirstPage = () =>{

    const [formData, setFormData] = useState({
      country: "",
      host: ""
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
        e.preventDefault()
        axios.post("http://localhost:3000/api/set_country",formData)
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
                  <BsGlobe />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="What country are you going to"
              type="text"
              name="country"
              autoComplete="new-country"
              value={formData.country}
              onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FaSchool />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Host Institution"
                type="text"
                autoComplete="new-host"
                name="host"
                value={formData.host}
                onChange={(e) => handleChange(e)}
              />
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

export default FirstPage;