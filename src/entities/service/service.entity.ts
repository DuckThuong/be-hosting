import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocationService } from '../location/locationService.entity';

@Entity('tb_service')
export class TbService extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Mã dịch vụ',
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: 'Tên dịch vụ',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: 'Loại dịch vụ',
  })
  category: string;

  // ── Relations ──

  @OneToMany(() => TbLocationService, (ls) => ls.service)
  locationServices?: TbLocationService[];
}
