import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { JwtModule } from '@nestjs/jwt';
import { PRIVATE_KEY } from 'src/constants';

describe('AuthService', () => {
  let authService: AuthService;
  // let crypto: CryptoService;
  // let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: PRIVATE_KEY,
          signOptions: { expiresIn: '60s' },
        }),
      ],
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
