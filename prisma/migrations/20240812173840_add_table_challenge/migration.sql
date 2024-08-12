-- CreateTable
CREATE TABLE "challenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userChallenge" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idChallenge" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "userChallenge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userChallenge" ADD CONSTRAINT "userChallenge_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userChallenge" ADD CONSTRAINT "userChallenge_idChallenge_fkey" FOREIGN KEY ("idChallenge") REFERENCES "challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
