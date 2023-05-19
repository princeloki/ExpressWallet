import {
    Button,
    CardHeader,
    CardBody
  } from "reactstrap";
  
  // import icons from react-icons library
  import { AiOutlinePlusCircle } from "react-icons/ai"
  import { AiOutlineLeft } from "react-icons/ai"  
  
  // FourthPage component definition
  const FourthPage = ({handleIndexChange, setActive, submitUserData, bankAmount}) =>{
  
    // openBank function changes the active state to true
    const openBank = () =>{
        setActive(true);
    }
    
    // render method return
    return(      
        <>
            {/* Card Header with Bank Account Information */}
            <CardHeader className="bg-transparent pb-5 bank-header">
                <div className="text-muted text-center mt-2 mb-4">
                    {/* Instructions for user to add bank account */}
                    <small>Add Bank Account(s)</small>
                </div>
                <div className="text-center accounts-added">
                    {/* Display of number of accounts added */}
                    <span className="btn-inner--text">{bankAmount} Account(s) Added</span>
                </div>
            </CardHeader>
            {/* Card Body contains the functional buttons */}
            <CardBody className="px-lg-5 py-lg-5">
                <div className="add-box">
                    {/* Add Button, opens the bank account addition interface on click */}
                    <AiOutlinePlusCircle className="add-button" onClick={openBank} /> 
                </div>
                <div className="text-center buttons">
                    {/* Back Button, switches the view to the previous page */}
                    <Button className="mt-4 back-button" onClick={()=>handleIndexChange(3)}>
                    <AiOutlineLeft /> Back
                    </Button>
                    {/* Save Button, triggers the submitUserData function to save user data */}
                    <Button className="mt-4 next-button" onClick={submitUserData} color="primary">
                    Save
                    </Button>
                </div>
            </CardBody>
      </>
    )
  }
  
  // export the FourthPage component
  export default FourthPage;
  