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

  @post('/role-change-requests/new', {
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

  @get('/role-change-requests/get', {
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

  @patch('/role-change-requests/decline/{id}', {
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
  async decline(
    @param.path.number('id') id: number,
  ): Promise<{status: string}> {
    const req: RoleChangeRequest = new RoleChangeRequest();
    req.Status = -1;

    this.roleChangeRequestRepository.updateById(id, req);
    return {status: 'success'};
  }

  @get('/role-change-requests/get/{id}', {
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

  @get('/role-change-requests/get/unprocessed', {
    responses: {
      '200': {
        description: 'RoleChangeRequest model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RoleChangeRequest)},
        },
      },
    },
  })
  async findUnprocessed(): Promise<RoleChangeRequest[]> {
    return this.roleChangeRequestRepository.find({where: {Status: 0}});
  }

  @del('/role-change-requests/delete/{id}', {
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
