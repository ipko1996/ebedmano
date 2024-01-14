export const RESTAURANT_DATA = {
  name: 'Marica',
  city: 'Veszprém',
  uniqueId: 'VESZ_MARICA',
} as const;

export const getCurrentOffer = async () => {
  return [{ day: new Date(), offer: 'Babgulyás', price: 800 }];
};
