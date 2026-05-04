import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777893104083 implements MigrationInterface {
    name = 'Migration1777893104083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` DROP FOREIGN KEY \`FK_f6a3c608ad4dfdc048c8563bd05\``);
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` CHANGE \`fullAddress\` \`fullAddress\` varchar(255) NULL COMMENT 'Địa chỉ chi tiết'`);
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` ADD CONSTRAINT \`FK_f6a3c608ad4dfdc048c8563bd05\` FOREIGN KEY (\`user_id\`) REFERENCES \`tb_user_default\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` DROP FOREIGN KEY \`FK_f6a3c608ad4dfdc048c8563bd05\``);
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` CHANGE \`fullAddress\` \`fullAddress\` varchar(255) NOT NULL COMMENT 'Địa chỉ chi tiết'`);
        await queryRunner.query(`ALTER TABLE \`tb_user_profile\` ADD CONSTRAINT \`FK_f6a3c608ad4dfdc048c8563bd05\` FOREIGN KEY (\`user_id\`) REFERENCES \`tb_user_default\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
