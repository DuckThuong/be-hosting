import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dataSource from '../data-source';

type SeedTarget = {
  table: string;
  deleteSql: string;
  countSql: string;
  params?: Array<string | number | null>;
};

type SeedRefs = {
  userCodes: string[];
  locationCodes: string[];
  addressCodes: string[];
  mediaCodes: string[];
  locationTypeCodes: string[];
  serviceCodes: string[];
  conversationKeys: string[];
  conversationNames: Array<string | null>;
  conversationCreatorCodes: string[];
  messageKeys: string[];
  messageContents: Array<string | null>;
};

type SeedConversation = {
  seedKey: string;
  type: string;
  name: string | null;
  avatar: string | null;
  createdByUserCode: string;
  status: string;
};

type SeedMessage = {
  seedKey: string;
  conversationSeedKey: string;
  senderUserCode: string;
  senderAvatarUrl: string | null;
  type: string;
  content: string | null;
  metadata: Record<string, unknown> | null;
  replyToMessageSeedKey: string | null;
  status: string;
  editedAt: string | null;
  deletedAt: string | null;
  deletedByUserCode: string | null;
  createdAt: string;
  updatedAt: string;
};

const FIXTURE_ROOT = path.join(__dirname, 'data');

function readJsonArrayFile(filePath: string): unknown[] {
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Fixture "${filePath}" must contain an array.`);
  }
  return parsed;
}

function placeholders(values: readonly unknown[]): string {
  return values.map(() => '?').join(', ');
}

function loadCodes(tableName: string, key: string): string[] {
  const rows = readJsonArrayFile(path.join(FIXTURE_ROOT, `${tableName}.json`));
  const values = rows.map((row) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`Invalid fixture row in ${tableName}: expected object.`);
    }
    const value = (row as Record<string, unknown>)[key];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Invalid fixture row in ${tableName}: missing "${key}".`);
    }
    return value;
  });
  return Array.from(new Set(values));
}

function loadConversations(): SeedConversation[] {
  return readJsonArrayFile(path.join(FIXTURE_ROOT, 'tb_conversation.json')) as SeedConversation[];
}

function loadMessages(): SeedMessage[] {
  return readJsonArrayFile(path.join(FIXTURE_ROOT, 'tb_message.json')) as SeedMessage[];
}

function loadSeedRefs(): SeedRefs {
  const conversations = loadConversations();
  const messages = loadMessages();

  return {
    userCodes: loadCodes('tb_user_default', 'userCode'),
    locationCodes: loadCodes('tb_location', 'locationCode'),
    addressCodes: loadCodes('tb_location-address', 'addressCode'),
    mediaCodes: loadCodes('tb_location-media', 'mediaCode'),
    locationTypeCodes: loadCodes('tb_location-type', 'typeCode'),
    serviceCodes: loadCodes('tb_service', 'code'),
    conversationKeys: conversations.map((item) => item.seedKey),
    conversationNames: conversations.map((item) => item.name),
    conversationCreatorCodes: conversations.map((item) => item.createdByUserCode),
    messageKeys: messages.map((item) => item.seedKey),
    messageContents: messages.map((item) => item.content),
  };
}

