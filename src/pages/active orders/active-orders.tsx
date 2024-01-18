import React, { useEffect, useState } from "react";
import { useNavigation } from "../../contexts/navigation";
import { DataGrid, TabPanel } from "devextreme-react";
import { Button, Column, Pager, Paging } from "devextreme-react/data-grid";
import "./active-orders.scss";
import { ActiveOrdersSevice } from "../../services";
import { ActiveOrders } from "../../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Item } from "devextreme-react/tab-panel";

export default function (props: any) {
  const { setNavigationData } = useNavigation();
  const { currentPath } = props;
  const [activeOrders, setActiceOrders] = useState<ActiveOrders>();
  const buttonColumnRender = (data: any) => {
    const orderDate: Date = new Date(data.data.Baslik.sip_tarih);
    const currentDate = new Date();
    let isDeliverOrderButtonDisabled = true;
    if (orderDate) {
      const timeDifference = currentDate.getTime() - orderDate.getTime();
      if (timeDifference < 60000) {
        setTimeout(() => {
          isDeliverOrderButtonDisabled = false;
        }, timeDifference);
      } else isDeliverOrderButtonDisabled = false;
    }
    console.log(isDeliverOrderButtonDisabled);

    const durumTipi = data.data.Baslik.durum_tip;
    const orderParameters = {
      sMarket: data.data.Baslik.smarketno,
      sipId: data.data.Baslik.ettn_no,
    };
    if (durumTipi === 1) {
      return (
        <div>
          <button key="cancel" className="cancel-button">
            iptal et
          </button>
          <button
            key="accept"
            className="accept-button"
            onClick={() => sendOrderOut(orderParameters)}
          >
            Yola çıkar
          </button>
        </div>
      );
    } else if (durumTipi === 3) {
      return (
        <button
          key="deliver"
          className="accept-button"
          onClick={() => deliverOrder(orderParameters)}
          disabled={isDeliverOrderButtonDisabled}
        >
          Teslim et
        </button>
      );
    }
  };
  const updateOrders = () => {
    ActiveOrdersSevice.getAll().then((activeOrders: ActiveOrders) => {
      setActiceOrders(activeOrders);
    });
  };
  const sendOrderOut = (params: object) => {
    ActiveOrdersSevice.sendOrderOut(params).then(() => updateOrders());
  };
  const deliverOrder = (params: object) => {
    ActiveOrdersSevice.deliverOrder(params).then(() => updateOrders());
  };
  useEffect(() => {
    if (setNavigationData) {
      setNavigationData({ currentPath: currentPath });
    }
    updateOrders();
  }, [currentPath, setNavigationData]);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{"Siparişler"}</h2>
      <TabPanel>
        <Item title="Aktif Siparişler">
          <div>
            <DataGrid
              keyExpr="Musteri._id"
              showBorders
              rowAlternationEnabled
              showColumnLines
              dataSource={activeOrders?.Siparis}
              columnAutoWidth
            >
              <Column
                dataField={"Musteri._id"}
                visible={false}
                formItem={{ visible: false }}
              ></Column>
              <Column
                dataField={"Baslik.odeme_yontem_aciklama"}
                caption={"Platform"}
              ></Column>
              <Column dataField={"Musteri.adi"} caption={"Müşteri"}></Column>
              <Column dataField={"SiparisAdres.il"} caption={"Adres"}></Column>
              <Column
                dataField={"Baslik.toplam_tutar"}
                caption={"Tutar"}
                format="currency"
              ></Column>
              <Column
                dataField={"Baslik.sip_tarih"}
                caption={"Sipariş Tarihi"}
              ></Column>
              <Column
                dataField={"Baslik.sip_durum_aciklama"}
                caption={"Durum"}
              ></Column>
              <Column
                dataField={"Baslik.odeme_yontem_aciklama"}
                caption={"Ödeme Yöntemi"}
              ></Column>
              <Column
                dataField={"Baslik.odeme_yontem_aciklama"}
                caption={"Kurye"}
              ></Column>
              <Column
                type="buttons"
                caption="Durum"
                cellRender={buttonColumnRender}
                minWidth={250}
              ></Column>
              <Column type="buttons" caption={"İşlemler"} width={200}>
                <Button cssClass="process-button">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" /> Detay
                </Button>
                <Button cssClass="process-button">
                  <FontAwesomeIcon icon={faPrint} size="lg" /> Yazdır
                </Button>
              </Column>
              <Pager
                allowedPageSizes={[5, 10, 25, 50, 100]}
                showPageSizeSelector={true}
                visible
              />
              <Paging defaultPageSize={5} />
            </DataGrid>
          </div>
        </Item>
        <Item title="Hazır Siparişler">
          <div>
            <DataGrid
              keyExpr="Musteri._id"
              showBorders
              rowAlternationEnabled
              showColumnLines
              dataSource={activeOrders?.Siparis}
              columnAutoWidth
            >
              <Column
                dataField={"Musteri._id"}
                visible={false}
                formItem={{ visible: false }}
              ></Column>
              <Column dataField={"name"} caption={"Platform"}></Column>
              <Column dataField={"Musteri.adi"} caption={"Müşteri"}></Column>
              <Column dataField={"SiparisAdres.il"} caption={"Adres"}></Column>
              <Column dataField={"name"} caption={"Tutar"}></Column>
              <Column dataField={"name"} caption={"Sipariş Tarihi"}></Column>
              <Column dataField={"name"} caption={"Durum"}></Column>
              <Column dataField={"name"} caption={"Ödeme Yöntemi"}></Column>
              <Column dataField={"name"} caption={"Kurye"}></Column>
              <Column type="buttons" caption="Durum">
                <Button text="iptal et" cssClass="cancel-button" />
                <Button text="Kabul et" cssClass="accept-button" />
              </Column>
              <Column type="buttons" caption={"İşlemler"}>
                <Button cssClass="process-button">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" /> Detay
                </Button>
                <Button cssClass="process-button">
                  <FontAwesomeIcon icon={faPrint} size="lg" /> Yazdır
                </Button>
              </Column>
              <Pager
                allowedPageSizes={[5, 10, 25, 50, 100]}
                showPageSizeSelector={true}
                visible
              />
              <Paging defaultPageSize={5} />
            </DataGrid>
          </div>
        </Item>
      </TabPanel>
    </React.Fragment>
  );
}
