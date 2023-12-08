import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

type Page = {
  id: number;
  title: string;
  description: string;
  localization: string;
  email: string;
  user_id: number;
};

export const contactPageFactory = async (userId: number) => {
  const randomTestId = randomBytes(10).toString('hex');
  const mockedContactPage = {
    title: `Mocked Title ${randomTestId}`,
    description: `Mocked description ${randomTestId}`,
    localization: `(
    -22.4191${randomInt(10, 100)},
    -46.8320${randomInt(10, 100)}
  )`,
    email: `mocked${randomTestId}@mail.com`,
  };

  const values = { ...mockedContactPage, userId };

  return await db.oneOrNone<Page>(
    `insert into contact_pages(
          title,
          description,
          localization,
          email,
          user_id
      ) values($1:raw) returning *;`,
    [
      Object.values(values)
        .map((value) => `'${value}'`)
        .toString(),
    ],
  );
};
