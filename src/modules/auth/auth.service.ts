import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  PRIVATE_KEY,
  REFRESH_PRIVATE_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
} from 'src/constants';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserWithoutPassword } from '../user/IUserService';

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
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      secret: PRIVATE_KEY,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      secret: REFRESH_PRIVATE_KEY,
    });

    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: REFRESH_PRIVATE_KEY,
      });
      const existentUser = await this.pgp.db.oneOrNone<UserDb>(
        'select * from users where email ilike $1',
        [payload.sub.email],
      );

      if (!existentUser || !existentUser.enabled)
        throw new UnauthorizedException();

      const user = {
        id: existentUser.id,
        name: existentUser.name,
        email: existentUser.email,
      };
      const newPayload = { sub: user };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: PRIVATE_KEY,
      });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        secret: REFRESH_PRIVATE_KEY,
      });

      return { user, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
