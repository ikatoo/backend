import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const { db } = new PgPromiseService();

export const projectOnUserFactory = async (projectId: number, userId: number) =>
  await db.oneOrNone(
    `insert into projects_on_users(
        project_id,	
        user_id
    ) values($1, $2) returning *;`,
    [projectId, userId],
  );
