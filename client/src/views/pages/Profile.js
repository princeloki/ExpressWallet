import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState,useEffect } from "react";
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';

const Profile = (props) => {
  const history = useHistory();
  const [edit, setEdit] = useState(false);
  const [enabled,setEnabled] = useState(true);
  const [initialStep,setInitialStep] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [priorities, setPriorities] = useState({
    "H": 0,
    "N": 0,
    "L": 0
  })

  const [formData, setFormData] = useState({
    email: props.user.email || '',
    first_name: props.user.first_name || '',
    last_name: props.user.last_name || '',
    autoassign: props.user.autoassign
  })

  const submit = (e) =>{
    e.preventDefault()
    axios.post(`http://localhost:4000/api/update_user_info/${props.user.uid}`, {
      ...formData,
      ...priorities
    })
    .then(response=>{
      localStorage.setItem("user", JSON.stringify({
        uid: props.user.uid,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_num: props.user.phone_num,
        balance: props.user.balance,
        length: props.user.length,
        country: props.user.country,
        host: props.user.host,
        currency: props.user.currency,
        budget: props.user.budget,
        start: props.user.start,
        autoassign: formData.autoassign
      }))
      window.location.reload();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_priorities/${props.user.uid}`)
    .then(response=>{
      setPriorities({
        "H": response.data[0].percentage,
        "N": response.data[1].percentage,
        "L": response.data[2].percentage
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },[])

  const deleteAccount = () =>{
    axios.delete(`http://localhost:4000/api/delete_account/${props.user.uid}`)
    .then(response=>{
      localStorage.removeItem("user");
      history.push('/auth/register');
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const handleChange = (e) =>{
    setEdit(true);
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handlePriority = (e) =>{
    setEdit(true);
    setPriorities((prevPriorities)=>{
      return{
        ...prevPriorities,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleAutoAssign = () =>{
    setClicked(true);
    setEdit(true);
    if(formData.autoassign === 0){
      setFormData(prevFormData=>{
        return{
          ...prevFormData,
          autoassign: 1,
        }
      })
    } else{
      setFormData(prevFormData=>{
        return{
          ...prevFormData,
          autoassign: 0,
        }
      })
    }
  }

    
  const onExit = () => {
    setEnabled(false)
  }

  const steps = [
    {
        element: '#on-but',
        intro: 'Once disabled, it is possible to turn this feature back on.',
    },
    {
        element: '#save-but',
        intro: 'Once revelevant changes have been made, click the save button here.',
    }
  ];


  return (
    <>
      <UserHeader user={props.user}/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        {clicked &&<Steps
              enabled={enabled}
              steps={steps}
              initialStep={initialStep}
              onExit={onExit}
            />}
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={() => deleteAccount()}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submit}>
                  <h6 className="heading-small text-muted mb-4">
                    Turn on Automatic Expense Categorization
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <Button color="primary" size="sm" onClick={handleAutoAssign} id="on-but">{formData.autoassign===1 ? "On" : "Off"}</Button>
                      </Col>
                    </Row>
                  </div>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            name="email"
                            value={formData.email}
                            onChange={(e)=>handleChange(e)}
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={(e)=>handleChange(e)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={(e)=>handleChange(e)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Budget Reallocation Parameters
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-high"
                          >
                            High (%)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-high"
                            name="H"
                            value={priorities.H}
                            onChange={(e)=>handlePriority(e)}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-normal"
                          >
                            Normal (%)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-normal"
                            name="N"
                            value={priorities.N}
                            onChange={(e)=>handlePriority(e)}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-low"
                          >
                            Low (%)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-low"
                            name="L"
                            value={priorities.L}
                            onChange={(e)=>handlePriority(e)}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {edit && <Button color="primary" type="submit" id="save-but">Save</Button>}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
