import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { ROUND, LOCATION_RENT_STATUS } from '../assests/constants/constants';
import { UserRole, UserStatus } from '../dtos/user/user.dto';
import { items, users } from './mock-data.copy';

type MockItem = (typeof items)[number];
type MockUser = (typeof users)[number];

function getSeedPassword(): string {
  const seedPassword = process.env.SEEDPASSWORD;

  if (!seedPassword) {
    throw new Error('Missing SEEDPASSWORD in environment');
  }

  return seedPassword;
}

function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toCode(prefix: string, raw: string): string {
  const normalized = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `${prefix}_${normalized}`.slice(0, 50);
}

function mapRentTypeToTypeCode(rentType: string): string {
  const mapping: Record<string, string> = {
    motel: 'ROOM',
    apartment: 'APARTMENT',
    office: 'OFFICE',
    'full-house': 'HOUSE',
    venue: 'SHOP',
  };

  return mapping[rentType] ?? 'ROOM';
}

function parseAddress(rawAddress: string): {
  ward: string;
  district: string;
  city: string;
  province: string;
  country: string;
  fullAddress: string;
} {
  const segments = rawAddress
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const city = segments[segments.length - 1] ?? 'Viet Nam';
  const district = segments[segments.length - 2] ?? city;
  const ward = segments[segments.length - 3] ?? district;

  return {
    ward,
    district,
    city,
    province: city,
    country: 'Viet Nam',
    fullAddress: rawAddress,
  };
}

