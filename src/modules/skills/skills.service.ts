import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly pgp: PgPromiseService) {}

  async findAll() {
    return await this.pgp.db.manyOrNone('select * from skills');
  }

  async findByUserProject(skillId: number, projectId: number) {
    const skills = await this.pgp.db.manyOrNone(
      `select
        skills.id as id,
        skills.title as title
      from 
        skills_on_users_projects as soup,
        skills,
        projects_on_users as pou,
        projects
      where 
        soup.skill_id=skills.id and
        soup.project_on_user_id=pou.id and
        pou.user_id=$1 and
        pou.project_id=projects.id and
        projects.id=$2;`,
      [skillId, projectId],
    );
    return skills;
  }

  async findByTitle(title: string) {
    const skill = await this.pgp.db.oneOrNone(
      'select * from skills where title=$1',
      [title],
    );
    return skill;
  }

  async findByUser(userId: number) {
    const { db } = this.pgp;

    const skills = await db.manyOrNone(
      `select
        skills.id as id,
        skills.title as title
      from
        projects,
        projects_on_users as pou,
        users,
        skills_on_users_projects as soup,
        skills
      where
        users.id=$1 and
        pou.user_id=users.id and
        pou.project_id=projects.id and
        soup.project_on_user_id=pou.id and
        soup.skill_id=skills.id
      ;`,
      [userId],
    );

    return skills;
  }

  async create(createSkillDto: CreateSkillDto) {
    const skill: { id: number } = await this.pgp.db.oneOrNone(
      'insert into skills(title) values($1) returning id;',
      [createSkillDto.title],
    );

    return skill;
  }

  async createOnProject(skillId: number, projectOnUserId: number) {
    const exist = await this.pgp.db.oneOrNone(
      'select * from skills_on_users_projects where skill_id=$1 and project_on_user_id=$2',
      [skillId, projectOnUserId],
    );
    if (!exist)
      await this.pgp.db.oneOrNone(
        'insert into skills_on_users_projects(skill_id, project_on_user_id) values($1, $2);',
        [skillId, projectOnUserId],
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
