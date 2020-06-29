import {DefaultCrudRepository} from '@loopback/repository';
import {Tags, TagsRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TagsRepository extends DefaultCrudRepository<
  Tags,
  typeof Tags.prototype.ID_Tags,
  TagsRelations
> {
  constructor(@inject('datasources.db_carena') dataSource: DbCarenaDataSource) {
    super(Tags, dataSource);
  }
}
