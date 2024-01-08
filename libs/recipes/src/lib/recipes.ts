import { RESTAURANT, IWaiter, restaurantNameToEventMap } from '../staff';

const toEventMapFor = (restaurant: RESTAURANT): IWaiter | string =>
  restaurantNameToEventMap[restaurant] ?? 'No such restaurant';

export async function getCurrentOfferFor(restaurant: string): Promise<string> {
  const restaurantEnum = toEventMapFor(restaurant as RESTAURANT);
  if (typeof restaurantEnum === 'string') {
    return restaurantEnum;
  }
  return await restaurantEnum.getCurrentOffer();
}
