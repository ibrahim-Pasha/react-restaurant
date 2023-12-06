import React, { useEffect, useState } from 'react';
import './bolgeler.scss';
import TabPanel, { Item } from "devextreme-react/tab-panel";
import Button from 'devextreme-react/button';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/navigation';
import { MasaService } from '../../services/masa.sevice';
import { Bolum, Masa } from '../../models';
import { BolumService } from '../../services/bolum.service';
export default function Bolgeler(props: any) {
    const [tables, setTables] = useState<Masa[]>([]);
    const [bolumlar, setBolumlar] = useState<Bolum[]>([]);
    const navigate = useNavigate();
    const [bolumNo, setBolumNo] = useState(1)
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
        try {
            const Masalar$ = MasaService.getAll(
                { bolumno: bolumNo }
            );
            const Bolumlar$ = BolumService.getAll();
            Promise.all([Masalar$, Bolumlar$]).then((results) => {
                setTables(results[0]);
                setBolumlar(results[1]);
            })
        } catch (error) {
            console.log(error);

        }

    }, [setNavigationData, currentPath, bolumNo])
    return (
        <React.Fragment>
            <div className={'contant-header'}>
                <span className='header'>Bölgeler</span>
            </div>
            <TabPanel>
                {bolumlar.map((s) => {
                    setBolumNo(s.bolumno);
                    return (
                        <Item title={`Salon (${s})`} >
                            <div className='main-div'
                            >
                                {tables.map((t) => (
                                    <Button
                                        accessKey={`Masa ${t.masano}`}
                                        className="card"
                                        onClick={buttonClick}>
                                        <div
                                            className="card-content">
                                            <div className="card-header"></div>
                                            <div className="">
                                                Masa {t.masano}
                                            </div>
                                            <div className="card-footer"></div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </Item>
                    )
                })}
            </TabPanel>
        </React.Fragment>
    )
}