function buildTargets(refs: SeedRefs): SeedTarget[] {
  const userCodePlaceholders = placeholders(refs.userCodes);
  const locationCodePlaceholders = placeholders(refs.locationCodes);
  const addressCodePlaceholders = placeholders(refs.addressCodes);
  const mediaCodePlaceholders = placeholders(refs.mediaCodes);
  const locationTypePlaceholders = placeholders(refs.locationTypeCodes);
  const serviceCodePlaceholders = placeholders(refs.serviceCodes);
  const conversationCreatorPlaceholders = placeholders(refs.conversationCreatorCodes);

  return [
    {
      table: 'tb_message_attachment',
      countSql: `
        SELECT COUNT(*) AS total
        FROM \`tb_message_attachment\`
        WHERE \`messageId\` IN (
          SELECT m.id
          FROM \`tb_message\` m
          INNER JOIN \`tb_conversation\` c ON c.id = m.conversationId
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      deleteSql: `
        DELETE FROM \`tb_message_attachment\`
        WHERE \`messageId\` IN (
          SELECT m.id
          FROM \`tb_message\` m
          INNER JOIN \`tb_conversation\` c ON c.id = m.conversationId
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      params: refs.conversationCreatorCodes,
    },
    {
      table: 'tb_message',
      countSql: `
        SELECT COUNT(*) AS total
        FROM \`tb_message\`
        WHERE \`conversationId\` IN (
          SELECT c.id
          FROM \`tb_conversation\` c
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      deleteSql: `
        DELETE FROM \`tb_message\`
        WHERE \`conversationId\` IN (
          SELECT c.id
          FROM \`tb_conversation\` c
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      params: refs.conversationCreatorCodes,
    },
    {
      table: 'tb_conversation_participant',
      countSql: `
        SELECT COUNT(*) AS total
        FROM \`tb_conversation_participant\`
        WHERE \`conversationId\` IN (
          SELECT c.id
          FROM \`tb_conversation\` c
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      deleteSql: `
        DELETE FROM \`tb_conversation_participant\`
        WHERE \`conversationId\` IN (
          SELECT c.id
          FROM \`tb_conversation\` c
          INNER JOIN \`tb_user_default\` u ON u.id = c.createdByUserId
          WHERE u.userCode IN (${conversationCreatorPlaceholders})
        )
      `,
      params: refs.conversationCreatorCodes,
    },
    {
      table: 'tb_conversation',
      countSql: `
        SELECT COUNT(*) AS total
        FROM \`tb_conversation\`
        WHERE \`createdByUserId\` IN (
          SELECT \`id\`
          FROM \`tb_user_default\`
          WHERE \`userCode\` IN (${conversationCreatorPlaceholders})
        )
      `,
      deleteSql: `
        DELETE FROM \`tb_conversation\`
        WHERE \`createdByUserId\` IN (
          SELECT \`id\`
          FROM \`tb_user_default\`
          WHERE \`userCode\` IN (${conversationCreatorPlaceholders})
        )
      `,
      params: refs.conversationCreatorCodes,
    },
    {
      table: 'tb_location-favorite',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location-favorite\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location-favorite\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      params: refs.locationCodes,
    },
    {
      table: 'tb_location-service',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location-service\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location-service\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      params: refs.locationCodes,
    },
    {
      table: 'tb_location-media',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location-media\` WHERE \`mediaCode\` IN (${mediaCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location-media\` WHERE \`mediaCode\` IN (${mediaCodePlaceholders})`,
      params: refs.mediaCodes,
    },
    {
      table: 'tb_location-address',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location-address\` WHERE \`addressCode\` IN (${addressCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location-address\` WHERE \`addressCode\` IN (${addressCodePlaceholders})`,
      params: refs.addressCodes,
    },
    {
      table: 'tb_location',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location\` WHERE \`locationCode\` IN (${locationCodePlaceholders})`,
      params: refs.locationCodes,
    },
    {
      table: 'tb_user_profile',
      countSql: `
        SELECT COUNT(*) AS total
        FROM \`tb_user_profile\`
        WHERE \`user_id\` IN (
          SELECT \`id\` FROM \`tb_user_default\` WHERE \`userCode\` IN (${userCodePlaceholders})
        )
      `,
      deleteSql: `
        DELETE FROM \`tb_user_profile\`
        WHERE \`user_id\` IN (
          SELECT \`id\` FROM \`tb_user_default\` WHERE \`userCode\` IN (${userCodePlaceholders})
        )
      `,
      params: refs.userCodes,
    },
    {
      table: 'tb_user_default',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_user_default\` WHERE \`userCode\` IN (${userCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_user_default\` WHERE \`userCode\` IN (${userCodePlaceholders})`,
      params: refs.userCodes,
    },
    {
      table: 'tb_service',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_service\` WHERE \`code\` IN (${serviceCodePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_service\` WHERE \`code\` IN (${serviceCodePlaceholders})`,
      params: refs.serviceCodes,
    },
    {
      table: 'tb_location-type',
      countSql: `SELECT COUNT(*) AS total FROM \`tb_location-type\` WHERE \`typeCode\` IN (${locationTypePlaceholders})`,
      deleteSql: `DELETE FROM \`tb_location-type\` WHERE \`typeCode\` IN (${locationTypePlaceholders})`,
      params: refs.locationTypeCodes,
    },
  ];
}

async function ensureSchema(): Promise<void> {
  const requiredTables = [
    'tb_user_default',
    'tb_user_profile',
    'tb_service',
    'tb_location-type',
    'tb_location',
    'tb_location-address',
    'tb_location-service',
    'tb_location-favorite',
    'tb_location-media',
    'tb_conversation',
    'tb_conversation_participant',
    'tb_message',
    'tb_message_attachment',
  ];

  for (const tableName of requiredTables) {
    const rows = await dataSource.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1`,
      [tableName],
    );
    if (!rows.length) throw new Error(`Missing table: ${tableName}. Run migrations first.`);
  }
}

async function showSummary(): Promise<void> {
  const tables = [
    'tb_user_default',
    'tb_user_profile',
    'tb_location-type',
    'tb_service',
    'tb_location',
    'tb_location-address',
    'tb_location-service',
    'tb_location-favorite',
    'tb_location-media',
    'tb_conversation',
    'tb_conversation_participant',
    'tb_message',
    'tb_message_attachment',
  ];

  const summary: Array<{ table: string; total: number }> = [];
  for (const tableName of tables) {
    const rows = await dataSource.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
    summary.push({ table: tableName, total: Number(rows[0].total) });
  }
  console.table(summary);
}

async function undoSeed(dryRun: boolean): Promise<void> {
  const refs = loadSeedRefs();
  const targets = buildTargets(refs);

  if (dryRun) {
    const summary: Array<{ table: string; matchedRows: number }> = [];
    for (const target of targets) {
      const rows = await dataSource.query(target.countSql, target.params ?? []);
      summary.push({ table: target.table, matchedRows: Number(rows[0].total) });
    }
    console.table(summary);
    console.log('Dry run completed. No data was deleted.');
    return;
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const target of targets) {
      await queryRunner.query(target.deleteSql, target.params ?? []);
    }
    await queryRunner.commitTransaction();
    console.log('Undo seed completed.');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

async function run(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  await dataSource.initialize();

  try {
    await ensureSchema();
    await undoSeed(dryRun);
    await showSummary();
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Undo seed failed:', error);
  process.exit(1);
});
