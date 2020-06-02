import {DefaultCrudRepository} from '@loopback/repository';
import {ChatMessage, ChatMessageRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChatMessageRepository extends DefaultCrudRepository<
  ChatMessage,
  typeof ChatMessage.prototype.ID_Message,
  ChatMessageRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(ChatMessage, dataSource);
  }
}
