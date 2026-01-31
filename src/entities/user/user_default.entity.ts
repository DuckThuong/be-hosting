import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole, UserStatus } from '../../dtos/user/user.dto';

@Entity('tb_user_default')
export class TbUserDefault {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Username',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'UserCode',
  })
  userCode: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'User email',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: true,
    comment: 'Hashed password',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Phone number',
  })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Full name',
  })
  fullName?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Date of birth',
  })
  dateOfBirth?: Date;

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
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Is email verified',
  })
  isEmailVerified: boolean;
}
