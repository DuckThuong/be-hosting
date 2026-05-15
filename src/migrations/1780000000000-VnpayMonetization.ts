import { MigrationInterface, QueryRunner } from 'typeorm';

export class VnpayMonetization1780000000000 implements MigrationInterface {
  name = 'VnpayMonetization1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`tb_payment_transaction\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm',
        \`transactionCode\` varchar(40) NOT NULL,
        \`purpose\` enum ('BOOKING_DEPOSIT', 'OWNER_PACKAGE') NOT NULL,
        \`amount\` decimal(15,2) NOT NULL,
        \`status\` enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
        \`bookingCode\` varchar(25) NULL,
        \`ownerUserCode\` varchar(50) NULL,
        \`planCode\` varchar(50) NULL,
        \`vnpayTxnRef\` varchar(40) NOT NULL,
        \`vnpayTransactionNo\` varchar(50) NULL,
        \`bankCode\` varchar(50) NULL,
        \`payDate\` varchar(20) NULL,
        \`paidAt\` timestamp NULL,
        \`expiredAt\` timestamp NULL,
        UNIQUE INDEX \`IDX_payment_transaction_code\` (\`transactionCode\`),
        UNIQUE INDEX \`IDX_payment_vnpay_txn_ref\` (\`vnpayTxnRef\`),
        INDEX \`IDX_payment_booking_code\` (\`bookingCode\`),
        INDEX \`IDX_payment_owner_code\` (\`ownerUserCode\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`tb_owner_package_plan\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm',
        \`planCode\` varchar(50) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`rentalClass\` enum ('SHORT_TERM', 'LONG_TERM') NOT NULL,
        \`price\` decimal(15,2) NOT NULL DEFAULT '0.00',
        \`durationDays\` int NULL,
        \`maxActiveListings\` int NOT NULL DEFAULT '0',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        UNIQUE INDEX \`IDX_owner_package_plan_code\` (\`planCode\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`tb_owner_package_subscription\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm',
        \`ownerUserCode\` varchar(50) NOT NULL,
        \`planCode\` varchar(50) NOT NULL,
        \`rentalClass\` enum ('SHORT_TERM', 'LONG_TERM') NOT NULL,
        \`startsAt\` timestamp NOT NULL,
        \`expiresAt\` timestamp NULL,
        \`maxActiveListings\` int NOT NULL,
        \`status\` enum ('ACTIVE', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
        INDEX \`IDX_owner_package_subscription_owner\` (\`ownerUserCode\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      INSERT INTO \`tb_owner_package_plan\`
        (\`planCode\`, \`name\`, \`rentalClass\`, \`price\`, \`durationDays\`, \`maxActiveListings\`, \`isActive\`)
      VALUES
        ('LONG_FREE', 'Long-term Free', 'LONG_TERM', 0, NULL, 3, 1),
        ('LONG_PLUS', 'Long-term Plus', 'LONG_TERM', 99000, 30, 10, 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `tb_owner_package_subscription`');
    await queryRunner.query('DROP TABLE `tb_owner_package_plan`');
    await queryRunner.query('DROP TABLE `tb_payment_transaction`');
  }
}
