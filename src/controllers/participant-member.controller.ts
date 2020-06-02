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
import {ParticipantMember} from '../models';
import {ParticipantMemberRepository} from '../repositories';

export class ParticipantMemberController {
  constructor(
    @repository(ParticipantMemberRepository)
    public participantMemberRepository : ParticipantMemberRepository,
  ) {}

  @post('/participant-members', {
    responses: {
      '200': {
        description: 'ParticipantMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(ParticipantMember)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParticipantMember, {
            title: 'NewParticipantMember',
            exclude: ['ID_Part_Member'],
          }),
        },
      },
    })
    participantMember: Omit<ParticipantMember, 'ID_Part_Member'>,
  ): Promise<ParticipantMember> {
    return this.participantMemberRepository.create(participantMember);
  }

  @get('/participant-members/count', {
    responses: {
      '200': {
        description: 'ParticipantMember model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ParticipantMember)) where?: Where<ParticipantMember>,
  ): Promise<Count> {
    return this.participantMemberRepository.count(where);
  }

  @get('/participant-members', {
    responses: {
      '200': {
        description: 'Array of ParticipantMember model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ParticipantMember)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ParticipantMember)) filter?: Filter<ParticipantMember>,
  ): Promise<ParticipantMember[]> {
    return this.participantMemberRepository.find(filter);
  }

  @patch('/participant-members', {
    responses: {
      '200': {
        description: 'ParticipantMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParticipantMember, {partial: true}),
        },
      },
    })
    participantMember: ParticipantMember,
    @param.query.object('where', getWhereSchemaFor(ParticipantMember)) where?: Where<ParticipantMember>,
  ): Promise<Count> {
    return this.participantMemberRepository.updateAll(participantMember, where);
  }

  @get('/participant-members/{id}', {
    responses: {
      '200': {
        description: 'ParticipantMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(ParticipantMember)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ParticipantMember> {
    return this.participantMemberRepository.findById(id);
  }

  @patch('/participant-members/{id}', {
    responses: {
      '204': {
        description: 'ParticipantMember PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParticipantMember, {partial: true}),
        },
      },
    })
    participantMember: ParticipantMember,
  ): Promise<void> {
    await this.participantMemberRepository.updateById(id, participantMember);
  }

  @put('/participant-members/{id}', {
    responses: {
      '204': {
        description: 'ParticipantMember PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() participantMember: ParticipantMember,
  ): Promise<void> {
    await this.participantMemberRepository.replaceById(id, participantMember);
  }

  @del('/participant-members/{id}', {
    responses: {
      '204': {
        description: 'ParticipantMember DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.participantMemberRepository.deleteById(id);
  }
}
