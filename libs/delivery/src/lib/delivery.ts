import axios from 'axios';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';
import { prismaClient } from '@ebedmano/kitchenware';
import { logger } from '@ebedmano/kitchenware';
import {
  RESTAURANT,
  getOfferFromTo,
  toEventMapFor,
  updateOfferFor,
} from '@ebedmano/recipes';

dayjs.locale({
  ...hu,
  weekStart: 1,
});

export const deliveryFor = async (restaurantStr: string) => {
  const restaurant = toEventMapFor(restaurantStr as RESTAURANT);
  if (typeof restaurant === 'string') throw new Error('Restaurant not found');

  // Check if restaurant updated
  const { updated } = await updateOfferFor(restaurant);
  if (updated) {
    logger.info(`Offer updated for ${restaurant.RESTAURANT_DATA.name}`);
  }

  const offer = await getOfferFromTo(restaurant.RESTAURANT_DATA.uniqueId);

  if (offer.length === 0) {
    logger.info(`No offer found for ${restaurant.RESTAURANT_DATA.name}`);
    return;
  }

  logger.info('Sending offer to subscribers...');

  // Get all subscribed users for this restaurant
  const subs = await prismaClient.subscription.findMany({
    where: {
      restaurantId: offer[0].restaurantId,
    },
    include: {
      Bot: true,
    },
  });

  if (subs.length === 0) {
    logger.info(`No subscribers found for ${restaurant.RESTAURANT_DATA.name}`);
    return;
  }

  // Build text
  let text = `This week's offer for ${restaurant.RESTAURANT_DATA.name}:\n\n`;
  let day = dayjs(offer[0].date).locale('hu').format('dddd');
  text += `${day.toUpperCase()}\n`;
  text += offer.reduce((acc, curr) => {
    if (day === dayjs(curr.date).locale('hu').format('dddd')) {
      acc += '\n';
    } else {
      day = dayjs(curr.date).locale('hu').format('dddd');
      acc += '<br>\n';
      acc += `${day.toUpperCase()}\n\n`;
    }

    acc += `${curr.FoodName.name} - ${curr.price} Ft\n\n`;
    return acc;
  }, '');

  // logger.info(subs);

  for (const bot of subs) {
    logger.info(bot);
    // If bot posted this week, skip
    if (
      bot.lastPosted &&
      dayjs(bot.lastPosted).isAfter(dayjs().startOf('week'))
    )
      continue;

    await prismaClient.subscription.update({
      where: {
        restaurantId_botId: {
          botId: bot.botId,
          restaurantId: bot.restaurantId,
        },
      },
      data: {
        lastPosted: new Date(),
      },
    });
    await axios.post(bot.Bot.webhookLink, {
      text,
    });
  }
};
