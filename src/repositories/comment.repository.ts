import {DefaultCrudRepository} from '@loopback/repository';
import {Comment, CommentRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.ID_Comment,
  CommentRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(Comment, dataSource);
  }
}
