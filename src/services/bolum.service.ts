import { Bolum } from "../models";
import { AxiosService } from "./axios.service";

const headers = {
    'data': 'revi_demo',
    'posno': '0',
    'kno': '1',
};
const getAll = (): Promise<Bolum[]> => {
    let result$ = AxiosService.get<Bolum[]>(`http://ravi-mobil-demo.petekyazilim.com.tr/ravi-res/get-bolum-liste`, { headers: headers });
    return result$;
};

export const BolumService = {
    getAll,
};
