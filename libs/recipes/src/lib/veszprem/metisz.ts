export const RESTAURANT_DATA = {
  name: 'Metisz',
  city: 'Veszprém',
  uniqueId: 'VESZ_METISZ',
} as const;

export const getCurrentOffer = async () => {
  return [{ day: new Date(), offer: 'Babgulyás', price: 800 }];
};
