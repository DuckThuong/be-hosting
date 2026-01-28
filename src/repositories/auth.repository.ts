import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly repo: Repository<TbUserDefault>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  createUser(userData: Partial<TbUserDefault>) {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }
}
