import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserWithoutPassword } from '../user/IUserService';

export type SignInArgs = { email: string; password: string };
export type UserDb = UserWithoutPassword & { hash_password: string };
export type SignInResponse = {
  user: { id: number };
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly pgp: PgPromiseService,
    private readonly crypto: CryptoService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInArgs): Promise<SignInResponse> {
    const existentUser = await this.pgp.db.oneOrNone<UserDb>(
      'select * from users where email ilike $1',
      [email],
    );

    if (!existentUser || !existentUser.enabled)
      throw new UnauthorizedException();

    const authorized = await this.crypto.compareHash(
      password,
      existentUser.hash_password,
    );
    if (!authorized) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash_password: _, ...user } = existentUser;
    const payload = { sub: user };
    const access_token = await this.jwtService.signAsync(payload);
    return { user: { id: user.id }, access_token };
  }
}
