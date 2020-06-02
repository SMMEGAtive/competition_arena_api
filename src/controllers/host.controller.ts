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
import {Host} from '../models';
import {HostRepository} from '../repositories';

export class HostController {
  constructor(
    @repository(HostRepository)
    public hostRepository : HostRepository,
  ) {}

  @post('/hosts', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {'application/json': {schema: getModelSchemaRef(Host)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {
            title: 'NewHost',
            exclude: ['ID_Host'],
          }),
        },
      },
    })
    host: Omit<Host, 'ID_Host'>,
  ): Promise<Host> {
    return this.hostRepository.create(host);
  }

  @get('/hosts/count', {
    responses: {
      '200': {
        description: 'Host model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Host)) where?: Where<Host>,
  ): Promise<Count> {
    return this.hostRepository.count(where);
  }

  @get('/hosts', {
    responses: {
      '200': {
        description: 'Array of Host model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Host)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Host)) filter?: Filter<Host>,
  ): Promise<Host[]> {
    return this.hostRepository.find(filter);
  }

  @patch('/hosts', {
    responses: {
      '200': {
        description: 'Host PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {partial: true}),
        },
      },
    })
    host: Host,
    @param.query.object('where', getWhereSchemaFor(Host)) where?: Where<Host>,
  ): Promise<Count> {
    return this.hostRepository.updateAll(host, where);
  }

  @get('/hosts/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {'application/json': {schema: getModelSchemaRef(Host)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Host> {
    return this.hostRepository.findById(id);
  }

  @patch('/hosts/{id}', {
    responses: {
      '204': {
        description: 'Host PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {partial: true}),
        },
      },
    })
    host: Host,
  ): Promise<void> {
    await this.hostRepository.updateById(id, host);
  }

  @put('/hosts/{id}', {
    responses: {
      '204': {
        description: 'Host PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() host: Host,
  ): Promise<void> {
    await this.hostRepository.replaceById(id, host);
  }

  @del('/hosts/{id}', {
    responses: {
      '204': {
        description: 'Host DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.hostRepository.deleteById(id);
  }
}
