import {Entity, model, property} from '@loopback/repository';

@model({name: 'tb_payment_status'})
export class PaymentStatus extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID_Payment_Status: number;

  @property({
    type: 'string',
  })
  Image?: string;

  @property({
    type: 'number',
    required: true,
  })
  Status: number;

  constructor(data?: Partial<PaymentStatus>) {
    super(data);
  }
}

export interface PaymentStatusRelations {
  // describe navigational properties here
}

export type PaymentStatusWithRelations = PaymentStatus & PaymentStatusRelations;
