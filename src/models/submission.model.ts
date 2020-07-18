import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_submission'})
export class Submission extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Submission: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Participation: number;

  @property({
    type: 'string',
    required: true,
  })
  Title: string;

  @property({
    type: 'string',
  })
  Description: string;

  @property({
    type: 'string',
  })
  Link: string;

  @property({
    type: 'number',
    required: true,
  })
  Status: number;

  @property({
    type: 'date',
    required: true,
  })
  Date_Created: string;

  @property({
    type: 'date',
  })
  Date_Modified: string;

  constructor(data?: Partial<Submission>) {
    super(data);
  }
}

export interface SubmissionRelations {
  // describe navigational properties here
}

export type SubmissionWithRelations = Submission & SubmissionRelations;
