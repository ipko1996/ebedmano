import { Router, Request, Response } from 'express';
import { updateOfferFor } from '@ebedmano/recipes';
import { toEventMapFor, RESTAURANT } from '@ebedmano/recipes';

export const updateRoutes: Router = Router();

updateRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantStr = req.params['id'];

    const currentRestaurant = toEventMapFor(restaurantStr as RESTAURANT);
    if (typeof currentRestaurant === 'string')
      return res.status(404).send({ message: 'Restaurant not found' });

    const { message, error } = await updateOfferFor(currentRestaurant);
    return res.send({ message: message, error: error });
  } catch (error: unknown) {
    if (error instanceof Error) return res.send({ message: error.message });
    else return res.send({ message: 'Unknown error' });
  }
});
