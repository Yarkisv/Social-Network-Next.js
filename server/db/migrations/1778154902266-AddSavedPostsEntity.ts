import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSavedPostsEntity1778154902266 implements MigrationInterface {
    name = 'AddSavedPostsEntity1778154902266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`saved_posts\` (\`saved_post_id\` int NOT NULL AUTO_INCREMENT, \`userUserId\` int NULL, \`postPostId\` int NULL, UNIQUE INDEX \`IDX_81277e01bd0993d8f851e3e716\` (\`userUserId\`, \`postPostId\`), PRIMARY KEY (\`saved_post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`saved_posts\` ADD CONSTRAINT \`FK_6ed5e6b732e22e627b322fb840c\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_posts\` ADD CONSTRAINT \`FK_5771681c7d17218d336d3938c80\` FOREIGN KEY (\`postPostId\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_posts\` DROP FOREIGN KEY \`FK_5771681c7d17218d336d3938c80\``);
        await queryRunner.query(`ALTER TABLE \`saved_posts\` DROP FOREIGN KEY \`FK_6ed5e6b732e22e627b322fb840c\``);
        await queryRunner.query(`DROP INDEX \`IDX_81277e01bd0993d8f851e3e716\` ON \`saved_posts\``);
        await queryRunner.query(`DROP TABLE \`saved_posts\``);
    }

}
