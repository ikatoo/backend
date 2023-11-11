import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

const userMock = {
  name: 'Ttesasdf',
  email: 'asdf@asdflkj.com',
  password: 'lksjdfl',
};

type User = {
  id: number;
  enabled: boolean;
} & typeof userMock;

export const userFactory = async () =>
  await pgp.db.one<User>(
    'insert into users(name, email, hash_password) values($1, $2, $3) returning *;',
    Object.values(userMock),
  );
