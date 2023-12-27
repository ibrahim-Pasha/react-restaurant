import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./masa.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUp,
  faBolt,
  faCalendar,
  faEllipsisVertical,
  faGift,
  faMinus,
  faNotesMedical,
  faPlus,
  faPrint,
  faTag,
  faTrash,
  faUser,
  faUserGroup,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from "../../contexts/navigation";
import { Category, Product, ReqData, StokExtraList } from "../../models";
import { Masa as masaModel } from "../../models";
import {
  CategoriesService,
  MasaService,
  ProductsService,
  SearchService,
  StokExtraListService,
} from "../../services";
import Popup, { Position, ToolbarItem } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import { Discount, PartialPayment } from "../../components";

export default function Masa(props: any) {
  const { setNavigationData } = useNavigation();
  const navigate = useNavigate();
  const { currentPath } = props;
  const [categories, setCategories] = useState<Category[]>();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsInBasket, setProductsInBasket] = useState<SelectedProduct[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [filtredProducts, setFiltredProducts] = useState<Product[] | null>(
    null
  );
  const location = useLocation();
  const m_kodu = location.state?.m_kodu;
  const bolumNo = location.state?.bolumno;
  const [tables, setTables] = useState<masaModel>();
  const [grupKodu, setGrupKodu] = useState("01");
  const productDetRef: any = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [selectedProductDet, setSelectedProductDet] =
    useState<SelectedProduct>();
  const [PayPopupTitle, setPayPopupTitle] = useState("");
  const payTypes = ["Öde", "Öde & Yazdır"];
  const fastPayPopupRef: any = useRef(null);
  const [stokExtraList, setStokExtraList] = useState<StokExtraList[]>([]);
  const [orderId, setOrderId] = useState(1);
  const payPopupRef: any = useRef(null);
  const discountPopupRef: any = useRef(null);
  const [discount, setDiscount] = useState<discountValue>({
    count: 0,
    type: "count",
  });
  const [ikram, setIkram] = useState(new Map<number, boolean>());

  const handlePopupClose = () => {
    productDetRef.current?.instance.hide();
    setSelectedProductDet(undefined);
  };

  const save = () => {
    navigate("/bolgeler", { state: { m_kodu: tables?.m_kodu } });
  };

  const calculateTotal = (value: SelectedProduct[]) => {
    const pricesInBasket = value.map((product) => product.totalPrice);
    setTotalPrice(
      pricesInBasket.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    );
  };

  const updateBasket = () => {
    const productInBasket = productsInBasket.find(
      (product) => product.id === selectedProductDet?.id
    );
    if (productInBasket && selectedProductDet) {
      productInBasket.count = selectedProductDet.count;
      productInBasket.description = selectedProductDet.description;
      productInBasket.product = selectedProductDet.product;
      productInBasket.property = selectedProductDet.property;
      productInBasket.totalPrice = selectedProductDet.totalPrice;
      const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
      setProductsInBasket(allProductsInBasket);
    } else {
      const id = orderId + 1;
      setOrderId(id);
      const selectedProduct = selectedProductDet;
      if (selectedProduct) {
        selectedProduct.id = orderId;
        const clickedProdcut: SelectedProduct = selectedProduct;
        if (productsInBasket && clickedProdcut) {
          const allProductsInBasket: SelectedProduct[] = [
            ...productsInBasket,
            clickedProdcut,
          ];
          setProductsInBasket(allProductsInBasket);
        }
      }
    }
  };
  const removeFromBasket = (id: number) => {
    const productInBasket = productsInBasket.find((p) => p.id === id);
    let indexOfProduct;
    const allProducts = [...productsInBasket];
    if (productInBasket) {
      indexOfProduct = productsInBasket.indexOf(productInBasket);
      if (indexOfProduct > -1) {
        console.log(allProducts.splice(indexOfProduct, 1));
        setProductsInBasket(allProducts);
      }
    }
  };

  const Search = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchText(value);
  };

  const onChangeTab = useCallback(
    (e: any) => {
      const selectedTab = e.addedItems[0];
      if (selectedTab) {
        const selectedBolumTitle = selectedTab.title;
        const selectedGrupKod = categories?.find(
          (data) => data.aciklama === selectedBolumTitle
        )?.refkodu;
        if (selectedGrupKod) {
          setGrupKodu(selectedGrupKod);
        }
      }
    },
    [categories]
  );
  const onclickProduct = (product: Product) => {
    if (product) {
      setSelectedProductDet({
        product: product,
        count: 1,
        description: "",
        property: undefined,
        id: orderId,
        totalPrice: product.satis_fiyat,
      });
      productDetRef.current?.instance.show();
    }
  };

  const changeOrderDet = async (product: SelectedProduct) => {
    setSelectedProductDet(product);
    productDetRef.current?.instance.show();
  };

  const incrementProductCount = (product: SelectedProduct) => {
    product.count++;
    product.totalPrice += product.product.satis_fiyat;
    const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
    setProductsInBasket(allProductsInBasket);
  };
  const decrementProductCount = (product: SelectedProduct) => {
    if (product.count > 1) {
      product.count--;
      product.totalPrice -= product.product.satis_fiyat;
      const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
      setProductsInBasket(allProductsInBasket);
    }
  };
  const fastPay = () => {
    fastPayPopupRef.current?.instance.show();
    setPayPopupTitle(`Hızlı Öde(₺ ${totalPrice})`);
  };
  const pay = () => {
    payPopupRef.current?.instance.show();
    setPayPopupTitle(`Masa Adı: Masa ${m_kodu}`);
  };
  const ikramet = (order: SelectedProduct, bool: boolean) => {
    const productInBasket = productsInBasket.find(
      (product) => product.id === selectedProductDet?.id
    );
    if (bool) {
      if (productInBasket) {
        productInBasket.totalPrice = 0;
        const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
        setProductsInBasket(allProductsInBasket);
      }
      setSelectedProductDet({ ...order, totalPrice: 0 });
    } else {
      if (productInBasket && selectedProductDet) {
        productInBasket.totalPrice =
          selectedProductDet.count * selectedProductDet.product.satis_fiyat;
        const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
        setProductsInBasket(allProductsInBasket);
      }
      setSelectedProductDet({
        ...order,
        totalPrice: order.count * order.product.satis_fiyat,
      });
    }
    ikram.set(order.id, bool);
    const clonedMap = new Map(ikram);
    setIkram(clonedMap);
  };

  const ProductDetPopupComponent = () => {
    const extraAd = stokExtraList?.map((stok) => stok.ekstra_adi);

    if (selectedProductDet) {
      const ikramButton = () => {
        console.log(ikram.get(selectedProductDet.id));

        if (ikram.get(selectedProductDet.id) === false) {
          return (
            <button
              className="ikram"
              onClick={() => ikramet(selectedProductDet, true)}
            >
              {" "}
              <FontAwesomeIcon icon={faGift} /> ikram et
            </button>
          );
        } else if (ikram.get(selectedProductDet.id) === true) {
          return (
            <button
              className="ikram"
              onClick={() => ikramet(selectedProductDet, false)}
            >
              {" "}
              <FontAwesomeIcon icon={faXmark} /> ikramı geri al
            </button>
          );
        } else return;
      };
      return (
        <Popup
          title={selectedProductDet.product.stok_adi_kisa}
          dragEnabled={false}
          hideOnOutsideClick={true}
          showCloseButton={true}
          showTitle={true}
          container=".dx-viewport"
          width={650}
          height={700}
          ref={productDetRef}
        >
          <Position at="center" my="center" collision="fit" />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={{
              text: "iptal",
              onClick: () => {
                handlePopupClose();
              },
            }}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={{
              text: "Kaydet",
              onClick: () => {
                updateBasket();
                if (ikram.get(selectedProductDet.id) === undefined) {
                  console.log(ikram.get(selectedProductDet.id));

                  ikramet(selectedProductDet, false);
                }
                handlePopupClose();
              },
            }}
          />
          <div className="popup-contant">
            <div className="popup-firstLi">
              <div className="plus-minus-popup">
                <button
                  className="plus-minus-btn"
                  onClick={() => {
                    const newProductDet = { ...selectedProductDet };
                    newProductDet.count++;
                    newProductDet.totalPrice =
                      (selectedProductDet.count + 1) *
                      selectedProductDet.product.satis_fiyat;
                    setSelectedProductDet(newProductDet);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="sm"
                    style={{ color: "#e32b2b" }}
                  />
                </button>
                <input
                  className="product-count-popup"
                  value={selectedProductDet.count}
                  type="number"
                  onChange={(e) => {
                    const newProductDet = { ...selectedProductDet };
                    newProductDet.count = parseInt(e.target.value);
                    newProductDet.totalPrice =
                      parseInt(e.target.value) *
                      selectedProductDet.product.satis_fiyat;
                    setSelectedProductDet(newProductDet);
                  }}
                ></input>
                <button
                  className="plus-minus-btn"
                  onClick={() => {
                    if (selectedProductDet.count > 1) {
                      const newProductDet = { ...selectedProductDet };

                      newProductDet.count--;
                      newProductDet.totalPrice =
                        (selectedProductDet.count - 1) *
                        selectedProductDet.product.satis_fiyat;
                      setSelectedProductDet(newProductDet);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMinus}
                    size="sm"
                    style={{ color: "#e32b2b" }}
                  />
                </button>
              </div>
              <div>
                <textarea
                  className="popup-textarea"
                  placeholder="Ürün Notu ..."
                  value={selectedProductDet.description}
                  onChange={async (e) => {
                    const newProductDet = { ...selectedProductDet };
                    newProductDet.description = e.target.value;
                    setSelectedProductDet(newProductDet);
                  }}
                ></textarea>
              </div>
            </div>
            <div>
              <div className="popup-secondLine">
                <span>Özellikler</span>
                <SelectBox
                  placeholder="seç"
                  dataSource={extraAd}
                  value={
                    selectedProductDet.property
                      ? selectedProductDet.property
                      : null
                  }
                  noDataText="seçecek veri yok"
                  onSelectionChanged={(e) => {
                    console.log(selectedProductDet.property ?? null);
                    const newProductDet = { ...selectedProductDet };
                    newProductDet.property = e.selectedItem ?? null;
                    setSelectedProductDet(newProductDet);
                  }}
                />
              </div>
            </div>
            <div>{ikramButton()}</div>
          </div>
        </Popup>
      );
    }
  };
  const FastPayPopup = () => {
    return (
      <Popup
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={true}
        showTitle={true}
        container=".dx-viewport"
        width={650}
        height={310}
        title={PayPopupTitle}
        ref={fastPayPopupRef}
      >
        <Position at="center" my="center" collision="fit" />
        <div>
          <span>işlem tipi seç</span>
          <SelectBox
            className="pay-selector"
            defaultValue={"Öde"}
            dataSource={payTypes}
          ></SelectBox>
        </div>
        <div className="pay-types">
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
      </Popup>
    );
  };
  const payPopup = () => {
    return (
      <Popup
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={true}
        showTitle={true}
        container=".dx-viewport"
        width={1400}
        height={700}
        title={PayPopupTitle}
        ref={payPopupRef}
      >
        <Position at="center" my="center" collision="fit" />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={{
            text: "Öde",
            icon: "save",
            onClick: () => {},
          }}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={{
            text: "Öde ve yazdır",
            icon: "print",
            onClick: () => {},
          }}
        />
        <PartialPayment totalPrice={totalPrice} basket={productsInBasket} />
      </Popup>
    );
  };
  const handleDiscountButton = () => {
    if (productsInBasket.length > 0) discountPopupRef.current?.instance.show();
  };
  const handleDiscountValue = useCallback(
    (value: discountValue) => {
      if (value) {
        setDiscount(value);
      }
    },
    [setDiscount]
  );
  const discountPopup = () => {
    return (
      <Popup
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={true}
        container=".dx-viewport"
        width={400}
        height={550}
        ref={discountPopupRef}
        onHidden={() => {
          setDiscount({ count: 0, type: "count" });
        }}
      >
        <Position at="center" my="center" collision="fit" />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={{
            text: "Uygula",
            icon: "save",
            onClick: () => {
              if (discount?.type === "count") {
                setTotalPrice((prevState) =>
                  parseFloat((prevState - discount.count).toFixed(2))
                );
              } else if (discount?.type === "percent") {
                setTotalPrice((prevState) =>
                  parseFloat(
                    (prevState - (prevState * discount.count) / 100).toFixed(2)
                  )
                );
              }
              discountPopupRef.current?.instance.hide();
            },
          }}
        />
        <Discount discount={handleDiscountValue} />
      </Popup>
    );
  };

  useEffect(() => {
    if (setNavigationData) {
      setNavigationData({ currentPath: currentPath });
    }
    calculateTotal(productsInBasket);
    if (m_kodu == null) {
      navigate("/bolgeler");
    }
    const Masalar$ = MasaService.getAll({ bolumno: bolumNo });
    const Categories$ = CategoriesService.getAll();
    const Products$ = ProductsService.getAll({ grupKodu: grupKodu });
    const Serched$ = SearchService.getAll({ searchText: searchText });
    let stokExtraList$ = Promise.resolve({} as ReqData);
    if (selectedProductDet?.product.stokno) {
      stokExtraList$ = StokExtraListService.getAll({
        stokno: selectedProductDet?.product.stokno,
      });
    }
    Promise.all([
      Masalar$,
      Categories$,
      Products$,
      Serched$,
      stokExtraList$,
    ]).then((results) => {
      const masa = results[0].Data.find(
        (masa: masaModel) => masa.m_kodu === m_kodu
      );
      const categories = results[1].Data;
      const Products = results[2].Data;
      const filteredProducts = results[3].Data;
      const stokExtraList = results[4]?.Data;
      setTables(masa);
      setCategories(categories);
      setProducts(Products);
      setStokExtraList(stokExtraList);
      if (searchText === "") {
        setFiltredProducts(null);
      } else setFiltredProducts(filteredProducts);
    });
  }, [
    currentPath,
    setNavigationData,
    productsInBasket,
    bolumNo,
    m_kodu,
    navigate,
    grupKodu,
    searchText,
    selectedProductDet?.product.stokno,
  ]);

  return (
    <React.Fragment>
      {ProductDetPopupComponent()}
      {FastPayPopup()}
      {payPopup()}
      {discountPopup()}
      <div className="all-contant">
        <div className="header">
          <i className="fa-solid fa-arrow-left"></i>
          <button onClick={() => navigate("/bolgeler")} className="main-button">
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="xl"
              style={{ color: "#ffffff" }}
            />
          </button>
          <input
            className="tableName"
            readOnly
            defaultValue={tables && `Masa ${tables?.m_kodu}`}
          ></input>
          <button className="main-button">
            <FontAwesomeIcon size="xl" icon={faNotesMedical} />
          </button>
          <button className="main-button">
            <FontAwesomeIcon size="xl" icon={faUser} />
          </button>
          <button className="main-button">
            <FontAwesomeIcon
              size="xl"
              icon={faPrint}
              style={{ color: "#ffffff" }}
            />
          </button>
          <input
            className="ara"
            onChange={Search}
            placeholder="Ürün Adı veya Barkod ile Arama"
          ></input>
          <button className="main-button">
            <FontAwesomeIcon size="xl" icon={faUserGroup} />
          </button>
          <button className="main-button">
            <FontAwesomeIcon size="xl" icon={faCalendar} />
          </button>
        </div>
        <div className="contant">
          <div className="basket">
            <div>
              <div className="basket-header">
                <span>Adisyon:0</span>
                <span>Sipariş Durumu: Hazırlanıyor</span>
              </div>
              <div className="slected-products">
                <div className="basket-container">
                  {productsInBasket.map((product) => (
                    <Basket
                      key={product.product.grup_koduS}
                      product={product}
                      onIncrement={() => incrementProductCount(product)}
                      onDecrement={() => decrementProductCount(product)}
                      onRemove={() => removeFromBasket(product.id)}
                      onOrderDet={() => changeOrderDet(product)}
                      ikram={ikram}
                    />
                  ))}
                </div>
              </div>
            </div>
            <BasketFooter
              totalPrice={totalPrice}
              productsInBasket={productsInBasket}
              fastPay={() => fastPay()}
              pay={() => pay()}
              save={() => save()}
              handleDiscountButton={() => handleDiscountButton()}
            />
          </div>
          <div className="cat-pro">
            <Categories
              categories={categories ?? []}
              filtredProducts={filtredProducts}
              grupKodu={grupKodu}
              onChangeTab={onChangeTab}
              onclickProduct={onclickProduct}
              products={products}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
interface SelectedProduct {
  id: number;
  count: number;
  product: Product;
  description?: string;
  property?: string;
  totalPrice: number;
}
interface BasketProps {
  product: SelectedProduct;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onOrderDet: () => void;
  ikram: any;
}
interface BasketFooterProps {
  totalPrice: number;
  productsInBasket: SelectedProduct[];
  fastPay: () => void;
  save: () => void;
  pay: () => void;
  handleDiscountButton: () => void;
}
interface discountValue {
  count: number;
  type: string;
}
interface CategoriesProps {
  filtredProducts: Product[] | null;
  onChangeTab: (e: any) => void;
  grupKodu: string;
  categories: Category[];
}
interface ProductsProps {
  filtredProducts: Product[] | null;
  products: Product[];
  onclickProduct: (product: Product) => void;
}
interface CombinedProps extends CategoriesProps, ProductsProps {}
const Basket: React.FC<BasketProps> = memo(
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
    console.log(ikram.get(product.id));

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
      <div className="products-detales" key={product.id}>
        <div className="product-det1">
          <div className="plus-minus">
            <button className="plus-minus-btn" onClick={onIncrement}>
              <FontAwesomeIcon
                icon={faPlus}
                size="sm"
                style={{ color: "#e32b2b" }}
              />
            </button>
            <span className="product-count">{product.count}</span>
            <button className="plus-minus-btn" onClick={onDecrement}>
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
          <div className="selected-product-name">
            {/* ₺ {product.totalPrice} */}
            {totalPrice()}
          </div>
          <div>
            <button className="bsket-arrow-btn" onClick={onRemove}>
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                style={{ color: "#e32b2b" }}
              />
            </button>
          </div>
          <div>
            <button className="bsket-arrow-btn" onClick={() => onOrderDet()}>
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
const BasketFooter: React.FC<BasketFooterProps> = ({
  totalPrice,
  productsInBasket,
  fastPay,
  save,
  pay,
  handleDiscountButton,
}) => {
  return (
    <div className="basket-footer">
      <button className="bsket-arrow-btn">
        <FontAwesomeIcon
          icon={faArrowUp}
          size="xl"
          style={{ color: "#e32b2b" }}
        />
      </button>
      <div className="tutar">
        <span>Toplam Tutar</span>
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
              Öde ₺{totalPrice}
            </button>

            <button className="fast-pay-button" onClick={() => fastPay()}>
              <FontAwesomeIcon
                icon={faBolt}
                size="lg"
                style={{ color: "#e7eb00" }}
              />{" "}
              Hızlı Öde{" "}
            </button>
          </div>
        ) : null}
        <button className="save-btn" onClick={() => save()}>
          Kaydet
        </button>
      </div>
    </div>
  );
};
const Categories: React.FC<CombinedProps> = memo(
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
            {categories?.map((category) => (
              <Item title={category.aciklama} key={category.refkodu}>
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
const Products: React.FC<ProductsProps> = ({
  filtredProducts,
  products,
  onclickProduct,
}) => {
  if (filtredProducts) {
    return (
      <div className="products">
        {filtredProducts.map((product) => (
          <button className="card" onClick={() => onclickProduct(product)}>
            <span>{product.stok_adi_kisa}</span>
            <span>₺ {product.satis_fiyat}</span>
          </button>
        ))}
      </div>
    );
  } else {
    return (
      <div className="products">
        {products.map((product) => (
          <button
            className="card"
            key={product.stokno}
            onClick={() => onclickProduct(product)}
          >
            <span>{product.stok_adi_kisa}</span>
            <span>₺ {product.satis_fiyat}</span>
          </button>
        ))}
      </div>
    );
  }
};
