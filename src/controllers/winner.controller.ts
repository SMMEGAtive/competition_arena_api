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
import {Winner} from '../models';
import {WinnerRepository} from '../repositories';

export class WinnerController {
  constructor(
    @repository(WinnerRepository)
    public winnerRepository : WinnerRepository,
  ) {}

  @post('/winners', {
    responses: {
      '200': {
        description: 'Winner model instance',
        content: {'application/json': {schema: getModelSchemaRef(Winner)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Winner, {
            title: 'NewWinner',
            exclude: ['ID_Winner'],
          }),
        },
      },
    })
    winner: Omit<Winner, 'ID_Winner'>,
  ): Promise<Winner> {
    return this.winnerRepository.create(winner);
  }

  @get('/winners/count', {
    responses: {
      '200': {
        description: 'Winner model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Winner)) where?: Where<Winner>,
  ): Promise<Count> {
    return this.winnerRepository.count(where);
  }

  @get('/winners', {
    responses: {
      '200': {
        description: 'Array of Winner model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Winner)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Winner)) filter?: Filter<Winner>,
  ): Promise<Winner[]> {
    return this.winnerRepository.find(filter);
  }

  @patch('/winners', {
    responses: {
      '200': {
        description: 'Winner PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Winner, {partial: true}),
        },
      },
    })
    winner: Winner,
    @param.query.object('where', getWhereSchemaFor(Winner)) where?: Where<Winner>,
  ): Promise<Count> {
    return this.winnerRepository.updateAll(winner, where);
  }

  @get('/winners/{id}', {
    responses: {
      '200': {
        description: 'Winner model instance',
        content: {'application/json': {schema: getModelSchemaRef(Winner)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Winner> {
    return this.winnerRepository.findById(id);
  }

  @patch('/winners/{id}', {
    responses: {
      '204': {
        description: 'Winner PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Winner, {partial: true}),
        },
      },
    })
    winner: Winner,
  ): Promise<void> {
    await this.winnerRepository.updateById(id, winner);
  }

  @put('/winners/{id}', {
    responses: {
      '204': {
        description: 'Winner PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() winner: Winner,
  ): Promise<void> {
    await this.winnerRepository.replaceById(id, winner);
  }

  @del('/winners/{id}', {
    responses: {
      '204': {
        description: 'Winner DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.winnerRepository.deleteById(id);
  }
}
