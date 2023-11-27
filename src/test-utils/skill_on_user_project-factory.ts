import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const skillOnUserProjectFactory = async (
  skillId: number,
  projectOnUserId: number,
  modifier?: () => void,
) => {
  !!modifier && modifier();

  const skillOnUserProjectExists = await db.oneOrNone(
    'select * from skills_on_users_projects where skill_id=$1 and project_on_user_id=$2;',
    [skillId, projectOnUserId],
  );
  if (!!skillOnUserProjectExists)
    await db.none('delete from skills_on_users_projects where id=$1;', [
      skillOnUserProjectExists.id,
    ]);

  return await db.oneOrNone(
    `insert into skills_on_users_projects(
        skill_id,
        project_on_user_id
    ) values($1, $2) returning *;`,
    [skillId, projectOnUserId],
  );
};
