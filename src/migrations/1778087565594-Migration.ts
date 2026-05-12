import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778087565594 implements MigrationInterface {
    name = 'Migration1778087565594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationPriceStart\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationPriceEnd\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationPrice\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationPriceUnit\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationRate\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationRate\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationRate\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationRate\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationPriceUnit\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`locationPrice\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationPriceEnd\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`locationPriceStart\` decimal NULL`);
    }

}
