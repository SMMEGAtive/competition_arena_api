import {DefaultCrudRepository} from '@loopback/repository';
import {Participation, ParticipationRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ParticipationRepository extends DefaultCrudRepository<
  Participation,
  typeof Participation.prototype.ID_Participation,
  ParticipationRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Participation, dataSource);
  }
}
