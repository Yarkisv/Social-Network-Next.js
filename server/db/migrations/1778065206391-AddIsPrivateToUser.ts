import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPrivateToUser1778065206391 implements MigrationInterface {
    name = 'AddIsPrivateToUser1778065206391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'accepted'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isPrivate\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isPrivate\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`status\``);
    }

}
