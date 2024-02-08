import React, { useEffect, useState } from "react";
import "./regions.scss";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import Button from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../contexts/navigation";
import { Region, Table, ReqData } from "../../models";
import { RegionService, TableService } from "../../services";
export default function Regions(props: any) {
  const [tables, setTables] = useState<ReqData>();
  const [bolumlar, setBolumlar] = useState<Region>();
  const navigate = useNavigate();
  const [bolumNo, setBolumNo] = useState(1);
  const { currentPath } = props;
  const { setNavigationData } = useNavigation();
  const buttonClick = (m_kodu: number) => {
    navigate("/table", { state: { m_kodu: m_kodu, bolumno: bolumNo } });
  };
  const onChangeTab = (e: any) => {
    const selectedTab = e.addedItems[0];
    if (selectedTab) {
      const selectedBolumTitle = selectedTab.title;
      const selectedBolumNo = bolumlar?.Data.find(
        (data) => data.bolum_adi === selectedBolumTitle
      )?.bolumno;
      if (selectedBolumNo) {
        setBolumNo(selectedBolumNo);
      }
    }
  };
  const calculateDate = (tarih: string) => {
    const date: any = new Date(tarih);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();
    const remainingMinutes = Math.floor(
      (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
    );
    const hoursDifference = Math.floor(timeDifference / (60 * 60 * 1000));

    return { hours: hoursDifference, minutes: remainingMinutes };
  };
  useEffect(() => {
    if (setNavigationData) {
      setNavigationData({ currentPath: currentPath });
    }
    const Tables$ = TableService.getAll({ bolumno: bolumNo });
    const Regions$ = RegionService.getAll();
    Promise.all([Tables$, Regions$]).then((results) => {
      setTables(results[0]);
      setBolumlar(results[1]);
    });
  }, [setNavigationData, currentPath, bolumNo]);
  return (
    <React.Fragment>
      <div className={"contant-header"}>
        <span className="header">Reagions</span>
      </div>

      <TabPanel onSelectionChanged={onChangeTab}>
        {bolumlar?.Data?.map((s) => {
          return (
            <Item title={s.bolum_adi} key={s.bolumno}>
              <div className="main-div">
                {tables?.Data?.map((t: Table) => (
                  <Button
                    key={t.masano}
                    aria-label={`Table ${t.m_kodu}`}
                    className="card"
                    onClick={() => buttonClick(t.m_kodu)}
                  >
                    <div className="card-content">
                      <div className="card-header">
                        <span>Table {t.m_kodu}</span>{" "}
                      </div>
                      <div className="">Total : {t.MasaTutar}</div>
                      <div className="card-footer">
                        <div>{`${calculateDate(t.m_tarih).hours} s ${
                          calculateDate(t.m_tarih).minutes
                        } dk`}</div>
                        <div> no : {t.fisno}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Item>
          );
        })}
      </TabPanel>
    </React.Fragment>
  );
}
