export class ActiveOrders {
  Siparis: SiparisData[];
}
export class SiparisData {
  Baslik: {
    toplam_tutar: number;
    sip_tarih: Date;
    sip_durum_aciklama: string;
    odeme_yontem_aciklama: string;
    durum_tip: number;
    sip_id: string;
  };
  Musteri: { _id: string; ravi_id: string; adi: string; soyadi: string };
  SiparisAdres: {
    musteri_id: string;
    il: string;
    mahalle: string;
    ilçe: string;
    adres_aciklama1: string;
    telefon: string;
  };
}
