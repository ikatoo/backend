import { Test, TestingModule } from '@nestjs/testing';
import { PgService } from 'src/infra/db/pg/pg.service';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let service: AboutPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PgService],
    }).compile();

    service = module.get<AboutPageService>(AboutPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
