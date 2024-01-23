import { Router, Request, Response } from 'express';
import { getOfferFromTo, updateOfferFor } from '@ebedmano/recipes';
import { toEventMapFor, RESTAURANT } from '@ebedmano/recipes';

export const updateRoutes: Router = Router();

updateRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantStr = req.params['id'];

    const currentRestaurant = toEventMapFor(restaurantStr as RESTAURANT);
    if (typeof currentRestaurant === 'string')
      return res.status(404).send({ message: 'Restaurant not found' });

    const result = await getOfferFromTo(
      currentRestaurant.RESTAURANT_DATA.uniqueId
    );
    if (result.length > 0)
      return res.send({ message: 'Restaurant is up to date!' });

    await updateOfferFor(currentRestaurant);
    return res.send({ message: 'Restaurant updated!' });
  } catch (error: unknown) {
    if (error instanceof Error) return res.send({ message: error.message });
    else return res.send({ message: 'Unknown error' });
  }
});
