import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

const pgp = new PgPromiseService();

type User = {
  id?: number;
  name: string;
  email: string;
  hash_password: string;
  enabled: boolean;
};

export const userFactory = async () => {
  const randomTestId = randomBytes(10).toString('hex');
  const password = randomBytes(3).toString('hex') + 'pass';
  const hash_password = await new CryptoService().hasher(8, password);
  const mockedUser: User = {
    name: randomTestId,
    email: `${randomTestId}@email.com`,
    hash_password,
    enabled: true,
  };

  return await pgp.db.one<Required<User> & { password: string }>(
    'insert into users(name, email, hash_password, enabled) values($1, $2, $3, $4) returning *, $5 as password;',
    [...Object.values(mockedUser), password],
  );
};
