import { Prisma } from '@prisma/client';
import { logger } from '@ebedmano/kitchenware';
import { prismaClient } from '@ebedmano/kitchenware';
import dayjs from 'dayjs';
import { IWaiter } from '../staff';

/**
 * Updates the offer for the given restaurant
 * @param currentRestaurant
 */
export const updateOfferFor = async (currentRestaurant: IWaiter) => {
  const thisWeekStartDate = dayjs().startOf('week').toDate();
  const offer = await currentRestaurant.getCurrentOffer(thisWeekStartDate);

  if (!offer.succsess) {
    // Error happened while fetching
    logger.info(
      `Fetching failed for ${currentRestaurant.RESTAURANT_DATA.name}`
    );
    return {
      message: 'Fetching failed',
      error: offer.message || 'Unknown error',
    };
  }

  const foodNameData = offer.offers.map((offerItem) => ({
    name: offerItem.foodName,
  }));
  const restaurantData = {
    city: currentRestaurant.RESTAURANT_DATA.city,
    name: currentRestaurant.RESTAURANT_DATA.name,
    uniqueId: currentRestaurant.RESTAURANT_DATA.uniqueId,
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
      uniqueId: currentRestaurant.RESTAURANT_DATA.uniqueId,
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

  return { message: 'Offer updated' };
};

/**
 *
 * @param uniqueId uniqueId of the restaurant
 * @param {Date} [from=dayjs().startOf('week').toDate()] - default is the start of the week
 * @param {Date} [to=dayjs().endOf('week').toDate()] - default is the end of the week
 */
export const getOfferFromTo = async (
  uniqueId: string,
  from: Date = dayjs().startOf('week').toDate(),
  to: Date = dayjs().endOf('week').toDate()
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
          uniqueId,
        },
      },
    },
  });
};

export type MenuWithFoodNameAndRestaurant = Prisma.PromiseReturnType<
  typeof getOfferFromTo
>;
