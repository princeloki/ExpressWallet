import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import ExpenseReports from "views/examples/ExpenseReports";
import ExpenseManager from "views/examples/ExpenseManager";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import CurrencyConverter from "views/examples/CurrencyConverter.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/expense-report",
    name: "Expense Report",
    icon: "ni ni-book-bookmark text-red",
    component: ExpenseReports,
    layout: "/admin"
  },
  {
    path: "/expense-manager",
    name: "Expense Manager",
    icon: "ni ni-ruler-pencil text-primary",
    component: ExpenseManager,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/currency-converter",
    name: "Currency Converter",
    icon: "ni ni-book-bookmark text-red",
    component: CurrencyConverter,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
