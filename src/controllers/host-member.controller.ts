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
import {HostMember} from '../models';
import {HostMemberRepository} from '../repositories';

export class HostMemberController {
  constructor(
    @repository(HostMemberRepository)
    public hostMemberRepository : HostMemberRepository,
  ) {}

  @post('/host-members', {
    responses: {
      '200': {
        description: 'HostMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(HostMember)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HostMember, {
            title: 'NewHostMember',
            exclude: ['ID_Host_Member'],
          }),
        },
      },
    })
    hostMember: Omit<HostMember, 'ID_Host_Member'>,
  ): Promise<HostMember> {
    return this.hostMemberRepository.create(hostMember);
  }

  @get('/host-members/count', {
    responses: {
      '200': {
        description: 'HostMember model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(HostMember)) where?: Where<HostMember>,
  ): Promise<Count> {
    return this.hostMemberRepository.count(where);
  }

  @get('/host-members', {
    responses: {
      '200': {
        description: 'Array of HostMember model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HostMember)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(HostMember)) filter?: Filter<HostMember>,
  ): Promise<HostMember[]> {
    return this.hostMemberRepository.find(filter);
  }

  @patch('/host-members', {
    responses: {
      '200': {
        description: 'HostMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HostMember, {partial: true}),
        },
      },
    })
    hostMember: HostMember,
    @param.query.object('where', getWhereSchemaFor(HostMember)) where?: Where<HostMember>,
  ): Promise<Count> {
    return this.hostMemberRepository.updateAll(hostMember, where);
  }

  @get('/host-members/{id}', {
    responses: {
      '200': {
        description: 'HostMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(HostMember)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<HostMember> {
    return this.hostMemberRepository.findById(id);
  }

  @patch('/host-members/{id}', {
    responses: {
      '204': {
        description: 'HostMember PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HostMember, {partial: true}),
        },
      },
    })
    hostMember: HostMember,
  ): Promise<void> {
    await this.hostMemberRepository.updateById(id, hostMember);
  }

  @put('/host-members/{id}', {
    responses: {
      '204': {
        description: 'HostMember PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() hostMember: HostMember,
  ): Promise<void> {
    await this.hostMemberRepository.replaceById(id, hostMember);
  }

  @del('/host-members/{id}', {
    responses: {
      '204': {
        description: 'HostMember DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.hostMemberRepository.deleteById(id);
  }
}
