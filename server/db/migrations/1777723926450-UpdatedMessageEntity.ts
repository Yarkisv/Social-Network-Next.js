import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedMessageEntity1777723926450 implements MigrationInterface {
    name = 'UpdatedMessageEntity1777723926450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`media_path\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`type\` varchar(255) NOT NULL DEFAULT 'text'`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_22133395bd13b970ccd0c34ab22\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`content\` \`content\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`sender_id\` \`sender_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`chat_id\` \`chat_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_22133395bd13b970ccd0c34ab22\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_7540635fef1922f0b156b9ef74f\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chats\`(\`chat_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_7540635fef1922f0b156b9ef74f\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_22133395bd13b970ccd0c34ab22\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`chat_id\` \`chat_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`sender_id\` \`sender_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`content\` \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_22133395bd13b970ccd0c34ab22\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`media_path\``);
    }

}
