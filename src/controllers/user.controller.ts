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
  HttpErrors,
  isReferenceObject,
} from '@loopback/rest';
import {User, UserRelations} from '../models';
import {
  LoginRequestBody,
  ChangePasswordRequestBody,
  ChangePassword,
  RegisterRequestBody,
  Register,
} from '../models/types';
import {UserRepository, Credentials} from '../repositories';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {authenticate, TokenService} from '@loopback/authentication';
import {inject, NonVoid} from '@loopback/core';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {CustomUserService} from '../services/user.service';
import {genSalt, hash, compare} from 'bcryptjs';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {Console} from 'console';

const nodemailer = require('nodemailer');
require('dotenv').config();

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: CustomUserService,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['ID_User'],
          }),
        },
      },
    })
    user: Omit<User, 'ID_User'>,
  ): Promise<User> {
    const salt = await genSalt();
    const hashPassword = (await hash(user.Password, salt)).toString();

    user.Password = hashPassword;

    return this.userRepository.create(user);
  }

  @post('/register', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async register(
    @requestBody(RegisterRequestBody) registerRequest: Register,
  ): Promise<User> {
    const salt = await genSalt();
    const hashPassword = (
      await hash(registerRequest.Password, salt)
    ).toString();

    const user = new User();
    user.Username = registerRequest.Username;
    user.Password = hashPassword;
    user.Email = registerRequest.Email;
    user.Email_Verified = false;
    user.Role = 2;
    user.Phone = registerRequest.Phone;
    user.Gender = registerRequest.Gender;
    user.Date_of_Birth = registerRequest.Date_of_Birth;

    return this.userRepository.create(user);
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }

  @post('/users/requestforgotpassword', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'object',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {key: {type: 'string'}}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async requestToken(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{key: string}> {
    var key = Math.floor(Math.random() * 1000000).toString();

    return {key};
  }

  @post('/users/verifyemail', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'object',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {key: {type: 'string'}}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async verifyEmail(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{key: string}> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {user: process.env.EMAIL, pass: process.env.PASSWORD},
    });

    const data = jwt.sign(
      {id: currentUserProfile[securityId], email: currentUserProfile.email},
      'asdf1093KMnzxcvnkljvasdu09123nlasdasdf',
      {expiresIn: '1d'},
      (err, tokenData) => {
        const separatedTokenData = tokenData?.split('.', 3);

        const token1 = separatedTokenData![0];
        const token2 = separatedTokenData![1];
        const token3 = separatedTokenData![2];

        const url = `http://localhost:3000/users/confirmation?token1=${token1}&token2=${token2}&token3=${token3}`;
        //const url = `http://localhost:3000/users/confirmation?token=AOAOAOAO`;

        transporter.sendMail({
          from: 'stellius.megative@gmail.com',
          to: currentUserProfile.email,
          subject: 'Verifikasi Email Competition Arena',
          html: `Verifikasi Email anda <a href=${url}>Link Verify</a>`,
        });
      },
    );

    return {key: 'yes'};
  }

  @get('/users/confirmation', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async confirmEmail(
    @param.query.string('token1') token1: string,
    @param.query.string('token2') token2: string,
    @param.query.string('token3') token3: string,
  ): Promise<void> {
    interface VerificationToken {
      id: string;
      email: string;
    }

    const token = `${token1}.${token2}.${token3}`;
    const data = jwt.decode(token, {json: true});
    const id = data!.id;
    //let cred: VerificationToken = JSON.parse(data!.id);
    console.log(id);

    const thisUser = await this.userRepository.findById(data!.id);

    thisUser.Email_Verified = true;

    await this.userRepository.updateById(id, thisUser);
    console.log('Success');
  }

  @post('/users/changepass', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'object',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async changePassword(
    @requestBody(ChangePasswordRequestBody) changePassRequest: ChangePassword,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<void> {
    const id = Number(currentUserProfile[securityId]);
    const thisUser = await this.userRepository.findById(id);

    const passwordMatched = await this.passwordHasher.comparePassword(
      changePassRequest.old_password,
      thisUser.Password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(`The credentials are not correct.`);
    }

    const newPasswordMatched =
      changePassRequest.new_password.localeCompare(
        changePassRequest.new_password_reinput,
      ) === 0;
    if (!newPasswordMatched) {
      throw new HttpErrors.Unauthorized(`The credentials are not correct.`);
    }

    const checkNewPassword = await this.passwordHasher.comparePassword(
      changePassRequest.new_password,
      thisUser.Password,
    );

    if (checkNewPassword) {
      throw new HttpErrors.Unauthorized(
        `New Password cannot be the same as the current Password.`,
      );
    }

    const salt = await genSalt();
    const hashed = (
      await hash(changePassRequest.new_password, salt)
    ).toString();

    thisUser.Password = hashed;

    return this.userRepository.updateById(id, thisUser);
  }
  @post('/users/changeforgotpass', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'object',
        content: {
          'application/json': {
            schema: {type: 'string', properties: {status: {type: 'string'}}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async changeForgotPassword(
    @requestBody(ChangePasswordRequestBody) changePassRequest: ChangePassword,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<{status: string}> {
    const id = Number(currentUserProfile[securityId]);
    const thisUser = await this.userRepository.findById(id);

    const passwordMatched = await this.passwordHasher.comparePassword(
      changePassRequest.old_password,
      thisUser.Password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(`The credentials are not correct.`);
    }

    const newPasswordMatched =
      changePassRequest.new_password.localeCompare(
        changePassRequest.new_password_reinput,
      ) === 0;
    if (!newPasswordMatched) {
      throw new HttpErrors.Unauthorized(`The credentials are not correct.`);
    }

    const checkNewPassword = await this.passwordHasher.comparePassword(
      changePassRequest.new_password,
      thisUser.Password,
    );

    if (checkNewPassword) {
      throw new HttpErrors.Unauthorized(
        `New Password cannot be the same as the current Password.`,
      );
    }

    const salt = await genSalt();
    const hashed = (
      await hash(changePassRequest.new_password, salt)
    ).toString();

    thisUser.Password = hashed;

    this.userRepository.updateById(id, thisUser);

    const status = 'Success';

    return {status};
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(LoginRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
