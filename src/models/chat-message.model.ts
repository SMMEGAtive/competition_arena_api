import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_chat_message'})
export class ChatMessage extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Message?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Room?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;

  @property({
    type: 'string',
  })
  Message?: string;

  @property({
    type: 'string',
  })
  Image_URL?: string;

  @property({
    type: 'date',
    required: true,
  })
  Sent_Time?: string;

  @property({
    type: 'date',
  })
  Delivered_Time?: string;

  @property({
    type: 'date',
  })
  Read_Time?: string;

  constructor(data?: Partial<ChatMessage>) {
    super(data);
  }
}

export interface ChatMessageRelations {
  // describe navigational properties here
}

export type ChatMessageWithRelations = ChatMessage & ChatMessageRelations;
