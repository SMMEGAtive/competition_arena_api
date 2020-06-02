import {DefaultCrudRepository} from '@loopback/repository';
import {ParticipantMember, ParticipantMemberRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ParticipantMemberRepository extends DefaultCrudRepository<
  ParticipantMember,
  typeof ParticipantMember.prototype.ID_Part_Member,
  ParticipantMemberRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(ParticipantMember, dataSource);
  }
}
