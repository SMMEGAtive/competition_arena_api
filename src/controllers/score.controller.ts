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
import {Score} from '../models';
import {ScoreRepository} from '../repositories';

export class ScoreController {
  constructor(
    @repository(ScoreRepository)
    public scoreRepository : ScoreRepository,
  ) {}

  @post('/scores', {
    responses: {
      '200': {
        description: 'Score model instance',
        content: {'application/json': {schema: getModelSchemaRef(Score)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Score, {
            title: 'NewScore',
            exclude: ['ID_Score'],
          }),
        },
      },
    })
    score: Omit<Score, 'ID_Score'>,
  ): Promise<Score> {
    return this.scoreRepository.create(score);
  }

  @get('/scores/count', {
    responses: {
      '200': {
        description: 'Score model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Score)) where?: Where<Score>,
  ): Promise<Count> {
    return this.scoreRepository.count(where);
  }

  @get('/scores', {
    responses: {
      '200': {
        description: 'Array of Score model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Score)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Score)) filter?: Filter<Score>,
  ): Promise<Score[]> {
    return this.scoreRepository.find(filter);
  }

  @patch('/scores', {
    responses: {
      '200': {
        description: 'Score PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Score, {partial: true}),
        },
      },
    })
    score: Score,
    @param.query.object('where', getWhereSchemaFor(Score)) where?: Where<Score>,
  ): Promise<Count> {
    return this.scoreRepository.updateAll(score, where);
  }

  @get('/scores/{id}', {
    responses: {
      '200': {
        description: 'Score model instance',
        content: {'application/json': {schema: getModelSchemaRef(Score)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Score> {
    return this.scoreRepository.findById(id);
  }

  @patch('/scores/{id}', {
    responses: {
      '204': {
        description: 'Score PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Score, {partial: true}),
        },
      },
    })
    score: Score,
  ): Promise<void> {
    await this.scoreRepository.updateById(id, score);
  }

  @put('/scores/{id}', {
    responses: {
      '204': {
        description: 'Score PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() score: Score,
  ): Promise<void> {
    await this.scoreRepository.replaceById(id, score);
  }

  @del('/scores/{id}', {
    responses: {
      '204': {
        description: 'Score DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.scoreRepository.deleteById(id);
  }
}
