

import {
    Button,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col
  } from "reactstrap";
  
import { useState } from "react"
import axios from "axios"

const Reg = ({handleIndexChange}) =>{

    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: ""
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
        axios.post("http://localhost:4000/api/register",formData)
        .then(response => {
          console.log(response.data)
          handleIndexChange(1)
        })
        .catch(err => {
        console.log(err)
        })
    }
    
  
    return(
    <>      
      <CardHeader className="bg-transparent pb-5">
        <div className="text-muted text-center mt-2 mb-4">
          <small>Sign up with</small>
        </div>
        <div className="text-center">
          <Button
            className="btn-neutral btn-icon"
            color="default"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <span className="btn-inner--icon">
              <img
                alt="..."
                src={
                  require("../../../assets/img/icons/common/google.svg")
                    .default
                }
              />
            </span>
            <span className="btn-inner--text">Google</span>
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-lg-5 py-lg-5">
        <div className="text-center text-muted mb-4">
          <small>Or sign up with credentials</small>
        </div>
        <Form role="form" onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input 
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Email"
                type="email"
                autoComplete="new-email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Phone"
                type="phone"
                autoComplete="new-phone"
                name="phone"
                value={formData.phone}
                onChange={(e)=>handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Password"
                type="password"
                autoComplete="new-password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </FormGroup>
          <div className="text-muted font-italic">
            <small>
              password strength:{" "}
              <span className="text-success font-weight-700">strong</span>
            </small>
          </div>
          <Row className="my-4">
            <Col xs="12">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckRegister"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckRegister"
                >
                  <span className="text-muted">
                    I agree with the{" "}
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            </Col>
          </Row>
          <div className="text-center">
            <Button className="mt-4" color="primary" type="submit">
              Create account
            </Button>
          </div>
        </Form>
      </CardBody>
    </>
    )
  }

  export default Reg;