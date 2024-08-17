-- CreateTable
CREATE TABLE "timelogs" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "idUser" TEXT NOT NULL,
    "idTask" INTEGER NOT NULL,

    CONSTRAINT "timelogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "timelogs" ADD CONSTRAINT "timelogs_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelogs" ADD CONSTRAINT "timelogs_idTask_fkey" FOREIGN KEY ("idTask") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
