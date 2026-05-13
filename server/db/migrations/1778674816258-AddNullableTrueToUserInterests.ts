import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableTrueToUserInterests1778674816258 implements MigrationInterface {
    name = 'AddNullableTrueToUserInterests1778674816258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`interests\` \`interests\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`interests\` \`interests\` text NOT NULL`);
    }

}
