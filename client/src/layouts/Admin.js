

import React,{ useState,useEffect } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import axios from "axios";

import routes from "routes.js";

const Admin = (props) => {
  const userInfo = localStorage.getItem('user');
  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);
  const [remount, setRemount] = useState(false)
  const [rates, setRates] = useState([]);


  const [onDashboard, setOnDashboard] = useState(true);
  const mainContent = React.useRef(null);
  const location = useLocation();

  
  
  const currSym = ()=>{
    switch (localStorage.getItem('currency')) {
      case "JMD":
        return "$";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
      default:
        return "￥";
    }
  };

  
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

  const updateUser = () => {
    axios.get(`http://localhost:4000/api/get_user/${user.uid}`)
      .then(response => {
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch(error => {
      });
  };
  

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

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

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        setOnDashboard={setOnDashboard} 
        user={user}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
          user={user}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        {/* <Container fluid>
          <AdminFooter />
        </Container> */}
      </div>
    </>
  );
};

export default Admin;
