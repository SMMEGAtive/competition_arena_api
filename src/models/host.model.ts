import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_host'})
export class Host extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Host: number;

  @property({
    type: 'string',
    required: true,
  })
  Host_Name: string;

  @property({
    type: 'date',
    required: true,
  })
  Date_Created: string;

  @property({
    type: 'date',
  })
  Date_Modified: string;

  constructor(data?: Partial<Host>) {
    super(data);
  }
}

export interface HostRelations {
  // describe navigational properties here
}

export type HostWithRelations = Host & HostRelations;
