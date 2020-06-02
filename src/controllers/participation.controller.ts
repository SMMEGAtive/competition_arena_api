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
import {Participation} from '../models';
import {ParticipationRepository} from '../repositories';

export class ParticipationController {
  constructor(
    @repository(ParticipationRepository)
    public participationRepository : ParticipationRepository,
  ) {}

  @post('/participations', {
    responses: {
      '200': {
        description: 'Participation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Participation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participation, {
            title: 'NewParticipation',
            exclude: ['ID_Participation'],
          }),
        },
      },
    })
    participation: Omit<Participation, 'ID_Participation'>,
  ): Promise<Participation> {
    return this.participationRepository.create(participation);
  }

  @get('/participations/count', {
    responses: {
      '200': {
        description: 'Participation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Participation)) where?: Where<Participation>,
  ): Promise<Count> {
    return this.participationRepository.count(where);
  }

  @get('/participations', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Participation)) filter?: Filter<Participation>,
  ): Promise<Participation[]> {
    return this.participationRepository.find(filter);
  }

  @patch('/participations', {
    responses: {
      '200': {
        description: 'Participation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participation, {partial: true}),
        },
      },
    })
    participation: Participation,
    @param.query.object('where', getWhereSchemaFor(Participation)) where?: Where<Participation>,
  ): Promise<Count> {
    return this.participationRepository.updateAll(participation, where);
  }

  @get('/participations/{id}', {
    responses: {
      '200': {
        description: 'Participation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Participation)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Participation> {
    return this.participationRepository.findById(id);
  }

  @patch('/participations/{id}', {
    responses: {
      '204': {
        description: 'Participation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participation, {partial: true}),
        },
      },
    })
    participation: Participation,
  ): Promise<void> {
    await this.participationRepository.updateById(id, participation);
  }

  @put('/participations/{id}', {
    responses: {
      '204': {
        description: 'Participation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() participation: Participation,
  ): Promise<void> {
    await this.participationRepository.replaceById(id, participation);
  }

  @del('/participations/{id}', {
    responses: {
      '204': {
        description: 'Participation DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.participationRepository.deleteById(id);
  }
}
