import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { SkillsPageService } from './skills-page.service';

describe('SkillsPageService', () => {
  let skillsPageService: SkillsPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsPageService, PgPromiseService],
    }).compile();

    skillsPageService = module.get<SkillsPageService>(SkillsPageService);
  });

  it('should be defined', () => {
    expect(skillsPageService).toBeDefined();
  });
});
