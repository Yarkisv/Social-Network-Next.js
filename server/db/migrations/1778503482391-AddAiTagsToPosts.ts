import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAiTagsToPosts1778503482391 implements MigrationInterface {
    name = 'AddAiTagsToPosts1778503482391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`hashtag\` \`aiTags\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`aiTags\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`aiTags\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`aiTags\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`aiTags\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`aiTags\` \`hashtag\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
