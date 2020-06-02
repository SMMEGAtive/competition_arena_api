import {DefaultCrudRepository} from '@loopback/repository';
import {ChatRoom, ChatRoomRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChatRoomRepository extends DefaultCrudRepository<
  ChatRoom,
  typeof ChatRoom.prototype.ID_Room,
  ChatRoomRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(ChatRoom, dataSource);
  }
}
