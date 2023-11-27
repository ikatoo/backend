import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const mockedToken = { code: 'valid-token' };

export const tokenBlacklistFactory = async (modifier?: () => void) => {
  !!modifier && modifier();

  const tokenBlacklistExists = await db.oneOrNone(
    'select * from token_blacklist where code=$1;',
    [mockedToken.code],
  );
  if (!!tokenBlacklistExists)
    await db.none('delete from token_blacklist where id=$1;', [
      tokenBlacklistExists.id,
    ]);

  return await db.oneOrNone(
    'insert into token_blacklist(code) values($1) returning *;',
    [mockedToken.code],
  );
};
