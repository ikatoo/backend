import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedUser = {
  name: 'Ttesasdf',
  email: 'asdf@asdflkj.com',
  password: 'lksjdfl',
};

type User = {
  id: number;
  enabled: boolean;
  hash_password: string;
} & Omit<typeof mockedUser, 'password'>;

export const userFactory = async () => {
  const userExist = await pgp.db.oneOrNone<User>(
    'select * from users where email=$1;',
    [mockedUser.email],
  );
  if (!!userExist)
    await pgp.db.none('delete from users where id=$1;', [userExist.id]);

  return await pgp.db.one<User>(
    'insert into users(name, email, hash_password, enabled) values($1, $2, $3, true) returning *;',
    Object.values(mockedUser),
  );
};
