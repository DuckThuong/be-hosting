import { MigrationInterface, QueryRunner } from 'typeorm';

export class ThreeListingPackages1781100000000 implements MigrationInterface {
  name = 'ThreeListingPackages1781100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`tb_owner_package_plan\`
        (\`planCode\`, \`name\`, \`rentalClass\`, \`price\`, \`durationDays\`, \`maxActiveListings\`, \`isActive\`)
      SELECT 'LONG_BASIC', 'Basic', 'LONG_TERM', 99000, 30, 10, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM \`tb_owner_package_plan\` WHERE \`planCode\` = 'LONG_BASIC'
      )
    `);

    await queryRunner.query(`
      INSERT INTO \`tb_owner_package_plan\`
        (\`planCode\`, \`name\`, \`rentalClass\`, \`price\`, \`durationDays\`, \`maxActiveListings\`, \`isActive\`)
      SELECT 'LONG_PRO', 'Pro', 'LONG_TERM', 199000, 30, 30, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM \`tb_owner_package_plan\` WHERE \`planCode\` = 'LONG_PRO'
      )
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET \`name\` = 'Free',
          \`durationDays\` = 30,
          \`maxActiveListings\` = 3,
          \`isActive\` = 1
      WHERE \`planCode\` = 'LONG_FREE'
    `);

    await queryRunner.query(`
      UPDATE \`tb_payment_transaction\`
      SET \`planCode\` = 'LONG_BASIC'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_subscription\`
      SET \`planCode\` = 'LONG_BASIC'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    await queryRunner.query(`
      DELETE FROM \`tb_owner_package_plan\`
      WHERE \`planCode\` = 'LONG_PLUS'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`tb_owner_package_plan\`
        (\`planCode\`, \`name\`, \`rentalClass\`, \`price\`, \`durationDays\`, \`maxActiveListings\`, \`isActive\`)
      SELECT 'LONG_PLUS', 'Listing Plus', 'LONG_TERM', 99000, 30, 10, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM \`tb_owner_package_plan\` WHERE \`planCode\` = 'LONG_PLUS'
      )
    `);

    await queryRunner.query(`
      UPDATE \`tb_payment_transaction\`
      SET \`planCode\` = 'LONG_PLUS'
      WHERE \`planCode\` = 'LONG_BASIC'
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_subscription\`
      SET \`planCode\` = 'LONG_PLUS'
      WHERE \`planCode\` = 'LONG_BASIC'
    `);

    await queryRunner.query(`
      DELETE FROM \`tb_owner_package_plan\`
      WHERE \`planCode\` IN ('LONG_BASIC', 'LONG_PRO')
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET \`name\` = 'Listing Free Trial',
          \`durationDays\` = 30,
          \`maxActiveListings\` = 3,
          \`isActive\` = 1
      WHERE \`planCode\` = 'LONG_FREE'
    `);
  }
}
