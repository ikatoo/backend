import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PgService } from 'src/infra/db/pg/pg.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, PgService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
