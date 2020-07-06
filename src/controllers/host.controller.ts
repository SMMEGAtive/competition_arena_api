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
import {Host, HostMember, HostMemberRelations, User} from '../models';
import {
  HostRepository,
  HostMemberRepository,
  UserRepository,
} from '../repositories';
import {
  CreateHostTeamRequestBody,
  CreateHostTeam,
  HostTeamRequestBody,
  HostTeam,
  UserLimited,
  HostLimited,
} from '../models/types';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {inject} from '@loopback/core';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {getDateNow} from '../utils/gFunctions';
import {TokenService, authenticate} from '@loopback/authentication';
import {CustomUserService} from '../services';
import {UserServiceBindings, TokenServiceBindings} from '../keys';

export class HostController {
  constructor(
    @repository(HostRepository)
    public hostRepository: HostRepository,
    @repository(HostMemberRepository)
    public memberRepository: HostMemberRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: CustomUserService,
  ) {}

  @get('/hosts/get', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                Hosts: {
                  type: 'array',
                  properties: {
                    ID_Host: {type: 'number'},
                    Host_Name: {type: 'string'},
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
    Hosts: HostLimited[];
  }> {
    const allTeam = await this.hostRepository.find();

    const teams: HostLimited[] = [];
    let i: number = 0;
    for (i; i < allTeam.length; i++) {
      let info = {
        ID_Host: allTeam[i].ID_Host,
        Host_Name: allTeam[i].Host_Name,
      };
      let teamInfo: HostLimited = info;

      teams.push(teamInfo);
    }

    return {Hosts: teams};
  }

  @get('/hosts/get/{id}', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                Host_Name: {type: 'string'},
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
    Host_Name: string;
    Member: UserLimited[];
    Date_Created: string;
    Date_Modified: string;
  }> {
    const teamDetail = await this.hostRepository.findById(id);
    const teamMember = await this.memberRepository.find({where: {ID_Host: id}});

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
      Host_Name: teamDetail.Host_Name,
      Member: memberDetails,
      Date_Created: teamDetail.Date_Created,
      Date_Modified: teamDetail.Date_Modified,
    };
  }

  @post('/hosts/new', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Host model instance',
        content: {'application/json': {schema: getModelSchemaRef(Host)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(CreateHostTeamRequestBody)
    host: CreateHostTeam,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Host> {
    // Isi Tabel Host
    let hostTeam: Omit<Host, 'ID_Host'> = new Host();
    hostTeam.Host_Name = host.Host_Name;
    hostTeam.Date_Created = getDateNow();
    hostTeam.Date_Modified = getDateNow();

    let newTeamID: number = 1;
    const team = await this.hostRepository.findOne({
      order: ['ID_Host DESC'],
      limit: 1,
    });

    if (team) {
      newTeamID = team!.ID_Host! + 1;
    }

    //Isi Tabel HostMember
    const memberList = host.Members;
    let i: number = 0;
    for (i; i < memberList.length; i++) {
      let hostMember: HostMember = new HostMember();
      hostMember.ID_Host = newTeamID;
      hostMember.ID_User = memberList[i];
      this.memberRepository.create(hostMember);
    }

    return this.hostRepository.create(hostTeam);
  }

  @patch('/hosts/update/{id}', {
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
    @requestBody(HostTeamRequestBody)
    host: HostTeam,
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    // Isi Tabel Host
    const team = await this.hostRepository.findById(id);

    if (team.Host_Name != host.Host_Name) {
      let hostTeam: Omit<Host, 'ID_Host'> = new Host();
      hostTeam.Host_Name = host.Host_Name;
      hostTeam.Date_Modified = getDateNow();

      this.hostRepository.updateById(id, hostTeam);
    }

    //Isi Tabel HostMember
    const newMemberList = host.Members;
    const teamMember = await this.memberRepository.find({
      where: {ID_Host: id},
    });

    let pertained: number[] = [];
    let deleted: (HostMember & HostMemberRelations)[] = [];
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
      this.memberRepository.deleteById(deleted[i].ID_Host_Member);
    }

    if (added.length > 0) {
      i = 0;
      for (i; i < added.length; i++) {
        let newMember: HostMember = new HostMember();
        newMember.ID_Host = id;
        newMember.ID_User = added[i];
        this.memberRepository.create(newMember);
      }
    }

    return {status: 'Success'};
  }

  @del('/hosts/delete/{id}', {
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
    this.hostRepository.deleteById(id);

    // Delete Tabel Member
    this.memberRepository.deleteAll({ID_Host: id});

    return {status: 'Success'};
  }

  @get('/hosts/count', {
    responses: {
      '200': {
        description: 'Host model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Host)) where?: Where<Host>,
  ): Promise<Count> {
    return this.hostRepository.count(where);
  }
}
