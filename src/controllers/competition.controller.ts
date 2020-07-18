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
  Participation,
  Submission,
  Score,
} from '../models';
import {
  CompetitionRepository,
  TagsRepository,
  TaglistRepository,
  ScoreRepository,
  ParticipationRepository,
  SubmissionRepository,
  WinnerRepository,
} from '../repositories';
import {CompetitionRequestBody, CompetitionData} from '../models/types';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {toJSON} from '@loopback/testlab';
const globalFunction = require('../utils/gFunctions');

export class CompetitionController {
  constructor(
    @repository(CompetitionRepository)
    public competitionRepository: CompetitionRepository,
    @repository(TaglistRepository)
    public taglistRepository: TaglistRepository,
    @repository(TagsRepository)
    public tagsRepo: TagsRepository,
    @repository(ScoreRepository)
    public scoreRepo: ScoreRepository,
    @repository(ParticipationRepository)
    public partRepo: ParticipationRepository,
    @repository(SubmissionRepository)
    public submissionRepo: SubmissionRepository,
    @repository(WinnerRepository)
    public winnerRepo: WinnerRepository,
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: getModelSchemaRef(Competition)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(CompetitionRequestBody)
    competition: CompetitionData,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
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
  ): Promise<CompetitionData[]> {
    const competitions: Competition[] = await this.competitionRepository.find();

    const competitionsWithTags: CompetitionData[] = [];
    for (let i: number = 0; i < competitions.length; i++) {
      let taglist: Taglist[] = await this.taglistRepository.find({
        where: {ID_Competition: competitions[i].ID_Competition},
      });
      let tags: string[] = [];
      for (let j: number = 0; j < taglist.length; j++) {
        let tag: Tags = await this.tagsRepo.findById(taglist[j].ID_Tags);
        tags.push(tag.Tag_Name);
      }

      let newCompetitionData: CompetitionData = {
        ID_Competition: competitions[i].ID_Competition,
        ID_Host: competitions[i].ID_Host,
        Title: competitions[i].Title,
        Description: competitions[i].Description,
        Registration_Start: competitions[i].Registration_Start,
        Registration_End: competitions[i].Registration_End,
        Verification_End: competitions[i].Verification_End,
        Execution_Start: competitions[i].Execution_Start,
        Execution_End: competitions[i].Execution_End,
        Announcement_Date: competitions[i].Announcement_Date,
        Tags: tags,
      };
      competitionsWithTags.push(newCompetitionData);
    }
    return competitionsWithTags;
  }

  @get('/competitions/get/{id}', {
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: getModelSchemaRef(Competition)}},
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<CompetitionData> {
    const competition: Competition = await this.competitionRepository.findById(
      id,
    );

    const competitionsWithTags: CompetitionData[] = [];
    let taglist: Taglist[] = await this.taglistRepository.find({
      where: {ID_Competition: competition.ID_Competition},
    });
    let tags: string[] = [];
    for (let j: number = 0; j < taglist.length; j++) {
      let tag: Tags = await this.tagsRepo.findById(taglist[j].ID_Tags);
      tags.push(tag.Tag_Name);
    }

    let newCompetitionData: CompetitionData = {
      ID_Competition: competition.ID_Competition,
      ID_Host: competition.ID_Host,
      Title: competition.Title,
      Description: competition.Description,
      Registration_Start: competition.Registration_Start,
      Registration_End: competition.Registration_End,
      Verification_End: competition.Verification_End,
      Execution_Start: competition.Execution_Start,
      Execution_End: competition.Execution_End,
      Announcement_Date: competition.Announcement_Date,
      Tags: tags,
    };

    return newCompetitionData;
  }

  @post('/competitions/get/keyword/', {
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: getModelSchemaRef(Competition)}},
      },
    },
  })
  async findByKeyword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              keyword: {type: 'string'},
              tags: {type: 'array', items: {type: 'string'}},
            },
          },
        },
      },
    })
    request: {
      keyword: string;
      tags?: string[];
    },
  ): Promise<CompetitionData[]> {
    let comps: Competition[] = [];
    let taglist: Taglist[] = [];
    if (request.tags) {
      for (let i: number = 0; i < request.tags.length; i++) {
        const selectedTags: Tags[] = await this.tagsRepo.find({
          where: {Tag_Name: request.tags[i]},
        });
        taglist = await this.taglistRepository.find({
          where: {ID_Tags: selectedTags[i].ID_Tags},
        });
        for (let j: number = 0; j < taglist.length; j++) {
          let curComps: Competition[] = await this.competitionRepository.find({
            where: {
              ID_Competition: taglist[j].ID_Competition,
              Title: {like: `%${request.keyword}%`},
            },
          });
          if (curComps) {
            comps.push(curComps[0]);
          }
        }
      }
    } else {
      comps = await this.competitionRepository.find({
        where: {
          Title: {like: `%${request.keyword}%`},
        },
      });
    }

    let compsWithTags: CompetitionData[] = [];
    for (let i: number = 0; i < comps.length; i++) {
      let taglist: Taglist[] = await this.taglistRepository.find({
        where: {ID_Competition: comps[i].ID_Competition},
      });
      let tags: string[] = [];
      for (let j: number = 0; j < taglist.length; j++) {
        let tag: Tags = await this.tagsRepo.findById(taglist[j].ID_Tags);
        tags.push(tag.Tag_Name);
      }

      let newCompetitionData: CompetitionData = {
        ID_Competition: comps[i].ID_Competition,
        ID_Host: comps[i].ID_Host,
        Title: comps[i].Title,
        Description: comps[i].Description,
        Registration_Start: comps[i].Registration_Start,
        Registration_End: comps[i].Registration_End,
        Verification_End: comps[i].Verification_End,
        Execution_Start: comps[i].Execution_Start,
        Execution_End: comps[i].Execution_End,
        Announcement_Date: comps[i].Announcement_Date,
        Tags: tags,
      };
      compsWithTags.push(newCompetitionData);
    }

    return compsWithTags;
  }

  @patch('/competitions/update/{id}', {
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

  @patch('/competitions/setwinner/{id}', {
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
  async setWinner(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    const listParticipations: Participation[] = await this.partRepo.find({
      where: {ID_Competition: id},
    });

    const listScore: {
      ID_Participant: number;
      ID_Submission: number;
      Total_Score: number;
    }[] = [];
    for (let i: number = 0; i < listParticipations.length; i++) {
      console.log(`IDPart: ${listParticipations[i].ID_Participation}`);
      let submission: Submission | null = await this.submissionRepo.findOne({
        where: {ID_Participation: listParticipations[i].ID_Participation},
      });
      console.log(`IDSub: ${submission?.ID_Submission}`);

      if (submission) {
        let score: Score[] = await this.scoreRepo.find({
          where: {ID_Submission: submission.ID_Submission},
        });

        let totalScore: number = 0;

        if (score != undefined) {
          for (let i: number = 0; i < score.length; i++) {
            totalScore += score[i].Score;
          }
        } else {
          totalScore = 0;
        }

        listScore.push({
          ID_Participant: submission.ID_Participation,
          ID_Submission: submission.ID_Submission,
          Total_Score: totalScore,
        });
      }
    }

    listScore.sort((a, b) => b.Total_Score - a.Total_Score);

    for (let i: number = 0; i < listScore.length; i++) {
      console.log(
        `Number ${i + 1} / Submission ${listScore[i].ID_Submission} = ${
          listScore[i].Total_Score
        }`,
      );
    }

    await this.winnerRepo.create({
      First: listScore[0].ID_Participant,
      Second: listScore[1].ID_Participant,
      Third: listScore[2].ID_Participant,
    });

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
