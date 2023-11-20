import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const mockedSkillsPage = {
  title: 'Skill Page❗',
  description: '<p>Description, skill page😄</p>',
};

type SkillPage = typeof mockedSkillsPage & { id: number; user_id: number };

export const skillPageFactory = async (user_id: number) =>
  await pgp.db.one<SkillPage>(
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
