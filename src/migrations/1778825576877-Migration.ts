import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778825576877 implements MigrationInterface {
    name = 'Migration1778825576877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_payment_booking_code\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_payment_owner_code\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_payment_transaction_code\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_payment_vnpay_txn_ref\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_owner_package_subscription_owner\` ON \`tb_owner_package_subscription\``);
        await queryRunner.query(`DROP INDEX \`IDX_owner_package_plan_code\` ON \`tb_owner_package_plan\``);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` ADD \`trialReminderSentAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` ADD UNIQUE INDEX \`IDX_4de77075b20e90433089638f9f\` (\`transactionCode\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` ADD UNIQUE INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` (\`vnpayTxnRef\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_plan\` ADD UNIQUE INDEX \`IDX_f80a2b815075f936ce3102726f\` (\`planCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_c0c65cae797d4cc63393dd8de1\` ON \`tb_payment_transaction\` (\`bookingCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_d9d9e233d316fdd76ddd3aa9ad\` ON \`tb_payment_transaction\` (\`ownerUserCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_367fcfa76ba289e8c966d419a9\` ON \`tb_owner_package_subscription\` (\`ownerUserCode\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_367fcfa76ba289e8c966d419a9\` ON \`tb_owner_package_subscription\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9d9e233d316fdd76ddd3aa9ad\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_c0c65cae797d4cc63393dd8de1\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_plan\` DROP INDEX \`IDX_f80a2b815075f936ce3102726f\``);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` DROP INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\``);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` DROP INDEX \`IDX_4de77075b20e90433089638f9f\``);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` DROP COLUMN \`trialReminderSentAt\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_owner_package_plan_code\` ON \`tb_owner_package_plan\` (\`planCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_owner_package_subscription_owner\` ON \`tb_owner_package_subscription\` (\`ownerUserCode\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_payment_vnpay_txn_ref\` ON \`tb_payment_transaction\` (\`vnpayTxnRef\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_payment_transaction_code\` ON \`tb_payment_transaction\` (\`transactionCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_payment_owner_code\` ON \`tb_payment_transaction\` (\`ownerUserCode\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_payment_booking_code\` ON \`tb_payment_transaction\` (\`bookingCode\`)`);
    }

}
