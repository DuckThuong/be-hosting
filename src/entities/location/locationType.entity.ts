import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_location-type')
export class TbLocationType {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  typeCode: string;

  @Column({ type: 'varchar', length: 50, unique: false })
  typeName: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeDescription: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeLogo: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeBackGround: string;
}
