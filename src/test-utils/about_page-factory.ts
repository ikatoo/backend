import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

type AboutPage = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  user_id: number;
};

export const aboutPageFactory = async (user_id: number) => {
  const randomTestId = randomBytes(10).toString('hex');
  const mockedAboutPage = {
    title: `${randomTestId} Page❗`,
    description: `<p>Description, page😄 ${randomTestId}</p>`,
    image_url: `/public/${randomTestId}.jpg`,
    image_alt: `imagem de teste page ${randomTestId}`,
  };

  return await pgp.db.one<AboutPage>(
    `insert into about_pages(
      user_id, 
      title, 
      description,
      image_url,
      image_alt
    ) values(
      ${user_id}, 
      '${mockedAboutPage.title}', 
      '${mockedAboutPage.description}',
      '${mockedAboutPage.image_url}',
      '${mockedAboutPage.image_alt}'
    ) returning *;`,
  );
};
