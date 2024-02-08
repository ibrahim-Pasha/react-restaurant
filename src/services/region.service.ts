import { ReqData } from "../models";
import { AxiosService } from "./axios.service";

const headers = {
  data: "mono_2024",
  posno: "0",
  kno: "1",
};
const getAll = (): Promise<ReqData> => {
  let result$ = AxiosService.get<ReqData>(
    `https://ravi-mobil-demo.petekyazilim.com.tr/staj/get-bolum-liste`,
    { headers: headers }
  );
  return result$;
};

export const RegionService = {
  getAll,
};
