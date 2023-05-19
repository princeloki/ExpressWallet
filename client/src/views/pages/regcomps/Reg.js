// Importing necessary libraries and components
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
import validator from 'validator';

// Reg component for handling registration process
const Reg = ({ handleIndexChange, addData }) => {
  // useState hook for handling form message
  const [message, setMessage] = useState("")

  // useState hook for handling form data
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: ""
  })

  // Function to handle form field changes
  const handleChange = (e) => {
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              [e.target.name]: e.target.value,
          }
      });

      // If the password field was updated, check the password for validity
      if (e.target.name === 'password') {
          const { isValid, message } = isValidPassword(e.target.value);
          setMessage(message);
          if (!isValid) {
              return;
          }
      }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
      e.preventDefault()

      // If there's no error message
      if (!message) {
          // Make a POST request to the API to register the user
          axios.post("http://localhost:4000/api/register", formData)
              .then(response => {
                  console.log(response.data.count)
                  // Add user data
                  addData(prevFormData => {
                      return {
                          ...prevFormData,
                          uid: response.data.count,
                          email: formData.email
                      }
                  })
                  // Change index (could be for form steps)
                  handleIndexChange(1)
              })
              .catch(err => {
                  console.log(err)
              })
      }
  }

  // Function to validate password
  const isValidPassword = (password) => {
      // Password should be at least 10 characters long
      if (!validator.isLength(password, { min: 10 })) {
          return { isValid: false, message: 'Password should be at least 10 characters long' };
      }

      // Password should contain at least one lowercase character
      if (!/[a-z]/.test(password)) {
          return { isValid: false, message: 'Password should contain at least one lowercase character' };
      }

      // Password should contain at least one uppercase character
      if (!/[A-Z]/.test(password)) {
          return { isValid: false, message: 'Password should contain at least one uppercase character' };
      }

      // Password should contain at least one digit
      if (!/[0-9]/.test(password)) {
          return { isValid: false, message: 'Password should contain at least one digit' };
      }

      // If the password passes all checks, return true for isValid
      return { isValid: true, message: '' };
  };

  // Render registration form
    return(
    <>      
      <CardHeader className="bg-transparent pb-5">
        <div className="text-muted text-center mt-2 mb-4">
          <h1>Sign up</h1>
        </div>
      </CardHeader>
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
                type="number"
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
                id="password"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
            {message && <div className="text-danger">{message}</div>}
          </FormGroup>
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