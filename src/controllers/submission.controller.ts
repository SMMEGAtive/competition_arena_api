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
  Submission,
  ParticipationRelations,
  Participation,
  ParticipantMember,
  ParticipantMemberRelations,
  Score,
  Participant,
} from '../models';
import {
  SubmissionRepository,
  ParticipantMemberRepository,
  ParticipationRepository,
  ScoreRepository,
  ParticipantRepository,
} from '../repositories';
import {SubmissionRequestBody, SubmissionData} from '../models/types';
import {getDateNow} from '../utils/gFunctions';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';

export class SubmissionController {
  constructor(
    @repository(SubmissionRepository)
    public submissionRepository: SubmissionRepository,
    @repository(ParticipantMemberRepository)
    public memberRepository: ParticipantMemberRepository,
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
    @repository(ParticipationRepository)
    public partRepository: ParticipationRepository,
    @repository(ScoreRepository)
    public scoreRepository: ScoreRepository,
  ) {}

  async checkCompetitionParticipation(
    idUser: number,
    idComp: number,
  ): Promise<number> {
    const participations: (Participation &
      ParticipationRelations)[] = await this.partRepository.find({
      where: {ID_Competition: idComp},
    });

    console.log(participations.length);

    let id = -1;
    for (let i: number = 0; i < participations.length; i++) {
      let participation: Participation = participations[i];
      let participant: (ParticipantMember &
        ParticipantMemberRelations)[] = await this.memberRepository.find({
        where: {ID_Participant: participation.ID_Participant},
      });
      for (let j: number = 0; j < participant.length; j++) {
        console.log(`${idUser} banding ${participant[j].ID_User}`);
        if (idUser == participant[j].ID_User) {
          id = participant[j].ID_Participant;
          j = participant.length;
          i = participations.length;
        } else {
          id = -1;
        }
      }
    }

    return id;
  }

  @post('/submissions/new', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Submission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Submission)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(SubmissionRequestBody)
    submission: SubmissionData,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Submission> {
    const idParticipation: number = await this.checkCompetitionParticipation(
      parseInt(currentUserProfile[securityId]),
      submission.ID_Competition,
    );

    if (idParticipation == -1) {
      throw 'ERROR: Anda belum terdaftar di dalam lomba ini';
    } else {
      const newSubmission: Submission = new Submission();
      newSubmission.Title = submission.Title;
      newSubmission.Description = submission.Description;
      newSubmission.Link = submission.Link;
      newSubmission.ID_Participation = idParticipation;
      newSubmission.Status = 0;
      newSubmission.Date_Created = getDateNow();
      newSubmission.Date_Modified = getDateNow();
      return this.submissionRepository.create(newSubmission);
    }
  }

  @get('/submissions/count', {
    responses: {
      '200': {
        description: 'Submission model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Submission))
    where?: Where<Submission>,
  ): Promise<Count> {
    return this.submissionRepository.count(where);
  }

  @get('/submissions/get', {
    responses: {
      '200': {
        description: 'Array of Submission model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Submission)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Submission))
    filter?: Filter<Submission>,
  ): Promise<Submission[]> {
    return this.submissionRepository.find(filter);
  }

  @get('/submissions/get/{id}', {
    responses: {
      '200': {
        description: 'Submission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Submission)}},
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<{
    ID_Submission: number;
    Participant: {ID_Participant: number; Participant_Name: string};
    Title: string;
    Description: string;
    Link: string;
    Status: number;
    Score: number;
    Date_Created: string;
    Date_Modified: string;
  }> {
    let data: {
      ID_Submission: number;
      Participant: {ID_Participant: number; Participant_Name: string};
      Title: string;
      Description: string;
      Link: string;
      Status: number;
      Score: number;
      Date_Created: string;
      Date_Modified: string;
    };
    let score: number = 0;

    const submission: Submission = await this.submissionRepository.findById(id);
    const scoreList: Score[] = await this.scoreRepository.find({
      where: {ID_Submission: id},
    });
    const participation: Participation = await this.partRepository.findById(
      submission.ID_Participation,
    );
    const participant: Participant = await this.participantRepository.findById(
      participation.ID_Participant,
    );

    for (let i: number = 0; i < scoreList.length; i++) {
      score += scoreList[i].Score;
    }

    data = {
      ID_Submission: submission.ID_Submission,
      Participant: {
        ID_Participant: participant.ID_Participant,
        Participant_Name: participant.Team_Name,
      },
      Title: submission.Title,
      Description: submission.Description,
      Link: submission.Link,
      Status: submission.Status,
      Score: score,
      Date_Created: submission.Date_Created,
      Date_Modified: submission.Date_Modified,
    };

    return data;
  }

  @patch('/submissions/update/{id}', {
    responses: {
      '204': {
        description: 'Submission PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Submission, {partial: true}),
        },
      },
    })
    submission: Submission,
  ): Promise<void> {
    await this.submissionRepository.updateById(id, submission);
  }

  @patch('/submissions/disqualify/{id}', {
    responses: {
      '204': {
        description: 'Submission PATCH success',
      },
    },
  })
  async disqualify(@param.path.number('id') id: number): Promise<void> {
    const submission: Submission = await this.submissionRepository.findById(id);
    submission.Status = -1;
    await this.submissionRepository.updateById(id, submission);
  }

  @del('/submissions/delete/{id}', {
    responses: {
      '204': {
        description: 'Submission DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.submissionRepository.deleteById(id);
  }
}
