

import {
  Card,
  Col
} from "reactstrap";

import Reg from "./regcomps/Reg"
import FirstPage from "./regcomps/FirstPage"
import SecondPage from "./regcomps/SecondPage"
import ThirdPage from "./regcomps/ThirdPage"
import FourthPage from "./regcomps/FourthPage"

import { useState } from "react"

const Register = () => {

  const [index, setIndex] = useState(4)

  const handleIndexChange = (index) => {
    setIndex(index)
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary curve shadow border-0">
          {index === 0 && <Reg handleIndexChange={handleIndexChange} />}
          {index === 1 && <FirstPage handleIndexChange={handleIndexChange} />}
          {index === 2 && <SecondPage handleIndexChange={handleIndexChange} />}
          {index === 3 && <ThirdPage handleIndexChange={handleIndexChange} />}
          {index === 4 && <FourthPage handleIndexChange={handleIndexChange} />}
        </Card>
      </Col>
    </>
  );
};

export default Register;
