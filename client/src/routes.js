import Index from "views/Index.js";
import Profile from "views/pages/Profile.js";
import ExpenseReports from "views/pages/ExpenseReports";
import ExpenseManager from "views/pages/ExpenseManager";
import Register from "views/pages/Register.js";
import Login from "views/pages/Login.js";
import LogTransaction from "views/pages/LogTransaction.js";

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
    path: "log-transaction",
    name: "Log Transaction",
    icon: "ni ni-money-coins text-green",
    component: LogTransaction,
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
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/user-profile",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/register",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
