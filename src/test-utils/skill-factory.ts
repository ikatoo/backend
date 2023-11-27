import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedSkill = { title: 'Skill title' };

export const skillFactory = async (modifier?: () => void) => {
  !!modifier && modifier();

  const skillExists = await pgp.db.oneOrNone(
    'select * from skills where title=$1;',
    [mockedSkill.title],
  );
  if (!!skillExists)
    await pgp.db.none('delete from skills where id=$1;', [skillExists.id]);

  return await pgp.db.oneOrNone(
    'insert into skills(title) values($1) returning *;',
    [mockedSkill.title],
  );
};
