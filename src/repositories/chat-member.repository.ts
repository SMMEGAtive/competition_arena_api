import {DefaultCrudRepository} from '@loopback/repository';
import {ChatMember, ChatMemberRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChatMemberRepository extends DefaultCrudRepository<
  ChatMember,
  typeof ChatMember.prototype.ID_Member,
  ChatMemberRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(ChatMember, dataSource);
  }
}
