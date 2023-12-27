import React from "react";

import "./Footer.scss";
import { useNavigation } from "../../contexts/navigation";
import { useFooter } from "../../contexts/footer";

export default ({ ...rest }) => {
  const { navigationData } = useNavigation();
  const { displayed, trigger } = useFooter();
  if (trigger) {
    if (navigationData.currentPath === "/masa") {
      trigger(false);
    } else {
      trigger(false);
    }
  }
  if (displayed) {
    return <footer className={"footer"} {...rest} />;
  } else return null;
};
