import {Entity, model, property} from '@loopback/repository';

@model()
export class ChatRoom extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Room?: number;

  @property({
    type: 'string',
    required: true,
  })
  Room_Name: string;


  constructor(data?: Partial<ChatRoom>) {
    super(data);
  }
}

export interface ChatRoomRelations {
  // describe navigational properties here
}

export type ChatRoomWithRelations = ChatRoom & ChatRoomRelations;
