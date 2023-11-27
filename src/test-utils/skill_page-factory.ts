import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedSkillsPage = {
  title: 'Skill Page❗',
  description: '<p>Description, skill page😄</p>',
};

type SkillPage = typeof mockedSkillsPage & { id: number; user_id: number };

export const skillPageFactory = async (
  user_id: number,
  modifier?: () => void,
) => {
  !!modifier && modifier();

  const skillPageExists = await pgp.db.oneOrNone<SkillPage>(
    'select * from skills_pages where user_id=$1;',
    [user_id],
  );
  if (!!skillPageExists)
    await pgp.db.none('delete from skills_pages where id=$1;', [
      skillPageExists.id,
    ]);

  return await pgp.db.one<SkillPage>(
    `insert into skills_pages(
      user_id, 
      title, 
      description
    ) values(
      ${user_id}, 
      '${mockedSkillsPage.title}', 
      '${mockedSkillsPage.description}'
    ) returning *;`,
  );
};
