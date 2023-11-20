import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const mockedToken = { code: 'valid-token' };

export const tokenBlacklistFactory = async () =>
  await db.oneOrNone(
    'insert into token_blacklist(code) values($1) returning *;',
    [mockedToken.code],
  );
