import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { NodeMailerService } from 'src/infra/mailer/node-mailer/node-mailer.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import {
  IUserService,
  User,
  UserWithoutId,
} from 'src/modules/user/IUserService';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly pgp: PgPromiseService,
    private readonly crypto: CryptoService,
    private readonly mailer: NodeMailerService,
  ) {}

  async recoveryPassword(email: string): Promise<void> {
    const existentUser = await this.pgp.db.oneOrNone(
      'select * from users where email ilike $1',
      [email],
    );

    if (!existentUser) throw new BadRequestException();

    const randomPassword = randomBytes(8).toString('hex');
    await this.update(existentUser.id, { password: randomPassword });
    await this.mailer.send({
      from: email,
      to: email,
      subject: 'Recovery Password from iKatoo',
      message: `Your new password is: ${randomPassword}`,
    });
  }

  async listAll() {
    const users = await this.pgp.db.manyOrNone(
      'select id, name, email, enabled from users;',
    );

    return [...users];
  }

  async create(user: User) {
    const { password, name, email } = user;

    const existentUser = await this.pgp.db.oneOrNone(
      'select * from users where email ilike $1',
      [email],
    );
    if (!!existentUser) throw new BadRequestException();

    const hashPassword = await this.crypto.hasher(8, password);
    return await this.pgp.db.oneOrNone<{ id: number }>(
      'insert into users(name, email, hash_password) values($1, $2, $3) returning id;',
      [name, email, hashPassword],
    );
  }

  async update(id: number, user: Partial<UserWithoutId>) {
    const newUser = { ...user, hash_password: undefined };
    if (!!user.password) {
      newUser.hash_password = await this.crypto.hasher(8, user.password);
      delete newUser.password;
    } else {
      delete newUser.hash_password;
    }
    const fields = Object.keys(newUser);
    const values = Object.values(newUser);
    const fieldsValues = fields
      .map((field, index) => `${field}='${values[index]}'`)
      .toString();
    await this.pgp.db.none('update users set $1:raw where id=$2;', [
      fieldsValues,
      id,
    ]);
  }

  async remove(id: number) {
    if (!id) return;

    await this.pgp.db.none('delete from users where id=$1;', [id]);
  }
}
