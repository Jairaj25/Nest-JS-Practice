import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;
      const newUser = this.create({
        username,
        password,
      });
      await this.save(newUser);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
