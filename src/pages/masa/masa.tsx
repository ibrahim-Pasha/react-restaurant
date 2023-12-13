import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './masa.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faBolt, faCalendar, faEllipsisVertical, faMinus, faNotesMedical, faPlus, faPrint, faTag, faTrash, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from '../../contexts/navigation';
import { Categories, Product, ReqData, StokExtraList } from '../../models';
import { Masa as masaModel } from '../../models';
import { CategoriesService, MasaService, ProductsService, SearchService, StokExtraListService } from '../../services';
import Popup, { Position, ToolbarItem } from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';

export default function Masa(props: any) {
    const { setNavigationData } = useNavigation();
    const navigate = useNavigate()
    const { currentPath } = props;
    const [categories, setCategories] = useState<Categories[]>()
    const [products, setProducts] = useState<Product[]>([])
    const [productsInBasket, setProductsInBasket] = useState<SelectedProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [filtredProducts, setFiltredProducts] = useState<Product[] | null>(null)
    const location = useLocation();
    const masaNo = location.state?.masaNo;
    const bolumNo = location.state?.bolumno
    const [tables, setTables] = useState<masaModel>();
    const [grupKodu, setGrupKodu] = useState("01")
    const productDetRef: any = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [selectedProductDet, setSelectedProductDet] = useState<SelectedProduct>()
    const [title, setTitle] = useState('')
    const [fastPayTitle, setFastPayTitle] = useState('')
    const payTypes = ['Öde', 'Öde & Yazdır']
    const fastPayRef: any = useRef(null)
    const [stokExtraList, setStokExtraList] = useState<StokExtraList[]>([])
    const [textAreaValue, setTextAreaValue] = useState('');

    const handlePopupClose = () => {
        productDetRef.current?.instance.hide()
        setTextAreaValue('');
    };
    const save = () => {
        navigate('/bolgeler', { state: { masano: tables?.masano } })
    }
    const calculateTotal = (value: SelectedProduct[]) => {
        const pricesInBasket = value.map((product) => (product.count) * product.product.satis_fiyat)
        setTotalPrice(pricesInBasket.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
    }
    const addToBasket = (product: SelectedProduct) => {

        const clickedProdcut = product
        if (productsInBasket && clickedProdcut) {
            const allProductsInBasket: SelectedProduct[] = [

                ...productsInBasket,
                clickedProdcut
            ];
            setProductsInBasket(allProductsInBasket);
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
    const onclickProduct = (product: Product) => {
        setSelectedProductDet({ product: product, count: 1, description: '', property: undefined })//to use when gettin stok exra list
        handleOrderDet({ product, count: 1 })
    }

    const handleOrderDet = (product: SelectedProduct) => {
        productDetRef.current?.instance.show();
        setTitle(product.product.stok_adi_kisa);
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
                </div>)
        }
        else
            return (
                <div className='categories'>
                    <TabPanel
                        id='1'
                        onSelectionChanged={onChangeTab}
                        selectedIndex={parseInt(grupKodu) - 1}>
                        {categories?.map((category) => (
                            <Item title={category.aciklama} key={category.refkodu}>
                                <div className='products'>
                                    {products.map((product) => (
                                        <button className='card' onClick={() => onclickProduct(product)}>
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
    const masaTitle = () => {
        if (tables)
            return (`Masa ${tables?.m_kodu}`)
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
                    title={title}
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
                                selectedProductDet.description = textAreaValue
                                const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                setProductsInBasket(allProductsInBasket);

                                addToBasket(selectedProductDet)
                                handlePopupClose()
                            }
                        }}
                    />
                    <div className='popup-contant'>
                        <div className='popup-firstLi'>
                            <div className='plus-minus-popup'>
                                <button className='plus-minus-btn' onClick={() => {
                                    selectedProductDet.count++;
                                    const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                    setProductsInBasket(allProductsInBasket);
                                    console.log(selectedProductDet);

                                }} ><FontAwesomeIcon icon={faPlus} size="sm" style={{ color: "#e32b2b", }} /></button>
                                <input className='product-count-popup' value={selectedProductDet.count} type='number' onChange={(e) => {
                                    selectedProductDet.count = parseInt(e.target.value);
                                    const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                    setProductsInBasket(allProductsInBasket);
                                }}></input>
                                <button className='plus-minus-btn' onClick={() => {
                                    if (selectedProductDet.count > 1)
                                        selectedProductDet.count--;
                                    const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                    setProductsInBasket(allProductsInBasket);
                                }}><FontAwesomeIcon icon={faMinus} size="sm" style={{ color: "#e32b2b", }} /></button>
                            </div>
                            <div>
                                <textarea className='popup-textarea' placeholder='Ürün Notu ...' value={textAreaValue} onChange={
                                    (e) => {

                                        setTextAreaValue(e.target.value);


                                    }
                                } ></textarea>
                            </div>
                        </div>
                        <div>
                            <div className='popup-secondLine'>
                                <span>Özellikler</span>
                                <SelectBox placeholder='seç' dataSource={extraAd} noDataText='seçecek veri yok' onSelectionChanged={(e) => {
                                    selectedProductDet.property = e.selectedItem;
                                    const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                    setProductsInBasket(allProductsInBasket);
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
        if (masaNo == null) {
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
            const masa = results[0].Data.find((masa: masaModel) => masa.masano.toString() === masaNo)
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

    }, [currentPath, setNavigationData, productsInBasket, bolumNo, masaNo, navigate, grupKodu, searchText, selectedProductDet?.product.stokno])

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
                    <input className='tableName' readOnly defaultValue={masaTitle()}></input>
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
                                                onOrderDet={() => handleOrderDet(product)}
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
                <div><span><b>Not: </b> {product.description}</span></div>
            )
        }
    }
    return (
        <div className='products-detales'>
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
