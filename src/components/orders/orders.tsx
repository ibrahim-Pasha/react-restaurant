import React, { memo } from "react";
import "./orders.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../../models";
import {
  faEllipsisVertical,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Orders: React.FC<OrdersProps> = memo(
  ({ product, onIncrement, onDecrement, onRemove, onOrderDet, ikram }) => {
    const description = () => {
      if (product.description) {
        return (
          <div>
            <span className="description">
              <b>Not: </b> {product.description}
            </span>
          </div>
        );
      }
    };
    const totalPrice = () => {
      if (ikram.get(product.id)) {
        return (
          <div className="selected-product-name">
            <s>₺ {product.count * product.product.satis_fiyat}</s>
          </div>
        );
      } else {
        return (
          <div className="selected-product-name">₺ {product.totalPrice}</div>
        );
      }
    };
    return (
      <div className="products-detales">
        <div className="product-det1">
          <div className="plus-minus">
            <button
              className="plus-minus-btn"
              onClick={() => onIncrement(product)}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size="sm"
                style={{ color: "#e32b2b" }}
              />
            </button>
            <span className="product-count">{product.count}</span>
            <button
              className="plus-minus-btn"
              onClick={() => onDecrement(product)}
            >
              <FontAwesomeIcon
                icon={faMinus}
                size="sm"
                style={{ color: "#e32b2b" }}
              />
            </button>
          </div>
          <div className="product-spans">
            <span className="selected-product-name">
              {product.product.stok_adi_kisa}
            </span>
            {product.property}
            {description()}
          </div>
        </div>

        <div className="product-det2">
          <div className="selected-product-name">{totalPrice()}</div>
          <div>
            <button
              className="bsket-arrow-btn"
              onClick={() => onRemove(product.id)}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                style={{ color: "#e32b2b" }}
              />
            </button>
          </div>
          <div>
            <button
              className="bsket-arrow-btn"
              onClick={() => onOrderDet(product)}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="lg"
                style={{ color: "#ec6341" }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
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
export default Orders;
