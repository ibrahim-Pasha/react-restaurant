import { HomePage, ProfilePage, Bolgeler, Masa, ActiveOrders } from "./pages";
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
    path: "/bolgeler",
    element: Bolgeler,
  },
  {
    path: "/masa",
    element: Masa,
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
