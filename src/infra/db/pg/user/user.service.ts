import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { IUserService } from 'src/modules/user/IUserService';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { PgService } from '../pg.service';
import { Client } from 'pg';

@Injectable()
export class UserServicePg implements IUserService {
  constructor(
    private readonly db: PgService,
    private readonly crypto: CryptoService,
    private pgClient: Client,
  ) {
    (async () => {
      pgClient = await db.getClient();
    })();
  }

  async listAll() {
    await this.pgClient.connect();
    const users = (
      await this.pgClient.query('select id, name, email from users;')
    ).rows;
    await this.pgClient.end();

    return users;
  }

  async create(createUserDto: CreateUserDto) {
    await this.pgClient.connect();

    const { password, name, email } = createUserDto;
    const hashPassword = await this.crypto.hasher(8, password);
    await this.pgClient.query(
      'insert into users(name, email, hash_password) values ($1, $2, $3)',
      [name, email, hashPassword],
    );

    await this.pgClient.end();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.pgClient.connect();

    const user = updateUserDto;
    if (!!user.password) {
      user.password = await this.crypto.hasher(8, user.password);
    }

    const fields = Object.keys(user).toString();
    const values = Object.values(user).toString();

    await this.pgClient.query('update users set ($1) = ($2) where id = $3;', [
      fields,
      values,
      id,
    ]);

    await this.pgClient.end();
  }

  async remove(id: number) {
    if (!id) return;

    await this.pgClient.connect();
    await this.pgClient.query('delete from users where id = $1', [id]);
    await this.pgClient.end();
  }
}
