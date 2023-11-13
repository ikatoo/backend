import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedSkill = { title: 'Skill title' };

export const skillFactory = async () =>
  await pgp.db.oneOrNone('insert into skills(title) values($1) returning *;', [
    mockedSkill.title,
  ]);
