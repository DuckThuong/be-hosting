import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dataSource from '../data-source';
import { ROUND } from '../assests/constants/constants';

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
  serviceCode: string;
  serviceName: string;
  serviceDescription: string;
  serviceLogo: string | null;
  serviceBackGround: string | null;
  servicePrice: number;
  serviceDiscount: number;
};

type SeedLocation = {
  locationCode: string;
  typeCode: string;
  locationName: string;
  locationLogo: string;
  ownerCode: string;
  minTimeLimit: string | null;
  maxTimeLimit: string | null;
  locationPriceStart: number;
  locationPriceEnd: number;
  locationPriceAfterDeal: number;
  hasRent: number;
  userRentCd: string | null;
  locationDescription: string | null;
  locationNote: string | null;
  locationStatus: number;
  locationRate: number;
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
  serviceCodes: string[];
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

type SeedDataset = {
  locationTypes: SeedLocationType[];
  services: SeedService[];
  users: SeedUser[];
  profiles: SeedProfile[];
  locations: SeedLocation[];
  addresses: SeedAddress[];
  locationServices: SeedLocationService[];
  locationMedia: SeedLocationMedia[];
  favorites: SeedFavorite[];
};

const FIXTURE_ROOT = path.join(__dirname, 'data');

function getSeedPassword(): string {
  const seedPassword = process.env.SEEDPASSWORD;

  if (!seedPassword) {
    throw new Error('Missing SEEDPASSWORD in environment');
  }

  return seedPassword;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readJsonArrayFile(filePath: string): unknown[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
  } catch (error) {
    throw new Error(`Unable to read fixture file: ${filePath}`, {
      cause: error,
    });
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Fixture "${filePath}" must contain an array.`);
  }

  return parsed;
}

function loadTableRows<T>(
  tableName: string,
  validate: (value: unknown, index: number) => T,
): T[] {
  const tableFile = path.join(FIXTURE_ROOT, `${tableName}.json`);
  const rows = readJsonArrayFile(tableFile);
  return rows.map((row, index) => validate(row, index));
}

function validateSeedUser(value: unknown, index: number): SeedUser {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_user_default row at index ${index}: expected object.`);
  }

  const requiredStringFields = [
    'userCode',
    'username',
    'email',
    'fullName',
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(value[field])) {
      throw new Error(
        `Invalid tb_user_default row at index ${index}: field "${field}" is required.`,
      );
    }
  }

  if (!isFiniteNumber(value.role) || !isFiniteNumber(value.status)) {
    throw new Error(
      `Invalid tb_user_default row at index ${index}: "role" and "status" must be numbers.`,
    );
  }

  if (typeof value.isEmailVerified !== 'boolean') {
    throw new Error(
      `Invalid tb_user_default row at index ${index}: "isEmailVerified" must be boolean.`,
    );
  }

  return value as unknown as SeedUser;
}

function validateSeedProfile(value: unknown, index: number): SeedProfile {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_user_profile row at index ${index}: expected object.`);
  }

  const requiredStringFields = [
    'userCode',
    'avatarUrl',
    'coverUrl',
    'bio',
    'dateOfBirth',
    'phone',
    'fullAddress',
    'userWard',
    'userDistrict',
    'userCity',
    'userProvince',
    'userCountry',
    'userPortal',
    'userLat',
    'userLong',
    'userDescription',
    'userNote',
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(value[field])) {
      throw new Error(
        `Invalid tb_user_profile row at index ${index}: field "${field}" is required.`,
      );
    }
  }

  return value as unknown as SeedProfile;
}

function validateLocationType(value: unknown, index: number): SeedLocationType {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location-type row at index ${index}: expected object.`);
  }

  if (!isNonEmptyString(value.typeCode) || !isNonEmptyString(value.typeName)) {
    throw new Error(
      `Invalid tb_location-type row at index ${index}: "typeCode" and "typeName" are required.`,
    );
  }

  if (
    !isNullableString(value.typeDescription) ||
    !isNullableString(value.typeLogo) ||
    !isNullableString(value.typeBackGround)
  ) {
    throw new Error(
      `Invalid tb_location-type row at index ${index}: description/logo/background must be string or null.`,
    );
  }

  return value as unknown as SeedLocationType;
}

