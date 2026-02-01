import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { Repository } from 'typeorm';
import { TbUserProfile } from '../entities/user/user_profile.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly userDefault: Repository<TbUserDefault>,

    @InjectRepository(TbUserProfile)
    private readonly userProfile: Repository<TbUserProfile>,
  ) {}
}
