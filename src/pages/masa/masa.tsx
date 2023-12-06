import React, { ChangeEvent, useEffect, useState } from 'react';
import './masa.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faCalendar, faEllipsisVertical, faMinus, faNotesMedical, faPlus, faTag, faTrash, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from '../../contexts/navigation';
import { Product } from '../../models';
interface SelectedProduct {
    count: number;
    product: Product;
}

export default function Masa(props: any) {
    const { setNavigationData } = useNavigation();
    const navigate = useNavigate()
    const { currentPath } = props;
    const categories = [{ name: 'Sıcak içecekler', id: 1 }, { name: 'Soğuk içecekler', id: 2 }, { name: 'yiycekler', id: 3 }]
    const products = [{ name: 'kahve', id: 1, catId: 1, price: 12 }, { name: 'meyve suyu', id: 2, catId: 2, price: 12 }, { name: 'çay', id: 3, catId: 3, price: 12 }, { name: 'tost', id: 4, catId: 3, price: 12 }, { name: 'tost', id: 5, catId: 1, price: 12 }, { name: 'tost', id: 6, catId: 1, price: 12 }, { name: 'tost', id: 7, catId: 1, price: 12 }, { name: 'tost', id: 8, catId: 2, price: 12 }, { name: 'tost', id: 9, catId: 1, price: 12 }]
    const [productsInBasket, setProductsInBasket] = useState<SelectedProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [filtredProducts, setFiltredProducts] = useState<Product[] | null>(null)
    const calculateTotal = (value: SelectedProduct[]) => {
        const pricesInBasket = value.map((product) => (product.count) * product.product.price)
        setTotalPrice(pricesInBasket.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
    }
    const addToBasket = (id: number) => {
        const productInBasket = productsInBasket.find((p) => p.product.id === id);
        if (productInBasket) {
            productInBasket.count++;
            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
            setProductsInBasket(allProductsInBasket);
        } else {
            const clickedProdcut = products.find((p) => p.id === id);
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
        const productInBasket = productsInBasket.find((p) => p.product.id === id);
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
        const value = event.currentTarget.value === '' ? null : event.currentTarget.value;
        if (products && value != null) {
            const fProducts =
                products.filter((product) => product.name.includes(event.target.value));
            setFiltredProducts(fProducts)
        }
        else setFiltredProducts(null)
    };
    const returnProducts = () => {
        if (filtredProducts) {
            return (
                <div className='products'>
                    {filtredProducts.map(product => (
                        <button className='card' onClick={() => addToBasket(product.id)}>
                            {product.name}
                        </button>
                    ))}
                </div>)
        }
        else
            return (<div className='categories'>
                <TabPanel>
                    {categories.map((category) => (
                        <Item title={category.name} >
                            <div className='products'>
                                {products.filter(product => product.catId === category.id)?.map((filteredProducts) => (
                                    <button className='card' onClick={() => addToBasket(filteredProducts.id)}>
                                        {filteredProducts.name}
                                    </button>
                                ))}
                            </div>
                        </Item>
                    ))}
                </TabPanel>
            </div>)
    }
    useEffect(() => {
        if (setNavigationData) {
            setNavigationData({ currentPath: currentPath });
        }
        calculateTotal(productsInBasket)
    }, [currentPath, setNavigationData, productsInBasket])
    return (
        <React.Fragment>
            <div className='all-contant'>
                <div className='header'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <button
                        onClick={() => navigate('/bolgeler')}
                        className='main-button'                     >
                        <FontAwesomeIcon icon={faArrowLeft} size='xl' style={{ color: "#ffffff", }} />
                    </button>

                    <input className='tableName'></input>
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
                                                        }} ><FontAwesomeIcon icon={faPlus} size="lg" style={{ color: "#e32b2b", }} /></button>
                                                        <span className='product-count'>{b.count}</span>
                                                        <button className='plus-minus-btn' onClick={() => {
                                                            if (b.count > 1)
                                                                b.count--;
                                                            const allProductsInBasket: SelectedProduct[] = [...productsInBasket];
                                                            setProductsInBasket(allProductsInBasket);
                                                        }}><FontAwesomeIcon icon={faMinus} size="lg" style={{ color: "#e32b2b", }} /></button>
                                                    </div>
                                                    <span className='selected-product-name'>{b.product.name}</span>
                                                </div>

                                                <div className='product-det2'>
                                                    <div>
                                                        {b.product.price}
                                                    </div>
                                                    <div><button className='bsket-arrow-btn' onClick={() => removeFromBasket(b.product.id)}><FontAwesomeIcon icon={faTrash} size="lg" style={{ color: "#e32b2b", }} /></button></div>
                                                    <div><button className='bsket-arrow-btn'><FontAwesomeIcon icon={faEllipsisVertical} size="lg" style={{ color: "#ec6341", }} /></button></div>
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
                                {productsInBasket.length > 0 && (
                                    <button className='pey-button' >Öde ₺{totalPrice}</button>
                                )}
                                <button className='save-btn'>
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