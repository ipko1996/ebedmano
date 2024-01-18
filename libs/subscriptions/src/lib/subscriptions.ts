import { Router, Request, Response } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { prismaClient } from '@ebedmano/kitchenware';
import { subscriptionInputSchema } from '../schemas/subscription.schema';

export const subscriptionsRoutes: Router = Router();

subscriptionsRoutes.get('/', async (req: Request, res: Response) => {
  const subs = await prismaClient.subscription.findMany({
    include: {
      Restaurant: true,
    },
  });
  res.send(subs);
});

subscriptionsRoutes.post(
  '/',
  validateRequest({ body: subscriptionInputSchema }),
  async (req, res) => {
    const restaurantId = req.body.restaurantId;
    const botId = req.body.botId;

    // Check if subscription already exists

    // Check if channel exists

    // Check if restaurant exists

    await prismaClient.subscription.create({
      data: {
        restaurantId,
        botId,
      },
    });
    res.status(200).send({ message: 'Subscription created' });
  }
);

subscriptionsRoutes.delete('/:id', async (req, res) => {
  const botId = Number(req.params.id);
  const restaurantId = req.body.restaurantId;
  await prismaClient.subscription.delete({
    where: {
      restaurantId_botId: {
        botId,
        restaurantId,
      },
    },
  });
  res.status(200).send({ message: 'Subscription deleted' });
});
