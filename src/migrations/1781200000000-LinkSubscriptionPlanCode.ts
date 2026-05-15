import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkSubscriptionPlanCode1781200000000
  implements MigrationInterface
{
  name = 'LinkSubscriptionPlanCode1781200000000';

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
      UPDATE \`tb_owner_package_subscription\`
      SET \`planCode\` = 'LONG_BASIC'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    await queryRunner.query(`
      UPDATE \`tb_payment_transaction\`
      SET \`planCode\` = 'LONG_BASIC'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    const table = await queryRunner.getTable('tb_owner_package_subscription');
    const hasIndex = table?.indices.some(
      (index) => index.name === 'IDX_owner_package_subscription_plan_code',
    );
    if (!hasIndex) {
      await queryRunner.query(`
        CREATE INDEX \`IDX_owner_package_subscription_plan_code\`
        ON \`tb_owner_package_subscription\` (\`planCode\`)
      `);
    }

    const hasForeignKey = table?.foreignKeys.some(
      (foreignKey) =>
        foreignKey.name === 'FK_owner_package_subscription_plan_code',
    );

    if (!hasForeignKey) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        ADD CONSTRAINT \`FK_owner_package_subscription_plan_code\`
        FOREIGN KEY (\`planCode\`)
        REFERENCES \`tb_owner_package_plan\`(\`planCode\`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tb_owner_package_subscription');
    const hasForeignKey = table?.foreignKeys.some(
      (foreignKey) =>
        foreignKey.name === 'FK_owner_package_subscription_plan_code',
    );

    if (hasForeignKey) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        DROP FOREIGN KEY \`FK_owner_package_subscription_plan_code\`
      `);
    }

    const nextTable = await queryRunner.getTable('tb_owner_package_subscription');
    const hasIndex = nextTable?.indices.some(
      (index) => index.name === 'IDX_owner_package_subscription_plan_code',
    );
    if (hasIndex) {
      await queryRunner.query(`
        DROP INDEX \`IDX_owner_package_subscription_plan_code\`
        ON \`tb_owner_package_subscription\`
      `);
    }
  }
}
