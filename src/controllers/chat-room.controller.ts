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
import {ChatRoom} from '../models';
import {ChatRoomRepository} from '../repositories';

export class ChatRoomController {
  constructor(
    @repository(ChatRoomRepository)
    public chatRoomRepository : ChatRoomRepository,
  ) {}

  @post('/chat-rooms', {
    responses: {
      '200': {
        description: 'ChatRoom model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatRoom)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatRoom, {
            title: 'NewChatRoom',
            exclude: ['ID_Room'],
          }),
        },
      },
    })
    chatRoom: Omit<ChatRoom, 'ID_Room'>,
  ): Promise<ChatRoom> {
    return this.chatRoomRepository.create(chatRoom);
  }

  @get('/chat-rooms/count', {
    responses: {
      '200': {
        description: 'ChatRoom model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ChatRoom)) where?: Where<ChatRoom>,
  ): Promise<Count> {
    return this.chatRoomRepository.count(where);
  }

  @get('/chat-rooms', {
    responses: {
      '200': {
        description: 'Array of ChatRoom model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ChatRoom)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChatRoom)) filter?: Filter<ChatRoom>,
  ): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find(filter);
  }

  @patch('/chat-rooms', {
    responses: {
      '200': {
        description: 'ChatRoom PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatRoom, {partial: true}),
        },
      },
    })
    chatRoom: ChatRoom,
    @param.query.object('where', getWhereSchemaFor(ChatRoom)) where?: Where<ChatRoom>,
  ): Promise<Count> {
    return this.chatRoomRepository.updateAll(chatRoom, where);
  }

  @get('/chat-rooms/{id}', {
    responses: {
      '200': {
        description: 'ChatRoom model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatRoom)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findById(id);
  }

  @patch('/chat-rooms/{id}', {
    responses: {
      '204': {
        description: 'ChatRoom PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatRoom, {partial: true}),
        },
      },
    })
    chatRoom: ChatRoom,
  ): Promise<void> {
    await this.chatRoomRepository.updateById(id, chatRoom);
  }

  @put('/chat-rooms/{id}', {
    responses: {
      '204': {
        description: 'ChatRoom PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() chatRoom: ChatRoom,
  ): Promise<void> {
    await this.chatRoomRepository.replaceById(id, chatRoom);
  }

  @del('/chat-rooms/{id}', {
    responses: {
      '204': {
        description: 'ChatRoom DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.chatRoomRepository.deleteById(id);
  }
}
