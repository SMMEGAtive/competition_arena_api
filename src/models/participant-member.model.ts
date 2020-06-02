import {Entity, model, property} from '@loopback/repository';

@model()
export class ParticipantMember extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Part_Member?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Participant: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;


  constructor(data?: Partial<ParticipantMember>) {
    super(data);
  }
}

export interface ParticipantMemberRelations {
  // describe navigational properties here
}

export type ParticipantMemberWithRelations = ParticipantMember & ParticipantMemberRelations;
