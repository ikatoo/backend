import { JwtService } from '@nestjs/jwt';
import { PRIVATE_KEY } from 'src/constants';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { AuthService } from 'src/modules/auth/auth.service';

const pgp = new PgPromiseService();
const crypto = new CryptoService();
const jwtService = new JwtService({
  secret: PRIVATE_KEY,
  signOptions: { expiresIn: '60s' },
});
const authService = new AuthService(pgp, crypto, jwtService);

export const accessTokenFactory = async (email: string, password: string) => {
  const { access_token } = await authService.signIn({
    email,
    password,
  });

  return access_token;
};
