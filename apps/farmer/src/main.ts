import { CronJob } from 'cron';
import { deliveryFor } from '@ebedmano/delivery';
import { prismaClient, connectToDb, logger } from '@ebedmano/kitchenware';

/**
 * Lets just call a function in every hour
 * that will check if there is a new offer
 *
 * This will call a function which will decide
 * if it has to start looking for a new offer
 */
const job = new CronJob(
  '* * * * *', // cronTime
  async function () {
    const restaurants = await prismaClient.restaurant.findMany();
    if (restaurants.length === 0) {
      logger.info('No restaurants found');
      return;
    }
    for (const restaurant of restaurants) {
      await deliveryFor(restaurant.uniqueId);
    }
  }, // onTick
  null, // onComplete
  true // start
);

(async () => {
  await connectToDb();
  job.start();
  //await deliveryFor('VESZ_ZONA');
})();

// Get all restaurants
// Start cron job for each restaurant
