import { RESTAURANT, toEventMapFor } from '../staff';

export async function getCurrentOfferFor(restaurant: string): Promise<string> {
  const restaurantEnum = toEventMapFor(restaurant as RESTAURANT);
  if (typeof restaurantEnum === 'string') {
    return restaurantEnum;
  }
  return await restaurantEnum.getCurrentOffer();
}
