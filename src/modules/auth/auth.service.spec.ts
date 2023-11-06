import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

describe('AuthService', () => {
  let authService: AuthService;
  // let crypto: CryptoService;
  // let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CryptoService, PgPromiseService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // crypto = module.get<CryptoService>(CryptoService);
    // pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
