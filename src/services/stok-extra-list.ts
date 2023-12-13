import { ReqData } from "../models";
import { AxiosService } from "./axios.service";

const headers = {
    'data': 'mono_2024',
    'posno': '0',
    'kno': '1',
};
const getAll = (params: object): Promise<ReqData> => {
    let result$ = AxiosService.get<ReqData>(`https://ravi-mobil-demo.petekyazilim.com.tr/ravi-res/get-stok-ekstra-liste`, { headers: headers, params: params });
    return result$;
};

export const StokExtraListService = {
    getAll,
};
