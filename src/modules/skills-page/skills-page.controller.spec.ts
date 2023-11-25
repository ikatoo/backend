/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { userFactory } from 'src/test-utils/user-factory';
import { SkillsPageController } from './skills-page.controller';
import { SkillsPageService } from './skills-page.service';

describe('SkillsPageController', () => {
  let skillsPageController: SkillsPageController;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsPageController],
      providers: [SkillsPageService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    skillsPageController =
      module.get<SkillsPageController>(SkillsPageController);

    pgp = module.get<PgPromiseService>(PgPromiseService);
    const { db } = pgp;
    db.none('delete from projects;');
    db.none('delete from skills_pages;');
    db.none('delete from skills;');
    db.none('delete from users;');
  });

  it('should be defined', () => {
    expect(skillsPageController).toBeDefined();
  });

  it('/skills/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();
    // const createdProject1 = await projectFactory(() => {
    //   mockedProject.title = 'Project 1';
    // });
    // const createdProject2 = await projectFactory(() => {
    //   mockedProject.title = 'Project 2';
    // });
    // await projectOnUserFactory(createdProject1.id, createdUser.id);
    // await projectOnUserFactory(createdProject2.id, createdUser.id);

    // const createdPage = await skillPageFactory(createdUser.id);

    // const result = await skillsPageController.findByUser(createdUser.id + '');

    // const { user_id: _, ...page } = createdPage;
    // const expected = {
    //   ...page,
    //   projects: [
    //     { ...mockedProject, title: 'Project 1' },
    //     { ...mockedProject, title: 'Project 2' },
    //   ],
    // };

    // expect(result).toEqual(expected);
  });
});
