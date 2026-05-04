import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRole, UserStatus } from '../../assets/enums/user.enum';
import { TbUserProfile } from './user_profile.entity';

@Entity('tb_user_default')
export class TbUserDefault extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Username',
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'UserCode',
    unique: true,
    nullable: false,
  })
  userCode: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'User email',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: true,
    comment: 'Hashed password',
    nullable: false,  
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Full name',
  })
  fullName?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    comment: 'User status',
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: 'User role',
    nullable: false,  
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Is email verified',
  })
  isEmailVerified: boolean;

  // ── Relations ──

  @OneToOne(() => TbUserProfile, (profile) => profile.user, { cascade: true })
  profile?: TbUserProfile;
}
