-- CreateTable
CREATE TABLE "reward" (
    "id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idRewardType" INTEGER NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewardType" (
    "id" SERIAL NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "rewardType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reward" ADD CONSTRAINT "reward_idRewardType_fkey" FOREIGN KEY ("idRewardType") REFERENCES "rewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward" ADD CONSTRAINT "reward_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
