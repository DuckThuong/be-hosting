import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_user_profile')
export class TbUserProfile {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({
    type: 'int',
    comment: 'User id',
  })
  user_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Avatar URL',
  })
  avatarUrl?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Cover/banner URL',
  })
  coverUrl?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Bio',
  })
  bio?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Date of birth',
  })
  dateOfBirth?: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Phone number',
  })
  phone?: string;

  @Column({
    type: 'varchar',
    comment: 'Địa chỉ chi tiết',
    length: 255,
    unique: false,
  })
  fullAddress: string;

  @Column({
    type: 'varchar',
    comment: 'Phường | xã',
    length: 255,
    nullable: true,
    unique: false,
  })
  userWard: string;

  @Column({
    type: 'varchar',
    comment: 'Quận | huyện',
    length: 255,
    nullable: true,
    unique: false,
  })
  userDistrict: string;

  @Column({
    type: 'varchar',
    comment: 'Thành Phố',
    length: 255,
    unique: false,
    nullable: true,
  })
  userCity: string;

  @Column({
    type: 'varchar',
    comment: 'Tỉnh',
    length: 255,
    unique: false,
    nullable: true,
  })
  userProvince: string;

  @Column({
    type: 'varchar',
    comment: 'Quốc gia',
    length: 255,
    unique: false,
    nullable: true,
  })
  userCountry: string;

  @Column({
    type: 'varchar',
    comment: 'Mã bưu chính',
    length: 255,
    unique: false,
    nullable: true,
  })
  userPortal: string;

  @Column({
    type: 'varchar',
    comment: 'Vĩ độ',
    length: 255,
    unique: false,
    nullable: true,
  })
  userLat: string;

  @Column({
    type: 'varchar',
    comment: 'Kinh độ',
    length: 255,
    unique: false,
    nullable: true,
  })
  userLong: string;

  @Column({
    type: 'varchar',
    comment: 'Mô tả',
    length: 255,
    unique: false,
    nullable: true,
  })
  userDescription: string;

  @Column({
    type: 'varchar',
    comment: 'Ghi chú',
    length: 255,
    unique: false,
    nullable: true,
  })
  userNote: string;
}
