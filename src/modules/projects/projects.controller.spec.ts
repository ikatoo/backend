import { Test, TestingModule } from '@nestjs/testing';
import { randomInt } from 'crypto';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
import { skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';
import { userFactory } from 'src/test-utils/user-factory';
import { SkillsService } from '../skills/skills.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  // let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService, PgPromiseService, SkillsService],
      imports: [AppModule],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    // pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(projectsController).toBeDefined();
  });

  it('/user-id/:userId (GET) - should get project by user id', async () => {
    const createdUser = await userFactory();
    const createdProject1 = await projectFactory();
    const createdProject2 = await projectFactory();
    const userProject1 = await projectOnUserFactory(
      createdProject1.id,
      createdUser.id,
    );
    const userProject2 = await projectOnUserFactory(
      createdProject2.id,
      createdUser.id,
    );
    const skills1 = await Promise.all(
      Array.from({ length: randomInt(1, 5) }, async () => await skillFactory()),
    );
    const skills2 = await Promise.all(
      Array.from({ length: randomInt(1, 5) }, async () => await skillFactory()),
    );
    await Promise.all(
      skills1.map((skill) =>
        skillOnUserProjectFactory(skill.id, userProject1.id),
      ),
    );
    await Promise.all(
      skills2.map((skill) =>
        skillOnUserProjectFactory(skill.id, userProject2.id),
      ),
    );

    const projects = await projectsController.findByUser(createdUser.id + '');
    const result = projects.map((project) => {
      const { start, lastUpdate, skills, ...rest } = project;

      return {
        start: start.toLocaleDateString(),
        lastUpdate: lastUpdate.toLocaleDateString(),
        skills: (skills as any[]).sort((a, b) => a.id - b.id),
        ...rest,
      };
    });

    const expected = [
      {
        id: createdProject1.id,
        title: createdProject1.title,
        description: createdProject1.description,
        snapshot: createdProject1.snapshot,
        repositoryLink: createdProject1.repository_link,
        start: createdProject1.start.toLocaleDateString(),
        lastUpdate: createdProject1.last_update.toLocaleDateString(),
        skills: skills1.sort((a, b) => a.id - b.id),
        userId: createdUser.id,
      },
      {
        id: createdProject2.id,
        title: createdProject2.title,
        description: createdProject2.description,
        snapshot: createdProject2.snapshot,
        repositoryLink: createdProject2.repository_link,
        start: createdProject2.start.toLocaleDateString(),
        lastUpdate: createdProject2.last_update.toLocaleDateString(),
        skills: skills2.sort((a, b) => a.id - b.id),
        userId: createdUser.id,
      },
    ];

    expect(result).toEqual(expected);
  });
});
