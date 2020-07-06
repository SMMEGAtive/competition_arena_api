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
import {Comment} from '../models';
import {CommentRepository} from '../repositories';
import {CommentData, CommentRequestBody} from '../models/types';
import {getDateNow} from '../utils/gFunctions';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';

export class CommentController {
  constructor(
    @repository(CommentRepository)
    public commentRepository: CommentRepository,
  ) {}

  @post('/comments/new', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Comment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody(CommentRequestBody)
    comment: CommentData,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Comment> {
    const newComment: Omit<Comment, 'ID_Comment'> = new Comment();
    newComment.ID_Submission = comment.ID_Submission;
    newComment.Content = comment.Content;
    newComment.Date_Created = getDateNow();
    newComment.Date_Modified = getDateNow();
    newComment.ID_Comment_Parent = 0;
    newComment.ID_User = parseInt(currentUserProfile[securityId]);
    return this.commentRepository.create(newComment);
  }

  @post('/comments/reply/{id}', {
    responses: {
      '200': {
        description: 'Comment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async reply(
    @requestBody(CommentRequestBody)
    comment: CommentData,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
  ): Promise<Comment> {
    const newComment: Omit<Comment, 'ID_Comment'> = new Comment();
    newComment.ID_Submission = comment.ID_Submission;
    newComment.Content = comment.Content;
    newComment.Date_Created = getDateNow();
    newComment.Date_Modified = getDateNow();
    newComment.ID_Comment_Parent = id;
    newComment.ID_User = parseInt(currentUserProfile[securityId]);
    return this.commentRepository.create(newComment);
  }

  @get('/comments/count', {
    responses: {
      '200': {
        description: 'Comment model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Comment))
    where?: Where<Comment>,
  ): Promise<Count> {
    return this.commentRepository.count(where);
  }

  @get('/comments/get', {
    responses: {
      '200': {
        description: 'Array of Comment model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Comment))
    filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.commentRepository.find(filter);
  }

  @get('/comments/get/submission/{id}', {
    responses: {
      '200': {
        description: 'Array of Comment model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async findForSubmission(
    @param.path.number('id') id: number,
  ): Promise<Comment[]> {
    return this.commentRepository.find({where: {ID_Submission: id}});
  }

  @get('/comments/get/{id}', {
    responses: {
      '200': {
        description: 'Comment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Comment> {
    return this.commentRepository.findById(id);
  }

  @patch('/comments/update/{id}', {
    responses: {
      '204': {
        description: 'Comment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {partial: true}),
        },
      },
    })
    comment: Comment,
  ): Promise<void> {
    comment.Date_Modified = getDateNow();
    await this.commentRepository.updateById(id, comment);
  }

  @del('/comments/delete/{id}', {
    responses: {
      '204': {
        description: 'Comment DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.commentRepository.deleteById(id);
  }
}
