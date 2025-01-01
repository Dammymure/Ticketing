/*
  Warnings:

  - Added the required column `ticketId` to the `TicketVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketVerification" ADD COLUMN     "ticketId" TEXT NOT NULL;
