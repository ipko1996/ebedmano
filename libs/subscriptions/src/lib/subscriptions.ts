import { Router, Request, Response } from 'express';
import { prismaClient } from '@ebedmano/prisma-client';

export const subscriptionsCrud: Router = Router();

subscriptionsCrud.get('/', async (req: Request, res: Response) => {
  const subs = await prismaClient.subscription.findMany({
    include: {
      Restaurant: true,
    },
  });
  res.send(subs);
});

subscriptionsCrud.post('/', async (req: Request, res: Response) => {
  const restaurantStr = req.params['id'];
  res.send({ message: 'Szia' });
});
