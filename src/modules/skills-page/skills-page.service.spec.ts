import { Test, TestingModule } from '@nestjs/testing';
import { SkillsPageService } from './skills-page.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

describe('SkillsPageService', () => {
  let skillsPageService: SkillsPageService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsPageService, PgPromiseService],
    }).compile();

    skillsPageService = module.get<SkillsPageService>(SkillsPageService);
    pgp = module.get<PgPromiseService>(PgPromiseService);

    pgp.db.none('delete from skills_pages;');
  });

  it('should be defined', () => {
    expect(skillsPageService).toBeDefined();
  });
});
