import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PRIVATE_KEY } from 'src/constants';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { userFactory } from 'src/test-utils/user-factory';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, CryptoService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should NOT sign-in because user not found', async () => {
    const signInArgs = {
      email: 'invalid@email.com',
      password: 'invalid-password',
    };

    await expect(authController.signIn(signInArgs)).rejects.toThrowError(
      'Unauthorized',
    );
  });

  it('should NOT sign-in because password is incorrect', async () => {
    const { email } = await userFactory();

    await expect(
      authController.signIn({ email, password: 'invalid-password' }),
    ).rejects.toThrowError('Unauthorized');
  });

  it('should accept sign-in', async () => {
    const { email, password, name, id } = await userFactory();

    const result = await authController.signIn({ email, password });
    const isValid = jwtService.verify(result.accessToken, {
      secret: PRIVATE_KEY,
    });

    expect(result).toEqual({
      user: { id, name, email },
      accessToken: result.accessToken,
    });
    expect(isValid).toEqual({
      exp: isValid.exp,
      iat: isValid.iat,
      sub: { id, email, name },
    });
  });
});
