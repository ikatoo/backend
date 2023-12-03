import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { SkillsService } from '../skills/skills.service';
import { ProjectController } from './project.controller';
import { ProjectsService } from './projects.service';
import { userFactory } from 'src/test-utils/user-factory';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectsService, SkillsService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(projectController).toBeDefined();
  });

  it('project/ (POST) - should create a new project', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const createdUser = await userFactory();
    const start = new Date(`2021/${randomInt(1, 13)}/${randomInt(1, 28)}`);
    const lastUpdate = new Date();
    lastUpdate.setDate(start.getDate() + randomInt(500));
    const mockedData = {
      title: `title ${randomTestId}`,
      description: `description ${randomTestId}`,
      snapshot: `snapshot ${randomTestId}`,
      repositoryLink: `repositoryLink ${randomTestId}`,
      start,
      lastUpdate,
      skills: [{ title: `skill ${randomTestId}` }],
      userId: createdUser.id,
    };

    await projectController.create(mockedData);

    const createdProject = await pgp.db.one(
      `select
        projects.id as id,
        projects.title as title,
        projects.description as description,
        projects.snapshot as snapshot,
        projects.repository_link as "repositoryLink",
        projects.start as start,
        projects.last_update as "lastUpdate",
        users.id as "userId"
      from projects, users, projects_on_users as pou
      where 
        pou.user_id=users.id and
        pou.project_id=projects.id and
        users.id=$1;`,
      [createdUser.id],
    );
    const skills = await pgp.db.many(
      `select 
        title
      from
        skills,
        skills_on_users_projects as soup,
        projects_on_users as pou
      where
        skills.id=soup.skill_id and
        soup.project_on_user_id=pou.id and
        pou.project_id=$1
      ;`,
      [createdProject.id],
    );
    const expected = {
      id: createdProject.id,
      title: mockedData.title,
      description: mockedData.description,
      snapshot: mockedData.snapshot,
      repositoryLink: mockedData.repositoryLink,
      userId: createdUser.id,
      start: mockedData.start.toLocaleDateString(),
      lastUpdate: mockedData.lastUpdate.toLocaleDateString(),
      skills: mockedData.skills,
    };

    expect({
      ...createdProject,
      lastUpdate: createdProject.lastUpdate.toLocaleDateString(),
      start: createdProject.start.toLocaleDateString(),
      skills,
    }).toEqual(expected);
  });

  it('project/ (PATCH) - should update a existent project', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const createdUser = await userFactory();
    const createdProject = await projectFactory();
    await projectOnUserFactory(createdProject.id, createdUser.id);
    const newData = {
      title: `New title ${randomTestId}`,
    };

    await projectController.update(createdProject.id + '', newData);

    const updatedProject = await pgp.db.one(
      'select * from projects where id=$1;',
      [createdProject.id],
    );
    const expected = {
      ...createdProject,
      id: createdProject.id,
      title: newData.title,
    };

    expect(updatedProject).toEqual(expected);
  });
});
