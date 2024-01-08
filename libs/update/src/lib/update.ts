import { Router, Request, Response } from 'express';
import { getCurrentOfferFor } from '@ebedmano/recipes';

export const updateCrud: Router = Router();

updateCrud.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantStr = req.params['id'];
    const link = await getCurrentOfferFor(restaurantStr);
    res.send({ message: 'Welcome to ', asd: link });
  } catch (error: unknown) {
    if (error instanceof Error) res.send({ message: error.message });
    else res.send({ message: 'Unknown error' });
  }
});
