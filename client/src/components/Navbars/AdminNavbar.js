// Import necessary libraries and components from react-router-dom, reactstrap and react-icons
import { Link, useHistory } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";
import { IoIosNotifications } from "react-icons/io";

// Define the AdminNavbar component, taking props as a parameter
const AdminNavbar = (props) => {

  // useHistory hook gives you access to the history instance that you may use to navigate
  const history = useHistory();

  // Function to handle logging out
  const logout = () =>{
    // Remove 'user' item from localStorage
    localStorage.removeItem('user');
    // Redirect the user to the login page
    history.push("/auth/login")
  }
  
  // Return the JSX to be rendered
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}  {/* Dynamically display the brand text */}
          </Link>
          <Nav className="align-items-center d-none d-md-flex user-cont" navbar>
            <IoIosNotifications className="text-white notif" /> {/* Notification icon */}
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0 bg-white user-button" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle user">
                    <h1 className="user-initial">
                      {/* Dynamically display the user's initials */}
                      {props.user.first_name && props.user.last_name && props.user.first_name.charAt(0) + props.user.last_name.charAt(0)}
                    </h1>
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold name">
                      {/* Dynamically display the user's full name */}
                      {props.user ? props.user.first_name : ""} {props.user ? props.user.last_name : ""}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={logout}> {/* Call logout function on click */}
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

// Export the component for use in other files
export default AdminNavbar;
