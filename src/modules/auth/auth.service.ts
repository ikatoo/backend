import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

export type SignInArgs = { email: string; password: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly pgp: PgPromiseService,
    private readonly crypto: CryptoService,
  ) {}

  async signIn({ email, password }: SignInArgs): Promise<any> {
    const { hash_password, ...user } = await this.pgp.db.oneOrNone(
      'select * from users where email=$1',
      [email],
    );
    const authorized = await this.crypto.compareHash(password, hash_password);
    if (authorized) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return user;
  }
}
