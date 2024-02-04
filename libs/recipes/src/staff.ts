/**
 * This file needs to be updated when a new restaurant is added
 *
 * @todo
 * - add new restaurant as in the example below
 *  - add the new city if needed
 *  - add the new city to the RESTAURANT type if needed
 * - add the new restaurant to the restaurantNameToEventMap
 * - implement the getCurrentOffer method for the new restaurant
 *   in the lib/{city}/{restaurant}.ts file
 *
 * for more info see the README.md in libs\recipes\README.md
 */

import { Offer } from '@ebedmano/kitchenware';
import * as vesz from './lib/veszprem';

type RestaurantToEvent = Record<RESTAURANT, IWaiter>;

export interface IWaiter {
  getCurrentOffer: () => Promise<{
    offers: Offer[];
    succsess: boolean;
    message?: string;
  }>;
  RESTAURANT_DATA: {
    name: string;
    city: string;
    uniqueId: string;
  };
}

/**
 * All available restaurants.
 * This is usefull for type checking
 *
 * @example
 * const restaurant: RESTAURANT = 'VESZ_ZONA';
 * const restaurant: RESTAURANT = veszprem.ZONA;
 */
export type RESTAURANT = VESZPREM; //| KOSZEG;

/********************RESTAURANTS**********************/

/**
 * All available restaurants in Veszprém
 */
export const veszprem = {
  ZONA: 'VESZ_ZONA',
  //METISZ: 'VESZ_METISZ',
  //MARICA: 'VESZ_MARICA',
} as const;
/**
 * We will use this for RESTAURANT type
 */
type VESZPREM = typeof veszprem[keyof typeof veszprem];

/**
 * All available restaurants in Kőszeg
 */
// export const koszeg = {
//   KEKFENY: 'KOSZEG_KEKFENY',
// } as const;
// type KOSZEG = typeof koszeg[keyof typeof koszeg]

/*****************END OF RESTAURANTS***************/

/**
 * Map restaurant names to their event
 * @example
 * const a:boolean = restaurantNameToEventMap['VESZ_ZONA'] === vesz.vesz_zona
 * @returns {RestaurantToEvent}
 */
export const restaurantNameToEventMap: RestaurantToEvent = {
  [veszprem.ZONA]: vesz.vesz_zona,
  //[veszprem.METISZ]: vesz.vesz_metisz,
  //[veszprem.MARICA]: vesz.vesz_marica,
};

/**
 * Get the event for a restaurant
 * @param {RESTAURANT} restaurant
 * @returns {IWaiter | string}
 */
export const toEventMapFor = (restaurant: RESTAURANT): IWaiter | string =>
  restaurantNameToEventMap[restaurant] ?? 'No such restaurant';
