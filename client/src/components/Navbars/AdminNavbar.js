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
const AdminNavbar = (props) => {
  const history = useHistory();
  
  const logout = () =>{
    localStorage.removeItem('user');
    history.push("/auth/login")
  }
  
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex user-cont" navbar>
            <IoIosNotifications className="text-white notif" />
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0 bg-white user-button" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle user">
                    <h1 className="user-initial">{props.user.first_name&&props.user.last_name && props.user.first_name.charAt(0) + props.user.last_name.charAt(0)}</h1>
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold name">
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
                <DropdownItem href="#pablo" onClick={logout}>
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

export default AdminNavbar;
