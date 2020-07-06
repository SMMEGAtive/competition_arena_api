import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  param,
} from '@loopback/rest';
import {
  ChatRoom,
  ChatMember,
  ChatMemberRelations,
  ChatMessage,
  User,
} from '../models';
import {
  ChatRoomRepository,
  ChatMemberRepository,
  ChatMessageRepository,
  UserRepository,
} from '../repositories';
import {ChatRoomData, ChatRoomRequestBody, UserLimited} from '../models/types';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';

import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {getDateNow} from '../utils/gFunctions';

export class ChatRoomController {
  constructor(
    @repository(ChatRoomRepository)
    public chatRoomRepository: ChatRoomRepository,
    @repository(ChatMemberRepository)
    public memberRepository: ChatMemberRepository,
    @repository(ChatMessageRepository)
    public chatMessageRepository: ChatMessageRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/chat-rooms/new', {
    responses: {
      '200': {
        description: 'ChatRoom model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatRoom)}},
      },
    },
  })
  async create(
    @requestBody(ChatRoomRequestBody)
    room: ChatRoomData,
  ): Promise<ChatRoom> {
    // Isi Tabel Chatroom
    let chatRoom: Omit<ChatRoom, 'ID_Room'> = new ChatRoom();
    chatRoom.Room_Name = room.Room_Name;

    let newRoomID: number = 1;
    const lastRoom = await this.chatRoomRepository.findOne({
      order: ['ID_Room DESC'],
      limit: 1,
    });

    if (lastRoom) {
      newRoomID = lastRoom!.ID_Room! + 1;
    }

    //Isi Tabel Chat Member
    const memberList = room.Members;
    let i: number = 0;
    for (i; i < memberList.length; i++) {
      let roomMember: ChatMember = new ChatMember();
      roomMember.ID_Room = newRoomID;
      roomMember.ID_User = memberList[i];
      this.memberRepository.create(roomMember);
    }

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
    @param.query.object('where', getWhereSchemaFor(ChatRoom))
    where?: Where<ChatRoom>,
  ): Promise<Count> {
    return this.chatRoomRepository.count(where);
  }

  @get('/chat-rooms/membercount/{id}', {
    responses: {
      '200': {
        description: 'ChatRoom model count',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {count: {type: 'number'}}},
          },
        },
      },
    },
  })
  async memberCount(
    @param.path.number('id') id: number,
  ): Promise<{count: number}> {
    const teamMember = await this.memberRepository.find({
      where: {ID_Room: id},
    });
    return {count: teamMember.length};
  }

  @get('/chat-rooms/get', {
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
    @param.query.object('filter', getFilterSchemaFor(ChatRoom))
    filter?: Filter<ChatRoom>,
  ): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find(filter);
  }

  @patch('/chat-rooms/update/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  async update(
    @requestBody(ChatRoomRequestBody)
    room: ChatRoomData,
    @param.path.number('id') id: number,
  ): Promise<{status: string}> {
    // Isi Tabel Host
    const existingRoom = await this.chatRoomRepository.findById(id);

    if (existingRoom.Room_Name != room.Room_Name) {
      let upRoom: Omit<ChatRoom, 'ID_Room'> = new ChatRoom();
      upRoom.Room_Name = room.Room_Name;

      this.chatRoomRepository.updateById(id, upRoom);
    }

    //Isi Tabel HostMember
    const newMemberList = room.Members;
    const teamMember = await this.memberRepository.find({
      where: {ID_Room: id},
    });

    let pertained: number[] = [];
    let deleted: (ChatMember & ChatMemberRelations)[] = [];
    let added: number[] = [];
    let i: number = 0;
    let j: number = 0;
    let newMember: boolean = false;
    let stillExist: boolean = false;

    for (i; i < newMemberList.length; i++) {
      j = 0;
      stillExist = false;
      for (j; j < teamMember.length; j++) {
        if (newMemberList[i] == teamMember[j].ID_User) {
          stillExist = true;
          pertained.push(teamMember[j].ID_User);
          teamMember.splice(j, 1);
          j--;
        }
      }
      if (!stillExist) {
        added.push(newMemberList[i]);
        //this.memberRepository.deleteById(teamMember[j].ID_Host_Member);
      }
    }

    i = 0;
    for (i; i < teamMember.length; i++) {
      deleted.push(teamMember[i]);
    }

    i = 0;
    for (i; i < deleted.length; i++) {
      this.memberRepository.deleteById(deleted[i].ID_Member);
    }

    if (added.length > 0) {
      i = 0;
      for (i; i < added.length; i++) {
        let newMember: ChatMember = new ChatMember();
        newMember.ID_Room = id;
        newMember.ID_User = added[i];
        this.memberRepository.create(newMember);
      }
    }

    return {status: 'Success'};
  }

  @post('/chat-rooms/send/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  async sendMessage(
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
    @param.path.number('id') id: number,
  ): Promise<{status: string}> {
    chatMessage.ID_Room = id;
    chatMessage.Sent_Time = getDateNow();
    this.chatMessageRepository.create(chatMessage);
    return {status: 'success'};
  }

  @get('/chat-rooms/get/messages/{id}', {
    responses: {
      '200': {
        description: 'ChatMessage model instance',
        content: {'application/json': {schema: getModelSchemaRef(ChatMessage)}},
      },
    },
  })
  async findRoomMessages(
    @param.path.number('id') id: number,
  ): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({where: {ID_Room: id}});
  }

  @get('/chat-rooms/get/{id}', {
    responses: {
      '200': {
        description: 'ChatRoom model instance',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                Room_Name: {type: 'string'},
                Members: {
                  type: 'array',
                  properties: {
                    ID_User: {type: 'number'},
                    Username: {type: 'string'},
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<{
    ID_Room: number | undefined;
    Room_Name: string;
    Members: UserLimited[];
  }> {
    const room: ChatRoom = await this.chatRoomRepository.findById(id);
    const members: ChatMember[] = await this.memberRepository.find({
      where: {ID_Room: id},
    });

    const memberInfo: UserLimited[] = [];
    for (let i: number = 0; i < members.length; i++) {
      let user: User = await this.userRepository.findById(members[i].ID_User);
      memberInfo.push({ID_User: user.ID_User, Username: user.Username});
    }

    return {
      ID_Room: room.ID_Room,
      Room_Name: room.Room_Name,
      Members: memberInfo,
    };
  }

  @del('/chat-rooms/delete/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    // Delete Tabel Room
    this.chatRoomRepository.deleteById(id);

    // Delete Tabel Member
    this.memberRepository.deleteAll({ID_Room: id});

    return {status: 'Success'};
  }
}
