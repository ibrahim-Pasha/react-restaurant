import { ReqData } from "../models";
import { AxiosService } from "./axios.service";

const headers = {
    'data': 'ravi_demo',
    'posno': '0',
    'kno': '1',
};
const getAll = (params: object): Promise<ReqData> => {
    let result$ = AxiosService.get<ReqData>(`https://ravi-mobil-demo.petekyazilim.com.tr/ravi-res/get-hizli-satis-stok-liste`, { headers: headers, params: params });
    return result$;
};

export const ProductsService = {
    getAll,
};
