import { logger } from '@ebedmano/kitchenware';
import { RESTAURANT, toEventMapFor } from '../staff';
import { prismaClient } from '@ebedmano/kitchenware';
import { Menu } from '@prisma/client';

export const getCurrentOfferFor = async (restaurant: string) => {
  logger.info(`Getting current offer for ${restaurant}`);
  const currentRestaurant = toEventMapFor(restaurant as RESTAURANT);
  if (typeof currentRestaurant === 'string') return currentRestaurant;

  const { monday, sunday } = getCurrentWeekDates();
  const thisWeekStartDate = monday;
  const thisWeekEndDate = sunday;

  const uniqueId = currentRestaurant.RESTAURANT_DATA.uniqueId;
  const currentOffer = await getOfferFromTo(
    uniqueId,
    thisWeekStartDate,
    thisWeekEndDate
  );

  // We have the offer for this week
  if (currentOffer.length > 0) return currentOffer;
  logger.info(`No offer found for ${restaurant} for this week, fetching...`);

  // We don't have the offer for this week
  const offer = await currentRestaurant.getCurrentOffer();

  if (!offer.succsess) {
    // Error happened while fetching
    logger.info(`Fetching failed for ${restaurant}`);
    return offer.message || 'Unknown error';
  }

  const foodNameData = offer.offers.map((offerItem) => ({
    name: offerItem.foodName,
  }));
  const restaurantData = {
    city: currentRestaurant.RESTAURANT_DATA.city,
    name: currentRestaurant.RESTAURANT_DATA.name,
    uniqueId: uniqueId,
  };

  // Stupid prisma
  await prismaClient.foodName.createMany({
    data: foodNameData,
    skipDuplicates: true,
  });
  const allFoodNameItems = await prismaClient.foodName.findMany({
    where: {
      name: {
        in: foodNameData.map((food) => food.name),
      },
    },
  });

  const createdRestaurant = await prismaClient.restaurant.upsert({
    create: restaurantData,
    update: {},
    where: {
      uniqueId: uniqueId,
    },
  });

  const menuData = offer.offers.map((offerItem) => ({
    date: offerItem.day,
    price: offerItem.price,
    restaurantId: createdRestaurant.restaurantId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    foodNameId: allFoodNameItems.find(
      (food) => food.name === offerItem.foodName
    )?.foodNameId!,
  }));

  await prismaClient.menu.createMany({
    data: menuData,
  });

  const newCurrentOffer = await getOfferFromTo(
    uniqueId,
    thisWeekStartDate,
    thisWeekEndDate
  );

  return newCurrentOffer;
};

export const getCurrentWeekDates = (): { monday: Date; sunday: Date } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when Sunday

  const monday = new Date(today.setDate(diff));
  const sunday = new Date(today.setDate(diff + 6));

  // Reset time to 00:00:00 for both Monday and Sunday
  monday.setHours(0, 0, 0, 0);
  sunday.setHours(0, 0, 0, 0);

  return { monday, sunday };
};

export const getOfferFromTo = async (
  restaurantId: string,
  from: Date,
  to: Date
) => {
  logger.info(`Getting offer from ${from} to ${to}`);
  return await prismaClient.menu.findMany({
    orderBy: {
      date: 'asc',
    },
    include: {
      FoodName: true,
      Restaurant: true,
    },
    where: {
      date: {
        gte: from,
        lte: to,
      },
      AND: {
        Restaurant: {
          uniqueId: restaurantId,
        },
      },
    },
  });
};
