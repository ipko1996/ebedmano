import * as vesz from './vesz';
import { RESTAURANT, ISomething, VESZPREM } from '../interfaces';

type RestaurantToEvent = Record<RESTAURANT, ISomething>;

const restaurantNameToEventMap: RestaurantToEvent = {
  [VESZPREM.ZONA]: vesz.vesz_zona.something,
  [VESZPREM.METISZ]: vesz.vesz_metisz.something,
  [VESZPREM.MARICA]: vesz.vesz_marica.something,
  //[KOSZEG.KEKFENY]: vesz.vesz_zona.something,
};

const toEventMapFor = (restaurant: RESTAURANT): ISomething | string =>
  restaurantNameToEventMap[restaurant] ?? 'No such restaurant';

export async function getCurrentOfferFor(restaurant: string): Promise<string> {
  const restaurantEnum = toEventMapFor(restaurant as RESTAURANT);
  if (typeof restaurantEnum === 'string') {
    return restaurantEnum;
  }
  return await restaurantEnum.getCurrentOffer();
}
