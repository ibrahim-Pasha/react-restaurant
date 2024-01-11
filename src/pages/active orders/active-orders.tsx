import React, { useEffect, useState } from "react";
import { useNavigation } from "../../contexts/navigation";
import { DataGrid } from "devextreme-react";
import { Column, Pager, Paging } from "devextreme-react/data-grid";
import "./active-orders.scss";
import { ActiveOrdersSevice } from "../../services";
import { ActiveOrders } from "../../models";
export default function (props: any) {
  const { setNavigationData } = useNavigation();
  const { currentPath } = props;
  const [activeOrders, setActiceOrders] = useState<ActiveOrders>();
  useEffect(() => {
    if (setNavigationData) {
      setNavigationData({ currentPath: currentPath });
    }
    ActiveOrdersSevice.getAll().then((activeOrders: ActiveOrders) => {
      setActiceOrders(activeOrders);
    });
  }, [currentPath, setNavigationData]);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{"Aktif Siparişler"}</h2>
      <div className={"content-block dx-card responsive-paddings"}>
        <DataGrid
          keyExpr="id"
          showBorders
          rowAlternationEnabled
          showColumnLines
          dataSource={[
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 3, name: "c" },
            { id: 4, name: "d" },
            { id: 5, name: "e" },
            { id: 6, name: "f" },
          ]}
        >
          <Column
            dataField={"id"}
            visible={false}
            formItem={{ visible: false }}
          ></Column>
          <Column dataField={"name"} caption={"Platform"}></Column>
          <Column dataField={"name"} caption={"Müşteri"}></Column>
          <Column dataField={"name"} caption={"Adres"}></Column>
          <Column dataField={"name"} caption={"Tutar"}></Column>
          <Column dataField={"name"} caption={"Sipariş Tarihi"}></Column>
          <Column dataField={"name"} caption={"Durum"}></Column>
          <Column dataField={"name"} caption={"Ödeme Yöntemi"}></Column>
          <Column dataField={"name"} caption={"Kurye"}></Column>
          <Column dataField={"name"} caption={"İşlemler"}></Column>
          <Pager
            allowedPageSizes={[5, 10, 25, 50, 100]}
            showPageSizeSelector={true}
            visible
          />
          <Paging defaultPageSize={5} />
        </DataGrid>
      </div>
    </React.Fragment>
  );
}
