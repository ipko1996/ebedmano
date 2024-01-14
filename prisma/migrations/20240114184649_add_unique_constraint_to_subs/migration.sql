/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,teamsChannelId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_restaurantId_teamsChannelId_key" ON "Subscription"("restaurantId", "teamsChannelId");
