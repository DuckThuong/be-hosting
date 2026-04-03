import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775246048027 implements MigrationInterface {
    name = 'Migration1775246048027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_conversation_participant\` ADD \`nickname\` varchar(255) NULL COMMENT 'Biệt danh cuộc trò chuyện theo từng người dùng'`);
        await queryRunner.query(`ALTER TABLE \`tb_conversation\` CHANGE \`type\` \`type\` enum ('RENT', 'CONTACT', 'NORMAL', 'PRIVATE', 'GROUP') NOT NULL COMMENT 'Loại cuộc trò chuyện, v1 chỉ dùng NORMAL' DEFAULT 'NORMAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_conversation\` CHANGE \`type\` \`type\` enum ('RENT', 'CONTACT', 'NORMAL') NOT NULL DEFAULT 'NORMAL'`);
        await queryRunner.query(`ALTER TABLE \`tb_conversation_participant\` DROP COLUMN \`nickname\``);
    }

}
