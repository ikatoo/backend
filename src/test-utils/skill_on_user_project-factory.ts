import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const skillOnUserProjectFactory = async (
  skillId: number,
  projectOnUserId: number,
) =>
  await db.oneOrNone(
    `insert into skills_on_users_projects(
        skill_id,
        project_on_user_id
    ) values($1, $2) returning *;`,
    [skillId, projectOnUserId],
  );
