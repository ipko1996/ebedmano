export interface ISomething {
  getCurrentOffer: () => string;
}

export type RESTAURANT = VESZPREM | KOSZEG;

export enum VESZPREM {
  ZONA = 'VESZ_ZONA',
  METISZ = 'VESZ_METISZ',
  MARICA = 'VESZ_MARICA',
}

export enum KOSZEG {}
//KEKFENY = 'KOSZEG_KEKFENY',
