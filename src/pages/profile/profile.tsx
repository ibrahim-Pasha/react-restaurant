import React, { useState } from "react";
import "./profile.scss";
import Form from "devextreme-react/form";

export default function Profile() {
  const [notes, setNotes] = useState("Ibrahim is a Full Stack developer.");
  const employee = {
    ID: 7,
    FirstName: "Ibrahim",
    LastName: "Issa basha",
    Prefix: "Mr.",
    Position: "Developer",
    Picture: "images/employees/06.png",
    BirthDate: new Date("2003/09/19"),
    Notes: notes,
    Address: "Turkey",
    contact: "ibrahimisapasa@gmail.com",
  };

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Profile</h2>

      <div className={"content-block dx-card responsive-paddings"}>
        <div className={"form-avatar"}>
          <img alt={""} src={"./admin.jpeg"} />
        </div>
        <span>{notes}</span>
      </div>

      <div className={"content-block dx-card responsive-paddings"}>
        <Form
          id={"form"}
          defaultFormData={employee}
          onFieldDataChanged={(e) =>
            e.dataField === "Notes" && setNotes(e.value)
          }
          labelLocation={"top"}
          colCountByScreen={colCountByScreen}
        />
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};
