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
import {getDateNow} from '../utils/gFunctions';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {ScoreRequestBody, ScoreData} from '../models/types';

export class ScoreController {
  constructor(
    @repository(ScoreRepository)
    public scoreRepository: ScoreRepository,
  ) {}

  @post('/scores/new', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Score model instance',
        content: {'application/json': {schema: getModelSchemaRef(Score)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(ScoreRequestBody)
    score: ScoreData,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Score> {
    const newScore: Omit<Score, 'ID_Score'> = new Score();
    newScore.ID_Submission = score.ID_Submission;
    newScore.Score = score.Score;
    newScore.Impression = score.Impression;
    newScore.ID_User = parseInt(currentUserProfile[securityId]);
    newScore.Date_Created = getDateNow();
    newScore.Date_Modified = getDateNow();
    return this.scoreRepository.create(newScore);
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

  @get('/scores/get', {
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
    @param.query.object('filter', getFilterSchemaFor(Score))
    filter?: Filter<Score>,
  ): Promise<Score[]> {
    return this.scoreRepository.find(filter);
  }

  @get('/scores/get/submission/{id}', {
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
  async findBySubmission(
    @param.path.number('id') id: number,
  ): Promise<Score[]> {
    return this.scoreRepository.find({where: {ID_Submission: id}});
  }

  @get('/scores/get/{id}', {
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

  @patch('/scores/update/{id}', {
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
    score.Date_Modified = getDateNow();
    await this.scoreRepository.updateById(id, score);
  }

  @del('/scores/delete/{id}', {
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
