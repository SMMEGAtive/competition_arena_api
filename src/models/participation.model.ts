import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_participation'})
export class Participation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Participation: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Participant: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Competition: number;

  @property({
    type: 'number',
  })
  ID_Payment_Status: number;

  constructor(data?: Partial<Participation>) {
    super(data);
  }
}

export interface ParticipationRelations {
  // describe navigational properties here
}

export type ParticipationWithRelations = Participation & ParticipationRelations;
