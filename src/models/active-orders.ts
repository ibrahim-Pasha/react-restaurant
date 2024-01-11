export class ActiveOrders {
  Siparis: [
    Musteri: { _id: string; ravi_id: string; adi: string; soyadi: string },
    SiparisAdres: {
      musteri_id: string;
      il: string;
      mahalle: string;
      ilçe: string;
      adres_aciklama1: string;
      telefon: string;
    }
  ];
}
