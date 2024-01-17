import { z } from 'zod';

export const subscriptionInputSchema = z.object({
  restaurantId: z.number(),
  botId: z.number(),
});

// export const allSubscriptionsSchema = z.object({

// });
