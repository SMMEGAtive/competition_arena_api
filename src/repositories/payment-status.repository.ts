import {DefaultCrudRepository} from '@loopback/repository';
import {PaymentStatus, PaymentStatusRelations} from '../models';
import {DbCarenaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PaymentStatusRepository extends DefaultCrudRepository<
  PaymentStatus,
  typeof PaymentStatus.prototype.ID_Payment_Status,
  PaymentStatusRelations
> {
  constructor(
    @inject('datasources.db_carena') dataSource: DbCarenaDataSource,
  ) {
    super(PaymentStatus, dataSource);
  }
}
