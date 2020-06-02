import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {PaymentStatus} from '../models';
import {PaymentStatusRepository} from '../repositories';

export class PaymentStatusController {
  constructor(
    @repository(PaymentStatusRepository)
    public paymentStatusRepository : PaymentStatusRepository,
  ) {}

  @post('/payment-statuses', {
    responses: {
      '200': {
        description: 'PaymentStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(PaymentStatus)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentStatus, {
            title: 'NewPaymentStatus',
            exclude: ['ID_Payment_Status'],
          }),
        },
      },
    })
    paymentStatus: Omit<PaymentStatus, 'ID_Payment_Status'>,
  ): Promise<PaymentStatus> {
    return this.paymentStatusRepository.create(paymentStatus);
  }

  @get('/payment-statuses/count', {
    responses: {
      '200': {
        description: 'PaymentStatus model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PaymentStatus)) where?: Where<PaymentStatus>,
  ): Promise<Count> {
    return this.paymentStatusRepository.count(where);
  }

  @get('/payment-statuses', {
    responses: {
      '200': {
        description: 'Array of PaymentStatus model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PaymentStatus)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PaymentStatus)) filter?: Filter<PaymentStatus>,
  ): Promise<PaymentStatus[]> {
    return this.paymentStatusRepository.find(filter);
  }

  @patch('/payment-statuses', {
    responses: {
      '200': {
        description: 'PaymentStatus PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentStatus, {partial: true}),
        },
      },
    })
    paymentStatus: PaymentStatus,
    @param.query.object('where', getWhereSchemaFor(PaymentStatus)) where?: Where<PaymentStatus>,
  ): Promise<Count> {
    return this.paymentStatusRepository.updateAll(paymentStatus, where);
  }

  @get('/payment-statuses/{id}', {
    responses: {
      '200': {
        description: 'PaymentStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(PaymentStatus)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<PaymentStatus> {
    return this.paymentStatusRepository.findById(id);
  }

  @patch('/payment-statuses/{id}', {
    responses: {
      '204': {
        description: 'PaymentStatus PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentStatus, {partial: true}),
        },
      },
    })
    paymentStatus: PaymentStatus,
  ): Promise<void> {
    await this.paymentStatusRepository.updateById(id, paymentStatus);
  }

  @put('/payment-statuses/{id}', {
    responses: {
      '204': {
        description: 'PaymentStatus PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() paymentStatus: PaymentStatus,
  ): Promise<void> {
    await this.paymentStatusRepository.replaceById(id, paymentStatus);
  }

  @del('/payment-statuses/{id}', {
    responses: {
      '204': {
        description: 'PaymentStatus DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.paymentStatusRepository.deleteById(id);
  }
}
