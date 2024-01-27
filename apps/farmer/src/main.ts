import { CronJob } from 'cron';
import { deliveryFor } from '@ebedmano/delivery';
import { prismaClient } from '@ebedmano/kitchenware';

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
    for (const restaurant of restaurants) {
      await deliveryFor(restaurant.uniqueId);
    }
  }, // onTick
  null, // onComplete
  true // start
);

(() => {
  job.start();
})();

// Get all restaurants
// Start cron job for each restaurant
