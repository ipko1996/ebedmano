import { Router, Request, Response } from 'express';
import { getCurrentOfferFor } from '@ebedmano/recipes';

export const updateRoutes: Router = Router();

updateRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantStr = req.params['id'];
    const offer = await getCurrentOfferFor(restaurantStr);
    if (typeof offer !== 'string') res.send(offer);
    else res.send({ message: offer });
  } catch (error: unknown) {
    if (error instanceof Error) res.send({ message: error.message });
    else res.send({ message: 'Unknown error' });
  }
});
