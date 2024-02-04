import { prismaClient, connectToDb } from '@ebedmano/kitchenware';
import { veszprem, toEventMapFor, RESTAURANT } from '@ebedmano/recipes';

export default async function runExecutor() {
  await connectToDb();
  console.log('Executor ran for PrismaSeed');
  console.log(Object.keys(veszprem));

  for (const restaurant of Object.values(veszprem)) {
    const res = toEventMapFor(restaurant as RESTAURANT);
    if (typeof res === 'string') continue;
    console.log('Seeding: ', res.RESTAURANT_DATA.name);

    const data = res.RESTAURANT_DATA;
    const createdRestaurant = await prismaClient.restaurant.upsert({
      create: data,
      update: {},
      where: {
        uniqueId: res.RESTAURANT_DATA.uniqueId,
      },
    });
    console.log('Created: ', createdRestaurant.name);
  }
  return {
    success: true,
  };
}
