import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './masa.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faBolt, faCalendar, faEllipsisVertical, faMinus, faNotesMedical, faPlus, faPrint, faTag, faTrash, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from '../../contexts/navigation';
import { Category, Product, ReqData, StokExtraList } from '../../models';
import { Masa as masaModel } from '../../models';
import { CategoriesService, MasaService, ProductsService, SearchService, StokExtraListService } from '../../services';
import Popup, { Position, ToolbarItem } from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';

export default function Masa(props: any) {
    const { setNavigationData } = useNavigation();
    const navigate = useNavigate()
    const { currentPath } = props;
    const [categories, setCategories] = useState<Category[]>()
    const [products, setProducts] = useState<Product[]>([])
    const [productsInBasket, setProductsInBasket] = useState<SelectedProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [filtredProducts, setFiltredProducts] = useState<Product[] | null>(null)
    const location = useLocation();
    const m_kodu = location.state?.m_kodu;
    const bolumNo = location.state?.bolumno
    const [tables, setTables] = useState<masaModel>();
    const [grupKodu, setGrupKodu] = useState("01")
    const productDetRef: any = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [selectedProductDet, setSelectedProductDet] = useState<SelectedProduct>()
    const [fastPayTitle, setFastPayTitle] = useState('')
    const payTypes = ['Öde', 'Öde & Yazdır']
    const fastPayRef: any = useRef(null)
    const [stokExtraList, setStokExtraList] = useState<StokExtraList[]>([])
    const [orderId, setOrderId] = useState(1)
    const handlePopupClose = () => {
        productDetRef.current?.instance.hide()
        setSelectedProductDet(undefined)
    };
    const save = () => {
        navigate('/bolgeler', { state: { m_kodu: tables?.m_kodu } })
    }
    const calculateTotal = (value: SelectedProduct[]) => {
        const pricesInBasket = value.map((product) => (product.count) * product.product.satis_fiyat)
        setTotalPrice(pricesInBasket.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
    }
    const updateBasket = () => {
        const productInBasket = productsInBasket.find((product) => product.id === selectedProductDet?.id)
        if (productInBasket && selectedProductDet) {
            productInBasket.count = selectedProductDet.count
            productInBasket.description = selectedProductDet.description
            productInBasket.product = selectedProductDet.product
            productInBasket.property = selectedProductDet.property
            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
            setProductsInBasket(allProductsInBasket);
        }
        else {
            const id = orderId + 1
            setOrderId(id)
            const selectedProduct = selectedProductDet;
            if (selectedProduct) {
                selectedProduct.id = orderId
                const clickedProdcut: SelectedProduct = selectedProduct
                if (productsInBasket && clickedProdcut) {
                    const allProductsInBasket: SelectedProduct[] = [

                        ...productsInBasket,
                        clickedProdcut
                    ];
                    setProductsInBasket(allProductsInBasket);
                }
            }
        }
    }
    const removeFromBasket = (id: number) => {
        const productInBasket = productsInBasket.find((p) => parseInt(p.product.grup_koduS) === id);
        let indexOfProduct;
        const allProducts = [...productsInBasket];
        if (productInBasket) {
            indexOfProduct = productsInBasket.indexOf(productInBasket)
            if (indexOfProduct > -1) {
                allProducts.splice(indexOfProduct, 1);
                setProductsInBasket(allProducts)
            }
        }
    }
    const Search = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value
        setSearchText(value)
    };
    const onChangeTab = (e: any) => {
        const selectedTab = e.addedItems[0];
        if (selectedTab) {
            const selectedBolumTitle = selectedTab.title;
            const selectedGrupKod = categories?.find((data) => data.aciklama === selectedBolumTitle)?.refkodu
            if (selectedGrupKod) { setGrupKodu(selectedGrupKod) }
        }
    }
    const onclickProduct = async (product: Product) => {
        if (product) {
            await setSelectedProductDet({ product: product, count: 1, description: '', property: undefined, id: orderId })
            productDetRef.current?.instance.show();
        }
    }
    const changeOrderDet = async (product: SelectedProduct) => {
        await setSelectedProductDet(product);
        productDetRef.current?.instance.show();
    }
    const returnProducts = () => {
        if (filtredProducts) {
            return (
                <div className='products'>
                    {filtredProducts.map(product => (

                        <button className='card' onClick={() => onclickProduct(product)}>

                            <span>{product.stok_adi_kisa}</span>
                            <span>₺ {product.satis_fiyat}</span>
                        </button>
                    ))}
                </div>
            )
        }
        else
            return (
                <div className='categories'>
                    <TabPanel
                        onSelectionChanged={onChangeTab}
                        selectedIndex={parseInt(grupKodu) - 1}>
                        {categories?.map((category) => (
                            <Item title={category.aciklama} key={category.refkodu}>
                                <div className='products'>
                                    {products.map((product) => (
                                        <button className='card' key={product.stokno} onClick={() => onclickProduct(product)}>
                                            <span>{product.stok_adi_kisa}</span>
                                            <span>₺ {product.satis_fiyat}</span>
                                        </button>
                                    ))}
                                </div>
                            </Item>
                        ))}
                    </TabPanel>
                </div>
            )
    }
    const incrementProductCount = (product: SelectedProduct) => {
        product.count++;
        const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
        setProductsInBasket(allProductsInBasket);
    }
    const decrementProductCount = (product: SelectedProduct) => {
        if (product.count > 1)
            product.count--;
        const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
        setProductsInBasket(allProductsInBasket);
    }
    const fastPay = () => {
        fastPayRef.current?.instance.show();
        setFastPayTitle(`Hızlı Öde(₺ ${totalPrice})`)
    }
    const pay = () => {

    }
    const ProductDetPopupComponent = () => {
        const extraAd = stokExtraList?.map((stok) => stok.ekstra_adi)
        if (selectedProductDet)
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
                    ref={productDetRef}>
                    <Position at="center" my="center" collision="fit" />
                    <ToolbarItem
                        widget="dxButton"
                        toolbar="bottom"
                        location="after"
                        options={{
                            text: 'iptal',
                            onClick: () => {
                                handlePopupClose()
                            }
                        }}
                    />
                    <ToolbarItem
                        widget="dxButton"
                        toolbar="bottom"
                        location="after"
                        options={{
                            text: 'Kaydet',
                            onClick: () => {
                                updateBasket()
                                handlePopupClose()
                            }
                        }}
                    />
                    <div className='popup-contant'>
                        <div className='popup-firstLi'>
                            <div className='plus-minus-popup'>
                                <button className='plus-minus-btn' onClick={() => {
                                    const newProductDet = { ...selectedProductDet }
                                    newProductDet.count++;
                                    setSelectedProductDet(newProductDet);
                                }} ><FontAwesomeIcon icon={faPlus} size="sm" style={{ color: "#e32b2b", }} /></button>
                                <input className='product-count-popup' value={selectedProductDet.count} type='number' onChange={async (e) => {
                                    const newProductDet = { ...selectedProductDet }
                                    newProductDet.count = parseInt(e.target.value);
                                    await setSelectedProductDet(newProductDet);
                                }}></input>
                                <button className='plus-minus-btn' onClick={async () => {
                                    if (selectedProductDet.count > 1) {
                                        const newProductDet = { ...selectedProductDet }

                                        newProductDet.count--;
                                        await setSelectedProductDet(newProductDet);
                                    }
                                }}><FontAwesomeIcon icon={faMinus} size="sm" style={{ color: "#e32b2b", }} /></button>
                            </div>
                            <div>
                                <textarea className='popup-textarea' placeholder='Ürün Notu ...' value={selectedProductDet.description} onChange={
                                    async (e) => {
                                        const newProductDet = { ...selectedProductDet }
                                        newProductDet.description = e.target.value
                                        setSelectedProductDet(newProductDet)
                                    }
                                } ></textarea>
                            </div>
                        </div>
                        <div>
                            <div className='popup-secondLine'>
                                <span>Özellikler</span>
                                <SelectBox placeholder='seç' dataSource={extraAd} value={selectedProductDet.property ? selectedProductDet.property : ''} noDataText='seçecek veri yok' onSelectionChanged={(e) => {
                                    console.log(selectedProductDet.property ?? null);

                                    const newProductDet = { ...selectedProductDet }
                                    newProductDet.property = e.selectedItem;
                                    setSelectedProductDet(newProductDet)

                                }
                                } />
                            </div>
                        </div>
                    </div>
                </Popup>
            )
    }
    const FastPayPopup = () => {
        return (
            <Popup dragEnabled={false}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                container=".dx-viewport"
                width={650}
                height={310}
                title={fastPayTitle}
                ref={fastPayRef}>
                <Position at="center" my="center" collision="fit" />
                <div>
                    <span>işlem tipi seç</span>
                    <SelectBox className='pay-selector' defaultValue={'Öde'} dataSource={payTypes}></SelectBox>
                </div>
                <div className='pay-types'>
                    <div> <button className='pay-btn'><img className='pay-img' src="https://cdn.adisyo.com/paymenttypes/nakit.png" alt="" /> <span>Nakit</span></button></div>
                    <div> <button className='pay-btn'><img className='pay-img' src="https://cdn.adisyo.com/paymenttypes/creditcart.png" alt="" /> <span>Kredi Kartı</span></button></div>
                    <div> <button className='pay-btn'><img className='pay-img' src="https://cdn.adisyo.com/paymenttypes/debit.png" alt="" /> <span>Açık Hesap</span></button></div>
                </div>
            </Popup>
        )
    }

    useEffect(() => {
        if (setNavigationData) {
            setNavigationData({ currentPath: currentPath });
        }
        calculateTotal(productsInBasket)
        if (m_kodu == null) {
            navigate('/bolgeler')
        }
        const Masalar$ = MasaService.getAll(
            { bolumno: bolumNo }
        );
        const Categories$ = CategoriesService.getAll()
        const Products$ = ProductsService.getAll({ grupKodu: grupKodu })
        const Serched$ = SearchService.getAll({ searchText: searchText })
        let stokExtraList$ = Promise.resolve({} as ReqData)
        if (selectedProductDet?.product.stokno) {
            stokExtraList$ = StokExtraListService.getAll({ stokno: selectedProductDet?.product.stokno })

        }
        Promise.all([Masalar$, Categories$, Products$, Serched$, stokExtraList$]).then((results) => {
            const masa = results[0].Data.find((masa: masaModel) => masa.m_kodu === m_kodu)
            const categories = results[1].Data
            const Products = results[2].Data
            const filteredProducts = results[3].Data
            const stokExtraList = results[4]?.Data
            setTables(masa);
            setCategories(categories)
            setProducts(Products)
            setStokExtraList(stokExtraList)
            if (searchText === '') { setFiltredProducts(null) }
            else setFiltredProducts(filteredProducts)
        })

    }, [currentPath, setNavigationData, productsInBasket, bolumNo, m_kodu, navigate, grupKodu, searchText, selectedProductDet?.product.stokno])

    return (
        <React.Fragment>
            {ProductDetPopupComponent()}
            {FastPayPopup()}
            <div className='all-contant'>
                <div className='header'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <button
                        onClick={() => navigate('/bolgeler')}
                        className='main-button'>
                        <FontAwesomeIcon icon={faArrowLeft} size='xl' style={{ color: "#ffffff", }} />
                    </button>
                    <input className='tableName' readOnly defaultValue={tables && `Masa ${tables?.m_kodu}`}></input>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faNotesMedical} /></button>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faUser} /></button>
                    <button className='main-button'  ><FontAwesomeIcon size='xl' icon={faPrint} style={{ color: "#ffffff", }} /></button>
                    <input className='ara' onChange={Search} placeholder='Ürün Adı veya Barkod ile Arama'></input>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faUserGroup} /></button>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faCalendar} /></button>
                </div>
                <div className='contant'>
                    <div className='basket'>
                        <div>
                            <div className='basket-header'>
                                <span>Adisyon:0</span>
                                <span>Sipariş Durumu: Hazırlanıyor</span>
                            </div>
                            <div className='slected-products'>
                                <div className='basket-container'>
                                    {
                                        productsInBasket.map((product) => (
                                            <ProductDetails
                                                key={product.product.grup_koduS}
                                                product={product}
                                                onIncrement={() => incrementProductCount(product)}
                                                onDecrement={() => decrementProductCount(product)}
                                                onRemove={() => removeFromBasket(parseInt(product.product.grup_koduS))}
                                                onOrderDet={() => changeOrderDet(product)}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <BasketFooter
                            totalPrice={totalPrice}
                            productsInBasket={productsInBasket}
                            fastPay={() => fastPay()}
                            pay={() => pay()}
                            save={() => save()}
                        />
                    </div>
                    <div className='cat-pro'>
                        {returnProducts()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
interface SelectedProduct {
    id: number
    count: number;
    product: Product;
    description?: string;
    property?: string;
}
interface ProductDetailsProps {
    product: SelectedProduct;
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
    onOrderDet: () => void;
}
interface BasketFooterProps {
    totalPrice: number;
    productsInBasket: SelectedProduct[];
    fastPay: () => void;
    save: () => void;
    pay: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onIncrement, onDecrement, onRemove, onOrderDet }) => {
    const description = () => {
        if (product.description) {
            return (
                <div ><span className='description'><b>Not: </b> {product.description}</span></div>
            )
        }
    }
    return (
        <div className='products-detales' key={product.id}>
            <div className='product-det1'>
                <div className='plus-minus'>
                    <button className='plus-minus-btn' onClick={onIncrement}>
                        <FontAwesomeIcon icon={faPlus} size="sm" style={{ color: "#e32b2b" }} />
                    </button>
                    <span className='product-count'>{product.count}</span>
                    <button className='plus-minus-btn' onClick={onDecrement}>
                        <FontAwesomeIcon icon={faMinus} size="sm" style={{ color: "#e32b2b" }} />
                    </button>
                </div>
                <div className='product-spans'>
                    <span className='selected-product-name'>{product.product.stok_adi_kisa}</span>
                    {product.property}
                    {description()}
                </div>

            </div>

            <div className='product-det2'>
                <div className='selected-product-name'>
                    ₺ {product.product.satis_fiyat}
                </div>
                <div>
                    <button className='bsket-arrow-btn' onClick={onRemove}>
                        <FontAwesomeIcon icon={faTrash} size="lg" style={{ color: "#e32b2b" }} />
                    </button>
                </div>
                <div>
                    <button className='bsket-arrow-btn' onClick={() => onOrderDet()}>
                        <FontAwesomeIcon icon={faEllipsisVertical} size="lg" style={{ color: "#ec6341" }} />
                    </button>
                </div>
            </div>
        </div>

    );
};
const BasketFooter: React.FC<BasketFooterProps> = ({ totalPrice, productsInBasket, fastPay, save, pay }) => {
    return (
        <div className='basket-footer'>
            <button className='bsket-arrow-btn'><FontAwesomeIcon icon={faArrowUp} size="xl" style={{ color: "#e32b2b", }} /></button>
            <div className='tutar'>
                <span>Toplam Tutar</span>
                <span>₺{totalPrice}</span>
            </div>
            <div className='basket-buttons'>
                <button className='tag-btn'>
                    <FontAwesomeIcon icon={faTag} size="xl" style={{ color: "#e32b2b", }} />
                </button>
                {productsInBasket.length > 0 ? (
                    <div className='pey-buttons'>
                        <button className='pey-button' onClick={() => pay()} >Öde ₺{totalPrice}</button>

                        <button className='fast-pey-button' onClick={() => fastPay()}><FontAwesomeIcon icon={faBolt} size="lg" style={{ color: "#e7eb00", }} /> Hızlı Öde </button>
                    </div>
                ) : null}
                <button className='save-btn' onClick={() => save()}>
                    Kaydet
                </button>
            </div>
        </div>
    )
}
