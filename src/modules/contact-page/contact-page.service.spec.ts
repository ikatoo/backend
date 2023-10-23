import { Test, TestingModule } from '@nestjs/testing';
import { PgService } from 'src/infra/db/pg/pg.service';
import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPageService, PgService],
    }).compile();

    service = module.get<ContactPageService>(ContactPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
