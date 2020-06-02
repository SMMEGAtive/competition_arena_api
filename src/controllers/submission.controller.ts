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
import {Submission} from '../models';
import {SubmissionRepository} from '../repositories';

export class SubmissionController {
  constructor(
    @repository(SubmissionRepository)
    public submissionRepository : SubmissionRepository,
  ) {}

  @post('/submissions', {
    responses: {
      '200': {
        description: 'Submission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Submission)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Submission, {
            title: 'NewSubmission',
            exclude: ['ID_Submission'],
          }),
        },
      },
    })
    submission: Omit<Submission, 'ID_Submission'>,
  ): Promise<Submission> {
    return this.submissionRepository.create(submission);
  }

  @get('/submissions/count', {
    responses: {
      '200': {
        description: 'Submission model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Submission)) where?: Where<Submission>,
  ): Promise<Count> {
    return this.submissionRepository.count(where);
  }

  @get('/submissions', {
    responses: {
      '200': {
        description: 'Array of Submission model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Submission)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Submission)) filter?: Filter<Submission>,
  ): Promise<Submission[]> {
    return this.submissionRepository.find(filter);
  }

  @patch('/submissions', {
    responses: {
      '200': {
        description: 'Submission PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Submission, {partial: true}),
        },
      },
    })
    submission: Submission,
    @param.query.object('where', getWhereSchemaFor(Submission)) where?: Where<Submission>,
  ): Promise<Count> {
    return this.submissionRepository.updateAll(submission, where);
  }

  @get('/submissions/{id}', {
    responses: {
      '200': {
        description: 'Submission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Submission)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Submission> {
    return this.submissionRepository.findById(id);
  }

  @patch('/submissions/{id}', {
    responses: {
      '204': {
        description: 'Submission PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Submission, {partial: true}),
        },
      },
    })
    submission: Submission,
  ): Promise<void> {
    await this.submissionRepository.updateById(id, submission);
  }

  @put('/submissions/{id}', {
    responses: {
      '204': {
        description: 'Submission PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() submission: Submission,
  ): Promise<void> {
    await this.submissionRepository.replaceById(id, submission);
  }

  @del('/submissions/{id}', {
    responses: {
      '204': {
        description: 'Submission DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.submissionRepository.deleteById(id);
  }
}
