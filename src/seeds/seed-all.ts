import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dataSource from '../data-source';
import { ROUND } from '../assets/constants/constants';

type SeedUser = {
  userCode: string;
  username: string;
  email: string;
  fullName: string;
  role: number;
  status: number;
  isEmailVerified: boolean;
};

type SeedProfile = {
  userCode: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  dateOfBirth: string;
  phone: string;
  fullAddress: string;
  userWard: string;
  userDistrict: string;
  userCity: string;
  userProvince: string;
  userCountry: string;
  userPortal: string;
  userLat: string;
  userLong: string;
  userDescription: string;
  userNote: string;
};

type SeedLocationType = {
  typeCode: string;
  typeName: string;
  typeDescription: string | null;
  typeLogo: string | null;
  typeBackGround: string | null;
};

type SeedService = {
  code: string;
  name: string;
  description: string;
  category?: string;
  serviceCode?: string;
  serviceName?: string;
  serviceDescription?: string;
  servicePrice?: number;
};

type SeedOwnerPackagePlan = {
  planCode: string;
  name: string;
  rentalClass: string;
  price: number;
  durationDays: number | null;
  maxActiveListings: number;
  isActive: boolean;
};

type SeedOwnerPackageSubscription = {
  ownerUserCode: string;
  planCode: string;
  rentalClass: string;
  startsAt: string;
  expiresAt: string | null;
  trialReminderSentAt: string | null;
  status: string;
};

type SeedLocation = {
  locationCode: string;
  typeCode: string;
  locationName: string;
  locationLogo: string;
  ownerCode: string;
  minTimeLimit: string | null;
  maxTimeLimit: string | null;
  locationPrice?: number;
  locationPriceStart?: number;
  locationPriceEnd?: number;
  locationPriceAfterDeal: number;
  locationArea: number;
  hasRent: number;
  userRentCd: string | null;
  locationDescription: string | null;
  locationNote: string | null;
  locationStatus: number;
  locationRate: number;
  cancellationFeePercent?: number;
  rescheduleFeePercent?: number;
};

type SeedAddress = {
  locationCode: string;
  addressCode: string;
  addressName: string;
  fullAddress: string;
  addressWard: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  addressPortal: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
  addressStatus: string;
  addressDescription: string;
  addressNote: string;
  addressType: string;
};

type SeedLocationService = {
  locationCode: string;
  serviceCodes?: string[];
  services?: Array<{
    serviceCode: string;
    isFree?: boolean;
    basePrice?: number;
    unit?: string;
    quantity?: number;
  }>;
};

type SeedLocationMedia = {
  mediaCode: string;
  locationCode: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  displayOrder: number;
  isLogo: number;
};

type SeedFavorite = {
  locationCode: string;
  userCode: string;
};

type SeedConversation = {
  seedKey: string;
  type: string;
  name: string | null;
  avatar: string | null;
  createdByUserCode: string;
  status: string;
};

type SeedConversationParticipant = {
  conversationSeedKey: string;
  userCode: string;
  unreadCount: number;
  lastReadMessageSeedKey: string | null;
  lastReadAt: string | null;
  muteUntil: string | null;
  isPinned: boolean;
  joinedAt: string;
  deletedAt: string | null;
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

type SeedMessageAttachment = {
  messageSeedKey: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  storageKey: string | null;
  width: number | null;
  height: number | null;
};

type SeedDataset = {
  locationTypes: SeedLocationType[];
  services: SeedService[];
  ownerPackagePlans: SeedOwnerPackagePlan[];
  ownerPackageSubscriptions: SeedOwnerPackageSubscription[];
  users: SeedUser[];
  profiles: SeedProfile[];
  locations: SeedLocation[];
  addresses: SeedAddress[];
  locationServices: SeedLocationService[];
  locationMedia: SeedLocationMedia[];
  favorites: SeedFavorite[];
  conversations: SeedConversation[];
  conversationParticipants: SeedConversationParticipant[];
  messages: SeedMessage[];
  messageAttachments: SeedMessageAttachment[];
};

type ChatMaps = {
  userIdByCode: Map<string, number>;
  conversationIdBySeedKey: Map<string, number>;
  messageIdBySeedKey: Map<string, number>;
};

const FIXTURE_ROOT = path.join(__dirname, 'data');

function getSeedPassword(): string {
  const seedPassword = process.env.SEEDPASSWORD;
  if (!seedPassword) throw new Error('Missing SEEDPASSWORD in environment');
  return seedPassword;
}

function loadJson<T>(fileName: string): T[] {
  const filePath = path.join(FIXTURE_ROOT, fileName);
  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new TypeError(`Fixture "${fileName}" must contain an array.`);
  }
  return parsed as T[];
}

