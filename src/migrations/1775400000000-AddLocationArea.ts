import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationArea1775400000000 implements MigrationInterface {
  name = 'AddLocationArea1775400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('tb_location', 'locationArea');
    if (!hasColumn) {
      await queryRunner.query(
        'ALTER TABLE `tb_location` ADD `locationArea` decimal NULL AFTER `locationPriceAfterDeal`',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('tb_location', 'locationArea');
    if (hasColumn) {
      await queryRunner.query(
        'ALTER TABLE `tb_location` DROP COLUMN `locationArea`',
      );
    }
  }
}
