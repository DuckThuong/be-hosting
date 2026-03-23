import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertLocationService1774271800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO tb_service
            (serviceCode, serviceName, serviceDescription, serviceLogo, serviceBackGround, servicePrice, serviceDiscount)
            VALUES
            ('SRV_FREE_WIFI', 'Wifi miễn phí', 'Cung cấp wifi tốc độ cao miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_PARKING', 'Giữ xe miễn phí', 'Dịch vụ giữ xe miễn phí cho khách', NULL, NULL, 0, 0),
            ('SRV_FREE_WATER', 'Nước uống miễn phí', 'Nước uống phục vụ miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_TV', 'TV giải trí', 'Xem TV miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_AC', 'Máy lạnh', 'Sử dụng máy lạnh miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_RECEPTION', 'Lễ tân 24/7', 'Dịch vụ lễ tân miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_SECURITY', 'Bảo vệ', 'An ninh miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_CLEANING', 'Dọn phòng', 'Dịch vụ dọn phòng miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_ELEVATOR', 'Thang máy', 'Sử dụng thang máy miễn phí', NULL, NULL, 0, 0),
            ('SRV_FREE_BIKE', 'Cho mượn xe đạp', 'Cho mượn xe đạp miễn phí', NULL, NULL, 0, 0),

            ('SRV_LAUNDRY', 'Giặt ủi', 'Dịch vụ giặt ủi', NULL, NULL, 50000, 10),
            ('SRV_BREAKFAST', 'Bữa sáng', 'Cung cấp bữa sáng', NULL, NULL, 80000, 5),
            ('SRV_AIRPORT', 'Đưa đón sân bay', 'Dịch vụ đưa đón sân bay', NULL, NULL, 250000, 15),
            ('SRV_SPA', 'Spa', 'Dịch vụ spa thư giãn', NULL, NULL, 300000, 20),
            ('SRV_GYM', 'Phòng gym', 'Sử dụng phòng gym', NULL, NULL, 120000, 10),
            ('SRV_POOL', 'Hồ bơi', 'Sử dụng hồ bơi', NULL, NULL, 100000, 5),
            ('SRV_MASSAGE', 'Massage', 'Dịch vụ massage', NULL, NULL, 350000, 25),
            ('SRV_PROJECTOR', 'Thuê máy chiếu', 'Dịch vụ thuê máy chiếu', NULL, NULL, 150000, 10),
            ('SRV_MEETING', 'Phòng họp', 'Thuê phòng họp', NULL, NULL, 400000, 15),
            ('SRV_EXTRA_BED', 'Giường phụ', 'Thuê giường phụ', NULL, NULL, 200000, 10);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM tb_service
            WHERE serviceCode IN (
                'SRV_FREE_WIFI',
                'SRV_FREE_PARKING',
                'SRV_FREE_WATER',
                'SRV_FREE_TV',
                'SRV_FREE_AC',
                'SRV_FREE_RECEPTION',
                'SRV_FREE_SECURITY',
                'SRV_FREE_CLEANING',
                'SRV_FREE_ELEVATOR',
                'SRV_FREE_BIKE',
                'SRV_LAUNDRY',
                'SRV_BREAKFAST',
                'SRV_AIRPORT',
                'SRV_SPA',
                'SRV_GYM',
                'SRV_POOL',
                'SRV_MASSAGE',
                'SRV_PROJECTOR',
                'SRV_MEETING',
                'SRV_EXTRA_BED'
            );
        `);
  }
}
