import { ActiveOrders } from "../models";
import { AxiosService } from "./axios.service";
const headers={
    raviKey: '1258-9685-9645-1123'
}
const getAll = (): Promise<ActiveOrders> => {
    let result$ = AxiosService.post<ActiveOrders>(`https://sanal-market-api-server.petekyazilim.com/sanal-market/siparis-cek?sMarket=26`,{headers:headers});
    return result$;
  };
  export const ActiveOrdersSevice={
getAll
  }