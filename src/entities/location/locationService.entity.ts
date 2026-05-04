import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocation } from './location.entity';
import { TbService } from '../service/service.entity';

@Entity('tb_location-service')
export class TbLocationService extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Mã địa điểm',
  })
  locationCode: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Mã dịch vụ',
  })
  serviceCode: string;

  @Column({
    type: 'varchar',
    length: 2000,
    unique: false,
    comment: 'Mô tả dịch vụ',
  })
  description: string;

  @Column({
    type: 'boolean',
    comment: 'Loại tiện ích: free hoặc mất phí',
  })
  isFree: boolean;

  @Column({
    type: 'decimal',
    unique: false,
    nullable: true,
    comment: 'Giá cơ bản',
  })
  basePrice: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    comment: 'Đơn vị tính',
  })
  unit: string;

  //số lượng
  @Column({
    type: 'int',
    unique: false,
    nullable: true,
    comment: 'Số lượng',
  })
  quantity: number;

  @Column({
    type: 'boolean',
    comment: 'Trạng thái hoạt động',
  })
  isActive: boolean;

  // ── Relations ──

  @ManyToOne(() => TbLocation, (location) => location.locationServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationCode', referencedColumnName: 'locationCode' })
  location?: TbLocation;

  @ManyToOne(() => TbService, (service) => service.locationServices)
  @JoinColumn({ name: 'serviceCode', referencedColumnName: 'code' })
  service?: TbService;
}
