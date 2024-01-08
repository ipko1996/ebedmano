import * as vesz from './lib/vesz';

type RestaurantToEvent = Record<RESTAURANT, IWaiter>;

export interface IWaiter {
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

export const restaurantNameToEventMap: RestaurantToEvent = {
  [VESZPREM.ZONA]: vesz.vesz_zona,
  [VESZPREM.METISZ]: vesz.vesz_metisz,
  [VESZPREM.MARICA]: vesz.vesz_marica,
  //[KOSZEG.KEKFENY]: vesz.vesz_zona.something,
};