function validateService(value: unknown, index: number): SeedService {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_service row at index ${index}: expected object.`);
  }

  if (
    !isNonEmptyString(value.serviceCode) ||
    !isNonEmptyString(value.serviceName) ||
    !isNonEmptyString(value.serviceDescription)
  ) {
    throw new Error(
      `Invalid tb_service row at index ${index}: code/name/description are required.`,
    );
  }

  if (
    !isNullableString(value.serviceLogo) ||
    !isNullableString(value.serviceBackGround) ||
    !isFiniteNumber(value.servicePrice) ||
    !isFiniteNumber(value.serviceDiscount)
  ) {
    throw new Error(
      `Invalid tb_service row at index ${index}: invalid logo/background/price/discount.`,
    );
  }

  return value as unknown as SeedService;
}

function validateLocation(value: unknown, index: number): SeedLocation {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location row at index ${index}: expected object.`);
  }

  const requiredStringFields = [
    'locationCode',
    'typeCode',
    'locationName',
    'locationLogo',
    'ownerCode',
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(value[field])) {
      throw new Error(
        `Invalid tb_location row at index ${index}: field "${field}" is required.`,
      );
    }
  }

  const numericFields = [
    'locationPriceStart',
    'locationPriceEnd',
    'locationPriceAfterDeal',
    'hasRent',
    'locationStatus',
    'locationRate',
  ] as const;

  for (const field of numericFields) {
    if (!isFiniteNumber(value[field])) {
      throw new Error(
        `Invalid tb_location row at index ${index}: field "${field}" must be a number.`,
      );
    }
  }

  if (
    !isNullableString(value.minTimeLimit) ||
    !isNullableString(value.maxTimeLimit) ||
    !isNullableString(value.userRentCd) ||
    !isNullableString(value.locationDescription) ||
    !isNullableString(value.locationNote)
  ) {
    throw new Error(
      `Invalid tb_location row at index ${index}: invalid nullable string field.`,
    );
  }

  return value as unknown as SeedLocation;
}

function validateAddress(value: unknown, index: number): SeedAddress {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location-address row at index ${index}: expected object.`);
  }

  const requiredStringFields = [
    'locationCode',
    'addressCode',
    'addressName',
    'fullAddress',
    'addressWard',
    'addressDistrict',
    'addressCity',
    'addressProvince',
    'addressCountry',
    'addressPortal',
    'addressLat',
    'addressLong',
    'addressRegion',
    'addressStatus',
    'addressDescription',
    'addressNote',
    'addressType',
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(value[field])) {
      throw new Error(
        `Invalid tb_location-address row at index ${index}: field "${field}" is required.`,
      );
    }
  }

  return value as unknown as SeedAddress;
}

function validateLocationService(
  value: unknown,
  index: number,
): SeedLocationService {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location-service row at index ${index}: expected object.`);
  }

  if (!isNonEmptyString(value.locationCode)) {
    throw new Error(
      `Invalid tb_location-service row at index ${index}: locationCode is required.`,
    );
  }

  if (
    !Array.isArray(value.serviceCodes) ||
    value.serviceCodes.length === 0 ||
    value.serviceCodes.some((serviceCode) => !isNonEmptyString(serviceCode))
  ) {
    throw new Error(
      `Invalid tb_location-service row at index ${index}: serviceCodes must be a non-empty array of strings.`,
    );
  }

  const uniqueServiceCodes = new Set(value.serviceCodes);
  if (uniqueServiceCodes.size !== value.serviceCodes.length) {
    throw new Error(
      `Invalid tb_location-service row at index ${index}: serviceCodes contains duplicates.`,
    );
  }

  return value as unknown as SeedLocationService;
}

