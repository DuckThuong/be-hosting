import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveStripeFromBooking1778888888888 implements MigrationInterface {
    name = 'RemoveStripeFromBooking1778888888888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_booking\` DROP COLUMN \`stripePaymentIntentId\``);
        await queryRunner.query(`ALTER TABLE \`tb_booking\` DROP COLUMN \`stripeSessionId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_booking\` ADD \`stripeSessionId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tb_booking\` ADD \`stripePaymentIntentId\` varchar(255) NULL`);
    }

}
