import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776416693073 implements MigrationInterface {
    name = 'Migration1776416693073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tb_location-comment\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`locationCode\` varchar(25) NOT NULL, \`userCode\` varchar(25) NOT NULL, \`content\` varchar(255) NOT NULL, \`rate\` int NOT NULL, \`metaData\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tb_location-comment-reply\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`preCommentId\` int NOT NULL, \`userCode\` varchar(25) NOT NULL, \`content\` varchar(255) NOT NULL, \`rate\` int NOT NULL, \`metaData\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tb_message_attachment\` ADD CONSTRAINT \`FK_e315dbbb26dbbb8115f5fee9e69\` FOREIGN KEY (\`messageId\`) REFERENCES \`tb_message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_message_attachment\` DROP FOREIGN KEY \`FK_e315dbbb26dbbb8115f5fee9e69\``);
        await queryRunner.query(`DROP TABLE \`tb_location-comment-reply\``);
        await queryRunner.query(`DROP TABLE \`tb_location-comment\``);
    }

}
