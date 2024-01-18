import { ActiveOrders } from "../models";
import { AxiosService } from "./axios.service";
const headers = {
  raviKey: "1258-9685-9645-1123",
};
const getAll = (): Promise<ActiveOrders> => {
  let result$ = AxiosService.post<ActiveOrders>(
    `https://sanal-market-api-server.petekyazilim.com/sanal-market/siparis-cek`,
    { headers: headers }
  );
  return result$;
};
const sendOrderOut = (params: object): Promise<ActiveOrders> => {
  let result$ = AxiosService.post<ActiveOrders>(
    `https://sanal-market-api-server.petekyazilim.com/sanal-market/siparis-yola-cikar`,
    { params: params, headers: headers }
  );
  return result$;
};
const deliverOrder = (params: object): Promise<ActiveOrders> => {
  let result$ = AxiosService.post<ActiveOrders>(
    `https://sanal-market-api-server.petekyazilim.com/sanal-market/siparis-teslim-et`,
    { params: params, headers: headers }
  );
  return result$;
};
export const ActiveOrdersSevice = {
  getAll,
  sendOrderOut,
  deliverOrder,
};
