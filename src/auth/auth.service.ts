import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accesstoken: string }> {
    const { username, password } = authCredentialsDto;
    const foundUser = await this.usersRepository.findOneBy({
      username: username,
    });

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      const payload: JwtPayload = { username };
      const accesstoken: string = await this.jwtService.sign(payload);
      return { accesstoken };
    } else {
      throw new UnauthorizedException('Wrong login credentials');
    }
  }
}
