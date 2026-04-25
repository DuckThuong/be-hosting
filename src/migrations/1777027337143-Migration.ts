import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777027337143 implements MigrationInterface {
    name = 'Migration1777027337143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_service\` ADD \`pricingType\` enum ('FULL', 'DAILY') NOT NULL DEFAULT 'FULL'`);
        await queryRunner.query(`ALTER TABLE \`tb_service\` ADD \`isCustom\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`tb_service\` ADD \`createdByUserCode\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`locationCode\`, \`serviceCode\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD \`customPrice\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD \`pricingType\` enum ('FULL', 'DAILY') NOT NULL DEFAULT 'FULL'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`serviceCode\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`serviceCode\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`locationCode\`, \`serviceCode\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key'`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP COLUMN \`pricingType\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP COLUMN \`customPrice\``);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`locationCode\`, \`serviceCode\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_location-service\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`tb_service\` DROP COLUMN \`createdByUserCode\``);
        await queryRunner.query(`ALTER TABLE \`tb_service\` DROP COLUMN \`isCustom\``);
        await queryRunner.query(`ALTER TABLE \`tb_service\` DROP COLUMN \`pricingType\``);
    }

}
