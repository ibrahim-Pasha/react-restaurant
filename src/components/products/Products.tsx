import { Category, Product } from "../../models";
import TabPanel, { Item } from "devextreme-react/tab-panel";

interface ProductsProps {
    filteredProducts?: Product[];
    categories?: Category[];
    grupKodu: string;
    onclickProduct?: (product: Product) => void;
    onChangeTab: () => void;
}

const Products: React.FC<ProductsProps> = ({
    filteredProducts,
    categories,
    grupKodu,
    onclickProduct,
    onChangeTab
}) => {
    const products = filteredProducts ?? [];
    const propCategories = categories ?? [];

    if (products.length > 0) {
        return (

            <div className="products">
                {products.map((product) => (
                    <button
                        className="card"
                        key={product.stokno}
                        onClick={() => onclickProduct?.(product)}
                    >
                        <span>{product.stok_adi_kisa}</span>
                        <span>₺ {product.satis_fiyat}</span>
                    </button>
                ))}
            </div>
        );
    } else {
        return (
            <div className="categories">
                <TabPanel
                    onSelectionChanged={onChangeTab}
                    selectedIndex={parseInt(grupKodu) - 1}
                >
                    {propCategories?.map((category) => (
                        <Item title={category.aciklama} key={category.refkodu}>
                            <div className="products">
                                {products.map((product) => (
                                    <button
                                        className="card"
                                        key={product.stokno}
                                        onClick={() => onclickProduct?.(product)}
                                    >
                                        <span>{product.stok_adi_kisa}</span>
                                        <span>₺ {product.satis_fiyat}</span>
                                    </button>
                                ))}
                            </div>
                        </Item>
                    ))}
                </TabPanel>
            </div>
        );
    }
};

export default Products;
