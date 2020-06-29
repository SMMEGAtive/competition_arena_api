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
  Competition,
  Taglist,
  Tags,
  TagsRelations,
  CompetitionRelations,
  TaglistRelations,
} from '../models';
import {
  CompetitionRepository,
  TagsRepository,
  TaglistRepository,
} from '../repositories';
import {CompetitionRequestBody, CompetitionData} from '../models/types';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
const globalFunction = require('../utils/gFunctions');

export class CompetitionController {
  constructor(
    @repository(CompetitionRepository)
    public competitionRepository: CompetitionRepository,
    @repository(TaglistRepository)
    public taglistRepository: TaglistRepository,
    @repository(TagsRepository)
    public tagsRepo: TagsRepository,
  ) {}

  async getTagID(tag: string): Promise<number> {
    const tagData: (Tags & TagsRelations)[] = await this.tagsRepo.find({
      where: {Tag_Name: tag},
    });

    let getID: number = 0;
    if (tagData[0] != undefined) {
      getID = tagData[0].ID_Tags;
    } else {
      const newTag = await this.tagsRepo.create({Tag_Name: tag});

      getID = newTag.ID_Tags;
    }

    return getID;
  }

  @post('/competitions/new', {
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: getModelSchemaRef(Competition)}},
      },
    },
  })
  async create(
    @requestBody(CompetitionRequestBody)
    competition: CompetitionData,
  ): Promise<CompetitionData> {
    // Assign into Competition Type
    const comp: Competition = new Competition();
    comp.ID_Host = competition.ID_Host;
    comp.Title = competition.Title;
    comp.Description = competition.Description;
    comp.Registration_Start = competition.Registration_Start;
    comp.Registration_End = competition.Registration_End;
    comp.Verification_End = competition.Verification_End;
    comp.Execution_Start = competition.Execution_Start;
    comp.Execution_End = competition.Execution_End;
    comp.Announcement_Date = competition.Announcement_Date;

    const currentComp: Promise<Competition> = this.competitionRepository.create(
      comp,
    );

    //Tags
    let idList: number[] = [];
    let i = 0;
    let j = 0;
    for (i; i < competition.Tags.length; i++) {
      let id: number = 0;
      j = 0;
      let isNewOne: boolean = false;
      id = (await this.getTagID(competition.Tags[i])).valueOf();

      console.log(`Iteration ${i + 1}: ID_Tags // ${id}`);

      if (idList.length == 0) {
        idList.push(id);
        console.log(`Pushed: ID_Tags // ${id}`);
      } else {
        for (j; j < idList.length; j++) {
          if (id != idList[j]) {
            isNewOne = true;
            console.log(`i: ${i} j: ${j}`);
          }
        }
        if (isNewOne) {
          idList.push(id);
          console.log(`Pushed: ID_Tags // ${id}`);
        }
      }
    }

    i = 0;
    for (i; i < idList.length; i++) {
      let list: Taglist = new Taglist();
      list.ID_Competition = (await currentComp).ID_Competition!;
      list.ID_Tags = idList[i];

      this.taglistRepository.create(list);
    }

    return competition;
  }

  @get('/competitions/count', {
    responses: {
      '200': {
        description: 'Competition model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Competition))
    where?: Where<Competition>,
  ): Promise<Count> {
    return this.competitionRepository.count(where);
  }

  @get('/competitions/get', {
    responses: {
      '200': {
        description: 'Array of Competition model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Competition)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Competition))
    filter?: Filter<Competition>,
  ): Promise<Competition[]> {
    return this.competitionRepository.find(filter);
  }

  @get('/competitions/get/{id}', {
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: getModelSchemaRef(Competition)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Competition> {
    return this.competitionRepository.findById(id);
  }

  @post('/competitions/update/{id}', {
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
    @requestBody(CompetitionRequestBody)
    competition: CompetitionData,
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    // Isi Tabel Host
    const competitionFromDB = await this.competitionRepository.findById(id);

    if (
      competition.Title != competitionFromDB.Title ||
      competition.Description != competitionFromDB.Description ||
      competition.Announcement_Date != competitionFromDB.Announcement_Date ||
      competition.Execution_Start != competitionFromDB.Execution_Start ||
      competition.Execution_End != competitionFromDB.Execution_End ||
      competition.Registration_Start != competitionFromDB.Registration_Start ||
      competition.Registration_End != competitionFromDB.Registration_End ||
      competition.Verification_End != competitionFromDB.Verification_End
    ) {
      let competitionData: Omit<
        Competition,
        'ID_Competition'
      > = new Competition();

      competitionData.ID_Host = competition.ID_Host;
      competitionData.Title = competition.Title;
      competitionData.Description = competition.Description;
      competitionData.Registration_Start = competition.Registration_Start;
      competitionData.Registration_End = competition.Registration_End;
      competitionData.Verification_End = competition.Verification_End;
      competitionData.Execution_Start = competition.Execution_Start;
      competitionData.Execution_End = competition.Execution_End;
      competitionData.Announcement_Date = competition.Announcement_Date;

      this.competitionRepository.updateById(id, competitionData);
    }

    //Isi Tags
    const newTags = competition.Tags;
    const tags = await this.taglistRepository.find({
      where: {ID_Competition: id},
    });

    let pertained: number[] = [];
    let deleted: (Taglist & TaglistRelations)[] = [];
    let added: number[] = [];
    let i: number = 0;
    let j: number = 0;
    //let newTags: boolean = false;
    let stillExist: boolean = false;

    for (i; i < newTags.length; i++) {
      j = 0;
      stillExist = false;
      let currentTagID = await this.getTagID(newTags[i]);
      for (j; j < tags.length; j++) {
        if (currentTagID == tags[j].ID_Tags) {
          stillExist = true;
          pertained.push(tags[j].ID_Tags);
          tags.splice(j, 1);
          j--;
        }
      }
      if (!stillExist) {
        added.push(currentTagID);
        //this.memberRepository.deleteById(teamMember[j].ID_Host_Member);
      }
    }

    if (tags.length > 0) {
      i = 0;
      for (i; i < tags.length; i++) {
        deleted.push(tags[i]);
      }
    }

    if (deleted.length > 0) {
      i = 0;
      for (i; i < deleted.length; i++) {
        this.taglistRepository.deleteById(deleted[i].ID_Taglist);
      }
    }

    if (added.length > 0) {
      i = 0;
      for (i; i < added.length; i++) {
        let newMember: Taglist = new Taglist();
        newMember.ID_Competition = id;
        newMember.ID_Tags = added[i];
        this.taglistRepository.create(newMember);
      }
    }

    return {status: 'Success'};
  }

  @del('/competitions/{id}', {
    responses: {
      '204': {
        description: 'Competition DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // Delete taglist
    this.taglistRepository.deleteAll({ID_Competition: id});

    // Delete Competition
    this.competitionRepository.deleteById(id);
  }
}
