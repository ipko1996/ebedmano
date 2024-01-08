import { CronJob } from 'cron';
import { getCurrentOfferFor } from '@ebedmano/recipes';

/**
 * Lets just call a function in every hour
 * that will check if there is a new offer
 *
 * This will call a function which will decide
 * if it has to start looking for a new offer
 */
const job = new CronJob(
  '* * * * * *', // cronTime
  function () {
    console.log('You will see this message every second');
  }, // onTick
  null, // onComplete
  true, // start
  'America/Los_Angeles' // timeZone
);

job.start();

(async () => {
  await getCurrentOfferFor('asd');
})();
