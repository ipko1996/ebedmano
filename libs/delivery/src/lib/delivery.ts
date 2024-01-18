import axios from 'axios';
import dayjs from 'dayjs';
import('dayjs/locale/hu');
import { prismaClient } from '@ebedmano/kitchenware';
import { logger } from '@ebedmano/kitchenware';
import { getCurrentOfferFor } from '@ebedmano/recipes';

export const delivery = async (restaurant: string) => {
  const offer = await getCurrentOfferFor(restaurant);
  if (typeof offer === 'string') return offer;

  //logger.info(offer);

  // Get all subscribed users for this restaurant
  const subs = await prismaClient.subscription.findMany({
    where: {
      restaurantId: offer[0].restaurantId,
    },
    include: {
      Bot: true,
    },
  });

  // Build text
  let text = `This week's offer for ${offer[0].Restaurant.name}:\n\n`;
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
  logger.info(text);

  // logger.info(subs);

  for (const bot of subs) {
    logger.info(bot);
    await axios.post(bot.Bot.webhookLink, {
      text,
    });
  }

  return 'delivery';
};
