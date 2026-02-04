import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770215173446 implements MigrationInterface {
    name = 'InitSchema1770215173446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Chats\` (\`chat_id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`chat_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Chat_members\` (\`chat_member_id\` int NOT NULL AUTO_INCREMENT, \`chat_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`chat_member_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Messages\` (\`message_id\` int NOT NULL AUTO_INCREMENT, \`chat_id\` int NOT NULL, \`sender_id\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`sent_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`message_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`comment_id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`likes\` int NOT NULL DEFAULT '0', \`sent_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`post_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`comment_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`likes\` (\`like_id\` int NOT NULL AUTO_INCREMENT, \`postPostId\` int NULL, \`userUserId\` int NULL, PRIMARY KEY (\`like_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`post_id\` int NOT NULL AUTO_INCREMENT, \`contentPathTo\` varchar(255) NOT NULL, \`post_title\` varchar(255) NOT NULL DEFAULT '', \`userUserId\` int NULL, PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscription\` (\`subscription_id\` int NOT NULL AUTO_INCREMENT, \`isSubscriptionMutual\` tinyint NOT NULL DEFAULT 0, \`subscriptionSince\` datetime NOT NULL, \`subscriber_id\` int NULL, \`subscribed_to_id\` int NULL, PRIMARY KEY (\`subscription_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`fullname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`avatarPathTo\` varchar(255) NOT NULL DEFAULT '/default-avatar.jpg', PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Chat_members\` ADD CONSTRAINT \`FK_5ab6cae8471410816a7114105d5\` FOREIGN KEY (\`chat_id\`) REFERENCES \`Chats\`(\`chat_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat_members\` ADD CONSTRAINT \`FK_0a62836e1e7b49f3d2be64c0bb8\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_5e6c92cf7e83f784a8ad39c3a26\` FOREIGN KEY (\`sender_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_bbfe153fa60aa06483ed35ff4a7\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_f6577e0f10bd794973cfc02544f\` FOREIGN KEY (\`postPostId\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_7699af221310daf20de0a5139f2\` FOREIGN KEY (\`userUserId\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_b4855b3fc6710c40dc4eef9cf96\` FOREIGN KEY (\`userUserId\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscription\` ADD CONSTRAINT \`FK_e86c94ef2066df53b34d1e5edec\` FOREIGN KEY (\`subscriber_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscription\` ADD CONSTRAINT \`FK_57a34551029a17b1b912ceaee68\` FOREIGN KEY (\`subscribed_to_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscription\` DROP FOREIGN KEY \`FK_57a34551029a17b1b912ceaee68\``);
        await queryRunner.query(`ALTER TABLE \`subscription\` DROP FOREIGN KEY \`FK_e86c94ef2066df53b34d1e5edec\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_b4855b3fc6710c40dc4eef9cf96\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_7699af221310daf20de0a5139f2\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_f6577e0f10bd794973cfc02544f\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_bbfe153fa60aa06483ed35ff4a7\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_5e6c92cf7e83f784a8ad39c3a26\``);
        await queryRunner.query(`ALTER TABLE \`Chat_members\` DROP FOREIGN KEY \`FK_0a62836e1e7b49f3d2be64c0bb8\``);
        await queryRunner.query(`ALTER TABLE \`Chat_members\` DROP FOREIGN KEY \`FK_5ab6cae8471410816a7114105d5\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`subscription\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`likes\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`Messages\``);
        await queryRunner.query(`DROP TABLE \`Chat_members\``);
        await queryRunner.query(`DROP TABLE \`Chats\``);
    }

}
