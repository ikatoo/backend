import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

describe('SkillsService', () => {
  let service: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsService, PgPromiseService],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
