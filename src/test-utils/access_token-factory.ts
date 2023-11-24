import { JwtService } from '@nestjs/jwt';
import { PRIVATE_KEY } from 'src/constants';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/user/user.service';

const pgp = new PgPromiseService();
const crypto = new CryptoService();
const jwtService = new JwtService({
  secret: PRIVATE_KEY,
  signOptions: { expiresIn: '60s' },
});
const authService = new AuthService(pgp, crypto, jwtService);
const userService = new UsersService(pgp, crypto);

export const accessTokenFactory = async (email: string, password: string) => {
  const { id: userId } = await pgp.db.one(
    'select * from users where email=$1',
    [email],
  );
  await userService.update(userId, { password });

  const { access_token } = await authService.signIn({
    email,
    password,
  });

  return access_token;
};
