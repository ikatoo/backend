import { Module } from '@nestjs/common';
import { UsersServicePrisma } from 'src/infra/db/prisma/users/user.service';
import { PrismaService } from '../../infra/db/prisma/prisma.service';
import { CryptoService } from '../../infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  controllers: [UserController, UsersController],
  providers: [UsersServicePrisma, PrismaService, CryptoService],
})
export class UserModule {}
