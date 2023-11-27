import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const projectOnUserFactory = async (
  projectId: number,
  userId: number,
  modifier?: () => void,
) => {
  !!modifier && modifier();
  const projectExists = await db.oneOrNone(
    'select * from projects_on_users where project_id=$1 and user_id=$2;',
    [projectId, userId],
  );
  if (!!projectExists)
    await db.none('delete from projects_on_users where id=$1;', [
      projectExists.id,
    ]);

  return await db.oneOrNone(
    `insert into projects_on_users(
        project_id,	
        user_id
    ) values($1, $2) returning *;`,
    [projectId, userId],
  );
};
