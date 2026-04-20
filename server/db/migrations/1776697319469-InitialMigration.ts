import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1776697319469 implements MigrationInterface {
    name = 'InitialMigration1776697319469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chats\` (\`chat_id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`chat_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_members\` (\`chat_member_id\` int NOT NULL AUTO_INCREMENT, \`chat_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`chat_member_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`message_id\` int NOT NULL AUTO_INCREMENT, \`chat_id\` int NOT NULL, \`sender_id\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`sent_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`message_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`comment_id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`likes\` int NOT NULL DEFAULT '0', \`sent_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`post_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`comment_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`likes\` (\`like_id\` int NOT NULL AUTO_INCREMENT, \`postPostId\` int NULL, \`userUserId\` int NULL, PRIMARY KEY (\`like_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path_to\` varchar(255) NOT NULL, \`postPostId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`post_id\` int NOT NULL AUTO_INCREMENT, \`post_title\` varchar(255) NOT NULL DEFAULT '', \`userUserId\` int NULL, PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`subscription_id\` int NOT NULL AUTO_INCREMENT, \`isSubscriptionMutual\` tinyint NOT NULL DEFAULT 0, \`subscriptionSince\` datetime NOT NULL, \`subscriber_id\` int NULL, \`subscribed_to_id\` int NULL, PRIMARY KEY (\`subscription_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`fullname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`avatarPathTo\` varchar(255) NOT NULL DEFAULT '/default-avatar.jpg', PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat_members\` ADD CONSTRAINT \`FK_29ffb4b6edf59a7862129765339\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chats\`(\`chat_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_members\` ADD CONSTRAINT \`FK_9dc61e92eed1dc151c2b2ef01a0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_22133395bd13b970ccd0c34ab22\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_259bf9825d9d198608d1b46b0b5\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4c675567d2a58f0b07cef09c13d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_f6577e0f10bd794973cfc02544f\` FOREIGN KEY (\`postPostId\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_7699af221310daf20de0a5139f2\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_images\` ADD CONSTRAINT \`FK_c3c29bcffe0bd490952ecb661c2\` FOREIGN KEY (\`postPostId\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_b4855b3fc6710c40dc4eef9cf96\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_f56b7683178d56b3907fea72489\` FOREIGN KEY (\`subscriber_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_153beb481df5d759e4d92d1892d\` FOREIGN KEY (\`subscribed_to_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_153beb481df5d759e4d92d1892d\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_f56b7683178d56b3907fea72489\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_b4855b3fc6710c40dc4eef9cf96\``);
        await queryRunner.query(`ALTER TABLE \`post_images\` DROP FOREIGN KEY \`FK_c3c29bcffe0bd490952ecb661c2\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_7699af221310daf20de0a5139f2\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_f6577e0f10bd794973cfc02544f\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4c675567d2a58f0b07cef09c13d\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_259bf9825d9d198608d1b46b0b5\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_22133395bd13b970ccd0c34ab22\``);
        await queryRunner.query(`ALTER TABLE \`chat_members\` DROP FOREIGN KEY \`FK_9dc61e92eed1dc151c2b2ef01a0\``);
        await queryRunner.query(`ALTER TABLE \`chat_members\` DROP FOREIGN KEY \`FK_29ffb4b6edf59a7862129765339\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`post_images\``);
        await queryRunner.query(`DROP TABLE \`likes\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP TABLE \`chat_members\``);
        await queryRunner.query(`DROP TABLE \`chats\``);
    }

}