function loadDataset(): SeedDataset {
  return {
    locationTypes: loadJson<SeedLocationType>('tb_location-type.json'),
    services: loadJson<SeedService>('tb_service.json'),
    ownerPackagePlans: loadJson<SeedOwnerPackagePlan>('tb_owner_package_plan.json'),
    ownerPackageSubscriptions: loadJson<SeedOwnerPackageSubscription>(
      'tb_owner_package_subscription.json',
    ),
    users: loadJson<SeedUser>('tb_user_default.json'),
    profiles: loadJson<SeedProfile>('tb_user_profile.json'),
    locations: loadJson<SeedLocation>('tb_location.json'),
    addresses: loadJson<SeedAddress>('tb_location-address.json'),
    locationServices: loadJson<SeedLocationService>('tb_location-service.json'),
    locationMedia: loadJson<SeedLocationMedia>('tb_location-media.json'),
    favorites: loadJson<SeedFavorite>('tb_location-favorite.json'),
    conversations: loadJson<SeedConversation>('tb_conversation.json'),
    conversationParticipants: loadJson<SeedConversationParticipant>(
      'tb_conversation_participant.json',
    ),
    messages: loadJson<SeedMessage>('tb_message.json'),
    messageAttachments: loadJson<SeedMessageAttachment>(
      'tb_message_attachment.json',
    ),
  };
}

async function ensureSchema(): Promise<void> {
  const requiredTables = [
    'tb_user_default',
    'tb_user_profile',
    'tb_service',
    'tb_owner_package_plan',
    'tb_owner_package_subscription',
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
    if (!rows.length)
      throw new Error(`Missing table: ${tableName}. Run migrations first.`);
  }
}

async function hasColumn(
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const rows = await dataSource.query(
    `SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ? LIMIT 1`,
    [tableName, columnName],
  );
  return rows.length > 0;
}

async function loadUserIdMap(): Promise<Map<string, number>> {
  const rows: Array<{ id: number; userCode: string }> = await dataSource.query(
    'SELECT `id`, `userCode` FROM `tb_user_default`',
  );
  return new Map(rows.map((row) => [row.userCode, Number(row.id)]));
}

async function seedLocationTypes(items: SeedLocationType[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `INSERT INTO \`tb_location-type\` (\`typeCode\`, \`typeName\`, \`typeDescription\`, \`typeLogo\`, \`typeBackGround\`)
       SELECT ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_location-type\` WHERE \`typeCode\` = ?)`,
      [
        item.typeCode,
        item.typeName,
        item.typeDescription,
        item.typeLogo,
        item.typeBackGround,
        item.typeCode,
      ],
    );
  }
}

async function seedServices(items: SeedService[]): Promise<void> {
  for (const item of items) {
    const code = item.code ?? item.serviceCode;
    const name = item.name ?? item.serviceName;
    const category = item.category ?? 'GENERAL';

    await dataSource.query(
      `INSERT INTO \`tb_service\` (\`code\`, \`name\`, \`category\`)
       SELECT ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_service\` WHERE \`code\` = ?)`,
      [code, name, category, code],
    );
  }
}

