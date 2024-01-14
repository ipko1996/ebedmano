-- CreateTable
CREATE TABLE "TeamsChannel" (
    "id" SERIAL NOT NULL,
    "channelName" TEXT NOT NULL,
    "webhookLink" TEXT NOT NULL,

    CONSTRAINT "TeamsChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "teamsChannelId" INTEGER NOT NULL,
    "lastPostedDate" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamsChannel_webhookLink_key" ON "TeamsChannel"("webhookLink");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_teamsChannelId_fkey" FOREIGN KEY ("teamsChannelId") REFERENCES "TeamsChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
