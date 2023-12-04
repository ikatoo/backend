import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const skillFactory = async (staticTestId?: string) => {
  const randomTestId = randomBytes(10).toString('hex');

  return await pgp.db.oneOrNone(
    'insert into skills(title) values($1) returning *;',
    ['Skill Title ' + randomTestId + (staticTestId || '')],
  );
};
