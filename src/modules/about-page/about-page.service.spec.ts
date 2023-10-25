import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let service: AboutPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PgPromiseService],
    }).compile();

    service = module.get<AboutPageService>(AboutPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
