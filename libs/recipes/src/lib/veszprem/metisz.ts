import { weekdays } from '@ebedmano/kitchenware';

export const getCurrentOffer = async () => {
  return [{ day: weekdays.MONDAY, offer: 'Babgulyás', price: 800 }];
};
