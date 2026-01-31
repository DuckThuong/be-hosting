import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769843382052 implements MigrationInterface {
    name = 'Migration1769843382052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`maxTimeLimit\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`hasRent\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`userRentCd\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`minTimeLimit\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`minTimeLimit\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` CHANGE \`locationRate\` \`locationRate\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_location\` CHANGE \`locationRate\` \`locationRate\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`minTimeLimit\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`minTimeLimit\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`userRentCd\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`hasRent\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`maxTimeLimit\``);
    }

}
