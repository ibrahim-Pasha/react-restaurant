import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './masa.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faBolt, faCalendar, faEllipsisVertical, faMinus, faNotesMedical, faPlus, faTag, faTrash, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from '../../contexts/navigation';
import { Categories, Product } from '../../models';
import { Masa as masaModel } from '../../models';
import { CategoriesService, MasaService, ProductsService, SearchService } from '../../services';
import Popup, { Position, ToolbarItem } from 'devextreme-react/popup';
interface SelectedProduct {
    count: number;
    product: Product;
}

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

    const handleSave = () => {
        navigate('/bolgeler', { state: { masano: tables?.masano } })
    }
    const calculateTotal = (value: SelectedProduct[]) => {
        const pricesInBasket = value.map((product) => (product.count) * product.product.satis_fiyat)
        setTotalPrice(pricesInBasket.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
    }
    const addToBasket = (id: number) => {
        const productInBasket = productsInBasket.find((p) => p.product.stokno === id);
        if (productInBasket) {
            productInBasket.count++;
            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
            setProductsInBasket(allProductsInBasket);
        } else {
            const clickedProdcut = products.find((p) => p.stokno === id);
            if (productsInBasket && clickedProdcut) {
                const allProductsInBasket: SelectedProduct[] = [

                    ...productsInBasket,
                    { count: 1, product: clickedProdcut },
                ];
                setProductsInBasket(allProductsInBasket);
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
    console.log(filtredProducts);

    const returnProducts = () => {
        if (filtredProducts) {
            return (
                <div className='products'>
                    {filtredProducts.map(product => (
                        <button className='card' onClick={() => addToBasket(product.stokno)}>

                            <span>{product.stok_adi_kisa}</span>
                            <span>₺ {product.satis_fiyat}</span>
                        </button>
                    ))}
                </div>)
        }
        else
            return (<div className='categories'>
                <TabPanel onSelectionChanged={onChangeTab} selectedIndex={parseInt(grupKodu) - 1}>
                    {categories?.map((category) => (
                        <Item title={category.aciklama} >
                            <div className='products'>
                                {products.map((product) => (
                                    <button className='card' onClick={() => addToBasket(product.stokno)}>
                                        <span>{product.stok_adi_kisa}</span>
                                        <span>₺ {product.satis_fiyat}</span>                                    </button>
                                ))}
                            </div>
                        </Item>
                    ))}
                </TabPanel>
            </div>)
    }
    const masaTitle = () => {
        if (tables)
            return (`Masa ${tables?.m_kodu}`)

    }
    const [title, setTitle] = useState('')
    const handleOrderDet = (productName: string) => {
        productDetRef.current?.instance.show()
        setTitle(productName)
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
        Promise.all([Masalar$, Categories$, Products$, Serched$]).then((results) => {
            const masa = results[0].Data.find((masa: masaModel) => masa.masano.toString() === masaNo)
            const categories = results[1].Data
            const Products = results[2].Data
            const filteredProducts = results[3].Data
            setTables(masa);
            setCategories(categories)
            setProducts(Products)
            if (searchText === '') { setFiltredProducts(null) }
            else setFiltredProducts(filteredProducts)
        })

    }, [currentPath, setNavigationData, productsInBasket, bolumNo, masaNo, navigate, grupKodu, searchText])
    return (
        <React.Fragment>
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
                            productDetRef.current?.instance.hide()
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
                            productDetRef.current?.instance.hide()
                        }
                    }}
                />

            </Popup>
            <div className='all-contant'>
                <div className='header'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <button
                        onClick={() => navigate('/bolgeler')}
                        className='main-button'>
                        <FontAwesomeIcon icon={faArrowLeft} size='xl' style={{ color: "#ffffff", }} />
                    </button>

                    <input className='tableName' defaultValue={masaTitle()}></input>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faNotesMedical} /></button>
                    <button className='main-button' ><FontAwesomeIcon size='xl' icon={faUser} /></button>
                    <button className='main-button'  >MARŞ</button>
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
                                        productsInBasket.map((b) => (
                                            <div className='products-detales'>
                                                <div className='product-det1'>
                                                    <div className='plus-minus'>
                                                        <button className='plus-minus-btn' onClick={() => {
                                                            b.count++;
                                                            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                                            setProductsInBasket(allProductsInBasket);
                                                        }} ><FontAwesomeIcon icon={faPlus} size="sm" style={{ color: "#e32b2b", }} /></button>
                                                        <span className='product-count'>{b.count}</span>
                                                        <button className='plus-minus-btn' onClick={() => {
                                                            if (b.count > 1)
                                                                b.count--;
                                                            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                                            setProductsInBasket(allProductsInBasket);
                                                        }}><FontAwesomeIcon icon={faMinus} size="sm" style={{ color: "#e32b2b", }} /></button>
                                                    </div>
                                                    <span className='selected-product-name'>{b.product.stok_adi_kisa}</span>
                                                </div>

                                                <div className='product-det2'>
                                                    <div className='selected-product-name'>
                                                        ₺  {b.product.satis_fiyat}
                                                    </div>
                                                    <div><button className='bsket-arrow-btn' onClick={() => removeFromBasket(parseInt(b.product.grup_koduS))}><FontAwesomeIcon icon={faTrash} size="lg" style={{ color: "#e32b2b", }} /></button></div>
                                                    <div><button className='bsket-arrow-btn' onClick={() => handleOrderDet(b.product.stok_adi_kisa)}><FontAwesomeIcon icon={faEllipsisVertical} size="lg" style={{ color: "#ec6341", }} /></button></div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
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
                                        <button className='pey-button' >Öde ₺{totalPrice}</button>

                                        <button className='fast-pey-button' ><FontAwesomeIcon icon={faBolt} size="lg" style={{ color: "#e7eb00", }} /> Hızlı Öde </button>
                                    </div>
                                ) : null}
                                <button className='save-btn' onClick={handleSave}>
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='cat-pro'>
                        {returnProducts()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}