import { Offer } from '@ebedmano/kitchenware';
import { RESTAURANT, toEventMapFor } from '../staff';
import { prismaClient } from '@ebedmano/kitchenware';
import { Menu } from '@prisma/client';

export async function getCurrentOfferFor(
  restaurant: string
): Promise<Menu[] | null | Offer[]> {
  const restaurantEnum = toEventMapFor(restaurant as RESTAURANT);
  if (typeof restaurantEnum === 'string') {
    return null;
  }
  const { monday, sunday } = getCurrentWeekDates();

  // console.log('Monday:', monday.toISOString());
  // console.log('Sunday:', sunday.toISOString());

  const thisWeekStartDate = monday;
  const thisWeekEndDate = sunday;

  const uniqueId = restaurantEnum.RESTAURANT_DATA.uniqueId;
  const currentOffer = await getOfferFromTo(
    uniqueId,
    thisWeekStartDate,
    thisWeekEndDate
  );

  //console.log(currentOffer);

  if (currentOffer.length > 0) {
    return currentOffer;
  }

  const offer = await restaurantEnum.getCurrentOffer();

  const menuItemData = offer.map((offerItem) => ({
    name: offerItem.offer,
  }));
  const restaurantData = {
    city: restaurantEnum.RESTAURANT_DATA.city,
    name: restaurantEnum.RESTAURANT_DATA.name,
    uniqueId: uniqueId,
  };

  // Stupid prisma
  await prismaClient.foodName.createMany({
    data: menuItemData,
    skipDuplicates: true,
  });
  const allMenuItems = await prismaClient.foodName.findMany({
    where: {
      name: {
        in: menuItemData.map((item) => item.name),
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

  const menuData = offer.map((offerItem, index) => ({
    date: offerItem.day,
    price: offerItem.price,
    restaurantId: createdRestaurant.restaurantId,
    foodNameId: allMenuItems[index].foodNameId,
    //menuItemId: allMenuItems.find((item) => item.name === offerItem.offer).id,
  }));

  await prismaClient.menu.createMany({
    data: menuData,
  });

  const newCurrentOffer = await getOfferFromTo(
    uniqueId,
    thisWeekStartDate,
    thisWeekEndDate
  );
  //console.log(newCurrentOffer);

  return newCurrentOffer;
}

const getCurrentWeekDates = (): { monday: Date; sunday: Date } => {
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

const getOfferFromTo = async (restaurantId: string, from: Date, to: Date) => {
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

// {
//   date: offer[0].day,
//   price: offer[0].price,
//   MenuItem: {
//     connectOrCreate: {
//       create: {
//         name: offer[0].offer,
//       },
//       where: {
//         name: offer[0].offer,
//       },
//     },
//   },
//   Restaurant: {
//     connectOrCreate: {
//       where: {
//         uniqueId: uniqueId,
//       },
//       create: {
//         city: restaurantEnum.RESTAURANT_DATA.city,
//         name: restaurantEnum.RESTAURANT_DATA.name,
//         uniqueId: uniqueId,
//       },
//     },
//   },
// }
