import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

type SkillPage = {
  id: number;
  title: string;
  description: string;
  user_id: number;
};

export const skillPageFactory = async (user_id: number) => {
  const randomTestId = randomBytes(3).toString('hex');
  const mockedSkillsPage = {
    title: `${randomTestId} Skill Page❗`,
    description: `<p>Description, skill page😄 ${randomTestId}</p>`,
  };

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
