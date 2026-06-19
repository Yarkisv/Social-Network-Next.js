import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtColumnToPost1781877755616 implements MigrationInterface {
    name = 'AddCreatedAtColumnToPost1781877755616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`created_at\``);
    }

}
