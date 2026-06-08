import { MigrationInterface, QueryRunner } from "typeorm";

export class LastSeenMessageToChatMembers1780913458640 implements MigrationInterface {
    name = 'LastSeenMessageToChatMembers1780913458640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_members\` ADD \`last_read_message_id\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_members\` DROP COLUMN \`last_read_message_id\``);
    }

}
