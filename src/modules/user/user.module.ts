import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CryptoService],
})
export class UserModule {}
