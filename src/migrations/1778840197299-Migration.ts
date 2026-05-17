import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1778840197299 implements MigrationInterface {
  name = 'Migration1778840197299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tb_user_profile\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`user_id\` int NOT NULL COMMENT 'User id', \`avatarUrl\` varchar(255) NULL COMMENT 'Avatar URL', \`coverUrl\` varchar(255) NULL COMMENT 'Cover/banner URL', \`bio\` text NULL COMMENT 'Bio', \`dateOfBirth\` date NULL COMMENT 'Date of birth', \`phone\` varchar(20) NULL COMMENT 'Phone number', \`fullAddress\` varchar(255) NULL COMMENT 'Địa chỉ chi tiết', \`userWard\` varchar(255) NULL COMMENT 'Phường | xã', \`userDistrict\` varchar(255) NULL COMMENT 'Quận | huyện', \`userCity\` varchar(255) NULL COMMENT 'Thành Phố', \`userProvince\` varchar(255) NULL COMMENT 'Tỉnh', \`userCountry\` varchar(255) NULL COMMENT 'Quốc gia', \`userPortal\` varchar(255) NULL COMMENT 'Mã bưu chính', \`userLat\` varchar(255) NULL COMMENT 'Vĩ độ', \`userLong\` varchar(255) NULL COMMENT 'Kinh độ', \`userDescription\` varchar(255) NULL COMMENT 'Mô tả', \`userNote\` varchar(255) NULL COMMENT 'Ghi chú', UNIQUE INDEX \`REL_f6a3c608ad4dfdc048c8563bd0\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_user_default\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`username\` varchar(50) NOT NULL COMMENT 'Username', \`userCode\` varchar(50) NOT NULL COMMENT 'UserCode', \`email\` varchar(100) NOT NULL COMMENT 'User email', \`password\` varchar(255) NOT NULL COMMENT 'Hashed password', \`fullName\` varchar(100) NULL COMMENT 'Full name', \`status\` enum ('0', '1', '2') NOT NULL COMMENT 'User status' DEFAULT '0', \`role\` enum ('0', '1', '2') NOT NULL COMMENT 'User role' DEFAULT '2', \`isEmailVerified\` tinyint NOT NULL COMMENT 'Is email verified' DEFAULT 1, UNIQUE INDEX \`IDX_791797a3cc1b633f9faf92390d\` (\`username\`), UNIQUE INDEX \`IDX_4048cbc41c4e8401ef009e0c7d\` (\`userCode\`), UNIQUE INDEX \`IDX_f7f025f39bb10cab6617814c84\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_payment_transaction\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`transactionCode\` varchar(40) NOT NULL, \`purpose\` enum ('BOOKING_DEPOSIT', 'OWNER_PACKAGE') NOT NULL, \`amount\` decimal(15,2) NOT NULL, \`status\` enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING', \`bookingCode\` varchar(25) NULL, \`ownerUserCode\` varchar(50) NULL, \`planCode\` varchar(50) NULL, \`vnpayTxnRef\` varchar(40) NOT NULL, \`vnpayTransactionNo\` varchar(50) NULL, \`bankCode\` varchar(50) NULL, \`payDate\` varchar(20) NULL, \`paidAt\` timestamp NULL, \`expiredAt\` timestamp NULL, INDEX \`IDX_c0c65cae797d4cc63393dd8de1\` (\`bookingCode\`), INDEX \`IDX_d9d9e233d316fdd76ddd3aa9ad\` (\`ownerUserCode\`), UNIQUE INDEX \`IDX_4de77075b20e90433089638f9f\` (\`transactionCode\`), UNIQUE INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` (\`vnpayTxnRef\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_owner_package_plan\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`planCode\` varchar(50) NOT NULL, \`name\` varchar(100) NOT NULL, \`rentalClass\` enum ('SHORT_TERM', 'LONG_TERM') NOT NULL, \`price\` decimal(15,2) NOT NULL DEFAULT '0.00', \`durationDays\` int NULL, \`maxActiveListings\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_f80a2b815075f936ce3102726f\` (\`planCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_owner_package_subscription\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`ownerUserCode\` varchar(50) NOT NULL, \`planCode\` varchar(50) NOT NULL, \`rentalClass\` enum ('SHORT_TERM', 'LONG_TERM') NOT NULL, \`startsAt\` timestamp NOT NULL, \`expiresAt\` timestamp NULL, \`trialReminderSentAt\` timestamp NULL, \`status\` enum ('ACTIVE', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE', INDEX \`IDX_367fcfa76ba289e8c966d419a9\` (\`ownerUserCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-address\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`locationCode\` varchar(25) NOT NULL COMMENT 'Mã địa điểm', \`addressCode\` varchar(25) NOT NULL COMMENT 'Mã địa chỉ', \`addressName\` varchar(255) NOT NULL COMMENT 'Tên địa chỉ', \`fullAddress\` varchar(255) NOT NULL COMMENT 'Địa chỉ chi tiết', \`addressWard\` varchar(255) NOT NULL COMMENT 'Phường | xã', \`addressDistrict\` varchar(255) NOT NULL COMMENT 'Quận | huyện', \`addressCity\` varchar(255) NOT NULL COMMENT 'Thành Phố', \`addressProvince\` varchar(255) NOT NULL COMMENT 'Tỉnh', \`addressCountry\` varchar(255) NOT NULL COMMENT 'Quốc gia', \`addressPortal\` varchar(255) NOT NULL COMMENT 'Mã bưu chính', \`addressLat\` varchar(255) NOT NULL COMMENT 'Vĩ độ', \`addressLong\` varchar(255) NOT NULL COMMENT 'Kinh độ', \`addressRegion\` varchar(255) NOT NULL COMMENT 'Vùng', \`addressStatus\` varchar(255) NOT NULL COMMENT 'Trạng thái', \`addressDescription\` varchar(255) NOT NULL COMMENT 'Mô tả', \`addressNote\` varchar(255) NOT NULL COMMENT 'Ghi chú', \`addressType\` varchar(255) NOT NULL COMMENT 'Phân loại', UNIQUE INDEX \`IDX_f04b8a19e7ebb203771e55f01d\` (\`addressCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_service\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`code\` varchar(50) NOT NULL COMMENT 'Mã dịch vụ', \`name\` varchar(100) NOT NULL COMMENT 'Tên dịch vụ', \`category\` varchar(100) NOT NULL COMMENT 'Loại dịch vụ', UNIQUE INDEX \`IDX_1fb3f2bcee524cf876b7df8f0b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-service\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`locationCode\` varchar(50) NOT NULL COMMENT 'Mã địa điểm', \`serviceCode\` varchar(50) NOT NULL COMMENT 'Mã dịch vụ', \`description\` varchar(2000) NOT NULL COMMENT 'Mô tả dịch vụ', \`isFree\` tinyint NOT NULL COMMENT 'Loại tiện ích: free hoặc mất phí', \`basePrice\` decimal NULL COMMENT 'Giá cơ bản', \`unit\` varchar(255) NOT NULL COMMENT 'Đơn vị tính', \`quantity\` int NULL COMMENT 'Số lượng', \`isActive\` tinyint NOT NULL COMMENT 'Trạng thái hoạt động', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-media\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`mediaCode\` varchar(50) NOT NULL, \`locationCode\` varchar(25) NOT NULL, \`mediaUrl\` varchar(2000) NOT NULL, \`mediaType\` enum ('IMAGE', 'VIDEO') NOT NULL DEFAULT 'IMAGE', \`displayOrder\` int NOT NULL DEFAULT '1', \`isLogo\` tinyint NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_4b2a74f08b34bdb7a01b896983\` (\`mediaCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-favorite\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`locationCode\` varchar(50) NOT NULL, \`userCode\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_location_favorite_location_user\` (\`locationCode\`, \`userCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_booking\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`bookingCode\` varchar(25) NOT NULL, \`locationCode\` varchar(25) NOT NULL, \`guestUserCode\` varchar(50) NOT NULL, \`ownerUserCode\` varchar(50) NOT NULL, \`checkInDate\` date NULL, \`checkOutDate\` date NULL, \`totalPrice\` decimal(15,2) NOT NULL DEFAULT '0.00', \`status\` enum ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING_PAYMENT', \`paymentStatus\` enum ('UNPAID', 'PAID', 'REFUNDED', 'PARTIAL_REFUND') NOT NULL DEFAULT 'UNPAID', \`cancellationFee\` decimal(15,2) NULL, \`rescheduleFee\` decimal(15,2) NULL, \`note\` varchar(2000) NULL, \`lockedUntil\` timestamp NULL, UNIQUE INDEX \`IDX_e0e3b53266120e0ba898c83eae\` (\`bookingCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`typeCode\` varchar(50) NOT NULL, \`locationName\` varchar(100) NOT NULL, \`locationLogo\` varchar(250) NOT NULL, \`ownerCode\` varchar(100) NOT NULL, \`locationCode\` varchar(25) NOT NULL, \`minTimeLimit\` varchar(255) NULL, \`maxTimeLimit\` varchar(255) NULL, \`locationPrice\` decimal NULL, \`locationPriceUnit\` varchar(50) NULL, \`locationPriceAfterDeal\` decimal NULL, \`locationArea\` decimal NULL, \`hasRent\` int NULL, \`userRentCd\` varchar(50) NULL, \`locationDescription\` varchar(2000) NULL, \`locationNote\` varchar(2000) NULL, \`locationStatus\` int NOT NULL, \`locationRate\` float NULL, \`cancellationFeePercent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`rescheduleFeePercent\` decimal(5,2) NOT NULL DEFAULT '0.00', UNIQUE INDEX \`IDX_dde3994d7d03af926c306b6c46\` (\`locationCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-type\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`typeCode\` varchar(50) NOT NULL, \`typeName\` varchar(50) NOT NULL, \`typeDescription\` varchar(2000) NULL, \`typeLogo\` varchar(2000) NULL, \`typeBackGround\` varchar(2000) NULL, UNIQUE INDEX \`IDX_72815d2ec80bb2e76a878d6537\` (\`typeCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-comment\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`locationCode\` varchar(25) NOT NULL, \`userCode\` varchar(25) NOT NULL, \`content\` varchar(255) NOT NULL, \`rate\` int NOT NULL, \`metaData\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_location-comment-reply\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`preCommentId\` int NOT NULL, \`userCode\` varchar(25) NOT NULL, \`content\` varchar(255) NOT NULL, \`rate\` int NOT NULL, \`metaData\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_conversation_participant\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`conversationId\` int NOT NULL COMMENT 'ID cuộc trò chuyện mà người dùng tham gia', \`userId\` int NOT NULL COMMENT 'ID người dùng tham gia cuộc trò chuyện', \`unreadCount\` int NOT NULL COMMENT 'Số lượng tin nhắn chưa đọc của người dùng trong cuộc trò chuyện' DEFAULT '0', \`lastReadMessageId\` bigint NULL COMMENT 'ID tin nhắn cuối cùng mà người dùng đã đọc', \`lastReadAt\` timestamp NULL COMMENT 'Thời điểm đọc tin nhắn gần nhất', \`muteUntil\` timestamp NULL COMMENT 'Thời điểm tắt thông báo đến', \`isPinned\` tinyint NOT NULL COMMENT 'Trạng thái ghim cuộc trò chuyện lên đầu danh sách' DEFAULT 0, \`nickname\` varchar(255) NULL COMMENT 'Biệt danh cuộc trò chuyện theo từng người dùng', \`joinedAt\` timestamp NULL COMMENT 'Thời điểm tham gia cuộc trò chuyện (legacy)', INDEX \`IDX_a403e8f9bbf60f81880b998e7f\` (\`userId\`), UNIQUE INDEX \`IDX_a610f947b6b877960a9aa6116c\` (\`conversationId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_conversation\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`type\` enum ('RENT', 'CONTACT', 'NORMAL', 'PRIVATE', 'GROUP') NOT NULL COMMENT 'Loại cuộc trò chuyện, v1 chỉ dùng NORMAL' DEFAULT 'NORMAL', \`name\` varchar(255) NULL COMMENT 'Tên hiển thị được cache nếu cần', \`avatar\` varchar(255) NULL COMMENT 'Ảnh đại diện được cache nếu cần', \`lastMessagePreview\` varchar(255) NULL COMMENT 'Nội dung preview của tin nhắn cuối cùng', \`lastMessageId\` int NULL COMMENT 'ID của tin nhắn cuối cùng', \`lastMessageAt\` timestamp NULL COMMENT 'Thời điểm gửi tin nhắn cuối cùng', \`lastMessageType\` enum ('TEXT', 'IMAGE', 'FILE', 'SYSTEM') NULL COMMENT 'Loại tin nhắn cuối cùng', \`createdByUserId\` int NOT NULL COMMENT 'Người tạo cuộc trò chuyện', \`status\` enum ('ACTIVE', 'ARCHIVED', 'BLOCKED') NOT NULL COMMENT 'Trạng thái cuộc trò chuyện' DEFAULT 'ACTIVE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_message\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`conversationId\` int NOT NULL COMMENT 'ID cuộc trò chuyện chứa tin nhắn này', \`senderId\` int NOT NULL COMMENT 'ID người gửi tin nhắn', \`senderAvatarUrl\` varchar(255) NULL COMMENT 'URL avatar của người gửi', \`type\` enum ('TEXT', 'IMAGE', 'FILE', 'SYSTEM') NOT NULL COMMENT 'Loại tin nhắn' DEFAULT 'TEXT', \`content\` text NULL COMMENT 'Nội dung tin nhắn dạng văn bản', \`metadata\` json NULL COMMENT 'Dữ liệu bổ sung của tin nhắn', \`replyToMessageId\` int NULL COMMENT 'ID của tin nhắn được trả lời (nếu có)', \`status\` enum ('SENT', 'DELIVERED', 'READ') NOT NULL COMMENT 'Trạng thái của tin nhắn' DEFAULT 'SENT', \`editedAt\` timestamp NULL COMMENT 'Thời điểm chỉnh sửa tin nhắn', \`deletedByUserId\` int NULL COMMENT 'Người thực hiện xóa mềm tin nhắn', INDEX \`IDX_df478b6f36c8fa434b020420d6\` (\`senderId\`), INDEX \`IDX_c2b1b017aa4470103f4790d855\` (\`conversationId\`, \`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tb_message_attachment\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key', \`createdAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm tạo' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT 'Thời điểm cập nhật' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT 'Thời điểm xóa mềm', \`messageId\` int NOT NULL COMMENT 'ID tin nhắn sở hữu file đính kèm', \`fileName\` varchar(255) NOT NULL COMMENT 'Tên file hiển thị', \`mimeType\` varchar(255) NOT NULL COMMENT 'MIME type của file', \`size\` bigint NOT NULL COMMENT 'Kích thước file theo byte', \`url\` varchar(255) NOT NULL COMMENT 'URL public của file', \`storageKey\` varchar(255) NULL COMMENT 'Khóa lưu trữ nội bộ của file', \`width\` int NULL COMMENT 'Chiều rộng của ảnh nếu có', \`height\` int NULL COMMENT 'Chiều cao của ảnh nếu có', INDEX \`IDX_e315dbbb26dbbb8115f5fee9e6\` (\`messageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_user_profile\` ADD CONSTRAINT \`FK_f6a3c608ad4dfdc048c8563bd05\` FOREIGN KEY (\`user_id\`) REFERENCES \`tb_user_default\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_owner_package_subscription\` ADD CONSTRAINT \`FK_88e4ff70809ec920623447abdc4\` FOREIGN KEY (\`planCode\`) REFERENCES \`tb_owner_package_plan\`(\`planCode\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-address\` ADD CONSTRAINT \`FK_3ad67fa98c1adbc39350b18f487\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD CONSTRAINT \`FK_11971cf25977c6d691f27bac6e4\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` ADD CONSTRAINT \`FK_2dbca64eee7c73d12fdf6480c4e\` FOREIGN KEY (\`serviceCode\`) REFERENCES \`tb_service\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-media\` ADD CONSTRAINT \`FK_07dc06cb2851d375665ba9e33f1\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-favorite\` ADD CONSTRAINT \`FK_3ee6b6070c477da8042dda89a36\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-favorite\` ADD CONSTRAINT \`FK_b0bb73f2c2b828203f745970736\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_booking\` ADD CONSTRAINT \`FK_d5a851c2296f6deaa4ff5ce3dd2\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_booking\` ADD CONSTRAINT \`FK_a4b1a396ac5908bcef5aeda0c25\` FOREIGN KEY (\`guestUserCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location\` ADD CONSTRAINT \`FK_3661598fdd10deb48ee87fad77b\` FOREIGN KEY (\`typeCode\`) REFERENCES \`tb_location-type\`(\`typeCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location\` ADD CONSTRAINT \`FK_e80c1f1dcdbbd5cc9f138c0f8c0\` FOREIGN KEY (\`ownerCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment\` ADD CONSTRAINT \`FK_048bdaa708a70b70c2f5df295cb\` FOREIGN KEY (\`locationCode\`) REFERENCES \`tb_location\`(\`locationCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment\` ADD CONSTRAINT \`FK_031a17015738be4591702aa6557\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment-reply\` ADD CONSTRAINT \`FK_829950f018dd817d0f8ac826710\` FOREIGN KEY (\`preCommentId\`) REFERENCES \`tb_location-comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment-reply\` ADD CONSTRAINT \`FK_2b57e898aa450e6f7d06436f36e\` FOREIGN KEY (\`userCode\`) REFERENCES \`tb_user_default\`(\`userCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_conversation_participant\` ADD CONSTRAINT \`FK_7c2417eced165afedfcfe71260b\` FOREIGN KEY (\`conversationId\`) REFERENCES \`tb_conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_message\` ADD CONSTRAINT \`FK_cb2dbe0dee4475042f883312754\` FOREIGN KEY (\`conversationId\`) REFERENCES \`tb_conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_message_attachment\` ADD CONSTRAINT \`FK_e315dbbb26dbbb8115f5fee9e69\` FOREIGN KEY (\`messageId\`) REFERENCES \`tb_message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tb_message_attachment\` DROP FOREIGN KEY \`FK_e315dbbb26dbbb8115f5fee9e69\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_message\` DROP FOREIGN KEY \`FK_cb2dbe0dee4475042f883312754\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_conversation_participant\` DROP FOREIGN KEY \`FK_7c2417eced165afedfcfe71260b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment-reply\` DROP FOREIGN KEY \`FK_2b57e898aa450e6f7d06436f36e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment-reply\` DROP FOREIGN KEY \`FK_829950f018dd817d0f8ac826710\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment\` DROP FOREIGN KEY \`FK_031a17015738be4591702aa6557\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-comment\` DROP FOREIGN KEY \`FK_048bdaa708a70b70c2f5df295cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location\` DROP FOREIGN KEY \`FK_e80c1f1dcdbbd5cc9f138c0f8c0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location\` DROP FOREIGN KEY \`FK_3661598fdd10deb48ee87fad77b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_booking\` DROP FOREIGN KEY \`FK_a4b1a396ac5908bcef5aeda0c25\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_booking\` DROP FOREIGN KEY \`FK_d5a851c2296f6deaa4ff5ce3dd2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-favorite\` DROP FOREIGN KEY \`FK_b0bb73f2c2b828203f745970736\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-favorite\` DROP FOREIGN KEY \`FK_3ee6b6070c477da8042dda89a36\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-media\` DROP FOREIGN KEY \`FK_07dc06cb2851d375665ba9e33f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP FOREIGN KEY \`FK_2dbca64eee7c73d12fdf6480c4e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-service\` DROP FOREIGN KEY \`FK_11971cf25977c6d691f27bac6e4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_location-address\` DROP FOREIGN KEY \`FK_3ad67fa98c1adbc39350b18f487\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_owner_package_subscription\` DROP FOREIGN KEY \`FK_88e4ff70809ec920623447abdc4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tb_user_profile\` DROP FOREIGN KEY \`FK_f6a3c608ad4dfdc048c8563bd05\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e315dbbb26dbbb8115f5fee9e6\` ON \`tb_message_attachment\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_message_attachment\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c2b1b017aa4470103f4790d855\` ON \`tb_message\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_df478b6f36c8fa434b020420d6\` ON \`tb_message\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_message\``);
    await queryRunner.query(`DROP TABLE \`tb_conversation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a610f947b6b877960a9aa6116c\` ON \`tb_conversation_participant\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a403e8f9bbf60f81880b998e7f\` ON \`tb_conversation_participant\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_conversation_participant\``);
    await queryRunner.query(`DROP TABLE \`tb_location-comment-reply\``);
    await queryRunner.query(`DROP TABLE \`tb_location-comment\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_72815d2ec80bb2e76a878d6537\` ON \`tb_location-type\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_location-type\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_dde3994d7d03af926c306b6c46\` ON \`tb_location\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_location\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e0e3b53266120e0ba898c83eae\` ON \`tb_booking\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_booking\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_location_favorite_location_user\` ON \`tb_location-favorite\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_location-favorite\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4b2a74f08b34bdb7a01b896983\` ON \`tb_location-media\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_location-media\``);
    await queryRunner.query(`DROP TABLE \`tb_location-service\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_1fb3f2bcee524cf876b7df8f0b\` ON \`tb_service\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_service\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f04b8a19e7ebb203771e55f01d\` ON \`tb_location-address\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_location-address\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_367fcfa76ba289e8c966d419a9\` ON \`tb_owner_package_subscription\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_owner_package_subscription\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f80a2b815075f936ce3102726f\` ON \`tb_owner_package_plan\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_owner_package_plan\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` ON \`tb_payment_transaction\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4de77075b20e90433089638f9f\` ON \`tb_payment_transaction\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_10bb4a5b4afc00c5e28cc21513\` ON \`tb_payment_transaction\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d9d9e233d316fdd76ddd3aa9ad\` ON \`tb_payment_transaction\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c0c65cae797d4cc63393dd8de1\` ON \`tb_payment_transaction\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_payment_transaction\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f7f025f39bb10cab6617814c84\` ON \`tb_user_default\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4048cbc41c4e8401ef009e0c7d\` ON \`tb_user_default\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_791797a3cc1b633f9faf92390d\` ON \`tb_user_default\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_user_default\``);
    await queryRunner.query(
      `DROP INDEX \`REL_f6a3c608ad4dfdc048c8563bd0\` ON \`tb_user_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`tb_user_profile\``);
  }
}
