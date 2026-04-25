import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorLocationServicesPricing1777000000000
  implements MigrationInterface
{
  name = 'RefactorLocationServicesPricing1777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tb_service\` ADD \`pricingType\` enum ('FULL', 'DAILY') NOT NULL DEFAULT 'FULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_service\` ADD \`isCustom\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_service\` ADD \`createdByUserCode\` varchar(50) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD \`customPrice\` decimal NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD \`pricingType\` enum ('FULL', 'DAILY') NOT NULL DEFAULT 'FULL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP COLUMN \`pricingType\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP COLUMN \`customPrice\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD PRIMARY KEY (\`locationCode\`, \`serviceCode\`)`,
    );

    await queryRunner.query(
      `ALTER TABLE \`tb_service\` DROP COLUMN \`createdByUserCode\``,
    );
    await queryRunner.query(`ALTER TABLE \`tb_service\` DROP COLUMN \`isCustom\``);
    await queryRunner.query(
      `ALTER TABLE \`tb_service\` DROP COLUMN \`pricingType\``,
    );
  }
}
