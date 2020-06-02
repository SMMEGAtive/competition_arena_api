import {DefaultCrudRepository} from '@loopback/repository';
import {Winner, WinnerRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class WinnerRepository extends DefaultCrudRepository<
  Winner,
  typeof Winner.prototype.ID_Winner,
  WinnerRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Winner, dataSource);
  }
}