async function seedOwnerPackagePlans(
  items: SeedOwnerPackagePlan[],
): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `INSERT INTO \`tb_owner_package_plan\` (
        \`planCode\`, \`name\`, \`rentalClass\`, \`price\`, \`durationDays\`, \`maxActiveListings\`, \`isActive\`
      )
       SELECT ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_owner_package_plan\` WHERE \`planCode\` = ?)`,
      [
        item.planCode,
        item.name,
        item.rentalClass,
        item.price,
        item.durationDays,
        item.maxActiveListings,
        item.isActive ? 1 : 0,
        item.planCode,
      ],
    );
  }
}

async function seedOwnerPackageSubscriptions(
  items: SeedOwnerPackageSubscription[],
): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `INSERT INTO \`tb_owner_package_subscription\` (
        \`ownerUserCode\`, \`planCode\`, \`rentalClass\`, \`startsAt\`, \`expiresAt\`, \`trialReminderSentAt\`, \`status\`
      )
       SELECT ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM \`tb_owner_package_subscription\`
         WHERE \`ownerUserCode\` = ? AND \`rentalClass\` = ? AND \`status\` = ?
       )`,
      [
        item.ownerUserCode,
        item.planCode,
        item.rentalClass,
        item.startsAt,
        item.expiresAt,
        item.trialReminderSentAt,
        item.status,
        item.ownerUserCode,
        item.rentalClass,
        item.status,
      ],
    );
  }
}

async function seedUsers(items: SeedUser[]): Promise<void> {
  const hashedPassword = await bcrypt.hash(getSeedPassword(), ROUND);
  for (const user of items) {
    await dataSource.query(
      `INSERT INTO \`tb_user_default\` (\`username\`, \`userCode\`, \`email\`, \`password\`, \`fullName\`, \`status\`, \`role\`, \`isEmailVerified\`)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_user_default\` WHERE \`userCode\` = ?)`,
      [
        user.username,
        user.userCode,
        user.email,
        hashedPassword,
        user.fullName,
        String(user.status),
        String(user.role),
        user.isEmailVerified ? 1 : 0,
        user.userCode,
      ],
    );
  }
}

async function seedProfiles(items: SeedProfile[]): Promise<void> {
  const userIdByCode = await loadUserIdMap();
  for (const profile of items) {
    const userId = userIdByCode.get(profile.userCode);
    if (!userId)
      throw new Error(`Cannot seed profile. Missing user: ${profile.userCode}`);
    await dataSource.query(
      `INSERT INTO \`tb_user_profile\` (\`user_id\`, \`avatarUrl\`, \`coverUrl\`, \`bio\`, \`dateOfBirth\`, \`phone\`, \`fullAddress\`, \`userWard\`, \`userDistrict\`, \`userCity\`, \`userProvince\`, \`userCountry\`, \`userPortal\`, \`userLat\`, \`userLong\`, \`userDescription\`, \`userNote\`)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_user_profile\` WHERE \`user_id\` = ?)`,
      [
        userId,
        profile.avatarUrl,
        profile.coverUrl,
        profile.bio,
        profile.dateOfBirth,
        profile.phone,
        profile.fullAddress,
        profile.userWard,
        profile.userDistrict,
        profile.userCity,
        profile.userProvince,
        profile.userCountry,
        profile.userPortal,
        profile.userLat,
        profile.userLong,
        profile.userDescription,
        profile.userNote,
        userId,
      ],
    );
  }
}

