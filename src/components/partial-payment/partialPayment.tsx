import { Product } from "../../models";
import "./partialPayment.scss";
import React, { useState } from "react";

const PartialPayment: React.FC<partialPaymentprops> = ({
  totalPrice,
  basket,
}) => {
  const [paymnt, setpeyment] = useState(new Map<SelectedProduct, boolean>());
  const [enteredValue, setEnteredValue] = useState(totalPrice.toString());
  const [totalValue, setTotalValue] = useState(totalPrice);

  const handleButtonClick = (value: number) => {
    console.log(totalValue, totalPrice);
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
      setEnteredValue(enteredValue.slice(0, -1));
      calculateTotal(enteredValue.slice(0, -1));
    }
  };

  const calculateTotal = (value: string) => {
    const enteredNumber = parseFloat(value);
    if (!isNaN(enteredNumber)) {
      setTotalValue(enteredNumber);
    } else {
      setTotalValue(totalPrice);
      setEnteredValue(totalPrice.toString());
    }
  };
  const handleSelectOrder = (order: SelectedProduct) => {
    if (paymnt.get(order)) {
      paymnt.set(order, false);
      const clonedMap = new Map(paymnt);
      setpeyment(clonedMap);
    } else {
      paymnt.set(order, true);
      const clonedMap = new Map(paymnt);

      setpeyment(clonedMap);
    }
  };
  return (
    <div className="pay-contant">
      <div className="select-product-topay">
        <div className="pay-headers">
          <b>Parçalı Öde</b>
        </div>
        <div className="div-btn">
          <button className="not-paid-btn">Ödenmemiş olanlar</button>
        </div>
        {basket.map((order) => {
          if (paymnt.get(order)) {
            console.log(paymnt.get(order));

            return (
              <div
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
            console.log(false);

            return (
              <div
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
          <div className="selected-products"></div>
          <span style={{ float: "right" }}>
            Ödenecek Tutar : {totalValue.toFixed(2)}
          </span>
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
                  DEL
                </button>
              </div>
              <div className="pad-keys">
                <button className="pad-key">
                  <b>,</b>
                </button>
                <button className="pad-key">0</button>
                <button className="pad-key">DEL</button>{" "}
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
            <button className="pay-btn">
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
            <button className="pay-btn">
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
            <button className="pay-btn">
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
}

interface partialPaymentprops {
  totalPrice: number;
  basket: SelectedProduct[];
}
export default PartialPayment;
