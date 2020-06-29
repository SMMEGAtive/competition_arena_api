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
import {
  Participant,
  Host,
  HostMember,
  ParticipantMember,
  ParticipantMemberRelations,
} from '../models';
import {
  ParticipantRepository,
  ParticipantMemberRepository,
  UserRepository,
} from '../repositories';
import {inject} from '@loopback/core';
import {TokenServiceBindings, UserServiceBindings} from '../keys';
import {TokenService, authenticate} from '@loopback/authentication';
import {CustomUserService} from '../services';
import {
  ParticipantLimited,
  HostLimited,
  UserLimited,
  CreateHostTeamRequestBody,
  CreateHostTeam,
  ParticipantTeam,
  ParticipantTeamRequestBody,
} from '../models/types';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {getDateNow} from '../utils/gFunctions';

import {UserProfile, securityId, SecurityBindings} from '@loopback/security';

export class ParticipantController {
  constructor(
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
    @repository(ParticipantMemberRepository)
    public memberRepository: ParticipantMemberRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: CustomUserService,
  ) {}

  @get('/participants/get', {
    responses: {
      '200': {
        description: 'Participant model instance',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                Participants: {
                  type: 'array',
                  properties: {
                    ID_Participant: {type: 'number'},
                    Team_Name: {type: 'string'},
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async get(): Promise<{
    Participants: ParticipantLimited[];
  }> {
    const allTeam = await this.participantRepository.find();

    const teams: ParticipantLimited[] = [];
    let i: number = 0;
    for (i; i < allTeam.length; i++) {
      let info = {
        ID_Participant: allTeam[i].ID_Participant,
        Team_Name: allTeam[i].Team_Name,
      };
      let teamInfo: ParticipantLimited = info;

      teams.push(teamInfo);
    }

    return {Participants: teams};
  }

  @get('/participantss/getdetail/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                Team_Name: {type: 'string'},
                Members: {
                  type: 'array',
                  properties: {
                    ID_User: {type: 'number'},
                    Username: {type: 'string'},
                  },
                },
                Date_Created: {type: 'string'},
                Date_Modified: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async getDetail(
    @param.path.number('id') id: number,
  ): Promise<{
    Team_Name: string;
    Member: UserLimited[];
    Date_Created: string;
    Date_Modified: string;
  }> {
    const teamDetail = await this.participantRepository.findById(id);
    const teamMember = await this.memberRepository.find({
      where: {ID_Participant: id},
    });

    const memberDetails: UserLimited[] = [];
    let i: number = 0;
    for (i; i < teamMember.length; i++) {
      let thisUser = await this.userRepository.findById(teamMember[i].ID_User);
      let info = {
        ID_User: thisUser.ID_User,
        Username: thisUser.Username,
      };
      let userInfo: UserLimited = info;

      memberDetails.push(userInfo);
    }

    return {
      Team_Name: teamDetail.Team_Name,
      Member: memberDetails,
      Date_Created: teamDetail.Date_Created,
      Date_Modified: teamDetail.Date_Modified,
    };
  }

  @post('/participants/new', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Host model instance',
        content: {'application/json': {schema: getModelSchemaRef(Participant)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(ParticipantTeamRequestBody)
    participant: ParticipantTeam,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Participant> {
    // Isi Tabel Host
    let participantTeam: Omit<
      Participant,
      'ID_Participant'
    > = new Participant();
    participantTeam.Team_Name = participant.Team_Name;
    participantTeam.Date_Created = getDateNow();
    participantTeam.Date_Modified = getDateNow();

    let newTeamID: number = 1;
    const team = await this.participantRepository.findOne({
      order: ['ID_Participant DESC'],
      limit: 1,
    });

    if (team) {
      newTeamID = team.ID_Participant! + 1;
    }

    //Isi Tabel HostMember
    const memberList = participant.Members;
    let i: number = 0;
    for (i; i < memberList.length; i++) {
      let participantMember: ParticipantMember = new ParticipantMember();
      participantMember.ID_Participant = newTeamID;
      participantMember.ID_User = memberList[i];
      this.memberRepository.create(participantMember);
    }

    return this.participantRepository.create(participantTeam);
  }

  @post('/participants/update/{id}', {
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
  async update(
    @requestBody(ParticipantTeamRequestBody)
    participant: ParticipantTeam,
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    // Isi Tabel Host
    const team = await this.participantRepository.findById(id);

    if (team.Team_Name != participant.Team_Name) {
      let participantTeam: Omit<
        Participant,
        'ID_Participant'
      > = new Participant();
      participantTeam.Team_Name = participant.Team_Name;
      participantTeam.Date_Modified = getDateNow();

      this.participantRepository.updateById(id, participantTeam);
    }

    //Isi Tabel HostMember
    const newMemberList = participant.Members;
    const teamMember = await this.memberRepository.find({
      where: {ID_Participant: id},
    });

    let pertained: number[] = [];
    let deleted: (ParticipantMember & ParticipantMemberRelations)[] = [];
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

    if (teamMember.length > 0) {
      i = 0;
      for (i; i < teamMember.length; i++) {
        deleted.push(teamMember[i]);
      }
    }

    if (deleted.length > 0) {
      i = 0;
      for (i; i < deleted.length; i++) {
        this.memberRepository.deleteById(deleted[i].ID_Part_Member);
      }
    }

    if (added.length > 0) {
      i = 0;
      for (i; i < added.length; i++) {
        let newMember: ParticipantMember = new ParticipantMember();
        newMember.ID_Participant = id;
        newMember.ID_User = added[i];
        this.memberRepository.create(newMember);
      }
    }

    return {status: 'Success'};
  }

  @del('/participants/delete/{id}', {
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
    // Delete Tabel Host
    this.participantRepository.deleteById(id);

    // Delete Tabel Member
    this.memberRepository.deleteAll({ID_Participant: id});

    return {status: 'Success'};
  }

  @get('/participants/count', {
    responses: {
      '200': {
        description: 'Participant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Participant))
    where?: Where<Participant>,
  ): Promise<Count> {
    return this.participantRepository.count(where);
  }
}
