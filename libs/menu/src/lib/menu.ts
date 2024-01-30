import { Router, Request, Response } from 'express';
import {
  // MenuWithFoodNameAndRestaurant,
  RESTAURANT,
  getOfferFromTo,
  toEventMapFor,
} from '@ebedmano/recipes';

export const menuRoutes: Router = Router();

menuRoutes.get('/:id', async (req: Request, res: Response) => {
  const restaurantStr = req.params['id'];

  const currentRestaurant = toEventMapFor(restaurantStr as RESTAURANT);
  if (typeof currentRestaurant === 'string')
    return res.status(404).send({ message: 'Restaurant not found' });

  const result = await getOfferFromTo(
    currentRestaurant.RESTAURANT_DATA.uniqueId
  );
  if (result.length > 0) return res.send(result);
  else
    return res.status(404).send({ message: 'No offer found, try updating...' });
});
