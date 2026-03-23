import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedLocationFavorite1774271900000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`tb_location-favorite\` (\`locationCode\`, \`userCode\`)
      SELECT seed.locationCode, seed.userCode
      FROM (
        SELECT l.locationCode, u.userCode
        FROM (
          SELECT \`locationCode\`, \`ownerCode\`
          FROM \`tb_location\`
          ORDER BY \`id\` ASC
          LIMIT 5
        ) l
        CROSS JOIN (
          SELECT \`userCode\`
          FROM \`tb_user_default\`
          ORDER BY \`id\` ASC
          LIMIT 2
        ) u
        WHERE l.ownerCode <> u.userCode
      ) seed
      WHERE NOT EXISTS (
        SELECT 1
        FROM \`tb_location-favorite\` f
        WHERE f.\`locationCode\` = seed.\`locationCode\`
          AND f.\`userCode\` = seed.\`userCode\`
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE f
      FROM \`tb_location-favorite\` f
      INNER JOIN (
        SELECT seed.locationCode, seed.userCode
        FROM (
          SELECT l.locationCode, u.userCode
          FROM (
            SELECT \`locationCode\`, \`ownerCode\`
            FROM \`tb_location\`
            ORDER BY \`id\` ASC
            LIMIT 5
          ) l
          CROSS JOIN (
            SELECT \`userCode\`
            FROM \`tb_user_default\`
            ORDER BY \`id\` ASC
            LIMIT 2
          ) u
          WHERE l.ownerCode <> u.userCode
        ) seed
      ) target
        ON target.locationCode = f.locationCode
       AND target.userCode = f.userCode;
    `);
  }
}
