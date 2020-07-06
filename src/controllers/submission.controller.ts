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
} from '../models';
import {
  SubmissionRepository,
  ParticipantMemberRepository,
  ParticipationRepository,
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
    @repository(ParticipationRepository)
    public partRepository: ParticipationRepository,
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
  async findById(@param.path.number('id') id: number): Promise<Submission> {
    return this.submissionRepository.findById(id);
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
