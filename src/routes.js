import Calendar from "./components/Calendar.vue";
import AdminDashboard from "./components/AdminDashboard.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Calendar,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboard,
  },
];

export default routes;
