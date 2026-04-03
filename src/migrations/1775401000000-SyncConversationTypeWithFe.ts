import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncConversationTypeWithFe1775401000000
  implements MigrationInterface
{
  name = 'SyncConversationTypeWithFe1775401000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tb_conversation` MODIFY `type` enum ('PRIVATE','GROUP','RENT','CONTACT','NORMAL') NOT NULL DEFAULT 'NORMAL'",
    );
    await queryRunner.query(
      "UPDATE `tb_conversation` SET `type` = 'NORMAL' WHERE `type` IN ('PRIVATE', 'GROUP')",
    );
    await queryRunner.query(
      "ALTER TABLE `tb_conversation` MODIFY `type` enum ('RENT','CONTACT','NORMAL') NOT NULL DEFAULT 'NORMAL'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tb_conversation` MODIFY `type` enum ('PRIVATE','GROUP','RENT','CONTACT','NORMAL') NOT NULL DEFAULT 'PRIVATE'",
    );
    await queryRunner.query(
      "UPDATE `tb_conversation` SET `type` = 'PRIVATE' WHERE `type` = 'NORMAL'",
    );
    await queryRunner.query(
      "ALTER TABLE `tb_conversation` MODIFY `type` enum ('PRIVATE','GROUP') NOT NULL DEFAULT 'PRIVATE'",
    );
  }
}
