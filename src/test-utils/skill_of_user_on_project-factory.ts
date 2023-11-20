import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const skillOfUserOnProject = async (
  skillUserId: number,
  projectUserId: number,
) =>
  await db.oneOrNone(
    `insert into skills_of_user_on_projects(
        skill_user_id,	
        project_user_id
    ) values($1, $2) returning *;`,
    [skillUserId, projectUserId],
  );
