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
  Request,
  Response,
  RestBindings,
} from '@loopback/rest';
import {Participation, PaymentStatus} from '../models';
import {
  ParticipationRepository,
  PaymentStatusRepository,
  ParticipantRepository,
  ParticipantMemberRepository,
  CompetitionRepository,
} from '../repositories';
import {ParticipationRequestBody, ParticipationData} from '../models/types';
import {inject} from '@loopback/core';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadService} from '../services';
import {getDateNow} from '../utils/gFunctions';
import {json} from 'express';
import {toJSON} from '@loopback/testlab';

export class ParticipationController {
  constructor(
    @repository(ParticipationRepository)
    public participationRepository: ParticipationRepository,
    @repository(PaymentStatusRepository)
    public paymentRepository: PaymentStatusRepository,
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
    @repository(ParticipantMemberRepository)
    public memberRepository: ParticipantMemberRepository,
    @repository(CompetitionRepository)
    public competitionRepository: CompetitionRepository,
    @inject(FILE_UPLOAD_SERVICE) private service: FileUploadService,
  ) {}

  @post('/participations/new', {
    responses: {
      '200': {
        description: 'Participation model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Participation)},
        },
      },
    },
  })
  async create(
    @requestBody(ParticipationRequestBody)
    participation: ParticipationData,
  ): Promise<Participation> {
    let blankPaymentStatus: Omit<
      PaymentStatus,
      'ID_Payment_Status'
    > = new PaymentStatus();
    blankPaymentStatus.Status = 0;
    const currentStatus: PaymentStatus = await this.paymentRepository.create({
      Image: '',
      Status: 0,
    });

    console.log(toJSON(blankPaymentStatus));

    let addedParticipation: Omit<
      Participation,
      'ID_Participation'
    > = new Participation();
    addedParticipation.ID_Participant = participation.ID_Participant;
    addedParticipation.ID_Competition = participation.ID_Competition;
    addedParticipation.ID_Payment_Status = currentStatus.ID_Payment_Status;

    console.log(toJSON(addedParticipation));

    return this.participationRepository.create(addedParticipation);
  }

  @get('/participations/count', {
    responses: {
      '200': {
        description: 'Participation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Participation))
    where?: Where<Participation>,
  ): Promise<Count> {
    return this.participationRepository.count(where);
  }

  @get('/participations/get', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Participation))
    filter?: Filter<Participation>,
  ): Promise<Participation[]> {
    return this.participationRepository.find(filter);
  }

  @get('/participations/get/participant/{id}', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async findByParticipant(
    @param.path.number('id') id: number,
  ): Promise<Participation[]> {
    return this.participationRepository.find({where: {ID_Participant: id}});
  }

  @get('/participations/get/user/all/{id}', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async findByUser(
    @param.path.number('id') id: number,
  ): Promise<Participation[]> {
    const list = await this.memberRepository.find({where: {ID_User: id}});

    let i: number = 0;
    let participations: Participation[] = [];
    for (i; i < list.length; i++) {
      let j: number = 0;
      let participationList = await this.participationRepository.find({
        where: {ID_Participant: list[i].ID_Participant},
      });
      for (j; j < participationList.length; j++) {
        participations.push(participationList[j]);
      }
    }

    return participations;
  }

  @get('/participations/get/user/ongoing/{id}', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async findByUserOngoing(
    @param.path.number('id') id: number,
  ): Promise<Participation[]> {
    const list = await this.memberRepository.find({where: {ID_User: id}});

    let i: number = 0;
    let participations: Participation[] = [];
    for (i; i < list.length; i++) {
      let j: number = 0;
      let competitionList = await this.competitionRepository.find({
        where: {Announcement_Date: {gt: getDateNow()}},
      });
      let participationList = await this.participationRepository.find({
        where: {
          ID_Participant: list[i].ID_Participant,
          ID_Competition: competitionList[i].ID_Competition,
        },
      });
      for (j; j < participationList.length; j++) {
        participations.push(participationList[j]);
      }
    }

    return participations;
  }

  @get('/participations/get/user/past/{id}', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async findByUserPast(
    @param.path.number('id') id: number,
  ): Promise<Participation[]> {
    const list = await this.memberRepository.find({where: {ID_User: id}});

    let i: number = 0;
    let participations: Participation[] = [];
    for (i; i < list.length; i++) {
      let j: number = 0;
      let competitionList = await this.competitionRepository.find({
        where: {Announcement_Date: {lt: getDateNow()}},
      });
      let participationList = await this.participationRepository.find({
        where: {
          ID_Participant: list[i].ID_Participant,
          ID_Competition: competitionList[i].ID_Competition,
        },
      });
      for (j; j < participationList.length; j++) {
        participations.push(participationList[j]);
      }
    }

    return participations;
  }

  @get('/participations/get/unprocessedpayment', {
    responses: {
      '200': {
        description: 'Array of Participation model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participation)},
          },
        },
      },
    },
  })
  async findUnprocessedPayment(): Promise<PaymentStatus[]> {
    return this.paymentRepository.find({where: {Status: 0}});
  }

  @patch('/participations/pay/{id}', {
    responses: {
      '204': {
        description: 'Participation PATCH success',
      },
    },
  })
  async addPayment(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'Upload file test',
      required: true,
      content: {
        'multipart/form-data': {'x-parser': 'stream', schema: {type: 'object'}},
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<string> {
    const status = await this.service.fileUpload(request, response);
    const payment: PaymentStatus = new PaymentStatus();
    payment.Image = status.toString();

    const currentParticipation = await this.participationRepository.findById(
      id,
    );

    await this.paymentRepository.updateById(
      currentParticipation.ID_Payment_Status,
      payment,
    );

    return 'Complete';
  }

  @patch('/participations/approve/{id}', {
    responses: {
      '204': {
        description: 'Participation PATCH success',
      },
    },
  })
  async approvePayment(@param.path.number('id') id: number): Promise<string> {
    const payment: PaymentStatus = new PaymentStatus();
    payment.Status = 1;

    const currentParticipation = await this.participationRepository.findById(
      id,
    );

    await this.paymentRepository.updateById(
      currentParticipation.ID_Payment_Status,
      payment,
    );

    return 'Approval Success';
  }

  @patch('/participations/decline/{id}', {
    responses: {
      '204': {
        description: 'Participation PATCH success',
      },
    },
  })
  async declinePayment(@param.path.number('id') id: number): Promise<string> {
    const payment: PaymentStatus = new PaymentStatus();
    payment.Status = -1;

    const currentParticipation = await this.participationRepository.findById(
      id,
    );

    await this.paymentRepository.updateById(
      currentParticipation.ID_Payment_Status,
      payment,
    );

    return 'Decline Success';
  }

  @get('/participations/get/{id}', {
    responses: {
      '200': {
        description: 'Participation model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Participation)},
        },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Participation> {
    return this.participationRepository.findById(id);
  }

  @del('/participations/delete/{id}', {
    responses: {
      '204': {
        description: 'Participation DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const payment = await this.participationRepository.findById(id);
    await this.paymentRepository.deleteById(payment.ID_Payment_Status);
    await this.participationRepository.deleteById(id);
  }
}
