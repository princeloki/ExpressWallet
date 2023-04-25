import {
    Button,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Label
  } from "reactstrap";
  
import { BsGlobe } from "react-icons/bs";
import { FaSchool } from "react-icons/fa";
import { AiOutlineRight } from "react-icons/ai"


const FirstPage = ({handleIndexChange, handleAddition, userData}) =>{
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleIndexChange(2)
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
              value={userData.country}
              onChange={(e) => handleAddition(e)}
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
                value={userData.host}
                onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="reg-label" for="start">When do/did you start your exchange?</Label>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FaSchool />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="When Will/did you start your exchange?"
                type="date"
                autoComplete="new-start"
                name="start"
                value={userData.start}
                onChange={(e) => handleAddition(e)}
              />
            </InputGroup>
          </FormGroup>
            <div className="text-center buttons">
                <Button className="mt-4 next-button" type="submit">
                Next <AiOutlineRight />
                </Button>
            </div>
        </Form>
      </CardBody>
    )
}

export default FirstPage;