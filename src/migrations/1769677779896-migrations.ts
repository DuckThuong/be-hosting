import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class Migrations1769677779896 implements MigrationInterface {
  name = 'Migrations1769677779896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tb_location-service',
      new TableColumn({
        name: 'serviceNote',
        type: 'varchar',
        length: '2000',
        isNullable: false,
      }),
    );

    await queryRunner.createIndex(
      'tb_location-service',
      new TableIndex({
        name: 'IDX_429d324e79b7e0d726e0914853',
        columnNames: ['serviceNote'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'tb_location-service',
      'IDX_429d324e79b7e0d726e0914853',
    );

    await queryRunner.dropColumn('tb_location-service', 'serviceNote');
  }
}
