import { CronJob } from 'cron';
import { deliveryFor } from '@ebedmano/delivery';

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
    await deliveryFor('VESZ_ZONA');
  }, // onTick
  null, // onComplete
  true // start
);

(() => {
  job.start();
})();

// Get all restaurants
// Start cron job for each restaurant
