import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778834111790 implements MigrationInterface {
    name = 'Migration1778834111790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` ON \`tb_payment_transaction\``);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` DROP COLUMN \`maxActiveListings\``);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` ADD UNIQUE INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` (\`vnpayTxnRef\`)`);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` ADD CONSTRAINT \`FK_88e4ff70809ec920623447abdc4\` FOREIGN KEY (\`planCode\`) REFERENCES \`tb_owner_package_plan\`(\`planCode\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` DROP FOREIGN KEY \`FK_88e4ff70809ec920623447abdc4\``);
        await queryRunner.query(`ALTER TABLE \`tb_payment_transaction\` DROP INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\``);
        await queryRunner.query(`ALTER TABLE \`tb_owner_package_subscription\` ADD \`maxActiveListings\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` ON \`tb_payment_transaction\` (\`vnpayTxnRef\`)`);
    }

}
