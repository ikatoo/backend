import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserWithoutPassword } from '../user/IUserService';
import { PRIVATE_KEY, REFRESH_PRIVATE_KEY } from 'src/constants';

export type SignInArgs = { email: string; password: string };
export type UserDb = UserWithoutPassword & { hash_password: string };
export type SignInResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
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

    const user = {
      id: existentUser.id,
      name: existentUser.name,
      email: existentUser.email,
    };
    const payload = { sub: user };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: PRIVATE_KEY,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: REFRESH_PRIVATE_KEY,
    });

    return { user, accessToken, refreshToken };
  }
}
