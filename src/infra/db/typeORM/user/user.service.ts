import { Inject, Injectable } from '@nestjs/common';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { IUserService } from 'src/modules/user/IUserService';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
export class UserServiceTypeORM implements IUserService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly crypto: CryptoService,
  ) {}

  async listAll() {
    const users = await this.userRepository.find({});
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      return rest;
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    this.userRepository.create({
      ...user,
      password: hashPassword,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...user } = updateUserDto;
    const hashPassword = !!password
      ? await this.crypto.hasher(8, password)
      : undefined;
    await this.userRepository.update(
      { id },
      { ...user, password: hashPassword },
    );
  }

  async remove(id: number) {
    await this.userRepository.delete({ id });
  }
}
