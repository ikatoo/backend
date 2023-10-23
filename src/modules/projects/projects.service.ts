import { Injectable } from '@nestjs/common';
import { PgService } from 'src/infra/db/pg/pg.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly db: PgService) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = {
      title: createProjectDto.title,
      description: createProjectDto.description,
      snapshot: createProjectDto.snapshot,
      repository_link: createProjectDto.repositoryLink,
      last_update: createProjectDto.lastUpdate,
    };
    if (!createProjectDto.userId) return;
    await this.db.connect();

    const fields = Object.keys(project).toString();
    const values = Object.values(project).toString();
    const queryResult = await this.db.query(
      'insert into projects($1) values ($2) returning id as projectId;',
      [fields, values],
    );
    await this.db.query(
      'insert into projects_on_users(project_id, user_id) values ($1, $2);',
      [queryResult.rows[0].projectId, createProjectDto.userId],
    );

    await this.db.end();
  }

  async listAll() {
    await this.db.connect();

    const result = await this.db.query(`
      select 
        id,
        title,
        description,
        snapshot,
        repository_link as repositoryLink,
        last_update as lastUpdate
      from projects;`);
    const projects = result.rows;

    await this.db.end();

    return projects;
  }

  async findByUser(userId: number) {
    await this.db.connect();

    const result = await this.db.query(
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
    const projects = result.rows;

    await this.db.end();

    return projects;
  }

  async findByTitle(partialTitle: string) {
    await this.db.connect();

    const result = await this.db.query(
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
    const projects = result.rows;

    await this.db.end();

    return projects;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    if (!id || !Object.keys(updateProjectDto).length) return;
    await this.db.connect();
    const fields = Object.keys(updateProjectDto)
      .toString()
      .replace('repositoryLink', 'repository_link')
      .replace('lastUpdate', 'last_update');
    const values = Object.values(updateProjectDto);

    await this.db.query(
      `
        update projects set ($1) = ($2) 
        where id=$3;
      `,
      [fields, values, id],
    );

    await this.db.end();
  }

  async remove(id: number) {
    if (!id) return;
    await this.db.connect();
    await this.db.query('delete from projects where id=$1', [id]);
    await this.db.end();
  }
}
