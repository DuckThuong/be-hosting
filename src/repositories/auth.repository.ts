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

  public async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  public async createUser(userData: Partial<TbUserDefault>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  public async verifyEmail(email: string): Promise<void> {
    await this.repo.update({ email }, { isEmailVerified: true });
  }
}