function validateLocationMedia(value: unknown, index: number): SeedLocationMedia {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location-media row at index ${index}: expected object.`);
  }

  if (
    !isNonEmptyString(value.mediaCode) ||
    !isNonEmptyString(value.locationCode) ||
    !isNonEmptyString(value.mediaUrl) ||
    !isNonEmptyString(value.mediaType)
  ) {
    throw new Error(
      `Invalid tb_location-media row at index ${index}: missing required string field.`,
    );
  }

  if (!isFiniteNumber(value.displayOrder) || !isFiniteNumber(value.isLogo)) {
    throw new Error(
      `Invalid tb_location-media row at index ${index}: displayOrder/isLogo must be numbers.`,
    );
  }

  return value as unknown as SeedLocationMedia;
}

function validateFavorite(value: unknown, index: number): SeedFavorite {
  if (!isObject(value)) {
    throw new Error(`Invalid tb_location-favorite row at index ${index}: expected object.`);
  }

  if (!isNonEmptyString(value.locationCode) || !isNonEmptyString(value.userCode)) {
    throw new Error(
      `Invalid tb_location-favorite row at index ${index}: locationCode and userCode are required.`,
    );
  }

  return value as unknown as SeedFavorite;
}

function ensureUnique(
  values: string[],
  context: string,
  formatter?: (value: string) => string,
): void {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(
        `Duplicate ${context}: ${formatter ? formatter(value) : value}`,
      );
    }

    seen.add(value);
  }
}

function loadSeedDataset(): SeedDataset {
  const dataset: SeedDataset = {
    locationTypes: loadTableRows('tb_location-type', validateLocationType),
    services: loadTableRows('tb_service', validateService),
    users: loadTableRows('tb_user_default', validateSeedUser),
    profiles: loadTableRows('tb_user_profile', validateSeedProfile),
    locations: loadTableRows('tb_location', validateLocation),
    addresses: loadTableRows('tb_location-address', validateAddress),
    locationServices: loadTableRows(
      'tb_location-service',
      validateLocationService,
    ),
    locationMedia: loadTableRows('tb_location-media', validateLocationMedia),
    favorites: loadTableRows('tb_location-favorite', validateFavorite),
  };

  validateDataset(dataset);
  return dataset;
}

function validateDataset(dataset: SeedDataset): void {
  ensureUnique(dataset.locationTypes.map((item) => item.typeCode), 'typeCode');
  ensureUnique(dataset.services.map((item) => item.serviceCode), 'serviceCode');
  ensureUnique(dataset.users.map((item) => item.userCode), 'userCode');
  ensureUnique(dataset.locations.map((item) => item.locationCode), 'locationCode');
  ensureUnique(dataset.addresses.map((item) => item.addressCode), 'addressCode');
  ensureUnique(dataset.locationMedia.map((item) => item.mediaCode), 'mediaCode');
  ensureUnique(
    dataset.locationServices.flatMap((item) =>
      item.serviceCodes.map((serviceCode) => `${item.locationCode}:${serviceCode}`),
    ),
    'location-service pair',
  );
  ensureUnique(
    dataset.favorites.map((item) => `${item.locationCode}:${item.userCode}`),
    'location-favorite pair',
  );

  const userCodes = new Set(dataset.users.map((item) => item.userCode));
  const locationCodes = new Set(dataset.locations.map((item) => item.locationCode));
  const serviceCodes = new Set(dataset.services.map((item) => item.serviceCode));
  const typeCodes = new Set(dataset.locationTypes.map((item) => item.typeCode));

  for (const profile of dataset.profiles) {
    if (!userCodes.has(profile.userCode)) {
      throw new Error(
        `tb_user_profile references missing userCode: ${profile.userCode}`,
      );
    }
  }

  for (const location of dataset.locations) {
    if (!typeCodes.has(location.typeCode)) {
      throw new Error(
        `tb_location ${location.locationCode} references missing typeCode: ${location.typeCode}`,
      );
    }

    if (!userCodes.has(location.ownerCode)) {
      throw new Error(
        `tb_location ${location.locationCode} references missing ownerCode: ${location.ownerCode}`,
      );
    }

    if (location.userRentCd && !userCodes.has(location.userRentCd)) {
      throw new Error(
        `tb_location ${location.locationCode} references missing userRentCd: ${location.userRentCd}`,
      );
    }
  }

  for (const address of dataset.addresses) {
    if (!locationCodes.has(address.locationCode)) {
      throw new Error(
        `tb_location-address ${address.addressCode} references missing locationCode: ${address.locationCode}`,
      );
    }
  }

  for (const locationService of dataset.locationServices) {
    if (!locationCodes.has(locationService.locationCode)) {
      throw new Error(
        `tb_location-service references missing locationCode: ${locationService.locationCode}`,
      );
    }

    for (const serviceCode of locationService.serviceCodes) {
      if (!serviceCodes.has(serviceCode)) {
        throw new Error(
          `tb_location-service references missing serviceCode: ${serviceCode}`,
        );
      }
    }
  }

  for (const media of dataset.locationMedia) {
    if (!locationCodes.has(media.locationCode)) {
      throw new Error(
        `tb_location-media ${media.mediaCode} references missing locationCode: ${media.locationCode}`,
      );
    }
  }

  for (const favorite of dataset.favorites) {
    if (!locationCodes.has(favorite.locationCode)) {
      throw new Error(
        `tb_location-favorite references missing locationCode: ${favorite.locationCode}`,
      );
    }

    if (!userCodes.has(favorite.userCode)) {
      throw new Error(
        `tb_location-favorite references missing userCode: ${favorite.userCode}`,
      );
    }
  }
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
  ];

  for (const tableName of requiredTables) {
    const rows = await dataSource.query(
      `
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = ?
        LIMIT 1
      `,
      [tableName],
    );

    if (!rows.length) {
      throw new Error(`Missing table: ${tableName}. Run migrations first.`);
    }
  }
}

async function hasColumn(
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const rows = await dataSource.query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?
      LIMIT 1
    `,
    [tableName, columnName],
  );

  return rows.length > 0;
}

