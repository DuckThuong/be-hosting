import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { ROUND, LOCATION_RENT_STATUS } from '../assests/constants/constants';
import { UserRole, UserStatus } from '../dtos/user/user.dto';

type SeedUser = {
  userCode: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
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

type SeedLocation = {
  locationCode: string;
  typeCode: string;
  locationName: string;
  locationLogo: string;
  ownerCode: string;
  minTimeLimit: string;
  maxTimeLimit: string;
  locationPriceStart: number;
  locationPriceEnd: number;
  locationPriceAfterDeal: number;
  hasRent: number;
  userRentCd: string | null;
  locationDescription: string;
  locationNote: string;
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
  serviceCode: string;
  serviceNote: string;
  isActive: number;
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

function getSeedPassword(): string {
  const seedPassword = process.env.SEEDPASSWORD;

  if (!seedPassword) {
    throw new Error('Missing SEEDPASSWORD in environment');
  }

  return seedPassword;
}

const locationTypes = [
  {
    typeCode: 'ROOM',
    typeName: 'Phong tro',
    typeDescription:
      'Phong tro cho thue gia re, phu hop sinh vien va nguoi di lam.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531521/file/bxab1now0w3nglnsuynp.png',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531594/phongtroback_x8on4b.jpg',
  },
  {
    typeCode: 'APARTMENT',
    typeName: 'Can ho',
    typeDescription: 'Can ho day du tien nghi, phu hop gia dinh hoac ca nhan.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/canho_wovqil.jpg',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531586/canhoback_w26gna.jpg',
  },
  {
    typeCode: 'HOUSE',
    typeName: 'Nha nguyen can',
    typeDescription: 'Nha nguyen can cho thue dai han.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/nhachothue_uo1nsk.png',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/nhachothueback_lsoxw7.jpg',
  },
  {
    typeCode: 'DORM',
    typeName: 'Ky tuc xa',
    typeDescription: 'Ky tuc xa danh cho sinh vien hoac nguoi lao dong.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/kytucxalogo_ek5ysd.png',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/kytucxaback_chrefe.jpg',
  },
  {
    typeCode: 'OFFICE',
    typeName: 'Van phong',
    typeDescription: 'Van phong cho thue phuc vu kinh doanh.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/background_van_phong_wu9djd.jpg',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/background_van_phong_wu9djd.jpg',
  },
  {
    typeCode: 'SHOP',
    typeName: 'Mat bang kinh doanh',
    typeDescription: 'Mat bang cho thue de mo cua hang hoac kinh doanh.',
    typeLogo:
      'https://res.cloudinary.com/devclound/image/upload/v1770531584/matbanglogo_n3uc08.jpg',
    typeBackGround:
      'https://res.cloudinary.com/devclound/image/upload/v1770531585/mat_bang_back_wxeahw.avif',
  },
];

const services = [
  ['SRV_FREE_WIFI', 'Wifi mien phi', 'Cung cap wifi toc do cao mien phi', 0, 0],
  ['SRV_FREE_PARKING', 'Giu xe mien phi', 'Dich vu giu xe mien phi cho khach', 0, 0],
  ['SRV_FREE_WATER', 'Nuoc uong mien phi', 'Nuoc uong phuc vu mien phi', 0, 0],
  ['SRV_FREE_TV', 'TV giai tri', 'Xem TV mien phi', 0, 0],
  ['SRV_FREE_AC', 'May lanh', 'Su dung may lanh mien phi', 0, 0],
  ['SRV_FREE_RECEPTION', 'Le tan 24/7', 'Dich vu le tan mien phi', 0, 0],
  ['SRV_FREE_SECURITY', 'Bao ve', 'An ninh mien phi', 0, 0],
  ['SRV_FREE_CLEANING', 'Don phong', 'Dich vu don phong mien phi', 0, 0],
  ['SRV_FREE_ELEVATOR', 'Thang may', 'Su dung thang may mien phi', 0, 0],
  ['SRV_FREE_BIKE', 'Cho muon xe dap', 'Cho muon xe dap mien phi', 0, 0],
  ['SRV_LAUNDRY', 'Giat ui', 'Dich vu giat ui', 50000, 10],
  ['SRV_BREAKFAST', 'Bua sang', 'Cung cap bua sang', 80000, 5],
  ['SRV_AIRPORT', 'Dua don san bay', 'Dich vu dua don san bay', 250000, 15],
  ['SRV_SPA', 'Spa', 'Dich vu spa thu gian', 300000, 20],
  ['SRV_GYM', 'Phong gym', 'Su dung phong gym', 120000, 10],
  ['SRV_POOL', 'Ho boi', 'Su dung ho boi', 100000, 5],
  ['SRV_MASSAGE', 'Massage', 'Dich vu massage', 350000, 25],
  ['SRV_PROJECTOR', 'Thue may chieu', 'Dich vu thue may chieu', 150000, 10],
  ['SRV_MEETING', 'Phong hop', 'Thue phong hop', 400000, 15],
  ['SRV_EXTRA_BED', 'Giuong phu', 'Thue giuong phu', 200000, 10],
];

const users: SeedUser[] = [
  {
    userCode: 'admin-01',
    username: 'Admin',
    email: 'admin@example.com',
    fullName: 'Admin Demo',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  },
  {
    userCode: 'owner-01',
    username: 'Owner 1',
    email: 'owner1@example.com',
    fullName: 'Owner Alpha',
    role: UserRole.OWNER,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  },
  {
    userCode: 'owner-02',
    username: 'Owner 2',
    email: 'owner2@example.com',
    fullName: 'Owner Beta',
    role: UserRole.OWNER,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  },
  {
    userCode: 'renter-01',
    username: 'Renter 1',
    email: 'renter1@example.com',
    fullName: 'Renter Gamma',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  },
  {
    userCode: 'renter-02',
    username: 'Renter 2',
    email: 'renter2@example.com',
    fullName: 'Renter Delta',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  },
];

const profiles: SeedProfile[] = [
  {
    userCode: 'admin-01',
    avatarUrl: 'https://picsum.photos/seed/admin-avatar/400/400',
    coverUrl: 'https://picsum.photos/seed/admin-cover/1200/400',
    bio: 'Quan tri vien du lieu demo.',
    dateOfBirth: '1992-01-15',
    phone: '0901000001',
    fullAddress: '1 Nguyen Hue, Ben Nghe, Quan 1, Ho Chi Minh City',
    userWard: 'Ben Nghe',
    userDistrict: 'Quan 1',
    userCity: 'Ho Chi Minh City',
    userProvince: 'Ho Chi Minh',
    userCountry: 'Vietnam',
    userPortal: '700000',
    userLat: '10.776530',
    userLong: '106.700981',
    userDescription: 'Tai khoan quan tri test.',
    userNote: 'Dung de kiem tra he thong.',
  },
  {
    userCode: 'owner-01',
    avatarUrl: 'https://picsum.photos/seed/owner-alpha-avatar/400/400',
    coverUrl: 'https://picsum.photos/seed/owner-alpha-cover/1200/400',
    bio: 'Chu tro khu vuc trung tam.',
    dateOfBirth: '1989-04-22',
    phone: '0901000002',
    fullAddress: '25 Le Loi, Ben Thanh, Quan 1, Ho Chi Minh City',
    userWard: 'Ben Thanh',
    userDistrict: 'Quan 1',
    userCity: 'Ho Chi Minh City',
    userProvince: 'Ho Chi Minh',
    userCountry: 'Vietnam',
    userPortal: '700000',
    userLat: '10.772500',
    userLong: '106.698000',
    userDescription: 'So huu nhieu phong tro va can ho.',
    userNote: 'Owner chinh de test location.',
  },
  {
    userCode: 'owner-02',
    avatarUrl: 'https://picsum.photos/seed/owner-beta-avatar/400/400',
    coverUrl: 'https://picsum.photos/seed/owner-beta-cover/1200/400',
    bio: 'Chu mat bang va van phong cho thue.',
    dateOfBirth: '1990-09-12',
    phone: '0901000003',
    fullAddress: '88 Dien Bien Phu, Da Kao, Quan 1, Ho Chi Minh City',
    userWard: 'Da Kao',
    userDistrict: 'Quan 1',
    userCity: 'Ho Chi Minh City',
    userProvince: 'Ho Chi Minh',
    userCountry: 'Vietnam',
    userPortal: '700000',
    userLat: '10.786100',
    userLong: '106.699200',
    userDescription: 'Cho thue van phong va mat bang.',
    userNote: 'Owner phu de test ownership.',
  },
  {
    userCode: 'renter-01',
    avatarUrl: 'https://picsum.photos/seed/renter-gamma-avatar/400/400',
    coverUrl: 'https://picsum.photos/seed/renter-gamma-cover/1200/400',
    bio: 'Nguoi dung dang tim phong khu vuc trung tam.',
    dateOfBirth: '1998-07-01',
    phone: '0901000004',
    fullAddress: '12 Cach Mang Thang 8, Ben Thanh, Quan 1, Ho Chi Minh City',
    userWard: 'Ben Thanh',
    userDistrict: 'Quan 1',
    userCity: 'Ho Chi Minh City',
    userProvince: 'Ho Chi Minh',
    userCountry: 'Vietnam',
    userPortal: '700000',
    userLat: '10.771300',
    userLong: '106.692700',
    userDescription: 'Tai khoan test favorite va share.',
    userNote: 'Renter thu nhat.',
  },
  {
    userCode: 'renter-02',
    avatarUrl: 'https://picsum.photos/seed/renter-delta-avatar/400/400',
    coverUrl: 'https://picsum.photos/seed/renter-delta-cover/1200/400',
    bio: 'Nguoi dung tim can ho va van phong nho.',
    dateOfBirth: '1996-11-19',
    phone: '0901000005',
    fullAddress: '45 Phan Xich Long, Ward 2, Phu Nhuan, Ho Chi Minh City',
    userWard: 'Ward 2',
    userDistrict: 'Phu Nhuan',
    userCity: 'Ho Chi Minh City',
    userProvince: 'Ho Chi Minh',
    userCountry: 'Vietnam',
    userPortal: '700000',
    userLat: '10.799400',
    userLong: '106.684200',
    userDescription: 'Tai khoan test list va room detail.',
    userNote: 'Renter thu hai.',
  },
];

const locations: SeedLocation[] = [
  {
    locationCode: 'LOC_ROOM_01',
    typeCode: 'ROOM',
    locationName: 'Phong tro gan cho Ben Thanh',
    locationLogo: 'https://picsum.photos/seed/loc-room-01/800/600',
    ownerCode: 'owner-01',
    minTimeLimit: '1',
    maxTimeLimit: '12',
    locationPriceStart: 3500000,
    locationPriceEnd: 4200000,
    locationPriceAfterDeal: 3300000,
    hasRent: LOCATION_RENT_STATUS.READY,
    userRentCd: null,
    locationDescription: 'Phong tro co gac, gan trung tam, day du noi that co ban.',
    locationNote: 'Phu hop sinh vien va nhan vien van phong.',
    locationStatus: 1,
    locationRate: 4,
  },
  {
    locationCode: 'LOC_APT_01',
    typeCode: 'APARTMENT',
    locationName: 'Can ho studio Quan 1',
    locationLogo: 'https://picsum.photos/seed/loc-apt-01/800/600',
    ownerCode: 'owner-01',
    minTimeLimit: '3',
    maxTimeLimit: '24',
    locationPriceStart: 8500000,
    locationPriceEnd: 10500000,
    locationPriceAfterDeal: 8200000,
    hasRent: LOCATION_RENT_STATUS.READY,
    userRentCd: null,
    locationDescription: 'Can ho studio day du noi that, an ninh, co ham xe.',
    locationNote: 'Uu tien hop dong dai han.',
    locationStatus: 1,
    locationRate: 5,
  },
  {
    locationCode: 'LOC_HOUSE_01',
    typeCode: 'HOUSE',
    locationName: 'Nha nguyen can Phu Nhuan',
    locationLogo: 'https://picsum.photos/seed/loc-house-01/800/600',
    ownerCode: 'owner-02',
    minTimeLimit: '6',
    maxTimeLimit: '36',
    locationPriceStart: 18000000,
    locationPriceEnd: 22000000,
    locationPriceAfterDeal: 17500000,
    hasRent: LOCATION_RENT_STATUS.READY,
    userRentCd: null,
    locationDescription: 'Nha nguyen can rong rai, thich hop gia dinh hoac van phong.',
    locationNote: 'Co san 3 phong ngu va san thuong.',
    locationStatus: 1,
    locationRate: 4,
  },
  {
    locationCode: 'LOC_OFFICE_01',
    typeCode: 'OFFICE',
    locationName: 'Van phong mini Da Kao',
    locationLogo: 'https://picsum.photos/seed/loc-office-01/800/600',
    ownerCode: 'owner-02',
    minTimeLimit: '3',
    maxTimeLimit: '24',
    locationPriceStart: 12000000,
    locationPriceEnd: 15000000,
    locationPriceAfterDeal: 11800000,
    hasRent: LOCATION_RENT_STATUS.READY,
    userRentCd: null,
    locationDescription: 'Van phong mini gan trung tam, thich hop startup nho.',
    locationNote: 'Da bao gom phi quan ly co ban.',
    locationStatus: 1,
    locationRate: 5,
  },
];

const addresses: SeedAddress[] = [
  {
    locationCode: 'LOC_ROOM_01',
    addressCode: 'ADDR_ROOM_01',
    addressName: 'Dia chi chinh phong tro',
    fullAddress: '120 Le Thanh Ton, Ben Nghe, Quan 1, Ho Chi Minh City',
    addressWard: 'Ben Nghe',
    addressDistrict: 'Quan 1',
    addressCity: 'Ho Chi Minh City',
    addressProvince: 'Ho Chi Minh',
    addressCountry: 'Vietnam',
    addressPortal: '700000',
    addressLat: '10.775900',
    addressLong: '106.700200',
    addressRegion: 'Noi thanh',
    addressStatus: '0',
    addressDescription: 'Dia chi dai dien cua phong tro',
    addressNote: 'Ngo vao rong 3m',
    addressType: '1',
  },
  {
    locationCode: 'LOC_APT_01',
    addressCode: 'ADDR_APT_01',
    addressName: 'Dia chi chinh can ho',
    fullAddress: '18 Nguyen Du, Ben Nghe, Quan 1, Ho Chi Minh City',
    addressWard: 'Ben Nghe',
    addressDistrict: 'Quan 1',
    addressCity: 'Ho Chi Minh City',
    addressProvince: 'Ho Chi Minh',
    addressCountry: 'Vietnam',
    addressPortal: '700000',
    addressLat: '10.779100',
    addressLong: '106.703000',
    addressRegion: 'Noi thanh',
    addressStatus: '0',
    addressDescription: 'Dia chi dai dien cua can ho',
    addressNote: 'Tang 5, co thang may',
    addressType: '1',
  },
  {
    locationCode: 'LOC_HOUSE_01',
    addressCode: 'ADDR_HOUSE_01',
    addressName: 'Dia chi chinh nha',
    fullAddress: '92 Phan Xich Long, Ward 2, Phu Nhuan, Ho Chi Minh City',
    addressWard: 'Ward 2',
    addressDistrict: 'Phu Nhuan',
    addressCity: 'Ho Chi Minh City',
    addressProvince: 'Ho Chi Minh',
    addressCountry: 'Vietnam',
    addressPortal: '700000',
    addressLat: '10.800300',
    addressLong: '106.683800',
    addressRegion: 'Noi thanh',
    addressStatus: '0',
    addressDescription: 'Dia chi dai dien cua nha nguyen can',
    addressNote: 'Hem xe hoi',
    addressType: '1',
  },
  {
    locationCode: 'LOC_OFFICE_01',
    addressCode: 'ADDR_OFFICE_01',
    addressName: 'Dia chi chinh van phong',
    fullAddress: '55 Nguyen Dinh Chieu, Da Kao, Quan 1, Ho Chi Minh City',
    addressWard: 'Da Kao',
    addressDistrict: 'Quan 1',
    addressCity: 'Ho Chi Minh City',
    addressProvince: 'Ho Chi Minh',
    addressCountry: 'Vietnam',
    addressPortal: '700000',
    addressLat: '10.787000',
    addressLong: '106.698700',
    addressRegion: 'Noi thanh',
    addressStatus: '0',
    addressDescription: 'Dia chi dai dien cua van phong',
    addressNote: 'Toa nha co le tan',
    addressType: '1',
  },
];

const locationServices: SeedLocationService[] = [
  {
    locationCode: 'LOC_ROOM_01',
    serviceCode: 'SRV_FREE_WIFI',
    serviceNote: 'Wifi toc do cao',
    isActive: 1,
  },
  {
    locationCode: 'LOC_ROOM_01',
    serviceCode: 'SRV_FREE_PARKING',
    serviceNote: 'Cho gui xe may',
    isActive: 1,
  },
  {
    locationCode: 'LOC_APT_01',
    serviceCode: 'SRV_FREE_WIFI',
    serviceNote: 'Wifi da bao gom',
    isActive: 1,
  },
  {
    locationCode: 'LOC_APT_01',
    serviceCode: 'SRV_FREE_AC',
    serviceNote: 'May lanh phong khach va phong ngu',
    isActive: 1,
  },
  {
    locationCode: 'LOC_APT_01',
    serviceCode: 'SRV_POOL',
    serviceNote: 'Ho boi chung cu',
    isActive: 1,
  },
  {
    locationCode: 'LOC_HOUSE_01',
    serviceCode: 'SRV_FREE_PARKING',
    serviceNote: 'San de xe hoi',
    isActive: 1,
  },
  {
    locationCode: 'LOC_HOUSE_01',
    serviceCode: 'SRV_FREE_SECURITY',
    serviceNote: 'Khu pho an ninh',
    isActive: 1,
  },
  {
    locationCode: 'LOC_OFFICE_01',
    serviceCode: 'SRV_FREE_RECEPTION',
    serviceNote: 'Le tan toa nha',
    isActive: 1,
  },
  {
    locationCode: 'LOC_OFFICE_01',
    serviceCode: 'SRV_MEETING',
    serviceNote: 'Dat phong hop theo gio',
    isActive: 1,
  },
  {
    locationCode: 'LOC_OFFICE_01',
    serviceCode: 'SRV_PROJECTOR',
    serviceNote: 'Co may chieu su kien',
    isActive: 1,
  },
];

const favorites: SeedFavorite[] = [
  { locationCode: 'LOC_ROOM_01', userCode: 'renter-01' },
  { locationCode: 'LOC_APT_01', userCode: 'renter-02' },
  { locationCode: 'LOC_OFFICE_01', userCode: 'renter-02' },
  { locationCode: 'LOC_APT_01', userCode: 'renter-01' },
  { locationCode: 'LOC_HOUSE_01', userCode: 'renter-02' },
];

const locationMedia: SeedLocationMedia[] = [
  {
    mediaCode: 'MEDIA_ROOM_01_01',
    locationCode: 'LOC_ROOM_01',
    mediaUrl: 'https://picsum.photos/seed/loc-room-01/800/600',
    mediaType: 'IMAGE',
    displayOrder: 1,
    isLogo: 1,
  },
  {
    mediaCode: 'MEDIA_APT_01_01',
    locationCode: 'LOC_APT_01',
    mediaUrl: 'https://picsum.photos/seed/loc-apt-01/800/600',
    mediaType: 'IMAGE',
    displayOrder: 1,
    isLogo: 1,
  },
  {
    mediaCode: 'MEDIA_HOUSE_01_01',
    locationCode: 'LOC_HOUSE_01',
    mediaUrl: 'https://picsum.photos/seed/loc-house-01/800/600',
    mediaType: 'IMAGE',
    displayOrder: 1,
    isLogo: 1,
  },
  {
    mediaCode: 'MEDIA_OFFICE_01_01',
    locationCode: 'LOC_OFFICE_01',
    mediaUrl: 'https://picsum.photos/seed/loc-office-01/800/600',
    mediaType: 'IMAGE',
    displayOrder: 1,
    isLogo: 1,
  },
];

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

async function seedLocationTypes(): Promise<void> {
  for (const item of locationTypes) {
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

  console.log(`Seeded location types: ${locationTypes.length}`);
}

async function seedServices(): Promise<void> {
  for (const item of services) {
    await dataSource.query(
      `
        INSERT INTO \`tb_service\`
          (\`serviceCode\`, \`serviceName\`, \`serviceDescription\`, \`serviceLogo\`, \`serviceBackGround\`, \`servicePrice\`, \`serviceDiscount\`)
        SELECT ?, ?, ?, NULL, NULL, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM \`tb_service\` WHERE \`serviceCode\` = ?
        )
      `,
      [item[0], item[1], item[2], item[3], item[4], item[0]],
    );
  }

  console.log(`Seeded services: ${services.length}`);
}

async function seedUsers(): Promise<void> {
  const hashedPassword = await bcrypt.hash(getSeedPassword(), ROUND);

  for (const user of users) {
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

  console.log(
    `Seeded users: ${users.length} (${users.map((u) => `${u.userCode}:${u.email}`).join(', ')})`,
  );
}

async function seedProfiles(): Promise<void> {
  for (const profile of profiles) {
    const userRows = await dataSource.query(
      `SELECT \`id\` FROM \`tb_user_default\` WHERE \`userCode\` = ? LIMIT 1`,
      [profile.userCode],
    );

    if (!userRows.length) {
      throw new Error(`Cannot seed profile. Missing user: ${profile.userCode}`);
    }

    const userId = userRows[0].id as number;

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

  console.log(`Seeded user profiles: ${profiles.length}`);
}

async function seedLocations(): Promise<void> {
  for (const item of locations) {
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

  console.log(`Seeded locations: ${locations.length}`);
}

async function seedAddresses(): Promise<void> {
  for (const item of addresses) {
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

  console.log(`Seeded location addresses: ${addresses.length}`);
}

async function seedLocationServices(): Promise<void> {
  for (const item of locationServices) {
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
        item.serviceCode,
        item.serviceNote,
        item.isActive,
        item.locationCode,
        item.serviceCode,
      ],
    );
  }

  console.log(`Seeded location services: ${locationServices.length}`);
}

async function seedLocationMedia(): Promise<void> {
  for (const item of locationMedia) {
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

  console.log(`Seeded location media: ${locationMedia.length}`);
}

async function seedFavorites(): Promise<void> {
  for (const item of favorites) {
    const ownerRows = await dataSource.query(
      `SELECT \`ownerCode\` FROM \`tb_location\` WHERE \`locationCode\` = ? LIMIT 1`,
      [item.locationCode],
    );

    if (!ownerRows.length) {
      throw new Error(`Cannot seed favorite. Missing location: ${item.locationCode}`);
    }

    if ((ownerRows[0].ownerCode as string) === item.userCode) {
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

  console.log(`Seeded location favorites: ${favorites.length}`);
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
    const rows = await dataSource.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
    summary.push({ table: tableName, total: Number(rows[0].total) });
  }

  console.table(summary);
}

async function seedAll(): Promise<void> {
  await dataSource.initialize();

  try {
    await ensureSchema();
    await seedLocationTypes();
    await seedServices();
    await seedUsers();
    await seedProfiles();
    await seedLocations();
    await seedAddresses();
    await seedLocationServices();
    await seedLocationMedia();
    await seedFavorites();
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
