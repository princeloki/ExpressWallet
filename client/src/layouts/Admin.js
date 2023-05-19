// Import necessary libraries and components from react, react-router-dom, axios, and local components
import React,{ useState,useEffect } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import axios from "axios";

import routes from "routes.js";

// Define the Admin component
const Admin = (props) => {
  // Get user information from localStorage
  const userInfo = localStorage.getItem('user');

  // Define state variables and update methods
  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);
  const [rates, setRates] = useState([]);
  const [onDashboard, setOnDashboard] = useState(true);

  const mainContent = React.useRef(null);
  const [currencySymbols, setCurrencySymbols] = useState({});
  const location = useLocation();

  // Fetch the currency symbols from the API once when the component mounts
  useEffect(() => {
    axios.get('http://localhost:4000/api/get_symbols')
        .then(response => {
            const symbols = {};
            response.data.forEach(row => {
                symbols[row.code] = row.symbol;
            });
            setCurrencySymbols(symbols);
        })
        .catch(error => {
            console.error('Error fetching currencies:', error);
        });
  }, []);

  // Define a function to return the current currency symbol
  const currSym = ()=>{
    const currency = localStorage.getItem('currency');
    return currencySymbols[currency] || "￥";
  };

  // Fetch the user rates from the API once when the component mounts
  useEffect(()=>{
    axios.get(`http://localhost:4000/api/get_rates/${user.uid}`)
    .then(response=>{
      const result = response.data.reduce((acc, item) => {
        acc[item.symbol] = item.rate;
        return acc;
      }, {});
      setRates(result);
    })
    .catch(err=>{
      console.log(err);
    })
  },[])

  // Define a function to update the user information
  const updateUser = () => {
    axios.get(`http://localhost:4000/api/get_user/${user.uid}`)
      .then(response => {
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch(error => {
      });
  };

  // Update the user information every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.put(`http://localhost:4000/api/update_user/${user.uid}`)
        .then(response => {
          updateUser();
        })
        .catch(error => {
          console.log(error);
        });
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  

  // Scroll to top on location change
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Function to map over the routes
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            render={(props) => (
              <prop.component {...props} onDashboard={onDashboard} user={user} setUserData={setUser} 
              updateUser={updateUser} currSym={currSym} rates={rates}/>
            )}
          />
        );
      } else {
        return null;
      }
    });
  };

  // Function to get the brand text based on the current path
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  // Render the Admin component
  return (
    <>
      {/* Render the Sidebar component and pass necessary props */}
      <Sidebar
        {...props}
        routes={routes}
        setOnDashboard={setOnDashboard} 
        user={user}
      />
      {/* Render the main content */}
      <div className="main-content" ref={mainContent}>
        {/* Render the AdminNavbar component and pass necessary props */}
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
          user={user}
        />
        {/* Define the routes for the application */}
        <Switch>
          {getRoutes(routes)}
          {/* Redirect to /admin/index for any unknown routes */}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        {/* Uncomment the following lines to add a footer */}
        {/* <Container fluid>
          <AdminFooter />
        </Container> */}
      </div>
    </>
  );
};

// Export the Admin component
export default Admin;
