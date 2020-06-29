import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_participant'})
export class Participant extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Participant: number;

  @property({
    type: 'string',
    required: true,
  })
  Team_Name: string;

  @property({
    type: 'date',
    required: true,
  })
  Date_Created: string;

  @property({
    type: 'date',
  })
  Date_Modified: string;

  constructor(data?: Partial<Participant>) {
    super(data);
  }
}

export interface ParticipantRelations {
  // describe navigational properties here
}

export type ParticipantWithRelations = Participant & ParticipantRelations;
