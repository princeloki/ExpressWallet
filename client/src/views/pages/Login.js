// Import necessary components from the reactstrap library
import {
  Button,
  Card,
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

// Import the axios library for making HTTP requests
import axios from 'axios';
// Import the useState hook from React for managing component state
import { useState } from "react"
// Import useHistory hook from react-router-dom for programmatic navigation
import { useHistory } from "react-router-dom";

// Define a Login component
const Login = () => {
  // Define a history variable using useHistory hook for navigation
  const history = useHistory();
  
  // Use useState hook to set initial form data for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // Handler for changing form fields
  const handleChange = (e) => {
    // Update the formData state based on input changes
    setFormData(prevFormData =>{
      return{
        ...prevFormData,
        [e.target.name]: e.target.value,
      }
    })
  }

  // Handler for submitting the form
  const handleSubmit = (e) => {
    // Prevent default form submission
    e.preventDefault()
    // Make a POST request to the login API with form data
    axios.post('http://localhost:4000/api/login', formData)
    .then(response => {
      // Store the user data in local storage after successful login
      const userString = JSON.stringify(response.data.body);
      localStorage.setItem('user', userString);
      localStorage.setItem("currency", response.data.body.currency);
      // Navigate to the /admin/index route
      history.push("/admin/index")
    })
    .catch(err => {
      // Log any errors to the console
      console.log(err)
    })
  }

  // Render the login form
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e)=>handleChange(e)}
                    autoComplete="new-email"
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
                    name="password"
                    value={formData.password}
                    onChange={(e)=>handleChange(e)}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="register"
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
