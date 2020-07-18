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
import {Comment, User} from '../models';
import {CommentRepository, UserRepository} from '../repositories';
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
    @repository(UserRepository)
    public userRepository: UserRepository,
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
  ): Promise<
    {
      ID_Comment: number;
      ID_Submission: number;
      ID_User: number;
      Username: string;
      ID_Comment_Parent: number;
      Content: string;
      Date_Created: string;
      Date_Modified: string;
      Avatar_Path: string;
    }[]
  > {
    const comments: Comment[] = await this.commentRepository.find({
      where: {ID_Submission: id},
    });
    let commentData: {
      ID_Comment: number;
      ID_Submission: number;
      ID_User: number;
      Username: string;
      ID_Comment_Parent: number;
      Content: string;
      Date_Created: string;
      Date_Modified: string;
      Avatar_Path: string;
    }[] = [];

    for (let i: number = 0; i < comments.length; i++) {
      let user: User = await this.userRepository.findById(comments[i].ID_User);
      let avatar: string = '';
      if (user.Avatar_Path) {
        avatar = user.Avatar_Path?.substring(9);
      } else {
        avatar = '';
      }
      let comment = {
        ID_Comment: comments[i].ID_Comment,
        ID_Submission: comments[i].ID_Submission,
        ID_User: comments[i].ID_User,
        Username: user.Username,
        ID_Comment_Parent: comments[i].ID_Comment_Parent,
        Content: comments[i].Content,
        Date_Created: comments[i].Date_Created,
        Date_Modified: comments[i].Date_Modified,
        Avatar_Path: avatar,
      };

      commentData.push(comment);
    }

    return commentData;
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
