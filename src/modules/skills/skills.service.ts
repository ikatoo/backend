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
    const skills = await this.pgp.db.manyOrNone(
      `
        select 
          skills.id,
          title
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
    if (!userExist) throw new Error('User not found.');

    const { skillId } = await db.oneOrNone(
      `insert into users(title) values ($1) returning id as skillId;`,
      [createSkillDto.title],
    );

    await db.none(
      'insert into skills_on_users(skill_id, user_id) values($1, $2);',
      [skillId, createSkillDto.userId],
    );
  }

  async remove(id: number) {
    await this.pgp.db.none('delete from skills where id=$1', [id]);
  }
}
