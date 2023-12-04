/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
import { skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';
import { skillPageFactory } from 'src/test-utils/skill_page-factory';
import { userFactory } from 'src/test-utils/user-factory';
import { SkillsPageController } from './skills-page.controller';
import { SkillsPageService } from './skills-page.service';

describe('SkillsPageController', () => {
  let skillsPageController: SkillsPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsPageController],
      providers: [SkillsPageService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    skillsPageController =
      module.get<SkillsPageController>(SkillsPageController);
  });

  it('should be defined', () => {
    expect(skillsPageController).toBeDefined();
  });

  it('/skills-page/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();
    const project1 = await projectFactory().then((project) => {
      const {
        repository_link: repositoryLink,
        start,
        last_update: lastUpdate,
        ...rest
      } = project;

      return { ...rest, repositoryLink, lastUpdate };
    });
    const project2 = await projectFactory().then((project) => {
      const {
        repository_link: repositoryLink,
        start,
        last_update: lastUpdate,
        ...rest
      } = project;

      return { ...rest, repositoryLink, lastUpdate };
    });
    const skill1 = await skillFactory('Skill 1');
    const skill2 = await skillFactory('Skill 2');

    const projectOnUser1 = await projectOnUserFactory(
      project1.id,
      createdUser.id,
    );
    const projectOnUser2 = await projectOnUserFactory(
      project2.id,
      createdUser.id,
    );

    await skillOnUserProjectFactory(skill1.id, projectOnUser1.id);
    await skillOnUserProjectFactory(skill2.id, projectOnUser2.id);

    const createdPage = await skillPageFactory(createdUser.id);

    const result = await skillsPageController.findByUser(createdUser.id + '');

    const { user_id: userId, ...page } = createdPage;
    const expected = {
      ...page,
      projects: [
        { ...project1, skills: [{ ...skill1 }], userId },
        { ...project2, skills: [{ ...skill2 }], userId },
      ],
    };

    expect(result).toEqual(expected);
  });
});
