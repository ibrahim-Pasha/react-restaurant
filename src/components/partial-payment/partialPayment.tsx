import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../../models";
import "./partialPayment.scss";
import React, { useCallback, useEffect, useState } from "react";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

const PartialPayment: React.FC<partialPaymentprops> = ({
  totalPrice,
  basket,
}) => {
  const [paymnt, setpeyment] = useState(new Map<SelectedProduct, boolean>());
  const [enteredValue, setEnteredValue] = useState(totalPrice.toString());
  const [totalValue, setTotalValue] = useState(totalPrice);
  const [matList, setMatList] = useState<payList[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SelectedProduct[]>([]);
  const [payId, setPayId] = useState(0);
  const handleButtonClick = (value: number) => {
    if (totalPrice === totalValue) {
      setEnteredValue(value.toString());
      calculateTotal(value.toString());
    } else {
      setEnteredValue(enteredValue + value);
      calculateTotal(enteredValue + value);
    }
  };
  const handleDecimalButtonClick = () => {
    if (!enteredValue.includes(".")) {
      setEnteredValue(enteredValue + ".");
    }
  };
  const handleDeleteButtonClick = () => {
    if (totalPrice !== totalValue) {
      if (enteredValue.length === 1) {
        setEnteredValue(totalPrice.toString());
        calculateTotal(totalPrice.toString());
      } else {
        setEnteredValue(enteredValue.slice(0, -1));
        calculateTotal(enteredValue.slice(0, -1));
      }
    } else {
      setTotalValue(totalPrice);
      setEnteredValue(totalPrice.toString());
    }
  };
  const calculateTotal = useCallback((value: string) => {
    const enteredNumber = parseFloat(value);
    if (!isNaN(enteredNumber)) {
      setTotalValue(enteredNumber);
    }
  }, []);
  const handleSelectOrder = (order: SelectedProduct) => {
    if (paymnt.get(order)) {
      paymnt.delete(order);
      const clonedMap = new Map(paymnt);
      setpeyment(clonedMap);
      const allOrders = selectedOrders;
      const indexOfOrder = allOrders?.indexOf(order);
      if (indexOfOrder) {
        allOrders?.splice(indexOfOrder, 1);
        setSelectedOrders(allOrders);
      }
    } else {
      paymnt.set(order, true);
      const clonedMap = new Map(paymnt);
      setpeyment(clonedMap);
      const allOrders = selectedOrders;
      allOrders?.push(order);
      setSelectedOrders(allOrders);
    }
  };
  const onSelectPayType = (type: string) => {
    if (totalValue > 0) {
      setPayId(payId + 1);
      if (selectedOrders.length > 0) {
        console.log(selectedOrders);

        const price = selectedOrders
          .map((order) => order.totalPrice)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const selectedOrder: payList = {
          id: payId,
          selectedOrder: selectedOrders,
          type: type,
          price: price,
        };
        const allSelectedOrders = matList;
        allSelectedOrders.push(selectedOrder);
        setMatList(allSelectedOrders);
        setTotalValue((prevValue) => prevValue - price);
        setEnteredValue("");
      } else {
        const selectedOrder: payList = {
          id: payId,
          selectedOrder: selectedOrders,
          type: type,
          price: totalValue,
        };
        const allSelectedOrders = matList;
        allSelectedOrders.push(selectedOrder);
        setMatList(allSelectedOrders);

        const totalPriceToPay = allSelectedOrders
          .map((mat) => mat.price)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        setEnteredValue((totalPrice - totalPriceToPay).toString());
        calculateTotal((totalPrice - totalPriceToPay).toString());
      }
      setSelectedOrders([]);
    }
  };
  console.log(enteredValue, totalValue);

  const onRemovePay = (matId: number) => {
    const matToRemove = matList.find((mat) => mat.id === matId);
    if (matToRemove) {
      const indexOfMatToRemove = matList.indexOf(matToRemove);
      if (indexOfMatToRemove > -1) {
        const allMats = [...matList];
        allMats.splice(indexOfMatToRemove, 1);
        setMatList(allMats);
        console.log(matList);
      }
    }
  };
  console.log(matList);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key >= "0" && event.key <= "9") {
        setEnteredValue(enteredValue + event.key);
        calculateTotal(enteredValue + event.key);
      }
      console.log(event.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalPrice, calculateTotal, enteredValue]);
  return (
    <div className="pay-contant">
      <div className="select-product-topay">
        <div className="pay-headers">
          <b>Parçalı Öde</b>
        </div>
        <div className="div-btn">
          <button className="not-paid-btn">Ödenmemiş olanlar</button>
        </div>
        {basket.map((order, id) => {
          if (paymnt.get(order)) {
            return (
              <div
                key={id}
                className="selected-orders"
                onClick={() => handleSelectOrder(order)}
              >
                <div>
                  {order.count}- {order.product.stok_adi_kisa}
                </div>
                <div> ₺ {order.product.satis_fiyat * order.count}</div>
              </div>
            );
          } else {
            return (
              <div
                key={id}
                className="select-orders"
                onClick={() => handleSelectOrder(order)}
              >
                <div>
                  {order.count}- {order.product.stok_adi_kisa}
                </div>
                <div> ₺ {order.product.satis_fiyat * order.count}</div>
              </div>
            );
          }
        })}
      </div>
      <div className="enter-amount">
        <div className="pay-headers">
          <b>Toplam</b> <span>₺{totalPrice}</span>
        </div>
        <div>
          <div className="mat-list">
            {" "}
            <div className="selected-products">
              {matList.map((mat, id) => {
                return (
                  <div className="mat" key={id}>
                    <div>
                      <span>{mat.type}</span>
                    </div>
                    <div>
                      <span>₺ {mat.price}</span>
                      <button
                        className="spimle_icon"
                        onClick={() => onRemovePay(mat.id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="lg"
                          style={{ color: "#e32b2b" }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <span style={{ float: "right" }}>
                Ödenecek Tutar : {totalValue.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="key-pad">
            <div className="numeric-keypad">
              <div className="numeric-buttons">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => {
                  return (
                    <button
                      className="numeric-button"
                      key={number}
                      onClick={() => handleButtonClick(number)}
                    >
                      {number}
                    </button>
                  );
                })}
                <button
                  className="numeric-button"
                  onClick={handleDecimalButtonClick}
                >
                  <b>,</b>
                </button>
                <button
                  className="numeric-button"
                  onClick={() => handleButtonClick(0)}
                >
                  0
                </button>
                <button
                  className="numeric-button"
                  onClick={handleDeleteButtonClick}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="xl"
                    style={{ color: "#000000" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="select-pay-type">
        <div className="pay-headers">
          <b>Ödeme Tipleri</b>
        </div>

        <div className="select-pay-types">
          <div>
            {" "}
            <button
              className="pay-btn"
              onClick={() => onSelectPayType("nakit")}
            >
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/nakit.png"
                alt=""
              />{" "}
              <span>Nakit</span>
            </button>
          </div>
          <div>
            {" "}
            <button
              className="pay-btn"
              onClick={() => onSelectPayType("credicart")}
            >
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/creditcart.png"
                alt=""
              />{" "}
              <span>Kredi Kartı</span>
            </button>
          </div>
          <div>
            {" "}
            <button
              className="pay-btn"
              onClick={() => onSelectPayType("debit")}
            >
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/debit.png"
                alt=""
              />{" "}
              <span>Açık Hesap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface SelectedProduct {
  id: number;
  count: number;
  product: Product;
  description?: string;
  property?: string;
  totalPrice: number;
}

interface partialPaymentprops {
  totalPrice: number;
  basket: SelectedProduct[];
}
interface payList {
  selectedOrder?: SelectedProduct[];
  type: string;
  price: number;
  id: number;
}
export default PartialPayment;
