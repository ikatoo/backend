import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UserController, UsersController],
  providers: [UserService, PrismaService, CryptoService],
})
export class UserModule {}
