import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_tags'})
export class Tags extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Tags: number;

  @property({
    type: 'string',
    required: true,
  })
  Tag_Name: string;

  constructor(data?: Partial<Tags>) {
    super(data);
  }
}

export interface TagsRelations {
  // describe navigational properties here
}

export type TagsWithRelations = Tags & TagsRelations;
