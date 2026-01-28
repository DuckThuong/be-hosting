import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_service')
export class TbService {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  serviceCode: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  serviceName: string;

  @Column({ type: 'varchar', length: 2000, unique: false })
  serviceDescription: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  serviceLogo: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  serviceBackGround: string;

  @Column({ type: 'decimal', unique: false, nullable: true })
  servicePrice: number;

  @Column({ type: 'tinyint', unique: false, nullable: true })
  serviceDiscount: number;
}
