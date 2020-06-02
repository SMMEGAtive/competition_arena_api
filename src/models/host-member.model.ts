import {Entity, model, property} from '@loopback/repository';

@model()
export class HostMember extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Host_Member?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_Host: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;


  constructor(data?: Partial<HostMember>) {
    super(data);
  }
}

export interface HostMemberRelations {
  // describe navigational properties here
}

export type HostMemberWithRelations = HostMember & HostMemberRelations;
