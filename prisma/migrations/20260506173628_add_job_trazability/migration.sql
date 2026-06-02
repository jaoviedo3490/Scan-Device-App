/*
  Warnings:

  - A unique constraint covering the columns `[processId]` on the table `Jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Jobs` ALTER COLUMN `processId` DROP DEFAULT;

-- CreateTable
CREATE TABLE `AuditoryJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Date_Start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Date_End` DATETIME(3) NOT NULL,
    `JobId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Jobs_processId_key` ON `Jobs`(`processId`);

-- AddForeignKey
ALTER TABLE `AuditoryJob` ADD CONSTRAINT `AuditoryJob_JobId_fkey` FOREIGN KEY (`JobId`) REFERENCES `Jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
