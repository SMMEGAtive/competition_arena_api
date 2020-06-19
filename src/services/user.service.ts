import {bind, inject, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository, Credentials} from '../repositories';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from './hash.password.bcryptjs';
import {User} from '../models';
import {HttpErrors} from '@loopback/rest';
//import {Credentials} from '../models/types';
import {UserProfile, securityId} from '@loopback/security';
import {hash, genSalt} from 'bcryptjs';
import {UserService} from '@loopback/authentication';

@bind({scope: BindingScope.TRANSIENT})
export class CustomUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    // Find Username
    const foundUser = await this.userRepository.findOne({
      where: {Email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with email ${credentials.email} not found.`,
      );
    }

    // Match Password
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.Password,
    );

    const salt = await genSalt();
    const hashed = (await hash(credentials.password, salt)).toString();

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(
        `The credentials are not correct.
        }`,
      );
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    let userName = '';
    const userProfile = {
      [securityId]: user.ID_User.toString(),
      name: user.Username,
      email: user.Email,
      id: user.ID_User,
      role: user.Role,
      verified: user.Email_Verified,
    };

    return userProfile;
  }
}