function getServiceCodeForUtility(utility: string): string | null {
  const normalized = normalizeText(utility);

  if (normalized.includes('wifi')) return 'SRV_FREE_WIFI';
  if (normalized.includes('may lanh') || normalized.includes('dieu hoa')) {
    return 'SRV_FREE_AC';
  }
  if (
    normalized.includes('dau xe') ||
    normalized.includes('gui xe') ||
    normalized.includes('do xe')
  ) {
    return 'SRV_FREE_PARKING';
  }
  if (normalized.includes('an ninh')) return 'SRV_FREE_SECURITY';
  if (normalized.includes('ho boi')) return 'SRV_POOL';
  if (normalized.includes('gym')) return 'SRV_GYM';
  if (normalized.includes('may giat') || normalized.includes('giat')) {
    return 'SRV_LAUNDRY';
  }
  if (normalized.includes('phong hop')) return 'SRV_MEETING';

  return null;
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

async function seedMockData(): Promise<void> {
  const hashedPassword = await bcrypt.hash(getSeedPassword(), ROUND);

  const renterUsers: MockUser[] = [
    {
      id: 'mock-renter-01',
      name: 'Nguoi dung test 01',
      email: 'mock.renter01@example.com',
      phone: '0909000001',
      avatar: 'https://picsum.photos/100/100?random=mock-renter-01',
      role: 'renter',
      verified: true,
      address: 'Ha Noi',
    },
    {
      id: 'mock-renter-02',
      name: 'Nguoi dung test 02',
      email: 'mock.renter02@example.com',
      phone: '0909000002',
      avatar: 'https://picsum.photos/100/100?random=mock-renter-02',
      role: 'renter',
      verified: true,
      address: 'TP.HCM',
    },
  ];

  const allUsers = [...users, ...renterUsers];
  const userCodeById = new Map<string, string>();

  for (const user of allUsers) {
    const userCode = toCode(
      user.role === 'owner' ? 'MOCK_OWNER' : 'MOCK_USER',
      user.id,
    );
    userCodeById.set(user.id, userCode);

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
        user.name,
        userCode,
        user.email,
        hashedPassword,
        user.name,
        String(UserStatus.ACTIVE),
        String(user.role === 'owner' ? UserRole.OWNER : UserRole.USER),
        user.verified ? 1 : 0,
        userCode,
      ],
    );

    const userRows = await dataSource.query(
      `SELECT \`id\` FROM \`tb_user_default\` WHERE \`userCode\` = ? LIMIT 1`,
      [userCode],
    );
    const userId = Number(userRows[0].id);
    const address = user.address ?? 'Viet Nam';

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
        user.avatar ?? 'https://picsum.photos/100/100?random=default-avatar',
        `https://picsum.photos/1200/400?random=${encodeURIComponent(user.id)}`,
        `Ho so demo cho ${user.name}`,
        '1995-01-01',
        user.phone.replace(/\s+/g, ''),
        address,
        address,
        address,
        address,
        address,
        'Viet Nam',
        '700000',
        '0',
        '0',
        `Tai khoan seed tu mockData cho ${user.name}.`,
        'Seed FE mock data',
        userId,
      ],
    );
  }

  const renterCodes = renterUsers.map((user) => userCodeById.get(user.id) as string);

  for (const item of items) {
    const locationCode = `MOCK_LOC_${String(item.id).padStart(4, '0')}`;
    const ownerCode = userCodeById.get(item.ownerId);

    if (!ownerCode) {
      continue;
    }

    const primaryImage =
      item.mainImage ?? item.images?.[0] ?? 'https://picsum.photos/800/600';
    const basePrice = Math.max(0, Math.round(Number(item.price || 0) * 1000));

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
        mapRentTypeToTypeCode(item.rentType),
        item.title.slice(0, 100),
        primaryImage,
        ownerCode,
        locationCode,
        '1',
        '12',
        basePrice,
        basePrice,
        basePrice,
        LOCATION_RENT_STATUS.READY,
        null,
        item.description.slice(0, 2000),
        `Dien tich: ${item.area ?? 0}m2 | Phong ngu: ${item.bedrooms ?? 0} | Phong tam: ${item.bathrooms ?? 0} | Reviews: ${item.reviews ?? 0}`.slice(
          0,
          2000,
        ),
        1,
        Math.round(item.rating ?? 0),
        locationCode,
      ],
    );

    const parsedAddress = parseAddress(item.address);
    const addressCode = `MOCK_ADDR_${String(item.id).padStart(4, '0')}`;

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
        locationCode,
        addressCode,
        `Dia chi ${locationCode}`,
        parsedAddress.fullAddress,
        parsedAddress.ward,
        parsedAddress.district,
        parsedAddress.city,
        parsedAddress.province,
        parsedAddress.country,
        '700000',
        '0',
        '0',
        item.location,
        '0',
        `Dia chi seed tu mockData cho ${item.title}`.slice(0, 255),
        'Seed FE mock data',
        '1',
        addressCode,
      ],
    );

    const mediaUrls = Array.from(
      new Set([primaryImage, ...(item.images ?? [])].filter(Boolean)),
    );

    for (const [index, mediaUrl] of mediaUrls.entries()) {
      const mediaCode = `MOCK_MEDIA_${String(item.id).padStart(4, '0')}_${String(index + 1).padStart(2, '0')}`;
      await dataSource.query(
        `
          INSERT INTO \`tb_location-media\`
            (\`mediaCode\`, \`locationCode\`, \`mediaUrl\`, \`mediaType\`, \`displayOrder\`, \`isLogo\`)
          SELECT ?, ?, ?, 'IMAGE', ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM \`tb_location-media\` WHERE \`mediaCode\` = ?
          )
        `,
        [
          mediaCode,
          locationCode,
          mediaUrl,
          index + 1,
          index === 0 ? 1 : 0,
          mediaCode,
        ],
      );
    }

    const serviceCodes = Array.from(
      new Set((item.utilities ?? []).map(getServiceCodeForUtility).filter(Boolean)),
    ) as string[];

    for (const serviceCode of serviceCodes) {
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
          locationCode,
          serviceCode,
          'Seed FE mock data',
          1,
          locationCode,
          serviceCode,
        ],
      );
    }
  }

  const favoriteLocations = items.slice(0, Math.min(items.length, 12));
  for (const [index, item] of favoriteLocations.entries()) {
    const locationCode = `MOCK_LOC_${String(item.id).padStart(4, '0')}`;
    const userCode = renterCodes[index % renterCodes.length];

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
      [locationCode, userCode, locationCode, userCode],
    );
  }

  console.log(`Seeded FE mock users: ${allUsers.length}`);
  console.log(`Seeded FE mock locations: ${items.length}`);
  console.log(`Seeded FE mock favorites: ${favoriteLocations.length}`);
}

async function showSummary(): Promise<void> {
  const tables = [
    'tb_user_default',
    'tb_user_profile',
    'tb_location',
    'tb_location-address',
    'tb_location-service',
    'tb_location-media',
    'tb_location-favorite',
  ];

  const summary: Array<{ table: string; total: number }> = [];

  for (const tableName of tables) {
    const rows = await dataSource.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
    summary.push({ table: tableName, total: Number(rows[0].total) });
  }

  console.table(summary);
}

async function run(): Promise<void> {
  await dataSource.initialize();

  try {
    await ensureSchema();
    await seedMockData();
    await showSummary();
    console.log('Seed FE mock data completed.');
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Seed FE mock data failed:', error);
  process.exit(1);
});
