/*
  Warnings:

  - Added the required column `userId` to the `TicketVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketVerification" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketVerification" ADD CONSTRAINT "TicketVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
