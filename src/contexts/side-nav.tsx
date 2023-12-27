import { createContext, useContext, useState } from "react";

type NavSideContextType = {
  opend: boolean;
  trigger?: (isOpend: boolean) => void;
};

const SideNavContext = createContext<NavSideContextType>({
  opend: true,
});
const useSideNav = () => useContext(SideNavContext);

function SideNavProvider(props: any) {
  const [opend, setOpened] = useState(true);
  const trigger = (isOpend: boolean) => {
    setOpened(isOpend);
  };
  return <SideNavContext.Provider value={{ opend, trigger }} {...props} />;
}
export { useSideNav, SideNavProvider };
