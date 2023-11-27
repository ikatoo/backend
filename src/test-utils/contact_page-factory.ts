import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

const mockedContactPage = {
  title: 'Mocked Title',
  description: 'Mocked description',
  localization: '(2342423,53423534)',
  email: 'mocked@mail.com',
};

export const contactPageFactory = async (
  userId: number,
  modifier?: () => void,
) => {
  !!modifier && modifier();

  const contactPageExists = await db.oneOrNone(
    'select * from contact_pages where user_id=$1;',
    [userId],
  );
  if (!!contactPageExists)
    await db.none('delete from contact_pages where id=$1;', [
      contactPageExists.id,
    ]);

  const values = { ...mockedContactPage, userId };

  return await db.oneOrNone(
    `insert into contact_pages(
          title,
          description,
          localization,
          email,
          user_id
      ) values($1) returning *;`,
    [
      Object.values(values)
        .map((value) => `'${value}'`)
        .toString(),
    ],
  );
};
