import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_taglist'})
export class Taglist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Taglist: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Competition: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Tags: number;

  constructor(data?: Partial<Taglist>) {
    super(data);
  }
}

export interface TaglistRelations {
  // describe navigational properties here
}

export type TaglistWithRelations = Taglist & TaglistRelations;
