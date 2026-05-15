import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778772884904 implements MigrationInterface {
    name = 'Migration1778772884904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tb_booking\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`bookingCode\` varchar(25) NOT NULL, \`locationCode\` varchar(25) NOT NULL, \`guestUserCode\` varchar(50) NOT NULL, \`ownerUserCode\` varchar(50) NOT NULL, \`checkInDate\` date NULL, \`checkOutDate\` date NULL, \`totalPrice\` decimal(15,2) NOT NULL DEFAULT '0.00', \`status\` enum ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING_PAYMENT', \`paymentStatus\` enum ('UNPAID', 'PAID', 'REFUNDED', 'PARTIAL_REFUND') NOT NULL DEFAULT 'UNPAID', \`stripeSessionId\` varchar(255) NULL, \`stripePaymentIntentId\` varchar(255) NULL, \`cancellationFee\` decimal(15,2) NULL, \`rescheduleFee\` decimal(15,2) NULL, \`note\` varchar(2000) NULL, \`lockedUntil\` timestamp NULL, UNIQUE INDEX \`IDX_e0e3b53266120e0ba898c83eae\` (\`bookingCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`cancellationFeePercent\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`tb_location\` ADD \`rescheduleFeePercent\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`tb_booking\` ADD CONSTRAINT \`FK_d5a851c2296f6deaa4ff5ce3dd2\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tb_booking\` ADD CONSTRAINT \`FK_a4b1a396ac5908bcef5aeda0c25\` FOREIGN KEY (\`guestUserCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_booking\` DROP FOREIGN KEY \`FK_a4b1a396ac5908bcef5aeda0c25\``);
        await queryRunner.query(`ALTER TABLE \`tb_booking\` DROP FOREIGN KEY \`FK_d5a851c2296f6deaa4ff5ce3dd2\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`rescheduleFeePercent\``);
        await queryRunner.query(`ALTER TABLE \`tb_location\` DROP COLUMN \`cancellationFeePercent\``);
        await queryRunner.query(`DROP INDEX \`IDX_e0e3b53266120e0ba898c83eae\` ON \`tb_booking\``);
        await queryRunner.query(`DROP TABLE \`tb_booking\``);
    }

}
