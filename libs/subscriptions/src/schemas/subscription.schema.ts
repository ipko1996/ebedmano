import { z } from 'zod';

export const subscriptionInputSchema = z.object({
  restaurantId: z.number(),
  teamsChannelId: z.number(),
});

// export const allSubscriptionsSchema = z.object({

// });