async function seedLocations(items: SeedLocation[]): Promise<void> {
  for (const item of items) {
    const locationPrice = item.locationPrice ?? item.locationPriceStart;
    if (locationPrice == null) {
      throw new Error(
        `Cannot seed location. Missing price for: ${item.locationCode}`,
      );
    }

    await dataSource.query(
      `INSERT INTO \`tb_location\` (
        \`typeCode\`, \`locationName\`, \`locationLogo\`, \`ownerCode\`, \`locationCode\`, 
        \`minTimeLimit\`, \`maxTimeLimit\`, \`locationPrice\`, \`locationPriceUnit\`, \`locationPriceAfterDeal\`, 
        \`locationArea\`, \`hasRent\`, \`userRentCd\`, \`locationDescription\`, \`locationNote\`, 
        \`locationStatus\`, \`locationRate\`, \`cancellationFeePercent\`, \`rescheduleFeePercent\`
      )
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_location\` WHERE \`locationCode\` = ?)`,
      [
        item.typeCode,
        item.locationName,
        item.locationLogo,
        item.ownerCode,
        item.locationCode,
        item.minTimeLimit,
        item.maxTimeLimit,
        locationPrice,
        'tháng',
        item.locationPriceAfterDeal,
        item.locationArea,
        item.hasRent,
        item.userRentCd,
        item.locationDescription,
        item.locationNote,
        item.locationStatus,
        item.locationRate,
        item.cancellationFeePercent ?? 0,
        item.rescheduleFeePercent ?? 0,
        item.locationCode,
      ],
    );
  }
}

async function seedAddresses(items: SeedAddress[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `INSERT INTO \`tb_location-address\` (\`locationCode\`, \`addressCode\`, \`addressName\`, \`fullAddress\`, \`addressWard\`, \`addressDistrict\`, \`addressCity\`, \`addressProvince\`, \`addressCountry\`, \`addressPortal\`, \`addressLat\`, \`addressLong\`, \`addressRegion\`, \`addressStatus\`, \`addressDescription\`, \`addressNote\`, \`addressType\`)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_location-address\` WHERE \`addressCode\` = ?)`,
      [
        item.locationCode,
        item.addressCode,
        item.addressName,
        item.fullAddress,
        item.addressWard,
        item.addressDistrict,
        item.addressCity,
        item.addressProvince,
        item.addressCountry,
        item.addressPortal,
        item.addressLat,
        item.addressLong,
        item.addressRegion,
        item.addressStatus,
        item.addressDescription,
        item.addressNote,
        item.addressType,
        item.addressCode,
      ],
    );
  }
}

async function seedLocationServices(
  items: SeedLocationService[],
  services: SeedService[],
): Promise<void> {
  const serviceByCode = new Map(
    services.map((service) => [service.code ?? service.serviceCode, service]),
  );

  for (const item of items) {
    const locationServices =
      item.services ??
      (item.serviceCodes ?? []).map((serviceCode) => {
        const service = serviceByCode.get(serviceCode);
        const basePrice = Number(service?.servicePrice ?? 0);

        return {
          serviceCode,
          isFree: basePrice <= 0,
          basePrice,
          unit: 'FULL',
          quantity: 1,
        };
      });

    for (const service of locationServices) {
      const srv = serviceByCode.get(service.serviceCode);
      const description = srv?.description ?? srv?.name ?? service.serviceCode;

      await dataSource.query(
        `INSERT INTO \`tb_location-service\` (\`locationCode\`, \`serviceCode\`, \`description\`, \`isFree\`, \`basePrice\`, \`unit\`, \`quantity\`, \`isActive\`)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM \`tb_location-service\` WHERE \`locationCode\` = ? AND \`serviceCode\` = ?)`,
        [
          item.locationCode,
          service.serviceCode,
          description,
          (service.isFree ?? Number(service.basePrice ?? 0) <= 0) ? 1 : 0,
          service.isFree ? 0 : Number(service.basePrice ?? 0),
          service.unit ?? 'FULL',
          service.quantity ?? 1,
          1,
          item.locationCode,
          service.serviceCode,
        ],
      );
    }
  }
}

async function seedLocationMedia(items: SeedLocationMedia[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `INSERT INTO \`tb_location-media\` (\`mediaCode\`, \`locationCode\`, \`mediaUrl\`, \`mediaType\`, \`displayOrder\`, \`isLogo\`)
       SELECT ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_location-media\` WHERE \`mediaCode\` = ?)`,
      [
        item.mediaCode,
        item.locationCode,
        item.mediaUrl,
        item.mediaType,
        item.displayOrder,
        item.isLogo,
        item.mediaCode,
      ],
    );
  }
}

