import {
  Button,
  CardHeader,
  CardBody
} from "reactstrap";

import { AiOutlinePlusCircle } from "react-icons/ai"
import { AiOutlineLeft } from "react-icons/ai"  

const FourthPage = ({handleIndexChange, setActive, submitUserData, bankAmount}) =>{

  const openBank = () =>{
      setActive(true);
  }
  
  return(      
      <>
          <CardHeader className="bg-transparent pb-5 bank-header">
              <div className="text-muted text-center mt-2 mb-4">
                  <small>Add Bank Account(s)</small>
              </div>
              <div className="text-center accounts-added">
                  <span className="btn-inner--text">{bankAmount} Account(s) Added</span>
              </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
              <div className="add-box">
                  <AiOutlinePlusCircle className="add-button" onClick={openBank} /> 
              </div>
              <div className="text-center buttons">
                  <Button className="mt-4 back-button" onClick={()=>handleIndexChange(3)}>
                  <AiOutlineLeft /> Back
                  </Button>
                  <Button className="mt-4 next-button" onClick={submitUserData} color="primary">
                  Save
                  </Button>
              </div>
          </CardBody>
    </>
  )
}

export default FourthPage;