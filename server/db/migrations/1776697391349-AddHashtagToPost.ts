import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashtagToPost1776697391349 implements MigrationInterface {
    name = 'AddHashtagToPost1776697391349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`hashtag\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`hashtag\``);
    }

}