async function seedFavorites(items: SeedFavorite[]): Promise<void> {
  for (const item of items) {
    const ownerRows: Array<{ ownerCode: string }> = await dataSource.query(
      'SELECT `ownerCode` FROM `tb_location` WHERE `locationCode` = ? LIMIT 1',
      [item.locationCode],
    );
    if (!ownerRows.length || ownerRows[0].ownerCode === item.userCode) continue;
    await dataSource.query(
      `INSERT INTO \`tb_location-favorite\` (\`locationCode\`, \`userCode\`)
       SELECT ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_location-favorite\` WHERE \`locationCode\` = ? AND \`userCode\` = ?)`,
      [item.locationCode, item.userCode, item.locationCode, item.userCode],
    );
  }
}

async function seedConversations(
  items: SeedConversation[],
  userIdByCode: Map<string, number>,
): Promise<Map<string, number>> {
  const conversationIdBySeedKey = new Map<string, number>();

  for (const item of items) {
    const createdByUserId = userIdByCode.get(item.createdByUserCode);
    if (!createdByUserId) {
      throw new Error(
        `Cannot seed conversation. Missing user: ${item.createdByUserCode}`,
      );
    }

    const existingRows: Array<{ id: number }> = await dataSource.query(
      `SELECT \`id\` FROM \`tb_conversation\`
       WHERE \`createdByUserId\` = ?
         AND \`type\` = ?
         AND \`status\` = ?
         AND ((\`name\` IS NULL AND ? IS NULL) OR \`name\` = ?)
       LIMIT 1`,
      [createdByUserId, item.type, item.status, item.name, item.name],
    );

    if (existingRows.length > 0) {
      conversationIdBySeedKey.set(item.seedKey, Number(existingRows[0].id));
      continue;
    }

    const result = await dataSource.query(
      `INSERT INTO \`tb_conversation\` (\`type\`, \`name\`, \`avatar\`, \`createdByUserId\`, \`status\`)
       VALUES (?, ?, ?, ?, ?)`,
      [item.type, item.name, item.avatar, createdByUserId, item.status],
    );
    conversationIdBySeedKey.set(item.seedKey, Number(result.insertId));
  }

  return conversationIdBySeedKey;
}

