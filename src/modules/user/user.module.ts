import { Module } from '@nestjs/common';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { CryptoService } from '../../infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    NestPgpromiseModule.register({
      isGlobal: false,
      connection: config,
    }),
  ],
  controllers: [UserController, UsersController],
  providers: [UsersService, CryptoService],
})
export class UserModule {}
