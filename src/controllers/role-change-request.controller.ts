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
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {getDateNow} from '../utils/gFunctions';

export class RoleChangeRequestController {
  constructor(
    @repository(RoleChangeRequestRepository)
    public roleChangeRequestRepository: RoleChangeRequestRepository,
  ) {}

  @post('/role-change-requests', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'RoleChangeRequest model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RoleChangeRequest)},
        },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<RoleChangeRequest> {
    const roleChangeRequest: Omit<
      RoleChangeRequest,
      'ID_Request'
    > = new RoleChangeRequest();
    roleChangeRequest.ID_User = parseInt(currentUserProfile[securityId]);
    roleChangeRequest.Date_Request = getDateNow();
    roleChangeRequest.Status = 0;
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
    @param.query.object('where', getWhereSchemaFor(RoleChangeRequest))
    where?: Where<RoleChangeRequest>,
  ): Promise<Count> {
    return this.roleChangeRequestRepository.count(where);
  }

  @get('/role-change-requests', {
    responses: {
      '200': {
        description: 'Array of RoleChangeRequest model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(RoleChangeRequest),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(RoleChangeRequest))
    filter?: Filter<RoleChangeRequest>,
  ): Promise<RoleChangeRequest[]> {
    return this.roleChangeRequestRepository.find();
  }

  @patch('/role-change-requests/accept/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  async accept(@param.path.number('id') id: number): Promise<{status: string}> {
    const req: RoleChangeRequest = new RoleChangeRequest();
    req.Status = 1;

    this.roleChangeRequestRepository.updateById(id, req);
    return {status: 'success'};
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
    @param.query.object('where', getWhereSchemaFor(RoleChangeRequest))
    where?: Where<RoleChangeRequest>,
  ): Promise<Count> {
    return this.roleChangeRequestRepository.updateAll(roleChangeRequest, where);
  }

  @get('/role-change-requests/{id}', {
    responses: {
      '200': {
        description: 'RoleChangeRequest model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RoleChangeRequest)},
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<RoleChangeRequest> {
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