async function seedMessages(
  items: SeedMessage[],
  maps: ChatMaps,
): Promise<Map<string, number>> {
  const messageIdBySeedKey = new Map<string, number>();

  for (const item of items) {
    const conversationId = maps.conversationIdBySeedKey.get(
      item.conversationSeedKey,
    );
    const senderId = maps.userIdByCode.get(item.senderUserCode);
    const replyToMessageId = item.replyToMessageSeedKey
      ? (messageIdBySeedKey.get(item.replyToMessageSeedKey) ??
        maps.messageIdBySeedKey.get(item.replyToMessageSeedKey) ??
        null)
      : null;
    const deletedByUserId = item.deletedByUserCode
      ? (maps.userIdByCode.get(item.deletedByUserCode) ?? null)
      : null;

    if (!conversationId) {
      throw new Error(
        `Cannot seed message. Missing conversation: ${item.conversationSeedKey}`,
      );
    }
    if (!senderId) {
      throw new Error(
        `Cannot seed message. Missing sender: ${item.senderUserCode}`,
      );
    }

    const existingRows: Array<{ id: number }> = await dataSource.query(
      `SELECT \`id\` FROM \`tb_message\`
       WHERE \`conversationId\` = ?
         AND \`senderId\` = ?
         AND \`createdAt\` = ?
         AND ((\`content\` IS NULL AND ? IS NULL) OR \`content\` = ?)
       LIMIT 1`,
      [conversationId, senderId, item.createdAt, item.content, item.content],
    );

    if (existingRows.length > 0) {
      messageIdBySeedKey.set(item.seedKey, Number(existingRows[0].id));
      continue;
    }

    const result = await dataSource.query(
      `INSERT INTO \`tb_message\` (\`conversationId\`, \`senderId\`, \`senderAvatarUrl\`, \`type\`, \`content\`, \`metadata\`, \`replyToMessageId\`, \`status\`, \`editedAt\`, \`deletedAt\`, \`deletedByUserId\`, \`createdAt\`, \`updatedAt\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        conversationId,
        senderId,
        item.senderAvatarUrl,
        item.type,
        item.content,
        item.metadata ? JSON.stringify(item.metadata) : null,
        replyToMessageId,
        item.status,
        item.editedAt,
        item.deletedAt,
        deletedByUserId,
        item.createdAt,
        item.updatedAt,
      ],
    );
    messageIdBySeedKey.set(item.seedKey, Number(result.insertId));
  }

  return messageIdBySeedKey;
}

async function seedConversationParticipants(
  items: SeedConversationParticipant[],
  maps: ChatMaps,
): Promise<void> {
  for (const item of items) {
    const conversationId = maps.conversationIdBySeedKey.get(
      item.conversationSeedKey,
    );
    const userId = maps.userIdByCode.get(item.userCode);
    const lastReadMessageId = item.lastReadMessageSeedKey
      ? (maps.messageIdBySeedKey.get(item.lastReadMessageSeedKey) ?? null)
      : null;

    if (!conversationId) {
      throw new Error(
        `Cannot seed participant. Missing conversation: ${item.conversationSeedKey}`,
      );
    }
    if (!userId) {
      throw new Error(
        `Cannot seed participant. Missing user: ${item.userCode}`,
      );
    }

    await dataSource.query(
      `INSERT INTO \`tb_conversation_participant\` (\`conversationId\`, \`userId\`, \`unreadCount\`, \`lastReadMessageId\`, \`lastReadAt\`, \`muteUntil\`, \`isPinned\`, \`joinedAt\`, \`deletedAt\`)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_conversation_participant\` WHERE \`conversationId\` = ? AND \`userId\` = ?)`,
      [
        conversationId,
        userId,
        item.unreadCount,
        lastReadMessageId,
        item.lastReadAt,
        item.muteUntil,
        item.isPinned ? 1 : 0,
        item.joinedAt,
        item.deletedAt,
        conversationId,
        userId,
      ],
    );
  }
}

async function refreshParticipants(
  items: SeedConversationParticipant[],
  maps: ChatMaps,
): Promise<void> {
  for (const item of items) {
    const conversationId = maps.conversationIdBySeedKey.get(
      item.conversationSeedKey,
    );
    const userId = maps.userIdByCode.get(item.userCode);
    const lastReadMessageId = item.lastReadMessageSeedKey
      ? (maps.messageIdBySeedKey.get(item.lastReadMessageSeedKey) ?? null)
      : null;

    if (!conversationId || !userId) continue;

    await dataSource.query(
      `UPDATE \`tb_conversation_participant\`
       SET \`unreadCount\` = ?, \`lastReadMessageId\` = ?, \`lastReadAt\` = ?, \`muteUntil\` = ?, \`isPinned\` = ?, \`joinedAt\` = ?, \`deletedAt\` = ?
       WHERE \`conversationId\` = ? AND \`userId\` = ?`,
      [
        item.unreadCount,
        lastReadMessageId,
        item.lastReadAt,
        item.muteUntil,
        item.isPinned ? 1 : 0,
        item.joinedAt,
        item.deletedAt,
        conversationId,
        userId,
      ],
    );
  }
}

