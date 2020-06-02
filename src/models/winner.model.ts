import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_winner'})
export class Winner extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Winner?: number;

  @property({
    type: 'number',
    required: true,
  })
  First: number;

  @property({
    type: 'number',
    required: true,
  })
  Second: number;

  @property({
    type: 'number',
    required: true,
  })
  Third: number;

  constructor(data?: Partial<Winner>) {
    super(data);
  }
}

export interface WinnerRelations {
  // describe navigational properties here
}

export type WinnerWithRelations = Winner & WinnerRelations;
