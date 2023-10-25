import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly pgp: PgPromiseService) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = {
      title: createProjectDto.title,
      description: createProjectDto.description,
      snapshot: createProjectDto.snapshot,
      repository_link: createProjectDto.repositoryLink,
      last_update: createProjectDto.lastUpdate,
    };
    if (!createProjectDto.userId) return;

    const fields = Object.keys(project).toString();
    const values = Object.values(project).toString();
    const { id: projectId } = await this.pgp.db.oneOrNone(
      'insert into projects($1) values ($2) returning id as projectId;',
      [fields, values],
    );
    await this.pgp.db.none(
      'insert into projects_on_users(project_id, user_id) values ($1, $2);',
      [projectId, createProjectDto.userId],
    );
  }

  async listAll() {
    const projects = await this.pgp.db.manyOrNone(`
      select 
        id,
        title,
        description,
        snapshot,
        repository_link as repositoryLink,
        last_update as lastUpdate
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
          repository_link as repositoryLink,
          last_update as lastUpdate 
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
          repository_link as repositoryLink,
          last_update as lastUpdate 
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

    const fields = Object.keys(updateProjectDto)
      .toString()
      .replace('repositoryLink', 'repository_link')
      .replace('lastUpdate', 'last_update');
    const values = Object.values(updateProjectDto);

    await this.pgp.db.none(
      `
        update projects set ($1) = ($2) 
        where id=$3;
      `,
      [fields, values, id],
    );
  }

  async remove(id: number) {
    if (!id) return;
    await this.pgp.db.none('delete from projects where id=$1', [id]);
  }
}
