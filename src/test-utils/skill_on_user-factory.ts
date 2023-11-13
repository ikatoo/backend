import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

const pgp = new PgPromiseService();

export const skillOnUserFactory = async (userId: number, skillId: number) => {
  await pgp.db.none(
    'insert into skills_on_users(skill_id, user_id) values($1, $2);',
    [skillId, userId],
  );
};
