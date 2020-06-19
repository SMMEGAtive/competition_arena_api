import {Entity, model, property} from '@loopback/repository';
import {settings} from 'cluster';

@model({name: 'tb_user'})
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  Username: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_User: number;

  @property({
    type: 'string',
    required: true,
  })
  Email: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  Email_Verified: boolean;

  @property({
    type: 'string',
    required: true,
  })
  Password: string;

  @property({
    type: 'string',
  })
  Phone?: string;

  @property({
    type: 'string',
  })
  Address?: string;

  @property({
    type: 'number',
    required: true,
    default: 1,
  })
  Role: number;

  @property({
    type: 'string',
  })
  Description?: string;

  @property({
    type: 'string',
  })
  Affiliation?: string;

  @property({
    type: 'number',
    required: true,
  })
  Gender: number;

  @property({
    type: 'date',
  })
  Date_of_Birth?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