async function seedLocationTypes(items: SeedLocationType[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `
        INSERT INTO \`tb_location-type\`
          (\`typeCode\`, \`typeName\`, \`typeDescription\`, \`typeLogo\`, \`typeBackGround\`)
        SELECT ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_location-type\` WHERE \`typeCode\` = ?
        )
      `,
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
    await dataSource.query(
      `
        INSERT INTO \`tb_service\`
          (\`serviceCode\`, \`serviceName\`, \`serviceDescription\`, \`serviceLogo\`, \`serviceBackGround\`, \`servicePrice\`, \`serviceDiscount\`)
        SELECT ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_service\` WHERE \`serviceCode\` = ?
        )
      `,
      [
        item.serviceCode,
        item.serviceName,
        item.serviceDescription,
        item.serviceLogo,
        item.serviceBackGround,
        item.servicePrice,
        item.serviceDiscount,
        item.serviceCode,
      ],
    );
  }
}

async function seedUsers(items: SeedUser[]): Promise<void> {
  const hashedPassword = await bcrypt.hash(getSeedPassword(), ROUND);

  for (const user of items) {
    await dataSource.query(
      `
        INSERT INTO \`tb_user_default\`
          (\`username\`, \`userCode\`, \`email\`, \`password\`, \`fullName\`, \`status\`, \`role\`, \`isEmailVerified\`)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_user_default\` WHERE \`userCode\` = ?
        )
      `,
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

async function loadUserIdMap(): Promise<Map<string, number>> {
  const rows = (await dataSource.query(
    'SELECT `id`, `userCode` FROM `tb_user_default`',
  )) as Array<{ id: number; userCode: string }>;

  return new Map(rows.map((row) => [row.userCode, Number(row.id)]));
}

async function seedProfiles(items: SeedProfile[]): Promise<void> {
  const userIdMap = await loadUserIdMap();

  for (const profile of items) {
    const userId = userIdMap.get(profile.userCode);

    if (!userId) {
      throw new Error(`Cannot seed profile. Missing user: ${profile.userCode}`);
    }

    await dataSource.query(
      `
        INSERT INTO \`tb_user_profile\`
          (\`user_id\`, \`avatarUrl\`, \`coverUrl\`, \`bio\`, \`dateOfBirth\`, \`phone\`, \`fullAddress\`, \`userWard\`, \`userDistrict\`, \`userCity\`, \`userProvince\`, \`userCountry\`, \`userPortal\`, \`userLat\`, \`userLong\`, \`userDescription\`, \`userNote\`)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_user_profile\` WHERE \`user_id\` = ?
        )
      `,
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
    await dataSource.query(
      `
        INSERT INTO \`tb_location\`
          (\`typeCode\`, \`locationName\`, \`locationLogo\`, \`ownerCode\`, \`locationCode\`, \`minTimeLimit\`, \`maxTimeLimit\`, \`locationPriceStart\`, \`locationPriceEnd\`, \`locationPriceAfterDeal\`, \`hasRent\`, \`userRentCd\`, \`locationDescription\`, \`locationNote\`, \`locationStatus\`, \`locationRate\`)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_location\` WHERE \`locationCode\` = ?
        )
      `,
      [
        item.typeCode,
        item.locationName,
        item.locationLogo,
        item.ownerCode,
        item.locationCode,
        item.minTimeLimit,
        item.maxTimeLimit,
        item.locationPriceStart,
        item.locationPriceEnd,
        item.locationPriceAfterDeal,
        item.hasRent,
        item.userRentCd,
        item.locationDescription,
        item.locationNote,
        item.locationStatus,
        item.locationRate,
        item.locationCode,
      ],
    );
  }
}

async function seedAddresses(items: SeedAddress[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `
        INSERT INTO \`tb_location-address\`
          (\`locationCode\`, \`addressCode\`, \`addressName\`, \`fullAddress\`, \`addressWard\`, \`addressDistrict\`, \`addressCity\`, \`addressProvince\`, \`addressCountry\`, \`addressPortal\`, \`addressLat\`, \`addressLong\`, \`addressRegion\`, \`addressStatus\`, \`addressDescription\`, \`addressNote\`, \`addressType\`)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_location-address\` WHERE \`addressCode\` = ?
        )
      `,
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
  const serviceDescriptionByCode = new Map(
    services.map((service) => [service.serviceCode, service.serviceDescription]),
  );
  const hasServiceNoteColumn = await hasColumn(
    'tb_location-service',
    'serviceNote',
  );
  const hasIsActiveColumn = await hasColumn('tb_location-service', 'isActive');

  for (const item of items) {
    for (const serviceCode of item.serviceCodes) {
      if (hasServiceNoteColumn && hasIsActiveColumn) {
        await dataSource.query(
          `
            INSERT INTO \`tb_location-service\`
              (\`locationCode\`, \`serviceCode\`, \`serviceNote\`, \`isActive\`)
            SELECT ?, ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1
              FROM \`tb_location-service\`
              WHERE \`locationCode\` = ?
                AND \`serviceCode\` = ?
            )
          `,
          [
            item.locationCode,
            serviceCode,
            serviceDescriptionByCode.get(serviceCode) ?? '',
            1,
            item.locationCode,
            serviceCode,
          ],
        );
        continue;
      }

      if (hasServiceNoteColumn) {
        await dataSource.query(
          `
            INSERT INTO \`tb_location-service\`
              (\`locationCode\`, \`serviceCode\`, \`serviceNote\`)
            SELECT ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1
              FROM \`tb_location-service\`
              WHERE \`locationCode\` = ?
                AND \`serviceCode\` = ?
            )
          `,
          [
            item.locationCode,
            serviceCode,
            serviceDescriptionByCode.get(serviceCode) ?? '',
            item.locationCode,
            serviceCode,
          ],
        );
        continue;
      }

      if (hasIsActiveColumn) {
        await dataSource.query(
          `
            INSERT INTO \`tb_location-service\`
              (\`locationCode\`, \`serviceCode\`, \`isActive\`)
            SELECT ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1
              FROM \`tb_location-service\`
              WHERE \`locationCode\` = ?
                AND \`serviceCode\` = ?
            )
          `,
          [
            item.locationCode,
            serviceCode,
            1,
            item.locationCode,
            serviceCode,
          ],
        );
        continue;
      }

      await dataSource.query(
        `
          INSERT INTO \`tb_location-service\`
            (\`locationCode\`, \`serviceCode\`)
          SELECT ?, ?
          WHERE NOT EXISTS (
            SELECT 1
            FROM \`tb_location-service\`
            WHERE \`locationCode\` = ?
              AND \`serviceCode\` = ?
          )
        `,
        [item.locationCode, serviceCode, item.locationCode, serviceCode],
      );
    }
  }
}

async function seedLocationMedia(items: SeedLocationMedia[]): Promise<void> {
  for (const item of items) {
    await dataSource.query(
      `
        INSERT INTO \`tb_location-media\`
          (\`mediaCode\`, \`locationCode\`, \`mediaUrl\`, \`mediaType\`, \`displayOrder\`, \`isLogo\`)
        SELECT ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_location-media\` WHERE \`mediaCode\` = ?
        )
      `,
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
    const ownerRows = (await dataSource.query(
      'SELECT `ownerCode` FROM `tb_location` WHERE `locationCode` = ? LIMIT 1',
      [item.locationCode],
    )) as Array<{ ownerCode: string }>;

    if (!ownerRows.length) {
      throw new Error(`Cannot seed favorite. Missing location: ${item.locationCode}`);
    }

    if (ownerRows[0].ownerCode === item.userCode) {
      continue;
    }

    await dataSource.query(
      `
        INSERT INTO \`tb_location-favorite\` (\`locationCode\`, \`userCode\`)
        SELECT ?, ?
        WHERE NOT EXISTS (
          SELECT 1
          FROM \`tb_location-favorite\`
          WHERE \`locationCode\` = ?
            AND \`userCode\` = ?
        )
      `,
      [item.locationCode, item.userCode, item.locationCode, item.userCode],
    );
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
  const dataset = loadSeedDataset();
  await dataSource.initialize();

  try {
    await ensureSchema();
    await seedLocationTypes(dataset.locationTypes);
    await seedServices(dataset.services);
    await seedUsers(dataset.users);
    await seedProfiles(dataset.profiles);
    await seedLocations(dataset.locations);
    await seedAddresses(dataset.addresses);
    await seedLocationServices(dataset.locationServices, dataset.services);
    await seedLocationMedia(dataset.locationMedia);
    await seedFavorites(dataset.favorites);
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
