import { Router, Request, Response } from 'express';
import { prismaClient } from '@ebedmano/prisma-client';

export const menuCrud: Router = Router();

menuCrud.get('/', async (req: Request, res: Response) => {
  const menus = await prismaClient.restaurant.findMany();
  res.send({ message: 'Welcome to menu-crud!', menus });
});

menuCrud.get('/szia', async (req: Request, res: Response) => {
  // const rest = await prisma.restaurant.create({ data: { name: 'Zona' } });
  // console.log(rest);
  res.send({ message: 'Szia' });
});
