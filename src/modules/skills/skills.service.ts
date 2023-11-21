import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly pgp: PgPromiseService) {}

  async findAll() {
    return await this.pgp.db.manyOrNone('select * from skills');
  }

  async findByUser(userId: number) {
    const skills = await this.pgp.db.manyOrNone<{ id: number; title: string }>(
      `
        select 
          skills.id as id,
          skills.title as title
        from skills, skills_on_users 
        where 
          skills_on_users.skill_id = skills.id and
          skills_on_users.user_id = $1;
      `,
      [userId],
    );

    return skills;
  }

  async create(createSkillDto: CreateSkillDto) {
    const db = this.pgp.db;
    const userExist = await db.oneOrNone('select * from users where id=$1', [
      createSkillDto.userId,
    ]);
    const skillExist = await db.oneOrNone(
      'select id from skills where title ilike $1',
      [createSkillDto.title],
    );
    if (!userExist) throw new Error('User not found.');
    const { id: skillId } =
      skillExist ??
      (await db.oneOrNone(
        'insert into skills(title) values($1) returning id;',
        [createSkillDto.title],
      ));

    await db.none(
      'insert into skills_on_users(skill_id, user_id) values($1, $2);',
      [skillId, createSkillDto.userId],
    );
  }

  async remove(id: number) {
    await this.pgp.db.none('delete from skills where id=$1', [id]);
  }

  async removeOfTheUserProject(projectOnUserId: number, skillId: number) {
    await this.pgp.db.none(
      'delete from skills_on_users_projects where project_on_user_id=$1 and skill_id=$2',
      [projectOnUserId, skillId],
    );
  }

  async update(id: number, newTitle: string) {
    await this.pgp.db.none('update skills set title=$2 where id=$1;', [
      id,
      newTitle,
    ]);
  }
}
