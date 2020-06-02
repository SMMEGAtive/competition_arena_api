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
import {ChatMessage} from '../models';
import {ChatMessageRepository} from '../repositories';

export class ChatMessageController {
  constructor(
    @repository(ChatMessageRepository)
    public chatMessageRepository : ChatMessageRepository,
  ) {}

  @post('/chat-messages', {
    responses: {
      '200': {
        description: 'ChatMessage model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatMessage)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMessage, {
            title: 'NewChatMessage',
            exclude: ['ID_Message'],
          }),
        },
      },
    })
    chatMessage: Omit<ChatMessage, 'ID_Message'>,
  ): Promise<ChatMessage> {
    return this.chatMessageRepository.create(chatMessage);
  }

  @get('/chat-messages/count', {
    responses: {
      '200': {
        description: 'ChatMessage model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ChatMessage)) where?: Where<ChatMessage>,
  ): Promise<Count> {
    return this.chatMessageRepository.count(where);
  }

  @get('/chat-messages', {
    responses: {
      '200': {
        description: 'Array of ChatMessage model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ChatMessage)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChatMessage)) filter?: Filter<ChatMessage>,
  ): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find(filter);
  }

  @patch('/chat-messages', {
    responses: {
      '200': {
        description: 'ChatMessage PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMessage, {partial: true}),
        },
      },
    })
    chatMessage: ChatMessage,
    @param.query.object('where', getWhereSchemaFor(ChatMessage)) where?: Where<ChatMessage>,
  ): Promise<Count> {
    return this.chatMessageRepository.updateAll(chatMessage, where);
  }

  @get('/chat-messages/{id}', {
    responses: {
      '200': {
        description: 'ChatMessage model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatMessage)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ChatMessage> {
    return this.chatMessageRepository.findById(id);
  }

  @patch('/chat-messages/{id}', {
    responses: {
      '204': {
        description: 'ChatMessage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatMessage, {partial: true}),
        },
      },
    })
    chatMessage: ChatMessage,
  ): Promise<void> {
    await this.chatMessageRepository.updateById(id, chatMessage);
  }

  @put('/chat-messages/{id}', {
    responses: {
      '204': {
        description: 'ChatMessage PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() chatMessage: ChatMessage,
  ): Promise<void> {
    await this.chatMessageRepository.replaceById(id, chatMessage);
  }

  @del('/chat-messages/{id}', {
    responses: {
      '204': {
        description: 'ChatMessage DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.chatMessageRepository.deleteById(id);
  }
}
