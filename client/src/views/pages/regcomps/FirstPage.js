// Importing necessary components and icons from reactstrap and react-icons
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

// Importing axios for HTTP requests and useState and useEffect hooks from react
import axios from 'axios';
import { useEffect, useState } from "react";

const FirstPage = ({handleIndexChange, handleAddition, userData}) => {
  // Initializing countries and universities state
  const [countries, setCountries] = useState([])
  const [universities, setUniversities] = useState([])

  // On component mount, fetch the list of countries from the server
  useEffect(()=>{
    axios.get("http://localhost:4000/api/get_countries")
    .then(response=>{
      setCountries(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  // On component mount, fetch the list of universities from the server
  useEffect(()=>{
    axios.get("http://localhost:4000/api/get_universities")
    .then(response=>{
      setUniversities(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  // Map countries and universities to the format expected by react-select
  const countryOptions = countries.map((country) => ({ value: country, label: country }));
  const universityOptions = universities.map((university) => ({ value: university, label: university }));

  // On form submission, prevent default form submission event and move to the next page
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
                list="countries"
              />
              {/* Data list for country suggestions */}
              <datalist id="countries">
                {countries.map((country, index) => (
                  <option key={index} value={country} />
                ))}
              </datalist>
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
                list="universities"
              />
              {/* Data list for university suggestions */}
              <datalist id="universities">
                {universities.map((university, index) => (
                  <option key={index} value={university} />
                ))}
              </datalist>
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