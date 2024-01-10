import { Module } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { NodeMailerService } from 'src/infra/mailer/node-mailer/node-mailer.service';
import { CryptoService } from '../../infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UserController, UsersController],
  providers: [UsersService, CryptoService, PgPromiseService, NodeMailerService],
})
export class UserModule {}
