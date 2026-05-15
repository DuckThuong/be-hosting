import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingPackageTrial1781000000000 implements MigrationInterface {
  name = 'ListingPackageTrial1781000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTrialReminderSentAt = await queryRunner.hasColumn(
      'tb_owner_package_subscription',
      'trialReminderSentAt',
    );

    if (!hasTrialReminderSentAt) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        ADD \`trialReminderSentAt\` timestamp NULL
      `);
    }

    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET
        \`name\` = 'Listing Free Trial',
        \`durationDays\` = 30
      WHERE \`planCode\` = 'LONG_FREE'
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET \`name\` = 'Listing Plus'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    await queryRunner.query(`
      INSERT INTO \`tb_owner_package_subscription\`
        (\`ownerUserCode\`, \`planCode\`, \`rentalClass\`, \`startsAt\`, \`expiresAt\`, \`trialReminderSentAt\`, \`maxActiveListings\`, \`status\`)
      SELECT DISTINCT
        location.\`ownerCode\`,
        'LONG_FREE',
        'LONG_TERM',
        CURRENT_TIMESTAMP,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
        NULL,
        COALESCE(plan.\`maxActiveListings\`, 3),
        'ACTIVE'
      FROM \`tb_location\` location
      LEFT JOIN \`tb_owner_package_plan\` plan
        ON plan.\`planCode\` = 'LONG_FREE'
      WHERE location.\`deletedAt\` IS NULL
        AND NOT EXISTS (
          SELECT 1
          FROM \`tb_owner_package_subscription\` subscription
          WHERE subscription.\`ownerUserCode\` = location.\`ownerCode\`
            AND subscription.\`rentalClass\` = 'LONG_TERM'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET
        \`name\` = 'Long-term Free',
        \`durationDays\` = NULL
      WHERE \`planCode\` = 'LONG_FREE'
    `);

    await queryRunner.query(`
      UPDATE \`tb_owner_package_plan\`
      SET \`name\` = 'Long-term Plus'
      WHERE \`planCode\` = 'LONG_PLUS'
    `);

    const hasTrialReminderSentAt = await queryRunner.hasColumn(
      'tb_owner_package_subscription',
      'trialReminderSentAt',
    );

    if (hasTrialReminderSentAt) {
      await queryRunner.query(`
        ALTER TABLE \`tb_owner_package_subscription\`
        DROP COLUMN \`trialReminderSentAt\`
      `);
    }
  }
}
