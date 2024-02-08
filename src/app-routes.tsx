import { HomePage, ProfilePage, Regions, Table, ActiveOrders } from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/profile",
    element: ProfilePage,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/regions",
    element: Regions,
  },
  {
    path: "/table",
    element: Table,
  },
  {
    path: "/active_orders",
    element: ActiveOrders,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
