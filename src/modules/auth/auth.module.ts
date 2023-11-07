import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

@Module({
  imports: [PgPromiseService, CryptoService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
