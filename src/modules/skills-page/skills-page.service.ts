import { Injectable } from '@nestjs/common';
import { CreateSkillsPageDto } from './dto/create-skills-page.dto';
import { UpdateSkillsPageDto } from './dto/update-skills-page.dto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from '../projects/dto/create-project.dto';

type Project = CreateProjectDto & { id: number; userId: number };
export type SkillsPage = CreateSkillsPageDto & { id: number; user_id: number };
@Injectable()
export class SkillsPageService {
  constructor(private readonly pgp: PgPromiseService) {}

  async create(createSkillsPageDto: CreateSkillsPageDto & { userId: number }) {
    const fields = Object.keys(createSkillsPageDto)
      .map((field) => `"${field}"`)
      .toString();
    const values = Object.values(createSkillsPageDto)
      .map((value) => `'${value}'`)
      .toString();

    await this.pgp.db.none('insert into skills_pages($1:raw) values($2:raw);', [
      fields,
      values,
    ]);
  }

  async findByUser(userId: number) {
    const skillPage = await this.pgp.db.oneOrNone<SkillsPage>(
      `select id, title, description from skills_pages as sp where user_id=$1;`,
      [userId],
    );
    const projects = await this.pgp.db.manyOrNone<Project>(
      `select
        proj.id as id,
        proj.title as title,
        proj.description as description,
        proj.snapshot as snapshot,
        proj.repository_link as "repositoryLink",
        proj.last_update as "lastUpdate",
        pou.user_id as "userId"
      from projects as proj, projects_on_users as pou
      where proj.id=pou.project_id and pou.user_id=$1;`,
      [userId],
    );
    const projectsWithSkills = projects.map(async (project) => {
      const skills = await this.pgp.db.manyOrNone<{ title: string }>(
        `select
          skills.id as id,
          skills.title as title
        from 
          skills,
          skills_on_users_projects as soup,
          projects_on_users as pou
        where
          soup.skill_id=skills.id and
          soup.project_on_user_id=pou.id and
          pou.project_id=$1 and
          pou.user_id=$2
        ;`,
        [project.id, userId],
      );
      return { ...project, skills };
    });

    return {
      ...skillPage,
      projects: [...(await Promise.all(projectsWithSkills))],
    };
  }

  async update(userId: number, updateSkillsPageDto: UpdateSkillsPageDto) {
    const values = Object.values(updateSkillsPageDto);
    const fieldsValues = Object.keys(updateSkillsPageDto).map(
      (field, index) => `${field}="${values[index]}"`,
    );

    await this.pgp.db.none('update skills_pages set $1:raw where user_id=$2', [
      fieldsValues,
      userId,
    ]);
  }

  remove(id: number) {
    return `This action removes a #${id} skillsPage`;
  }
}
