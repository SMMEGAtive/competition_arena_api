import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.ID_User,
  UserRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(User, dataSource);
  }
}
