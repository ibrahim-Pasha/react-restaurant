import React, { useEffect } from 'react';
import './bolgeler.scss';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import Button from 'devextreme-react/button';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/navigation';
export default function Bolgeler(props: any) {
    const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const Salons = [1, 2];
    const navigate = useNavigate();
    const buttonClick = (e: any) => {
        navigate("/masa", { state: { id: e.element.accessKey } });
        console.log(e.element.accessKey);
    };
    const { currentPath } = props;
    const { setNavigationData } = useNavigation();
    useEffect(() => {
        if (setNavigationData) {
            setNavigationData({ currentPath: currentPath });
        }
    }, [setNavigationData, currentPath])
    return (
        <React.Fragment>
            <div className={'contant-header'}>
                <span className='header'>Bölgeler</span>
            </div>
            <TabPanel>
                {Salons.map((s) => (
                    <Item title={`Salon (${s})`} >

                        <div className='main-div'
                        >
                            {tables.map((t) => (
                                <Button
                                    accessKey={`Masa ${t}`}
                                    className="card"
                                    onClick={buttonClick}>
                                    <div
                                        className="card-content">
                                        <div className="card-header"></div>
                                        <div className="">
                                            Masa {t}
                                        </div>
                                        <div className="card-footer"></div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </Item>
                ))}
            </TabPanel>
        </React.Fragment>
    )
}