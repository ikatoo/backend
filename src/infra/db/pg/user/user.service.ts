import { Inject, Injectable } from '@nestjs/common';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { IUserService } from 'src/modules/user/IUserService';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { DbProviderValues } from '../db.module';

@Injectable()
export class UsersServicePg implements IUserService {
  constructor(
    @Inject('PG_CONNECTION')
    private db: DbProviderValues,
    private readonly crypto: CryptoService,
  ) {}

  async listAll() {
    const users = await this.db.query('select id, name, email from users;');

    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, name, email } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    const query =
      'insert into users(name, email, hash_password) values($1, $2, $3)';
    const values = [name, email, hashPassword];
    await this.db.transaction(query, values);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = updateUserDto;
    if (!!user.password) {
      user.password = await this.crypto.hasher(8, user.password);
    }

    const fields = Object.keys(user).toString();
    const values = Object.values(user).toString();

    await this.db.transaction('update users set ($1) = ($2) where id = $3;', [
      fields,
      values,
      id.toString(),
    ]);
  }

  async remove(id: number) {
    if (!id) return;

    await this.db.transaction('delete from users where id = $1', [
      id.toString(),
    ]);
  }
}
