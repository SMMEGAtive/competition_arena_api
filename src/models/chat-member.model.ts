import {Entity, model, property} from '@loopback/repository';

@model()
export class ChatMember extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Member?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Room: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;


  constructor(data?: Partial<ChatMember>) {
    super(data);
  }
}

export interface ChatMemberRelations {
  // describe navigational properties here
}

export type ChatMemberWithRelations = ChatMember & ChatMemberRelations;
