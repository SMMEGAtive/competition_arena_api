import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_score'})
export class Score extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Score?: number;

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
    required: true,
  })
  Score: number;

  @property({
    type: 'string',
    required: true,
  })
  Impression: string;

  @property({
    type: 'date',
    required: true,
  })
  Date_Created: string;

  @property({
    type: 'date',
  })
  Date_Modified?: string;

  constructor(data?: Partial<Score>) {
    super(data);
  }
}

export interface ScoreRelations {
  // describe navigational properties here
}

export type ScoreWithRelations = Score & ScoreRelations;
