import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const foundUser = await this.usersRepository.findOneBy({
      username: username,
    });

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      return 'Successfully logged in';
    } else {
      throw new UnauthorizedException('Wrong login credentials');
    }
  }
}
