import { EntityRepository, Repository } from 'typeorm';
import { TbUserDefault } from '../entities/user/user_default.dto';

@EntityRepository(TbUserDefault)
export class AuthRepository extends Repository<TbUserDefault> {
  // Repository methods would go here
}
