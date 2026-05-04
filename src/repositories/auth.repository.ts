import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(TbUserDefault)
    private readonly repo: Repository<TbUserDefault>,

    @InjectRepository(TbUserProfile)
    private readonly profileRepo: Repository<TbUserProfile>,
  ) {}

  public async findByEmail(email: string) {
    return await this.repo.findOne({
      where: { email },
    });
  }

  public async findById(id: number) {
    return await this.repo.findOne({
      where: { id },
    });
  }

  public async createUser(userData: Partial<TbUserDefault>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  public async createUserProfile(userId: number): Promise<TbUserProfile> {
    const profile = this.profileRepo.create({ user_id: userId });
    return await this.profileRepo.save(profile);
  }

  public async verifyEmail(email: string): Promise<void> {
    await this.repo.update({ email }, { isEmailVerified: true });
  }

  public async updatePassword(id: number, password: string): Promise<void> {
    await this.repo.update({ id }, { password: password });
  }
}

