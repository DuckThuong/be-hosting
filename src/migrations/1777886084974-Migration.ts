import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777886084974 implements MigrationInterface {
    name = 'Migration1777886084974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` ADD UNIQUE INDEX \`IDX_791797a3cc1b633f9faf92390d\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` ADD UNIQUE INDEX \`IDX_4048cbc41c4e8401ef009e0c7d\` (\`userCode\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` ADD UNIQUE INDEX \`IDX_f7f025f39bb10cab6617814c84\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` CHANGE \`isEmailVerified\` \`isEmailVerified\` tinyint NOT NULL COMMENT 'Is email verified' DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`tb_location-favorite\` ADD CONSTRAINT \`FK_b0bb73f2c2b828203f745970736\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD CONSTRAINT \`FK_3661598fdd10deb48ee87fad77b\` FOREIGN KEY (\`typeCode\`) REFERENCES \`tb_location-type\`(\`typeCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD CONSTRAINT \`FK_e80c1f1dcdbbd5cc9f138c0f8c0\` FOREIGN KEY (\`ownerCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD CONSTRAINT \`FK_11971cf25977c6d691f27bac6e4\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD CONSTRAINT \`FK_2dbca64eee7c73d12fdf6480c4e\` FOREIGN KEY (\`serviceCode\`) REFERENCES \`tb_service\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment\` ADD CONSTRAINT \`FK_048bdaa708a70b70c2f5df295cb\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment\` ADD CONSTRAINT \`FK_031a17015738be4591702aa6557\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment-reply\` ADD CONSTRAINT \`FK_829950f018dd817d0f8ac826710\` FOREIGN KEY (\`preCommentId\`) REFERENCES \`tb_location-comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment-reply\` ADD CONSTRAINT \`FK_2b57e898aa450e6f7d06436f36e\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_conversation_participant\` ADD CONSTRAINT \`FK_7c2417eced165afedfcfe71260b\` FOREIGN KEY (\`conversationId\`) REFERENCES \`tb_conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_message\` ADD CONSTRAINT \`FK_cb2dbe0dee4475042f883312754\` FOREIGN KEY (\`conversationId\`) REFERENCES \`tb_conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_message_attachment\` ADD CONSTRAINT \`FK_e315dbbb26dbbb8115f5fee9e69\` FOREIGN KEY (\`messageId\`) REFERENCES \`tb_message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_message_attachment\` DROP FOREIGN KEY \`FK_e315dbbb26dbbb8115f5fee9e69\``);
        await queryRunner.query(`ALTER TABLE \`tb_message\` DROP FOREIGN KEY \`FK_cb2dbe0dee4475042f883312754\``);
        await queryRunner.query(`ALTER TABLE \`tb_conversation_participant\` DROP FOREIGN KEY \`FK_7c2417eced165afedfcfe71260b\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment-reply\` DROP FOREIGN KEY \`FK_2b57e898aa450e6f7d06436f36e\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment-reply\` DROP FOREIGN KEY \`FK_829950f018dd817d0f8ac826710\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment\` DROP FOREIGN KEY \`FK_031a17015738be4591702aa6557\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-comment\` DROP FOREIGN KEY \`FK_048bdaa708a70b70c2f5df295cb\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP FOREIGN KEY \`FK_2dbca64eee7c73d12fdf6480c4e\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP FOREIGN KEY \`FK_11971cf25977c6d691f27bac6e4\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP FOREIGN KEY \`FK_e80c1f1dcdbbd5cc9f138c0f8c0\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP FOREIGN KEY \`FK_3661598fdd10deb48ee87fad77b\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-favorite\` DROP FOREIGN KEY \`FK_b0bb73f2c2b828203f745970736\``);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` CHANGE \`isEmailVerified\` \`isEmailVerified\` tinyint NOT NULL COMMENT 'Is email verified' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` DROP INDEX \`IDX_f7f025f39bb10cab6617814c84\``);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` DROP INDEX \`IDX_4048cbc41c4e8401ef009e0c7d\``);
        await queryRunner.query(`ALTER TABLE \`tb_user_default\` DROP INDEX \`IDX_791797a3cc1b633f9faf92390d\``);
    }

}
