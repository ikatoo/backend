import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { IUserService } from 'src/modules/user/IUserService';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

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

  async create(createUserDto: CreateUserDto) {
    const { password, name, email } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.pgp.db.none(
      'insert into users(name, email, hash_password) values($1, $2, $3);',
      [name, email, hashPassword],
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = updateUserDto;
    if (!!user.password) {
      user.password = await this.crypto.hasher(8, user.password);
    }

    const fields = Object.keys(user);
    const values = Object.values(user);
    const fieldsValues = fields
      .map((field, index) => `${field}='${values[index]}'`)
      .toString();
    console.log('fieldsValues ====', fieldsValues);
    await this.pgp.db.none('update users set $1:raw where id=$2;', [
      fieldsValues,
      id,
    ]);
  }

  async remove(id: number) {
    if (!id) return;

    await this.pgp.db.none('delete from users where id=$1', [id]);
  }
}