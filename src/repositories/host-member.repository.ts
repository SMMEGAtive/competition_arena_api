import {DefaultCrudRepository} from '@loopback/repository';
import {HostMember, HostMemberRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class HostMemberRepository extends DefaultCrudRepository<
  HostMember,
  typeof HostMember.prototype.ID_Host_Member,
  HostMemberRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(HostMember, dataSource);
  }
}
