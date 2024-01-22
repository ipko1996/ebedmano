-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurantId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lastPostedDate" TIMESTAMP(3),

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurantId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menuId" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "foodNameId" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menuId")
);

-- CreateTable
CREATE TABLE "FoodName" (
    "foodNameId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FoodName_pkey" PRIMARY KEY ("foodNameId")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "restaurantId" INTEGER NOT NULL,
    "botId" INTEGER NOT NULL,
    "lastPosted" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("restaurantId","botId")
);

-- CreateTable
CREATE TABLE "Bot" (
    "botId" SERIAL NOT NULL,
    "webhookLink" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("botId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_uniqueId_key" ON "Restaurant"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodName_name_key" ON "FoodName"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bot_webhookLink_key" ON "Bot"("webhookLink");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_foodNameId_fkey" FOREIGN KEY ("foodNameId") REFERENCES "FoodName"("foodNameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("botId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
