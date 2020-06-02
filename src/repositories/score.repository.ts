import {DefaultCrudRepository} from '@loopback/repository';
import {Score, ScoreRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ScoreRepository extends DefaultCrudRepository<
  Score,
  typeof Score.prototype.ID_Score,
  ScoreRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Score, dataSource);
  }
}
