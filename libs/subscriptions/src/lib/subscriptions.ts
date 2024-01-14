import { Router, Request, Response } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { prismaClient } from '@ebedmano/prisma-client';
import { subscriptionInputSchema } from '../schemas/subscription.schema';

export const subscriptionsCrud: Router = Router();

subscriptionsCrud.get('/', async (req: Request, res: Response) => {
  const subs = await prismaClient.subscription.findMany({
    include: {
      Restaurant: true,
    },
  });
  res.send(subs);
});

subscriptionsCrud.post(
  '/',
  validateRequest({ body: subscriptionInputSchema }),
  async (req, res) => {
    const restaurantId = req.body.restaurantId;
    const teamsChannelId = req.body.teamsChannelId;

    // Check if subscription already exists

    // Check if channel exists

    // Check if restaurant exists

    await prismaClient.subscription.create({
      data: {
        restaurantId,
        teamsChannelId,
      },
    });
    res.status(200).send({ message: 'Subscription created' });
  }
);

subscriptionsCrud.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prismaClient.subscription.delete({
    where: {
      id: id,
    },
  });
  res.status(200).send({ message: 'Subscription deleted' });
});
