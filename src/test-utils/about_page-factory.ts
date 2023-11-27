import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedAboutPage = {
  title: 'Page❗',
  description: '<p>Description, page😄</p>',
  image_url: '/public/teste-page.img',
  image_alt: 'imagem de teste page',
};

type AboutPage = typeof mockedAboutPage & { id: number; user_id: number };

export const aboutPageFactory = async (
  user_id: number,
  modifier?: () => void,
) => {
  !!modifier && modifier();

  const aboutPageExists = await pgp.db.oneOrNone(
    'select * from about_pages where user_id=$1;',
    [user_id],
  );
  if (!!aboutPageExists)
    await pgp.db.none('delete from about_pages where id=$1;', [
      aboutPageExists.id,
    ]);

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
