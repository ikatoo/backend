import { Test, TestingModule } from '@nestjs/testing';
import { SkillsPageController } from './skills-page.controller';
import { SkillsPageService } from './skills-page.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

describe('SkillsPageController', () => {
  let controller: SkillsPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsPageController],
      providers: [SkillsPageService, PgPromiseService],
    }).compile();

    controller = module.get<SkillsPageController>(SkillsPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
