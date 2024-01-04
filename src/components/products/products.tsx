import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../../models";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const Products: React.FC<ProductsProps> = ({
  filtredProducts,
  products,
  onclickProduct,
}) => {
  if (filtredProducts) {
    return (
      <div className="products">
        {filtredProducts.map((product, id) => (
          <div className="table-card">
            <button
              className="table-card-button"
              key={id}
              onClick={() => onclickProduct(product, false)}
            >
              <span>{product.stok_adi_kisa}</span>
              <span>₺ {product.satis_fiyat}</span>
            </button>
            <button
              className="table-card-button-det"
              onClick={() => onclickProduct(product, true)}
            >
              {" "}
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="lg"
                style={{ color: "#ec6341" }}
              />
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="products">
        {products.map((product, id) => (
          <div className="table-card">
            <button
              className="table-card-button"
              key={id}
              onClick={() => onclickProduct(product, false)}
            >
              <span>{product.stok_adi_kisa}</span>
              <span>₺ {product.satis_fiyat}</span>
            </button>
            <button
              className="table-card-button-det"
              onClick={() => onclickProduct(product, true)}
            >
              {" "}
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="lg"
                style={{ color: "#ec6341" }}
              />
            </button>
          </div>
        ))}
      </div>
    );
  }
};
interface ProductsProps {
  filtredProducts: Product[] | null;
  products: Product[];
  onclickProduct: (product: Product, openDetailPopup: boolean) => void;
}
export default Products;
