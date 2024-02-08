import React from "react";
import "./home.scss";

export default function Home() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Home</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <h1 className="logos-container">Wellcome</h1>
        </div>
      </div>
    </React.Fragment>
  );
}
