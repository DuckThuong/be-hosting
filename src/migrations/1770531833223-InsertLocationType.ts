import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertLocationType1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`tb_location-type\`
      (\`typeCode\`, \`typeName\`, \`typeDescription\`, \`typeLogo\`, \`typeBackGround\`)
      VALUES
      ('ROOM', 'Phòng trọ', 'Phòng trọ cho thuê giá rẻ, phù hợp sinh viên và người đi làm.', 'https://res.cloudinary.com/devclound/image/upload/v1770531521/file/bxab1now0w3nglnsuynp.png', 'https://res.cloudinary.com/devclound/image/upload/v1770531594/phongtroback_x8on4b.jpg'),
      ('APARTMENT', 'Căn hộ', 'Căn hộ đầy đủ tiện nghi, phù hợp gia đình hoặc cá nhân.', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/canho_wovqil.jpg', 'https://res.cloudinary.com/devclound/image/upload/v1770531586/canhoback_w26gna.jpg'),
      ('HOUSE', 'Nhà nguyên căn', 'Nhà nguyên căn cho thuê dài hạn.', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/nhachothue_uo1nsk.png', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/nhachothueback_lsoxw7.jpg'),
      ('DORM', 'Ký túc xá', 'Ký túc xá dành cho sinh viên hoặc người lao động.', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/kytucxalogo_ek5ysd.png', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/kytucxaback_chrefe.jpg'),
      ('OFFICE', 'Văn phòng', 'Văn phòng cho thuê phục vụ kinh doanh.', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/background_van_phong_wu9djd.jpg', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/background_van_phong_wu9djd.jpg'),
      ('SHOP', 'Mặt bằng kinh doanh', 'Mặt bằng cho thuê để mở cửa hàng hoặc kinh doanh.', 'https://res.cloudinary.com/devclound/image/upload/v1770531584/matbanglogo_n3uc08.jpg', 'https://res.cloudinary.com/devclound/image/upload/v1770531585/m%E1%BA%B7t_b%E1%BA%B1ng_back_wxeahw.avif');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`tb_location-type\`
      WHERE \`typeCode\` IN (
        'ROOM',
        'APARTMENT',
        'HOUSE',
        'DORM',
        'OFFICE',
        'SHOP'
      );
    `);
  }
}
