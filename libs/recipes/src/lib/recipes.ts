import { Offer } from '@ebedmano/kitchenware';
import { RESTAURANT, toEventMapFor } from '../staff';

export async function getCurrentOfferFor(
  restaurant: string
): Promise<Offer[] | null> {
  const restaurantEnum = toEventMapFor(restaurant as RESTAURANT);
  if (typeof restaurantEnum === 'string') {
    return null;
  }
  const offer = await restaurantEnum.getCurrentOffer();
  return offer;
}
