-- CreateTable
CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usersChallenges" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idChallenge" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "usersChallenges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usersChallenges" ADD CONSTRAINT "usersChallenges_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersChallenges" ADD CONSTRAINT "usersChallenges_idChallenge_fkey" FOREIGN KEY ("idChallenge") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
