-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idRewardType" INTEGER NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewardTypes" (
    "id" SERIAL NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "rewardTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_idRewardsType_fkey" FOREIGN KEY ("idRewardType") REFERENCES "rewardTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
