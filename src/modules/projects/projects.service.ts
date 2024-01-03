import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly pgp: PgPromiseService) {}

  async createOnUser(projectId: number, userId: number) {
    const projectOnUser: { id: number } = await this.pgp.db.oneOrNone(
      'insert into projects_on_users(project_id, user_id) values($1, $2) returning id',
      [projectId, userId],
    );

    return projectOnUser;
  }

  async create(createProjectDto: CreateProjectDto) {
    const project: { id: number } = await this.pgp.db.oneOrNone(
      `insert into projects(
        title,
        description,
        snapshot,
        repository_link,
        start,
        last_update
      ) values($1:raw) returning id;`,
      [
        Object.values(createProjectDto)
          .map((value) =>
            value instanceof Date ? `'${value.toDateString()}'` : `'${value}'`,
          )
          .toString(),
      ],
    );

    return project;
  }

  async listAll() {
    const projects = await this.pgp.db.manyOrNone(`
      select 
        id,
        title,
        description,
        snapshot,
        repository_link as "repositoryLink",
        start,
        last_update as "lastUpdate"
      from projects;`);

    return projects;
  }

  async findByUser(userId: number) {
    const projects = await this.pgp.db.manyOrNone(
      `
        select 
          projects.id,
          title,
          description,
          snapshot,
          repository_link as "repositoryLink",
          start,
          last_update as "lastUpdate" 
        from projects, projects_on_users 
        where 
          projects_on_users.project_id = projects.id and
          projects_on_users.user_id = $1;
      `,
      [userId],
    );

    return projects;
  }

  async findByTitle(partialTitle: string) {
    const projects = await this.pgp.db.manyOrNone(
      `
        select 
          id,
          title,
          description,
          snapshot,
          repository_link as "repositoryLink",
          start,
          last_update as "lastUpdate" 
        from projects
        where 
          title ilike $1;
      `,
      [`%${partialTitle}%`],
    );

    return projects;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    if (!id || !Object.keys(updateProjectDto).length) return;

    const fields = Object.keys(updateProjectDto);
    const values = Object.values(updateProjectDto);
    const fieldsValues = fields
      .map((field, index) => {
        field.replace('repositoryLink', 'repository_link');
        field.replace('lastUpdate', 'last_update');

        return `${field}='${values[index]}'`;
      })
      .toString();

    await this.pgp.db.none(
      `
        update projects set $1:raw 
        where id=$2;
      `,
      [fieldsValues, id],
    );
  }

  async remove(id: number) {
    if (!id) return;
    await this.pgp.db.none('delete from projects where id=$1', [id]);
  }

  async listUsers(projectId: number) {
    const users = await this.pgp.db.manyOrNone<{ id: number; name: string }>(
      `select
        users.id as id,
        users.name as name,
        users.email as email
      from
        users,
        projects,
        projects_on_users as pou 
      where
        pou.user_id=users.id and
        pou.project_id=projects.id and
        projects.id=$1
      ;`,
      [projectId],
    );

    return users;
  }
}
