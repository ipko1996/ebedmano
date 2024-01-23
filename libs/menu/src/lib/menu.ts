import { Router, Request, Response } from 'express';
import {
  MenuWithFoodNameAndRestaurant,
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

  const result: MenuWithFoodNameAndRestaurant = await getOfferFromTo(
    currentRestaurant.RESTAURANT_DATA.uniqueId
  );
  if (result.length > 0) return res.send(result);
  else
    return res.status(404).send({ message: 'No offer found, try updating...' });
});

menuRoutes.get('/szia', async (req: Request, res: Response) => {
  // const rest = await prisma.restaurant.create({ data: { name: 'Zona' } });
  // console.log(rest);
  res.send({ message: 'Szia' });
});
