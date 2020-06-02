import {DefaultCrudRepository} from '@loopback/repository';
import {Submission, SubmissionRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SubmissionRepository extends DefaultCrudRepository<
  Submission,
  typeof Submission.prototype.ID_Submission,
  SubmissionRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Submission, dataSource);
  }
}
