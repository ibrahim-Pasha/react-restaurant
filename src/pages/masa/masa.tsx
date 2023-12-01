import React, { useEffect } from 'react';
import './masa.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faCalendar, faEllipsisVertical, faMinus, faNotesMedical, faPlus, faTag, faTrash, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useNavigation } from '../../contexts/navigation';


export default function Masa(props: any) {
    const { setNavigationData } = useNavigation();
    const navigate = useNavigate()
    const { currentPath } = props;
    const categories = [{ name: 'Sıcak içecekler', porId: 1 }, { name: 'Soğuk içecekler', porId: 2 }, { name: 'yiycekler', porId: 3 }]
    const products = [{ name: 'kahve', porId: 1 }, { name: 'meyve suyu', porId: 2 }, { name: 'çay', porId: 1 }, { name: 'tost', porId: 3 }]
    const Inbasket = [{ name: 'çay', price: '123' }]
    useEffect(() => {
        if (setNavigationData) {
            setNavigationData({ currentPath: currentPath });
        }
    }, [currentPath, setNavigationData])
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
                    <input className='ara' placeholder='Ürün Adı veya Barkod ile Arama'></input>
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
                            <div className='selected-product'>
                                {

                                    Inbasket.map((b) => (
                                        <div className='products-detales'>
                                            <div className='product-det1'>
                                                <div className='plus-minus'>
                                                    <button className='plus-minus-btn' ><FontAwesomeIcon icon={faPlus} size="lg" style={{ color: "#e32b2b", }} /></button>
                                                    <span className='product-count'>1</span>
                                                    <button className='plus-minus-btn'><FontAwesomeIcon icon={faMinus} size="lg" style={{ color: "#e32b2b", }} /></button>
                                                </div>
                                                <span className='selected-product-name'>{b.name}</span>
                                            </div>

                                            <div className='product-det2'>
                                                <div>
                                                    {b.price}
                                                </div>
                                                <div><button className='bsket-arrow-btn'><FontAwesomeIcon icon={faTrash} size="lg" style={{ color: "#e32b2b", }} /></button></div>
                                                <div><button className='bsket-arrow-btn'><FontAwesomeIcon icon={faEllipsisVertical} size="lg" style={{ color: "#ec6341", }} /></button></div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='basket-footer'>
                            <button className='bsket-arrow-btn'><FontAwesomeIcon icon={faArrowUp} size="xl" style={{ color: "#e32b2b", }} /></button>
                            <div className='tutar'>
                                <span>Toplam Tutar</span>
                                <span>0,00</span>
                            </div>
                            <div className='basket-buttons'>
                                <button className='tag-btn'>
                                    <FontAwesomeIcon icon={faTag} size="xl" style={{ color: "#e32b2b", }} />
                                </button>
                                <button className='save-btn'>
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className='cat-pro'>
                        <div className='categories'>
                            <TabPanel>
                                {categories.map((category) => (
                                    <Item title={category.name} >
                                        <div className='products'>
                                            {products.filter(product => product.porId === category.porId)?.map((filteredProducts) => (
                                                <button className='card'>
                                                    {filteredProducts.name}
                                                </button>
                                            ))}
                                        </div>
                                    </Item>
                                ))}
                            </TabPanel>
                        </div>
                    </div>

                </div>
            </div>

        </React.Fragment>
    )
}