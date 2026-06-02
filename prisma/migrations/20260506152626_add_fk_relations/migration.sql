/*
  Warnings:

  - You are about to drop the column `processID` on the `Jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Jobs` DROP COLUMN `processID`,
    ADD COLUMN `processId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Jobs` ADD CONSTRAINT `Jobs_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `ProcessJob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
