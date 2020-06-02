import {DefaultCrudRepository} from '@loopback/repository';
import {Host, HostRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class HostRepository extends DefaultCrudRepository<
  Host,
  typeof Host.prototype.ID_Host,
  HostRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Host, dataSource);
  }
}
