import {
  faArrowLeft,
  faCalendar,
  faNotesMedical,
  faPrint,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table as tableModel } from "../../models";

const TableHeader: React.FC<HeaderProps> = ({ tables, search }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <i className="fa-solid fa-arrow-left"></i>
      <button onClick={() => navigate("/regions")} className="main-button">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          style={{ color: "#ffffff" }}
        />
      </button>
      <input
        className="tableName"
        readOnly
        defaultValue={tables && `Table ${tables?.m_kodu}`}
      ></input>
      <button className="main-button">
        <FontAwesomeIcon size="xl" icon={faNotesMedical} />
      </button>
      <button className="main-button">
        <FontAwesomeIcon size="xl" icon={faUser} />
      </button>
      <button className="main-button">
        <FontAwesomeIcon
          size="xl"
          icon={faPrint}
          style={{ color: "#ffffff" }}
        />
      </button>
      <input
        className="ara"
        onChange={search}
        placeholder="Search using product name or barcode"
      ></input>
      <button className="main-button">
        <FontAwesomeIcon size="xl" icon={faUserGroup} />
      </button>
      <button className="main-button">
        <FontAwesomeIcon size="xl" icon={faCalendar} />
      </button>
    </div>
  );
};
interface HeaderProps {
  tables?: tableModel;
  search: (e: any) => void;
}
export default TableHeader;
