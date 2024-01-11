import { Routes, Route, Navigate } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import { Footer } from "./components";
import { ActiveOrders, Bolgeler, Masa } from "./pages";

export default function Content() {
  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/home" />} />
        <Route
          path="/bolgeler"
          element={<Bolgeler currentPath={"/bolgeler"} />}
        />
        <Route path="/masa" element={<Masa currentPath={"/masa"} />} />
        <Route
          path="/active_orders"
          element={<ActiveOrders currentPath={"/active_orders"} />}
        />
      </Routes>
      <Footer>
        Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Inc.
        <br />
        All trademarks or registered trademarks are property of their respective
        owners.
      </Footer>
    </SideNavBarLayout>
  );
}
