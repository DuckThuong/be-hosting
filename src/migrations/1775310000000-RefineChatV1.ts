import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class RefineChatV11775310000000 implements MigrationInterface {
  name = 'RefineChatV11775310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('tb_conversation')) {
      if (await queryRunner.hasColumn('tb_conversation', 'lastMessage')) {
        await queryRunner.renameColumn(
          'tb_conversation',
          'lastMessage',
          'lastMessagePreview',
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation', 'name'))) {
        await queryRunner.addColumn(
          'tb_conversation',
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation', 'lastMessageId'))) {
        await queryRunner.addColumn(
          'tb_conversation',
          new TableColumn({
            name: 'lastMessageId',
            type: 'int',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation', 'lastMessageType'))) {
        await queryRunner.addColumn(
          'tb_conversation',
          new TableColumn({
            name: 'lastMessageType',
            type: 'enum',
            enum: ['TEXT', 'IMAGE', 'FILE', 'SYSTEM'],
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation', 'createdByUserId'))) {
        await queryRunner.addColumn(
          'tb_conversation',
          new TableColumn({
            name: 'createdByUserId',
            type: 'int',
            default: 0,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation', 'status'))) {
        await queryRunner.addColumn(
          'tb_conversation',
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'ARCHIVED', 'BLOCKED'],
            default: "'ACTIVE'",
          }),
        );
      }
    }

    if (await queryRunner.hasTable('tb_conversation_participant')) {
      if (await queryRunner.hasColumn('tb_conversation_participant', 'isMuted')) {
        await queryRunner.renameColumn(
          'tb_conversation_participant',
          'isMuted',
          'muteUntil',
        );
        await queryRunner.changeColumn(
          'tb_conversation_participant',
          'muteUntil',
          new TableColumn({
            name: 'muteUntil',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      } else if (
        !(await queryRunner.hasColumn('tb_conversation_participant', 'muteUntil'))
      ) {
        await queryRunner.addColumn(
          'tb_conversation_participant',
          new TableColumn({
            name: 'muteUntil',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }

      if (
        await queryRunner.hasColumn('tb_conversation_participant', 'isDeleted')
      ) {
        await queryRunner.renameColumn(
          'tb_conversation_participant',
          'isDeleted',
          'deletedAt',
        );
        await queryRunner.changeColumn(
          'tb_conversation_participant',
          'deletedAt',
          new TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      } else if (
        !(await queryRunner.hasColumn('tb_conversation_participant', 'deletedAt'))
      ) {
        await queryRunner.addColumn(
          'tb_conversation_participant',
          new TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_conversation_participant', 'joinedAt'))) {
        await queryRunner.addColumn(
          'tb_conversation_participant',
          new TableColumn({
            name: 'joinedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          }),
        );
      }

      if (
        !(await queryRunner.hasColumn('tb_conversation_participant', 'lastReadAt'))
      ) {
        await queryRunner.addColumn(
          'tb_conversation_participant',
          new TableColumn({
            name: 'lastReadAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }
    }

    if (await queryRunner.hasTable('tb_message')) {
      if (await queryRunner.hasColumn('tb_message', 'avartarUrl')) {
        await queryRunner.renameColumn(
          'tb_message',
          'avartarUrl',
          'senderAvatarUrl',
        );
      } else if (!(await queryRunner.hasColumn('tb_message', 'senderAvatarUrl'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'senderAvatarUrl',
            type: 'varchar',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_message', 'replyToMessageId'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'replyToMessageId',
            type: 'int',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_message', 'status'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['SENT', 'DELIVERED', 'READ'],
            default: "'SENT'",
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_message', 'editedAt'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'editedAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }

      if (await queryRunner.hasColumn('tb_message', 'isDeleted')) {
        await queryRunner.renameColumn('tb_message', 'isDeleted', 'deletedAt');
        await queryRunner.changeColumn(
          'tb_message',
          'deletedAt',
          new TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      } else if (!(await queryRunner.hasColumn('tb_message', 'deletedAt'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_message', 'deletedByUserId'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'deletedByUserId',
            type: 'int',
            isNullable: true,
          }),
        );
      }

      if (!(await queryRunner.hasColumn('tb_message', 'updatedAt'))) {
        await queryRunner.addColumn(
          'tb_message',
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          }),
        );
      }
    }

    if (!(await queryRunner.hasTable('tb_message_attachment'))) {
      await queryRunner.createTable(
        new Table({
          name: 'tb_message_attachment',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'messageId',
              type: 'int',
            },
            {
              name: 'fileName',
              type: 'varchar',
            },
            {
              name: 'mimeType',
              type: 'varchar',
            },
            {
              name: 'size',
              type: 'bigint',
            },
            {
              name: 'url',
              type: 'varchar',
            },
            {
              name: 'storageKey',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'width',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'height',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
          indices: [
            new TableIndex({
              name: 'IDX_tb_message_attachment_messageId',
              columnNames: ['messageId'],
            }),
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('tb_message_attachment')) {
      await queryRunner.dropTable('tb_message_attachment');
    }
  }
}
