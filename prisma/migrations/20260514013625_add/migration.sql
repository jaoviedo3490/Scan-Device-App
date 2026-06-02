/*
  Warnings:

  - Made the column `Date` on table `IpHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `IpHistory` MODIFY `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
