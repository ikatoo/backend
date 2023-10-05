import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.prisma.user.create({
      data: { ...user, password: hashPassword },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...user } = updateUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.prisma.user.update({
      where: { id },
      data: { ...user, password: hashPassword },
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}
