import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
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
  ) {}

  async listAll() {
    const users = await this.pgp.db.manyOrNone(
      'select id, name, email from users;',
    );

    return [...users];
  }

  async create(user: User) {
    const { password, name, email } = user;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.pgp.db.none(
      'insert into users(name, email, hash_password) values($1, $2, $3);',
      [name, email, hashPassword],
    );
  }

  async update(id: number, user: Partial<UserWithoutId>) {
    console.log('user.password ===>', user.password);
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
    console.log('fieldsValues ===>', fieldsValues);
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
