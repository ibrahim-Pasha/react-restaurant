import React from "react";
import "./basket.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../../models";
import { faArrowUp, faBolt, faTag } from "@fortawesome/free-solid-svg-icons";
import Orders from "../orders/orders";

const Basket: React.FC<BasketProps> = ({
  totalPrice,
  fastPay,
  save,
  pay,
  handleDiscountButton,
  productsInBasket,
  onIncrement,
  ikram,
  onDecrement,
  onOrderDet,
  onRemove,
}) => {
  return (
    <div className="basket-contant">
      <div>
        <div className="basket-header">
          <span>Adisyon:0</span>
          <span>Sipariş Durumu: Hazırlanıyor</span>
        </div>
        <div className="slected-products">
          <div className="basket-container">
            {productsInBasket.map((product) => (
              <Orders
                key={product.id}
                product={product}
                onIncrement={() => onIncrement(product)}
                onDecrement={() => onDecrement(product)}
                onRemove={() => onRemove(product.id)}
                onOrderDet={() => onOrderDet(product)}
                ikram={ikram}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="basket-footer">
        <button className="bsket-arrow-btn">
          <FontAwesomeIcon
            icon={faArrowUp}
            size="xl"
            style={{ color: "#e32b2b" }}
          />
        </button>
        <div className="tutar">
          <span>Total</span>
          <span>₺{totalPrice}</span>
        </div>
        <div className="basket-buttons">
          <button className="tag-btn" onClick={() => handleDiscountButton()}>
            <FontAwesomeIcon
              icon={faTag}
              size="xl"
              style={{ color: "#e32b2b" }}
            />
          </button>
          {totalPrice > 0 ? (
            <div className="pay-buttons">
              <button className="pay-button" onClick={() => pay()}>
                Pay ₺{totalPrice}
              </button>

              <button className="fast-pay-button" onClick={() => fastPay()}>
                <FontAwesomeIcon
                  icon={faBolt}
                  size="lg"
                  style={{ color: "#e7eb00" }}
                />{" "}
                Fast Pay{" "}
              </button>
            </div>
          ) : null}
          <button className="save-btn" onClick={() => save()}>
            Save
          </button>
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
interface OrdersProps {
  product: SelectedProduct;
  onIncrement: (product: SelectedProduct) => void;
  onDecrement: (product: SelectedProduct) => void;
  onRemove: (productId: number) => void;
  onOrderDet: (product: SelectedProduct) => void;
  ikram: any;
}
interface BasketProps extends Omit<OrdersProps, "product"> {
  totalPrice: number;
  productsInBasket: SelectedProduct[];
  fastPay: () => void;
  save: () => void;
  pay: () => void;
  handleDiscountButton: () => void;
}
export default Basket;
