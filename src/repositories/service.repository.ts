import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbService } from '../entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(TbService)
    private readonly service: Repository<TbService>,
  ) {}
}
