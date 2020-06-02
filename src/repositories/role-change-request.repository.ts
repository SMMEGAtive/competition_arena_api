import {DefaultCrudRepository} from '@loopback/repository';
import {RoleChangeRequest, RoleChangeRequestRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RoleChangeRequestRepository extends DefaultCrudRepository<
  RoleChangeRequest,
  typeof RoleChangeRequest.prototype.ID_Request,
  RoleChangeRequestRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(RoleChangeRequest, dataSource);
  }
}
