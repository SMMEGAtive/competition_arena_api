import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_comment'})
export class Comment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Comment: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Submission: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;

  @property({
    type: 'number',
  })
  ID_Comment_Parent: number;

  @property({
    type: 'string',
    required: true,
  })
  Content: string;

  @property({
    type: 'date',
    required: true,
  })
  Date_Created: string;

  @property({
    type: 'date',
  })
  Date_Modified: string;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
