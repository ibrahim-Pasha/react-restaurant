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
import { Masa as masaModel } from "../../models";

const TableHeader: React.FC<HeaderProps> = ({ tables, search }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <i className="fa-solid fa-arrow-left"></i>
      <button onClick={() => navigate("/bolgeler")} className="main-button">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          style={{ color: "#ffffff" }}
        />
      </button>
      <input
        className="tableName"
        readOnly
        defaultValue={tables && `Masa ${tables?.m_kodu}`}
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
        placeholder="Ürün Adı veya Barkod ile Arama"
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
  tables?: masaModel;
  search: (e: any) => void;
}
export default TableHeader;
