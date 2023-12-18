import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
}
