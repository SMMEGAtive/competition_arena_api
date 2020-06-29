import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_role_change_request'})
export class RoleChangeRequest extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Request?: number;

  @property({
    type: 'number',
    required: true,
  })
  ID_User: number;

  @property({
    type: 'number',
    required: true,
  })
  Status: number;

  @property({
    type: 'date',
    required: true,
  })
  Date_Request: string;

  constructor(data?: Partial<RoleChangeRequest>) {
    super(data);
  }
}

export interface RoleChangeRequestRelations {
  // describe navigational properties here
}

export type RoleChangeRequestWithRelations = RoleChangeRequest &
  RoleChangeRequestRelations;
