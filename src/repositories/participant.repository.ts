import {DefaultCrudRepository} from '@loopback/repository';
import {Participant, ParticipantRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ParticipantRepository extends DefaultCrudRepository<
  Participant,
  typeof Participant.prototype.ID_Participant,
  ParticipantRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Participant, dataSource);
  }
}
