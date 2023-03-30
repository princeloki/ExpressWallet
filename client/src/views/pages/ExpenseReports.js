
import {
  Card,
  Container,
  Row,
  Col
} from "reactstrap";

import Header from "components/Headers/Header.js";
import Spending from "./components/Spending";

const ExpenseReports = (props) => {
  const size = ["January 2023","February 2023","March 2023"]
  const spendings = size.map((spending, index) =>{
    return(<Spending date={spending} key={index}/>)
  })

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7 spending-container" fluid>
        {spendings}
      </Container>
    </>
  );
};

export default ExpenseReports;