async function seedMessageAttachments(
  items: SeedMessageAttachment[],
  maps: ChatMaps,
): Promise<void> {
  for (const item of items) {
    const messageId = maps.messageIdBySeedKey.get(item.messageSeedKey);
    if (!messageId) {
      throw new Error(
        `Cannot seed attachment. Missing message: ${item.messageSeedKey}`,
      );
    }

    await dataSource.query(
      `INSERT INTO \`tb_message_attachment\` (\`messageId\`, \`fileName\`, \`mimeType\`, \`size\`, \`url\`, \`storageKey\`, \`width\`, \`height\`)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM \`tb_message_attachment\` WHERE \`messageId\` = ? AND \`fileName\` = ? AND \`url\` = ?)`,
      [
        messageId,
        item.fileName,
        item.mimeType,
        item.size,
        item.url,
        item.storageKey,
        item.width,
        item.height,
        messageId,
        item.fileName,
        item.url,
      ],
    );
  }
}

async function updateConversationCache(
  conversations: SeedConversation[],
  messages: SeedMessage[],
  maps: ChatMaps,
): Promise<void> {
  for (const conversation of conversations) {
    const conversationId = maps.conversationIdBySeedKey.get(
      conversation.seedKey,
    );
    if (!conversationId) continue;

    const lastMessage = messages
      .filter((item) => item.conversationSeedKey === conversation.seedKey)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .at(-1);

    if (!lastMessage) continue;

    const lastMessageId = maps.messageIdBySeedKey.get(lastMessage.seedKey);
    if (!lastMessageId) continue;

    let preview = '[Message]';
    const trimmedContent = lastMessage.content?.trim();
    if (trimmedContent) {
      preview = trimmedContent;
    } else if (lastMessage.type === 'IMAGE') {
      preview = '[Image]';
    } else if (lastMessage.type === 'FILE') {
      preview = '[File]';
    }

    await dataSource.query(
      `UPDATE \`tb_conversation\`
       SET \`lastMessageId\` = ?, \`lastMessagePreview\` = ?, \`lastMessageType\` = ?, \`lastMessageAt\` = ?
       WHERE \`id\` = ?`,
      [
        lastMessageId,
        preview.slice(0, 255),
        lastMessage.type,
        lastMessage.createdAt,
        conversationId,
      ],
    );
  }
}

async function showSummary(): Promise<void> {
  const tables = [
    'tb_user_default',
    'tb_user_profile',
    'tb_location-type',
    'tb_service',
    'tb_owner_package_plan',
    'tb_owner_package_subscription',
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
    const rows = await dataSource.query(
      `SELECT COUNT(*) AS total FROM \`${tableName}\``,
    );
    summary.push({ table: tableName, total: Number(rows[0].total) });
  }
  console.table(summary);
}

async function seedAll(): Promise<void> {
  const dataset = loadDataset();
  await dataSource.initialize();

  try {
    await ensureSchema();
    await seedLocationTypes(dataset.locationTypes);
    await seedServices(dataset.services);
    await seedOwnerPackagePlans(dataset.ownerPackagePlans);
    await seedOwnerPackageSubscriptions(dataset.ownerPackageSubscriptions);
    await seedUsers(dataset.users);
    await seedProfiles(dataset.profiles);
    await seedLocations(dataset.locations);
    await seedAddresses(dataset.addresses);
    await seedLocationServices(dataset.locationServices, dataset.services);
    await seedLocationMedia(dataset.locationMedia);
    await seedFavorites(dataset.favorites);

    const userIdByCode = await loadUserIdMap();
    const conversationIdBySeedKey = await seedConversations(
      dataset.conversations,
      userIdByCode,
    );
    const maps: ChatMaps = {
      userIdByCode,
      conversationIdBySeedKey,
      messageIdBySeedKey: new Map<string, number>(),
    };
    maps.messageIdBySeedKey = await seedMessages(dataset.messages, maps);
    await seedConversationParticipants(dataset.conversationParticipants, maps);
    await refreshParticipants(dataset.conversationParticipants, maps);
    await seedMessageAttachments(dataset.messageAttachments, maps);
    await updateConversationCache(
      dataset.conversations,
      dataset.messages,
      maps,
    );

    await showSummary();
    console.log('Seed all completed.');
  } finally {
    await dataSource.destroy();
  }
}

seedAll().catch((error: unknown) => {
  console.error('Seed all failed:', error);
  process.exit(1);
});
