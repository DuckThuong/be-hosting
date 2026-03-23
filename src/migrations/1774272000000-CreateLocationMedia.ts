import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationMedia1774272000000 implements MigrationInterface {
  name = 'CreateLocationMedia1774272000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`tb_location-media\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        \`mediaCode\` varchar(50) NOT NULL,
        \`locationCode\` varchar(25) NOT NULL,
        \`mediaUrl\` varchar(2000) NOT NULL,
        \`mediaType\` enum ('IMAGE', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
        \`displayOrder\` int NOT NULL DEFAULT 1,
        \`isLogo\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`IDX_location_media_code\` (\`mediaCode\`),
        INDEX \`IDX_location_media_location_code\` (\`locationCode\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_location_media_location_code\`
          FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`)
          ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      INSERT INTO \`tb_location-media\`
        (\`mediaCode\`, \`locationCode\`, \`mediaUrl\`, \`mediaType\`, \`displayOrder\`, \`isLogo\`)
      SELECT
        CONCAT('MEDIA_', LPAD(CAST(\`id\` AS CHAR), 8, '0')),
        \`locationCode\`,
        \`locationLogo\`,
        'IMAGE',
        1,
        1
      FROM \`tb_location\`
      WHERE \`locationLogo\` IS NOT NULL
        AND TRIM(\`locationLogo\`) <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM \`tb_location-media\` media
          WHERE media.\`locationCode\` = \`tb_location\`.\`locationCode\`
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `tb_location-media` DROP FOREIGN KEY `FK_location_media_location_code`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_location_media_location_code` ON `tb_location-media`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_location_media_code` ON `tb_location-media`',
    );
    await queryRunner.query('DROP TABLE `tb_location-media`');
  }
}
