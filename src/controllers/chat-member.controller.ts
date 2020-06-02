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
import {ChatMember} from '../models';
import {ChatMemberRepository} from '../repositories';

export class ChatMemberController {
  constructor(
    @repository(ChatMemberRepository)
    public chatMemberRepository : ChatMemberRepository,
  ) {}

  @post('/chat-members', {
    responses: {
      '200': {
        description: 'ChatMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatMember)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMember, {
            title: 'NewChatMember',
            exclude: ['ID_Member'],
          }),
        },
      },
    })
    chatMember: Omit<ChatMember, 'ID_Member'>,
  ): Promise<ChatMember> {
    return this.chatMemberRepository.create(chatMember);
  }

  @get('/chat-members/count', {
    responses: {
      '200': {
        description: 'ChatMember model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ChatMember)) where?: Where<ChatMember>,
  ): Promise<Count> {
    return this.chatMemberRepository.count(where);
  }

  @get('/chat-members', {
    responses: {
      '200': {
        description: 'Array of ChatMember model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ChatMember)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChatMember)) filter?: Filter<ChatMember>,
  ): Promise<ChatMember[]> {
    return this.chatMemberRepository.find(filter);
  }

  @patch('/chat-members', {
    responses: {
      '200': {
        description: 'ChatMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMember, {partial: true}),
        },
      },
    })
    chatMember: ChatMember,
    @param.query.object('where', getWhereSchemaFor(ChatMember)) where?: Where<ChatMember>,
  ): Promise<Count> {
    return this.chatMemberRepository.updateAll(chatMember, where);
  }

  @get('/chat-members/{id}', {
    responses: {
      '200': {
        description: 'ChatMember model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatMember)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ChatMember> {
    return this.chatMemberRepository.findById(id);
  }

  @patch('/chat-members/{id}', {
    responses: {
      '204': {
        description: 'ChatMember PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMember, {partial: true}),
        },
      },
    })
    chatMember: ChatMember,
  ): Promise<void> {
    await this.chatMemberRepository.updateById(id, chatMember);
  }

  @put('/chat-members/{id}', {
    responses: {
      '204': {
        description: 'ChatMember PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() chatMember: ChatMember,
  ): Promise<void> {
    await this.chatMemberRepository.replaceById(id, chatMember);
  }

  @del('/chat-members/{id}', {
    responses: {
      '204': {
        description: 'ChatMember DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.chatMemberRepository.deleteById(id);
  }
}
