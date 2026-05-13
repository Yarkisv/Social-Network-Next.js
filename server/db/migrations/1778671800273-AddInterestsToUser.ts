import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestsToUser1778671800273 implements MigrationInterface {
    name = 'AddInterestsToUser1778671800273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`interests\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`interests\``);
    }

}
