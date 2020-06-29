import {DefaultCrudRepository} from '@loopback/repository';
import {Taglist, TaglistRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TaglistRepository extends DefaultCrudRepository<
  Taglist,
  typeof Taglist.prototype.ID_Taglist,
  TaglistRelations
> {
  constructor(@inject('datasources.db_carena') dataSource: DbCarenaDataSource) {
    super(Taglist, dataSource);
  }
}
