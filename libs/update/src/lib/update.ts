import { Router, Request, Response } from 'express';
import { getCurrentOfferFor } from '@ebedmano/recipes';

export const updateCrud: Router = Router();

updateCrud.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantStr = req.params['id'];
    const offer = await getCurrentOfferFor(restaurantStr);
    if (offer)
      res.send({
        message: `Welcome it's ${offer[0].day}`,
        offer: offer[0].offer,
      });
    else res.send({ message: 'Restaurant not found' });
  } catch (error: unknown) {
    if (error instanceof Error) res.send({ message: error.message });
    else res.send({ message: 'Unknown error' });
  }
});
