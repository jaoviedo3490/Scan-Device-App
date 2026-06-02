-- CreateTable
CREATE TABLE `Jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `config` TEXT NOT NULL,
    `Date_Created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcessJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NOT NULL,
    `state` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
