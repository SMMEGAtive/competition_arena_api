import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_competition'})
export class Competition extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Competition?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Host: number;

  @property({
    type: 'number',
  })
  ID_Winner?: number;

  @property({
    type: 'string',
    required: true,
  })
  Title: string;

  @property({
    type: 'string',
  })
  Description?: string;

  @property({
    type: 'date',
    required: true,
  })
  Registration_Start: string;

  @property({
    type: 'date',
    required: true,
  })
  Registration_End: string;

  @property({
    type: 'date',
    required: true,
  })
  Verification_End: string;

  @property({
    type: 'date',
    required: true,
  })
  Execution_Start: string;

  @property({
    type: 'date',
    required: true,
  })
  Execution_End: string;

  @property({
    type: 'date',
    required: true,
  })
  Announcement_Date: string;

  constructor(data?: Partial<Competition>) {
    super(data);
  }
}

export interface CompetitionRelations {
  // describe navigational properties here
}

export type CompetitionWithRelations = Competition & CompetitionRelations;
