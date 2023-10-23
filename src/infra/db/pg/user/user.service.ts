import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { IUserService } from 'src/modules/user/IUserService';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Injectable()
export class UserServicePg implements IUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  async listAll() {
    const users = await this.prisma.user.findMany({});
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      return rest;
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.prisma.user.create({
      data: { ...user, password: hashPassword },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...user } = updateUserDto;
    const hashPassword = !!password
      ? await this.crypto.hasher(8, password)
      : undefined;
    await this.prisma.user.update({
      where: { id },
      data: { ...user, password: hashPassword },
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}
