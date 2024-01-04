import React, { memo } from "react";
import { Category, Product } from "../../models";
import Products from "../products/products";
import TabPanel, { Item } from "devextreme-react/tab-panel";

const Stok: React.FC<CombinedProps> = memo(
  ({
    filtredProducts,
    onChangeTab,
    grupKodu,
    categories,
    products,
    onclickProduct,
  }) => {
    if (filtredProducts) {
      return (
        <Products
          filtredProducts={filtredProducts}
          onclickProduct={onclickProduct}
          products={products}
        />
      );
    } else
      return (
        <div className="categories">
          <TabPanel
            onSelectionChanged={onChangeTab}
            selectedIndex={parseInt(grupKodu) - 1}
          >
            {categories?.map((category, id) => (
              <Item title={category.aciklama} key={id}>
                <Products
                  filtredProducts={filtredProducts}
                  onclickProduct={onclickProduct}
                  products={products}
                />
              </Item>
            ))}
          </TabPanel>
        </div>
      );
  }
);
interface CategoriesProps {
  filtredProducts: Product[] | null;
  onChangeTab: (e: any) => void;
  grupKodu: string;
  categories: Category[];
}
interface ProductsProps {
  filtredProducts: Product[] | null;
  products: Product[];
  onclickProduct: (product: Product, openDetailPopup: boolean) => void;
}
interface CombinedProps extends CategoriesProps, ProductsProps {}
export default Stok;
