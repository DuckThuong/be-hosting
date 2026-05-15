import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSubscriptionMaxActiveListings1781300000000
  implements MigrationInterface
{
  name = 'DropSubscriptionMaxActiveListings1781300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(
      'tb_owner_package_subscription',
      'maxActiveListings',
    );

    if (hasColumn) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        DROP COLUMN \`maxActiveListings\`
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(
      'tb_owner_package_subscription',
      'maxActiveListings',
    );

    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        ADD \`maxActiveListings\` int NOT NULL DEFAULT 0
      `);

      await queryRunner.query(`
        UPDATE \`tb_owner_package_subscription\` subscription
        INNER JOIN \`tb_owner_package_plan\` plan
          ON plan.\`planCode\` = subscription.\`planCode\`
        SET subscription.\`maxActiveListings\` = plan.\`maxActiveListings\`
      `);
    }
  }
}
