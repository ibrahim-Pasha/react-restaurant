import { Masa } from "../models";
import { AxiosService } from "./axios.service";

const headers = {
    'data': 'revi_demo',
    'posno': '0',
    'kno': '1',
};
const getAll = (params?: object): Promise<Masa[]> => {
    let result$ = AxiosService.get<Masa[]>(`http://ravi-mobil-demo.petekyazilim.com.tr/ravi-res/get-masa-liste?`, { headers: headers, params: params });
    return result$;
};

export const MasaService = {
    getAll,
};
