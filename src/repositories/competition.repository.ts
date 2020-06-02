import {DefaultCrudRepository} from '@loopback/repository';
import {Competition, CompetitionRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CompetitionRepository extends DefaultCrudRepository<
  Competition,
  typeof Competition.prototype.ID_Competition,
  CompetitionRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Competition, dataSource);
  }
}
