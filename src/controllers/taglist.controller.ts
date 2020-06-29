import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Taglist} from '../models';
import {TaglistRepository} from '../repositories';

export class TaglistController {
  constructor(
    @repository(TaglistRepository)
    public taglistRepository : TaglistRepository,
  ) {}

  @post('/taglists', {
    responses: {
      '200': {
        description: 'Taglist model instance',
        content: {'application/json': {schema: getModelSchemaRef(Taglist)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taglist, {
            title: 'NewTaglist',
            exclude: ['ID_Taglist'],
          }),
        },
      },
    })
    taglist: Omit<Taglist, 'ID_Taglist'>,
  ): Promise<Taglist> {
    return this.taglistRepository.create(taglist);
  }

  @get('/taglists/count', {
    responses: {
      '200': {
        description: 'Taglist model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Taglist) where?: Where<Taglist>,
  ): Promise<Count> {
    return this.taglistRepository.count(where);
  }

  @get('/taglists', {
    responses: {
      '200': {
        description: 'Array of Taglist model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Taglist, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Taglist) filter?: Filter<Taglist>,
  ): Promise<Taglist[]> {
    return this.taglistRepository.find(filter);
  }

  @patch('/taglists', {
    responses: {
      '200': {
        description: 'Taglist PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taglist, {partial: true}),
        },
      },
    })
    taglist: Taglist,
    @param.where(Taglist) where?: Where<Taglist>,
  ): Promise<Count> {
    return this.taglistRepository.updateAll(taglist, where);
  }

  @get('/taglists/{id}', {
    responses: {
      '200': {
        description: 'Taglist model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Taglist, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Taglist, {exclude: 'where'}) filter?: FilterExcludingWhere<Taglist>
  ): Promise<Taglist> {
    return this.taglistRepository.findById(id, filter);
  }

  @patch('/taglists/{id}', {
    responses: {
      '204': {
        description: 'Taglist PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taglist, {partial: true}),
        },
      },
    })
    taglist: Taglist,
  ): Promise<void> {
    await this.taglistRepository.updateById(id, taglist);
  }

  @put('/taglists/{id}', {
    responses: {
      '204': {
        description: 'Taglist PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() taglist: Taglist,
  ): Promise<void> {
    await this.taglistRepository.replaceById(id, taglist);
  }

  @del('/taglists/{id}', {
    responses: {
      '204': {
        description: 'Taglist DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.taglistRepository.deleteById(id);
  }
}
