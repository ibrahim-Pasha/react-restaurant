import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./masa.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGift,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  Basket,
  Discount,
  PartialPayment,
  Stok,
  TableHeader,
} from "../../components";

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
  const productDescriptionRef: any = useRef(null);
  const location = useLocation();
  const m_kodu = location.state?.m_kodu;
  const bolumNo = location.state?.bolumno;
  const [tables, setTables] = useState<masaModel>();
  const [grupKodu, setGrupKodu] = useState("01");
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
  const [productPopupDetailVisible, setProductPopupDetailVisible] =
    useState(false);
  const handleproductPopupDetailVisible = (isVisible: boolean) => {
    setProductPopupDetailVisible(isVisible);
  };
  const onSaveButton = () => {
    navigate("/bolgeler", { state: { m_kodu: tables?.m_kodu } });
  };
  const calculateTotal = useCallback((value: SelectedProduct[]) => {
    const pricesInBasket = value.map((product) => product.totalPrice);
    setTotalPrice(
      pricesInBasket.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    );
  }, []);
  const updateBasket = (selectedProduct: SelectedProduct) => {
    const productInBasket = productsInBasket.find(
      (product) => product.id === selectedProduct?.id
    );
    if (productInBasket && selectedProduct) {
      productInBasket.count = selectedProduct.count;
      productInBasket.description = selectedProduct.description;
      productInBasket.product = selectedProduct.product;
      productInBasket.property = selectedProduct.property;
      productInBasket.totalPrice = selectedProduct.totalPrice;
      const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
      setProductsInBasket(allProductsInBasket);
    } else {
      const id = orderId + 1;
      setOrderId(id);
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
    if (productInBasket) {
      const allProducts = [...productsInBasket];
      const indexOfProduct = productsInBasket.indexOf(productInBasket);
      if (indexOfProduct > -1) {
        allProducts.splice(indexOfProduct, 1);
        setProductsInBasket(allProducts);
      }
    }
  };
  const search = (event: ChangeEvent<HTMLInputElement>) => {
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
  const onclickProduct = (product: Product, openDetailPopup: boolean) => {
    setOrderId(orderId + 1);
    const selectedProduct: SelectedProduct = {
      product: product,
      count: 1,
      id: orderId,
      totalPrice: product.satis_fiyat,
      description: "",
      property: undefined,
    };
    setSelectedProductDet(selectedProduct);

    if (openDetailPopup) {
      handleproductPopupDetailVisible(true);
    } else {
      if (ikram.get(selectedProduct.id) === undefined) {
        ikramet(selectedProduct, false);
      }
      updateBasket(selectedProduct);
    }
  };
  const changeOrderDet = (product: SelectedProduct) => {
    setSelectedProductDet(product);
    handleproductPopupDetailVisible(true);
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
        if (ikram.get(selectedProductDet.id) === false) {
          return (
            <button
              className="ikram"
              onClick={() => ikramet(selectedProductDet, true)}
            >
              <FontAwesomeIcon icon={faGift} /> ikram et
            </button>
          );
        } else if (ikram.get(selectedProductDet.id) === true) {
          return (
            <button
              className="ikram"
              onClick={() => ikramet(selectedProductDet, false)}
            >
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
          visible={productPopupDetailVisible}
          onHidden={() => {
            setSelectedProductDet(undefined);
            handleproductPopupDetailVisible(false);
          }}
        >
          <Position at="center" my="center" collision="fit" />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={{
              text: "iptal",
              onClick: () => {
                handleproductPopupDetailVisible(false);
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
                if (ikram.get(selectedProductDet.id) === undefined) {
                  ikramet(selectedProductDet, false);
                }
                const newProductDet = { ...selectedProductDet };
                newProductDet.description = productDescriptionRef.current.value;
                updateBasket(newProductDet);
                handleproductPopupDetailVisible(false);
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
                  defaultValue={selectedProductDet?.description ?? ""}
                  ref={productDescriptionRef}
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
            <button className="pay-btn">
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/nakit.png"
                alt=""
              />
              <span>Nakit</span>
            </button>
          </div>
          <div>
            <button className="pay-btn">
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/creditcart.png"
                alt=""
              />
              <span>Kredi Kartı</span>
            </button>
          </div>
          <div>
            <button className="pay-btn">
              <img
                className="pay-img"
                src="https://cdn.adisyo.com/paymenttypes/debit.png"
                alt=""
              />
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
    calculateTotal,
  ]);

  return (
    <React.Fragment>
      {ProductDetPopupComponent()}
      {FastPayPopup()}
      {payPopup()}
      {discountPopup()}
      <div className="all-contant">
        <TableHeader tables={tables} search={search} />
        <div className="contant">
          <div className="basket">
            <Basket
              totalPrice={totalPrice}
              productsInBasket={productsInBasket}
              fastPay={() => fastPay()}
              pay={() => pay()}
              save={() => onSaveButton()}
              handleDiscountButton={() => handleDiscountButton()}
              onIncrement={(product: SelectedProduct) =>
                incrementProductCount(product)
              }
              onDecrement={(product: SelectedProduct) =>
                decrementProductCount(product)
              }
              onRemove={(productId: number) => removeFromBasket(productId)}
              onOrderDet={(product: SelectedProduct) => changeOrderDet(product)}
              ikram={ikram}
            />
          </div>
          <div className="stok">
            <Stok
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
interface discountValue {
  count: number;
  type: string;
}
