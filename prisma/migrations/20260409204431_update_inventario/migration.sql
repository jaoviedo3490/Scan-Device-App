/*
  Warnings:

  - You are about to alter the column `source` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Inventario` MODIFY `source` JSON NOT NULL;
