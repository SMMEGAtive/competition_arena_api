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
import {RoleChangeRequest} from '../models';
import {RoleChangeRequestRepository} from '../repositories';

export class RoleChangeRequestController {
  constructor(
    @repository(RoleChangeRequestRepository)
    public roleChangeRequestRepository : RoleChangeRequestRepository,
  ) {}

  @post('/role-change-requests', {
    responses: {
      '200': {
        description: 'RoleChangeRequest model instance',
        content: {'application/json': {schema: getModelSchemaRef(RoleChangeRequest)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleChangeRequest, {
            title: 'NewRoleChangeRequest',
            exclude: ['ID_Request'],
          }),
        },
      },
    })
    roleChangeRequest: Omit<RoleChangeRequest, 'ID_Request'>,
  ): Promise<RoleChangeRequest> {
    return this.roleChangeRequestRepository.create(roleChangeRequest);
  }

  @get('/role-change-requests/count', {
    responses: {
      '200': {
        description: 'RoleChangeRequest model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(RoleChangeRequest)) where?: Where<RoleChangeRequest>,
  ): Promise<Count> {
    return this.roleChangeRequestRepository.count(where);
  }

  @get('/role-change-requests', {
    responses: {
      '200': {
        description: 'Array of RoleChangeRequest model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RoleChangeRequest)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(RoleChangeRequest)) filter?: Filter<RoleChangeRequest>,
  ): Promise<RoleChangeRequest[]> {
    return this.roleChangeRequestRepository.find(filter);
  }

  @patch('/role-change-requests', {
    responses: {
      '200': {
        description: 'RoleChangeRequest PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleChangeRequest, {partial: true}),
        },
      },
    })
    roleChangeRequest: RoleChangeRequest,
    @param.query.object('where', getWhereSchemaFor(RoleChangeRequest)) where?: Where<RoleChangeRequest>,
  ): Promise<Count> {
    return this.roleChangeRequestRepository.updateAll(roleChangeRequest, where);
  }

  @get('/role-change-requests/{id}', {
    responses: {
      '200': {
        description: 'RoleChangeRequest model instance',
        content: {'application/json': {schema: getModelSchemaRef(RoleChangeRequest)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<RoleChangeRequest> {
    return this.roleChangeRequestRepository.findById(id);
  }

  @patch('/role-change-requests/{id}', {
    responses: {
      '204': {
        description: 'RoleChangeRequest PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleChangeRequest, {partial: true}),
        },
      },
    })
    roleChangeRequest: RoleChangeRequest,
  ): Promise<void> {
    await this.roleChangeRequestRepository.updateById(id, roleChangeRequest);
  }

  @put('/role-change-requests/{id}', {
    responses: {
      '204': {
        description: 'RoleChangeRequest PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() roleChangeRequest: RoleChangeRequest,
  ): Promise<void> {
    await this.roleChangeRequestRepository.replaceById(id, roleChangeRequest);
  }

  @del('/role-change-requests/{id}', {
    responses: {
      '204': {
        description: 'RoleChangeRequest DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roleChangeRequestRepository.deleteById(id);
  }
}
