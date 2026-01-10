CREATE TABLE `audioFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int NOT NULL,
	`duration` int,
	`format` varchar(10) NOT NULL,
	`title` text,
	`artist` text,
	`album` text,
	`albumArtist` text,
	`year` int,
	`genre` text,
	`trackNumber` int,
	`totalTracks` int,
	`comment` text,
	`composer` text,
	`isModified` int NOT NULL DEFAULT 0,
	`modifiedFileKey` varchar(255),
	`modifiedFileUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audioFiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `audioFiles` ADD CONSTRAINT `audioFiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;