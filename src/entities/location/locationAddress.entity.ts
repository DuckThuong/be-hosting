import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_location-address')
export class TbLocationAddress {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Mã địa điểm',
    length: 25,
    unique: false,
  })
  locationCode: string;

  @Column({ type: 'varchar', comment: 'Mã địa chỉ', length: 25, unique: true })
  addressCode: string;

  @Column({
    type: 'varchar',
    comment: 'Tên địa chỉ',
    length: 255,
    unique: false,
  })
  addressName: string;

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
    unique: false,
  })
  addressWard: string;

  @Column({
    type: 'varchar',
    comment: 'Quận | huyện',
    length: 255,
    unique: false,
  })
  addressDistrict: string;

  @Column({
    type: 'varchar',
    comment: 'Thành Phố',
    length: 255,
    unique: false,
  })
  addressCity: string;

  @Column({
    type: 'varchar',
    comment: 'Tỉnh',
    length: 255,
    unique: false,
  })
  addressProvince: string;

  @Column({
    type: 'varchar',
    comment: 'Quốc gia',
    length: 255,
    unique: false,
  })
  addressCountry: string;

  @Column({
    type: 'varchar',
    comment: 'Mã bưu chính',
    length: 255,
    unique: false,
  })
  addressPortal: string;

  @Column({
    type: 'varchar',
    comment: 'Vĩ độ',
    length: 255,
    unique: false,
  })
  addressLat: string;

  @Column({
    type: 'varchar',
    comment: 'Kinh độ',
    length: 255,
    unique: false,
  })
  addressLong: string;

  @Column({
    type: 'varchar',
    comment: 'Vùng',
    length: 255,
    unique: false,
  })
  addressRegion: string;

  @Column({
    type: 'varchar',
    comment: 'Trạng thái',
    length: 255,
    unique: false,
  })
  addressStatus: string;

  @Column({
    type: 'varchar',
    comment: 'Mô tả',
    length: 255,
    unique: false,
  })
  addressDescription: string;

  @Column({
    type: 'varchar',
    comment: 'Ghi chú',
    length: 255,
    unique: false,
  })
  addressNote: string;

  @Column({
    type: 'varchar',
    comment: 'Phân loại',
    length: 255,
    unique: false,
  })
  addressType: string;
}
